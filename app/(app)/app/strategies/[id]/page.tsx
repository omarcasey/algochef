"use client";
import React, { useEffect, useRef } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/spinner";
import { useFirestore, useFirestoreDocData, useUser } from "reactfire";
import { doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import Summary from "@/components/strategyPage/performanceSummary";
import PortfolioGrowth from "@/components/strategyPage/portfolioGrowth";
import AnnualReturnsGraph from "@/components/strategyPage/AnnualReturnsGraph";
import TrailingReturns from "@/components/strategyPage/TrailingReturns";

const StrategyPage = () => {
  const params = useParams<{ id: string }>();
  const { data: user, status } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const strategyId = params?.id;

  const sectionRefs = {
    summary: useRef<HTMLDivElement>(null),
    bro2: useRef<HTMLDivElement>(null),
    bro3: useRef<HTMLDivElement>(null),
    bro4: useRef<HTMLDivElement>(null),
    bro5: useRef<HTMLDivElement>(null),
  };

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

  const scrollToSection = (sectionId: keyof typeof sectionRefs) => {
    sectionRefs[sectionId].current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="flex w-full">
        <div className="w-64 pr-10">
          <p className={`ml-7 mb-3 mt-5 text-gray-400 text-xs uppercase`}>
            Portfolio Report
          </p>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="w-full flex items-center justify-start"
            onClick={() => scrollToSection("summary")}
          >
            <p className={`font-normal`}>Performance Summary</p>
          </Button>
          <p className={`ml-7 mb-3 mt-3 text-gray-400 text-xs uppercase`}>
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
            onClick={() => router.push("monthlyReturns")}
          >
            <p className={`font-normal`}>Monthly</p>
          </Button>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="w-full flex items-center justify-start"
            onClick={() => router.push("weeklyReturns")}
          >
            <p className={`font-normal`}>Weekly</p>
          </Button>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="w-full flex items-center justify-start"
            onClick={() => router.push("dailyReturns")}
          >
            <p className={`font-normal`}>Daily</p>
          </Button>
          <p className={`ml-7 mb-3 mt-3 text-gray-400 text-xs uppercase`}>
            Charts
          </p>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="w-full flex items-center justify-start"
            onClick={() => router.push("equityGraphs")}
          >
            <p className={`font-normal`}>Equity Graphs</p>
          </Button>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="w-full flex items-center justify-start"
            onClick={() => router.push("")}
          >
            <p className={`font-normal`}>Drawdown Graphs</p>
          </Button>
          <p className={`ml-7 mb-3 mt-3 text-gray-400 text-xs uppercase`}>
            Market
          </p>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="w-full flex items-center justify-start"
            onClick={() => router.push("")}
          >
            <p className={`font-normal`}>Market Performance</p>
          </Button>
          <p className={`ml-7 mb-3 mt-3 text-gray-400 text-xs uppercase`}>
            Correlation
          </p>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="w-full flex items-center justify-start"
            onClick={() => router.push("")}
          >
            <p className={`font-normal`}>Markets Matrix</p>
          </Button>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="w-full flex items-center justify-start"
            onClick={() => router.push("")}
          >
            <p className={`font-normal`}>Strategies Matrix</p>
          </Button>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="w-full flex items-center justify-start"
            onClick={() => router.push("")}
          >
            <p className={`font-normal`}>Negative Matrix</p>
          </Button>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="w-full flex items-center justify-start"
            onClick={() => router.push("")}
          >
            <p className={`font-normal`}>Positive Matrix</p>
          </Button>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="w-full flex items-center justify-start"
            onClick={() => router.push("")}
          >
            <p className={`font-normal`}>DD Matrix</p>
          </Button>
          <p className={`ml-7 mb-3 mt-3 text-gray-400 text-xs uppercase`}>
            Trades
          </p>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="w-full flex items-center justify-start"
            onClick={() => router.push("")}
          >
            <p className={`font-normal`}>Trade List</p>
          </Button>
          <p className={`ml-7 mb-3 mt-3 text-gray-400 text-xs uppercase`}>
            Settings
          </p>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="w-full flex items-center justify-start"
            onClick={() => router.push("")}
          >
            <p className={`font-normal`}>Portfolio Settings</p>
          </Button>
        </div>
        <ScrollArea className="flex-1 rounded-md bg-slate-50 dark:bg-black">
            <div
              id="summary"
              ref={sectionRefs.summary}
              className="p-6 space-y-8"
            >
              <Summary />
              <PortfolioGrowth />
              <AnnualReturnsGraph />
              <TrailingReturns />
            </div>
            <div
              id="bro2"
              className="h-screen w-full flex items-center justify-center "
            ></div>
            <div
              id="bro3"
              className="h-screen w-full flex items-center justify-center "
            ></div>
            <div
              ref={sectionRefs.bro4}
              id="bro4"
              className="h-screen w-full flex items-center justify-center bg-purple-500"
            ></div>
            <div
              id="bro5"
              className="h-screen w-full flex items-center justify-center bg-orange-500"
            ></div>
        </ScrollArea>
      </div>
    </>
  );
};

export default StrategyPage;
