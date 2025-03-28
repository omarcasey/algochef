"use client";
import React from "react";
import { useUser } from "reactfire";
import { LoadingSpinner } from "@/components/ui/spinner";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function StrategyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, status } = useUser();

  if (status === "loading") {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <LoadingSpinner size={45} />
      </div>
    );
  }

  if (!user) {
    return <div>Please sign in to view strategy details.</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/app/signals" 
          className="flex items-center text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span>Back to Trading Signals</span>
        </Link>
      </div>
      {children}
    </div>
  );
} 