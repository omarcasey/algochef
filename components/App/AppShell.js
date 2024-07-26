"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useRouter } from "next/navigation";
import { useUser } from "reactfire";
import { LoadingSpinner } from "../ui/spinner";

const AppShell = ({ children }) => {
  const { data: user, status } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") {
      return; // Wait for user status to be resolved
    }

    if (!user) {
      router.push("/login");
    } else {
      setIsLoading(false); // Finished loading user data
    }
  }, [user, status, router]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner size={45} />
      </div>
    );
  }

  return (
    <div className="flex flex-row h-screen dark bg-default-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <main className="flex flex-1 bg-default-100 overflow-y-auto p-7">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;
