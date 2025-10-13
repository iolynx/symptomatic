"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';

// Loading skeleton subcomponent
const LoadingSkeleton = () => (
	<Card>
		<CardHeader>
			<Skeleton className="h-6 w-32" />
		</CardHeader>
		<CardContent className="space-y-3">
			<Skeleton className="h-4 w-full" />
			<Skeleton className="h-4 w-full" />
			<Skeleton className="h-4 w-3/4" />
			<Skeleton className="h-4 w-full" />
			<Skeleton className="h-4 w-1/2" />
		</CardContent>
	</Card>
);


export default function AskPage() {
	const [symptoms, setSymptoms] = useState("");
	const [userPrompt, setUserPrompt] = useState(""); // Store the user's submitted symptoms
	const [response, setResponse] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [hasResponse, setHasResponse] = useState(false); // state to check whether the response card is empty

	const handleSubmit = async () => {
		if (!symptoms.trim() || isLoading) return;

		setIsLoading(true);
		setError("");
		setResponse("");
		setUserPrompt(symptoms);
		setHasResponse(true);

		const sessionId = localStorage.getItem("sessionId") || crypto.randomUUID();
		localStorage.setItem("sessionId", sessionId);

		try {
			// Ensure you have a .env.local file with NEXT_PUBLIC_API_URL
			const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

			const res = await fetch(`${apiUrl}/check-symptoms`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ symptoms, sessionId }),
			});

			if (!res.ok) {
				throw new Error(`API Error: ${res.statusText} (Status: ${res.status})`);
			}

			const data = await res.json();
			setResponse(data.response);

		} catch (err: any) {
			console.error("Fetch error:", err);
			setError(err.message || "An unexpected error occurred. Please ensure the backend server is running and reachable.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={`grid items-start gap-6 ${hasResponse ? 'grid-cols-1 md:grid-cols-5' : 'grid-cols-1 justify-items-center'}`}>
			{/* --- Left column: AI Response or Loading Skeleton --- */}
			{hasResponse && (
				<div className="md:col-span-3 min-h-[200px]">
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
								<CardTitle>AI Analysis</CardTitle>
								<p className="text-sm text-muted-foreground pt-2">
									Based on your symptoms: "{userPrompt}"
								</p>
							</CardHeader>
							<CardContent>
								<ReactMarkdown
									components={{
										h2: ({ node, ...props }) => <h2 className="text-lg font-semibold border-b pb-2 mt-4" {...props} />,
										ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-2" {...props} />,
										ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-2" {...props} />,
										li: ({ node, ...props }) => <li className="pl-2" {...props} />,
										p: ({ node, ...props }) => <p className="leading-7" {...props} />,
										strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
									}}
								>
									{response}
								</ReactMarkdown>
							</CardContent>
						</Card>
					)}
				</div>
			)}

			{/* --- Right column: User Input --- */}
			<div className={`transition-all duration-700 ease-in-out ${hasResponse ? 'md:col-span-2 w-full' : 'w-full max-w-2xl'}`}>
				<Card className="sticky top-20">
					<CardHeader>
						<CardTitle>Describe Your Symptoms</CardTitle>
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
		</div>
	);
}

