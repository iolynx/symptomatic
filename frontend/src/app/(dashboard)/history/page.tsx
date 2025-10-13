"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, MessageSquareText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface HistoryItem {
  _id: string;
  userInput: string;
  aiResponse: string;
  createdAt: string;
}

// --- History Page Component ---
export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      const sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        setIsLoading(false);
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
        const res = await fetch(`${apiUrl}/history/${sessionId}`);

        if (!res.ok) throw new Error('Failed to fetch history.');

        const data = await res.json();
        setHistory(data);
        // select the most recent item when the data loads
        if (data.length > 0) {
          setSelectedItem(data[0]);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (isLoading) {
    return <HistorySkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <Alert variant="destructive" className="max-w-md">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Card className="text-center p-8">
          <CardTitle>No History Found</CardTitle>
          <CardDescription className="mt-2">
            Your session history will appear here.
          </CardDescription>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] border rounded-lg w-full">
      {/* Left: List of prompts */}
      <aside className="w-1/3 md:w-1/4 border-r overflow-y-auto">
        <div className="sticky top-0 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <h2 className="text-lg font-semibold">Session History</h2>
        </div>
        <nav className="flex flex-col p-2 space-y-1">
          {history.map((item) => (
            <button
              key={item._id}
              onClick={() => setSelectedItem(item)}
              className={cn(
                "w-full text-left p-2 rounded-md truncate text-sm transition-colors",
                selectedItem?._id === item._id
                  ? "bg-muted font-semibold"
                  : "hover:bg-muted/50"
              )}
            >
              {item.userInput}
            </button>
          ))}
        </nav>
      </aside>

      {/* Right: Selected prompt and response */}
      <main className="w-2/3 md:w-3/4 p-6 overflow-y-auto">
        {selectedItem ? (
          <div className="space-y-6">
            {/*Card for User prompt */}
            <Card>
              <CardHeader>
                <CardTitle>Your Symptoms</CardTitle>
                <CardDescription>
                  On {new Date(selectedItem.createdAt).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="italic">"{selectedItem.userInput}"</p>
              </CardContent>
            </Card>

            {/* AI Response Card */}
            <Card>
              <CardHeader>
                <CardTitle>AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
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
                  {selectedItem.aiResponse}
                </ReactMarkdown>
              </CardContent>
            </Card>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <MessageSquareText className="h-12 w-12 mb-4" />
            <h3 className="text-lg font-semibold">Select an analysis</h3>
            <p className="max-w-sm">Choose an item from the history panel on the left to view the details of the analysis.</p>
          </div>
        )}
      </main>
    </div>
  );
}

// Skeleton component for loading
const HistorySkeleton = () => (
  <div className="flex h-[calc(100vh-8rem)] border rounded-lg">
    <aside className="w-1/3 md:w-1/4 border-r p-4 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <div className="space-y-2">
        {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
      </div>
    </aside>
    <main className="w-2/3 md:w-3/4 p-6 space-y-6">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-64 w-full" />
    </main>
  </div>
);

