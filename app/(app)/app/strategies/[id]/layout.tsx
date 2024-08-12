"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFirestore, useFirestoreDocData, useUser } from "reactfire";
import { doc } from "firebase/firestore";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { AiOutlineTool } from "react-icons/ai";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define the context and provider directly in this file
interface StrategyContextType {
  strategy: any; // Adjust the type according to your strategy data structure
}

const StrategyContext = createContext<StrategyContextType | undefined>(
  undefined
);

export const StrategyProvider: React.FC<{
  strategy: any;
  children: ReactNode;
}> = ({ strategy, children }) => {
  return (
    <StrategyContext.Provider value={{ strategy }}>
      {children}
    </StrategyContext.Provider>
  );
};

export const useStrategy = () => {
  const context = useContext(StrategyContext);
  if (context === undefined) {
    throw new Error("useStrategy must be used within a StrategyProvider");
  }
  return context;
};

export default function StrategyLayout({ children }: { children: ReactNode }) {
  const params = useParams<{ id: string }>();
  const { data: user, status } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const strategyId = params?.id;

  if (!strategyId) {
    return <div>Strategy ID is missing.</div>;
  }

  const strategyRef = doc(firestore, "strategies", strategyId);
  const { data: strategy, status: strategyStatus } =
    useFirestoreDocData(strategyRef);

  if (status === "loading" || strategyStatus === "loading") {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <LoadingSpinner size={45} />
      </div>
    );
  }

  if (!user) {
    return <div>Please sign in to view strategies.</div>;
  }

  if (strategyStatus === "error") {
    return <div>Error fetching strategies.</div>;
  }

  return (
    <StrategyProvider strategy={strategy}>
      <div className="flex w-full">
        <div className="w-64 pr-10">
          <p
            className={`ml-7 mb-3 mt-5 text-gray-400 text-xs uppercase`}
          >
            Portfolio Report
          </p>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="w-full flex items-center justify-start"
            onClick={() => router.push("summary")}
          >
            <p className={`font-normal`}>Performance Summary</p>
          </Button>
          <p
            className={`ml-7 mb-3 mt-3 text-gray-400 text-xs uppercase`}
          >
            Periodical Returns
          </p>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="w-full flex items-center justify-start"
            onClick={() => router.push("annualReturns")}
          >
            <p className={`font-normal`}>Annual</p>
          </Button>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="w-full flex items-center justify-start"
            onClick={() => router.push("/app/settings/financial/instruments")}
          >
            <p className={`font-normal`}>Monthly</p>
          </Button>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="w-full flex items-center justify-start"
            onClick={() => router.push("/app/settings/financial/instruments")}
          >
            <p className={`font-normal`}>Weekly</p>
          </Button>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="w-full flex items-center justify-start"
            onClick={() => router.push("/app/settings/financial/instruments")}
          >
            <p className={`font-normal`}>Daily</p>
          </Button>
          <p
            className={`ml-7 mb-3 mt-3 text-gray-400 text-xs uppercase`}
          >
            Charts
          </p>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="w-full flex items-center justify-start"
            onClick={() => router.push("/app/settings/financial/instruments")}
          >
            <p className={`font-normal`}>Equity Graphs</p>
          </Button>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="w-full flex items-center justify-start"
            onClick={() => router.push("/app/settings/financial/instruments")}
          >
            <p className={`font-normal`}>Drawdown Graphs</p>
          </Button>
          <p
            className={`ml-7 mb-3 mt-3 text-gray-400 text-xs uppercase`}
          >
            Market
          </p>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="w-full flex items-center justify-start"
            onClick={() => router.push("/app/settings/financial/instruments")}
          >
            <p className={`font-normal`}>Market Performance</p>
          </Button>
          <p
            className={`ml-7 mb-3 mt-3 text-gray-400 text-xs uppercase`}
          >
            Correlation
          </p>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="w-full flex items-center justify-start"
            onClick={() => router.push("/app/settings/financial/instruments")}
          >
            <p className={`font-normal`}>Markets Matrix</p>
          </Button>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="w-full flex items-center justify-start"
            onClick={() => router.push("/app/settings/financial/instruments")}
          >
            <p className={`font-normal`}>Strategies Matrix</p>
          </Button>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="w-full flex items-center justify-start"
            onClick={() => router.push("/app/settings/financial/instruments")}
          >
            <p className={`font-normal`}>Negative Matrix</p>
          </Button>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="w-full flex items-center justify-start"
            onClick={() => router.push("/app/settings/financial/instruments")}
          >
            <p className={`font-normal`}>Positive Matrix</p>
          </Button>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="w-full flex items-center justify-start"
            onClick={() => router.push("/app/settings/financial/instruments")}
          >
            <p className={`font-normal`}>DD Matrix</p>
          </Button>
          <p
            className={`ml-7 mb-3 mt-3 text-gray-400 text-xs uppercase`}
          >
            Trades
          </p>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="w-full flex items-center justify-start"
            onClick={() => router.push("/app/settings/financial/instruments")}
          >
            <p className={`font-normal`}>Trade List</p>
          </Button>
          <p
            className={`ml-7 mb-3 mt-3 text-gray-400 text-xs uppercase`}
          >
            Settings
          </p>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="w-full flex items-center justify-start"
            onClick={() => router.push("/app/settings/financial/instruments")}
          >
            <p className={`font-normal`}>Portfolio Settings</p>
          </Button>
        </div>
        <ScrollArea className="flex-1 border rounded-md">{children}</ScrollArea>
      </div>
    </StrategyProvider>
  );
}
