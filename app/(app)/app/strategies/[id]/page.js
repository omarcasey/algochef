"use client";
import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/spinner";

const StrategyPage = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get the current pathname

  useEffect(() => {
    // Redirect to the current path + /summary
    router.push(`${pathname}/summary`);
  }, [router, pathname]);

  // While redirecting, optionally display a loading spinner or similar
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <LoadingSpinner size={45} />
    </div>
  );
};

export default StrategyPage;
