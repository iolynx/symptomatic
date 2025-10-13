"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import ReactMarkdown from "react-markdown";

// Skeleton Component to display while fetching response
const LoadingSkeleton = () => (
	<Card>
		<CardHeader>
			<Skeleton className="h-6 w-32" />
		</CardHeader>
		<CardContent className="space-y-3">
			<Skeleton className="h-4 w-full" />
			<Skeleton className="h-4 w-full" />
			<Skeleton className="h-4 w-3/4" />
		</CardContent>
	</Card>
);

export default function AskPage() {
	const [symptoms, setSymptoms] = useState("");
	const [userPrompt, setUserPrompt] = useState("");
	const [response, setResponse] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const [hasSubmitted, setHasSubmitted] = useState(false);
	const [isResponseVisible, setIsResponseVisible] = useState(false);

	useEffect(() => {
		if (hasSubmitted) {
			const timer = setTimeout(() => setIsResponseVisible(true), 50);
			return () => clearTimeout(timer);
		}
	}, [hasSubmitted]);

	const handleSubmit = async () => {
		if (!symptoms.trim() || isLoading) return;
		setIsLoading(true);
		setError("");
		setResponse("");
		setUserPrompt(symptoms);

		setHasSubmitted(true);

		const sessionId = localStorage.getItem("sessionId") || crypto.randomUUID();
		localStorage.setItem("sessionId", sessionId);

		try {
			const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
			const res = await fetch(`${apiUrl}/check-symptoms`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ symptoms, sessionId }),
			});
			if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
			const data = await res.json();
			setResponse(data.response);
		} catch (err: any) {
			setError(err.message || "An unexpected error occurred.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={`flex w-full gap-6 transition-all duration-700 ease-in-out ${hasSubmitted ? 'justify-between' : 'justify-center'}`}>

			{/* INPUT CARD WRAPPER */}
			<div className={`transition-all duration-700 ease-in-out ${hasSubmitted ? 'w-2/5' : 'w-full max-w-2xl'}`}>
				<Card className="sticky top-20">
					<CardHeader>
						<CardTitle>Describe Your Symptoms:</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<Textarea
							placeholder="E.g. Fever, sore throat, body ache..."
							value={symptoms}
							onChange={(e) => setSymptoms(e.target.value)}
							rows={5}
							disabled={isLoading}
						/>
						<Button onClick={handleSubmit} className="w-full" disabled={isLoading}>
							{isLoading ? "Analyzing..." : "Analyze"}
						</Button>
					</CardContent>
				</Card>
			</div>

			{/* RESPONSE CARD WRAPPER */}
			{hasSubmitted && (
				<div className={`w-3/5 min-h-[200px] transition-opacity duration-500 ease-in-out ${isResponseVisible ? 'opacity-100' : 'opacity-0'}`}>
					{isLoading && <LoadingSkeleton />}
					{error && (
						<Alert variant="destructive">
							<Terminal className="h-4 w-4" />
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
					{response && !isLoading && (
						<Card>
							<CardHeader>
								<CardTitle>AI Diagnosis</CardTitle>
								<p className="text-sm text-muted-foreground pt-2">
									Based on your symptoms: "{userPrompt}"
								</p>
							</CardHeader>
							<CardContent>
								<ReactMarkdown
									components={{
										h2: ({ node, ...props }) => <h2 className="text-lg font-semibold border-b pb-2 mt-4 text-primary" {...props} />,
										ul: ({ node, ...props }) => <ul className="list-disc list-inside" {...props} />,
										ol: ({ node, ...props }) => <ol className="list-decimal list-inside" {...props} />,
										li: ({ node, ...props }) => <li className="pl-2 py-2.5" {...props} />,
										p: ({ node, ...props }) => <p className="leading-7 [&:not(:first-child)]:mt-4" {...props} />,
										strong: ({ node, ...props }) => <strong className="font-semibold text-foreground/90" {...props} />,
									}}
								>
									{response}
								</ReactMarkdown>
							</CardContent>
						</Card>
					)}
				</div>
			)}
		</div>
	);
}


