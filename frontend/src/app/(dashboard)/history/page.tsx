"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface HistoryItem {
  _id: string;
  userInput: string;
  aiResponse: string;
  createdAt: string;
}

// Component to display a single history entry
const HistoryEntry = ({ item }: { item: HistoryItem }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">Your Symptoms</CardTitle>
      <CardDescription>
        On {new Date(item.createdAt).toLocaleString()} you asked about:
      </CardDescription>
    </CardHeader>
    <CardContent>
      <p className="italic bg-muted p-3 rounded-md">"{item.userInput}"</p>

      <div className="mt-4 border-t pt-4">
        <h3 className="font-semibold mb-2">AI Analysis</h3>
        <ReactMarkdown
          components={{
            h2: ({ node, ...props }) => <h2 className="text-lg font-semibold border-b pb-2 mt-4 text-primary" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc list-inside" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal list-inside" {...props} />,
            li: ({ node, ...props }) => <li className="pl-2 py-1.5" {...props} />,
            p: ({ node, ...props }) => <p className="leading-7 [&:not(:first-child)]:mt-4" {...props} />,
            strong: ({ node, ...props }) => <strong className="font-semibold text-foreground/90" {...props} />,
          }}
        >
          {item.aiResponse}
        </ReactMarkdown>
      </div>
    </CardContent>
  </Card>
);

// Loading skeleton for the page
const HistorySkeleton = () => (
  <div className="space-y-6">
    {[...Array(3)].map((_, i) => (
      <Card key={i}>
        <CardHeader>
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-12 w-full" />
          <div className="mt-4 border-t pt-4 space-y-2">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);


export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        setIsLoading(false);
        // No need to show an error, they just don't have history yet.
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
        const res = await fetch(`${apiUrl}/history/${sessionId}`);

        if (!res.ok) {
          throw new Error('Failed to fetch history.');
        }

        const data = await res.json();
        setHistory(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Your Session History</h1>
        <p className="text-muted-foreground mt-2">
          Here are the previous analyses from your current session.
        </p>
      </div>

      {isLoading && <HistorySkeleton />}

      {error && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !error && history.length > 0 && (
        <div className="space-y-6">
          {history.map((item) => (
            <HistoryEntry key={item._id} item={item} />
          ))}
        </div>
      )}

      {!isLoading && !error && history.length === 0 && (
        <Card className="text-center p-8">
          <CardTitle>No History Found</CardTitle>
          <CardDescription className="mt-2">
            It looks like you haven't analyzed any symptoms in this session yet.
          </CardDescription>
        </Card>
      )}
    </div>
  );
}

