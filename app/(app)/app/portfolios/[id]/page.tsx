"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/spinner";
import {
  useFirestore,
  useFirestoreCollection,
  useFirestoreDocData,
  useUser,
} from "reactfire";
import { collection, doc, orderBy, query } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BsGraphDownArrow, BsTable } from "react-icons/bs";
import { TfiStatsUp } from "react-icons/tfi";
import { IoCalendarClearOutline } from "react-icons/io5";
import { IoCalendarOutline } from "react-icons/io5";
import { IoIosCheckboxOutline } from "react-icons/io";
import { IoStatsChartSharp } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import Summary from "@/components/strategyPage/performanceSummary";
import PortfolioGrowth from "@/components/strategyPage/portfolioGrowth";
import AnnualReturnsGraph from "@/components/strategyPage/AnnualReturnsGraph";
import MonthlyReturnsGraph from "@/components/strategyPage/MonthlyReturnsGraph";
import TrailingReturns from "@/components/strategyPage/TrailingReturns";
import ActiveReturnsChart from "@/components/strategyPage/ActiveReturnsChart";
import AnnualReturns from "@/components/strategyPage/AnnualReturns";
import MonthlyReturns from "@/components/strategyPage/MonthlyReturns";
import RiskandReturnMetrics from "@/components/strategyPage/RiskandReturnMetrics";
import Drawdowns from "@/components/strategyPage/Drawdowns";
import DrawdownDollar from "@/components/strategyPage/DrawdownDollar";
import TradingPerformance from "@/components/strategyPage/TradingPerformance";
import TradeList from "@/components/strategyPage/TradeList";
import StrategyInfo from "@/components/strategyPage/StrategyInfo";
import StrategyConfig from "@/components/strategyPage/StrategyConfig";
import MonthlyNetProfitGraph from "@/components/strategyPage/MonthlyNetProfitGraph";
import DailyNetProfitGraph from "@/components/strategyPage/DailyNetProfitGraph";
import MonthlyAnalysis from "@/components/strategyPage/MonthlyAnalysis";
import TradeDistribution from "@/components/strategyPage/TradeDistribution";
import BiggestDrawdowns from "@/components/strategyPage/BiggestDrawdowns";
import MonteCarloAnalysis from "@/components/strategyPage/MonteCarloAnalysis";
import { GoSidebarCollapse } from "react-icons/go";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { IoAnalyticsSharp } from "react-icons/io5";

const PortfolioPage = () => {
  const params = useParams<{ id: string }>();
  const { data: user, status } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(true);
  const [plotByTrade, setPlotByTrade] = useState(true);
  const [plotByTime, setPlotByTime] = useState(false);
  const [dataInDollars, setDataInDollars] = useState(true);
  const [dataInPercent, setDataInPercent] = useState(false);
  const [monteCarloSelected, setMonteCarloSelected] = useState(false);

  const handlePlotByTradeChange = (checked: boolean) => {
    setPlotByTrade(checked);
    setPlotByTime(!checked);
  };

  const handlePlotByTimeChange = (checked: boolean) => {
    setPlotByTime(checked);
    setPlotByTrade(!checked);
  };

  const handleDataInDollarsChange = (checked: boolean) => {
    setDataInDollars(checked);
    setDataInPercent(!checked);
  };

  const handleDataInPercentChange = (checked: boolean) => {
    setDataInPercent(checked);
    setDataInDollars(!checked);
  };

  const portfolioId = params?.id;

  const sectionRefs = {
    summary: useRef<HTMLDivElement>(null),
    activereturns: useRef<HTMLDivElement>(null),
    metrics: useRef<HTMLDivElement>(null),
    annualreturns: useRef<HTMLDivElement>(null),
    monthlyreturns: useRef<HTMLDivElement>(null),
    drawdowns: useRef<HTMLDivElement>(null),
    rollingreturns: useRef<HTMLDivElement>(null),
    trades: useRef<HTMLDivElement>(null),
  };

  if (!portfolioId) {
    return <div>Portfolio ID is missing.</div>;
  }

  // Changed from strategies to portfolios collection
  const portfolioRef = doc(firestore, "portfolios", portfolioId);
  const { data: portfolio, status: portfolioStatus } =
    useFirestoreDocData(portfolioRef);

  // Changed from strategies/{id}/trades to portfolios/{id}/trades
  const tradesCollectionRef = collection(
    firestore,
    `portfolios/${portfolioId}/trades`
  );
  const tradesQuery = query(tradesCollectionRef, orderBy("exitDate", "asc"));
  const { data: tradesData, status: tradesStatus } =
    useFirestoreCollection(tradesQuery);

  if (
    status === "loading" ||
    portfolioStatus === "loading" ||
    tradesStatus === "loading"
  ) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <LoadingSpinner size={45} />
      </div>
    );
  }

  if (!user) {
    return <div>Please sign in to view portfolios.</div>;
  }

  if (portfolioStatus === "error" || tradesStatus === "error") {
    return <div>Error fetching data. Please try again later.</div>;
  }

  const trades = tradesData ? tradesData.docs.map((doc) => doc.data()) : [];

  const scrollToSection = (sectionId: keyof typeof sectionRefs) => {
    sectionRefs[sectionId].current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div className="flex w-full">
        <div
          className={`space-y-1 transition-width duration-300 ${
            isExpanded ? "w-56 pr-10" : "w-[4.5rem] pr-6"
          }`}
        >
          <div className="w-full flex justify-end">
            <Button
              variant="ghost"
              onClick={toggleSidebar}
              className={`-mt-[3px] mb-9`}
            >
              <GoSidebarCollapse
                className={`transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </Button>
          </div>
          <p
            className={`ml-7 !mb-4 mt-5 text-gray-400 text-xs uppercase ${
              isExpanded ? "" : "hidden"
            }`}
          >
            Portfolio Report
          </p>
          <Button
            variant={"ghost"}
            size={"default"}
            className="w-full flex items-center justify-start"
            onClick={() => scrollToSection("summary")}
          >
            <IoEyeOutline size={16} className={`mr-2 shrink-0`} />
            <p className={`font-normal ${isExpanded ? "" : "hidden"}`}>
              Summary
            </p>
          </Button>
          <Button
            variant={"ghost"}
            size={"default"}
            className="w-full flex items-center justify-start"
            onClick={() => scrollToSection("activereturns")}
          >
            <IoStatsChartSharp className="mr-2 shrink-0" />
            <p className={`font-normal ${isExpanded ? "" : "hidden"}`}>
              Active Returns
            </p>
          </Button>
          <Button
            variant={"ghost"}
            size={"default"}
            className="w-full flex items-center justify-start"
            onClick={() => scrollToSection("metrics")}
          >
            <IoIosCheckboxOutline size={16} className="mr-2 shrink-0" />
            <p className={`font-normal ${isExpanded ? "" : "hidden"}`}>
              Metrics
            </p>
          </Button>
          <Button
            variant={"ghost"}
            size={"default"}
            className="w-full flex items-center justify-start"
            onClick={() => scrollToSection("annualreturns")}
          >
            <IoCalendarClearOutline className="mr-2 shrink-0" />
            <p className={`font-normal ${isExpanded ? "" : "hidden"}`}>
              Annual Returns
            </p>
          </Button>
          <Button
            variant={"ghost"}
            size={"default"}
            className="w-full flex items-center justify-start"
            onClick={() => scrollToSection("monthlyreturns")}
          >
            <IoCalendarOutline className="mr-2 shrink-0" />
            <p className={`font-normal ${isExpanded ? "" : "hidden"}`}>
              Monthly Returns
            </p>
          </Button>
          <Button
            variant={"ghost"}
            size={"default"}
            className="w-full flex items-center justify-start"
            onClick={() => scrollToSection("drawdowns")}
          >
            <BsGraphDownArrow className="mr-2 shrink-0" />
            <p className={`font-normal ${isExpanded ? "" : "hidden"}`}>
              Drawdown Graphs
            </p>
          </Button>
          <Button
            variant={"ghost"}
            size={"default"}
            className="w-full flex items-center justify-start"
            onClick={() => scrollToSection("rollingreturns")}
          >
            <TfiStatsUp className="mr-2 shrink-0" />
            <p className={`font-normal ${isExpanded ? "" : "hidden"}`}>
              Rolling Returns
            </p>
          </Button>
          <Button
            variant={"ghost"}
            size={"default"}
            className="w-full flex items-center justify-start"
            onClick={async () => {
              await setMonteCarloSelected(false);
              scrollToSection("trades");
            }}
          >
            <BsTable className="mr-2 shrink-0" />
            <p className={`font-normal ${isExpanded ? "" : "hidden"}`}>
              Trades
            </p>
          </Button>
          <p
            className={`ml-7 !mb-4 !mt-10 text-gray-400 text-xs uppercase ${
              isExpanded ? "" : "hidden"
            }`}
          >
            Analysis
          </p>
          <Button
            variant={"ghost"}
            size={"default"}
            className={`w-full flex items-center justify-start ${
              monteCarloSelected && "bg-blue-100"
            }`}
            onClick={() => setMonteCarloSelected(!monteCarloSelected)}
          >
            <IoAnalyticsSharp className="mr-2 shrink-0" />
            <p className={`font-normal ${isExpanded ? "" : "hidden"}`}>
              Monte Carlo
            </p>
          </Button>
          {isExpanded && (
            <>
              <p className="!mt-10 text-sm">Plot by</p>
              <div className="flex items-center !mt-3 border rounded-md px-3 py-2 w-full justify-between">
                <Label htmlFor="plotByTrade" className="text-xs">
                  Trade
                </Label>
                <Switch
                  className="data-[state=checked]:bg-blue-500"
                  id="plotByTrade"
                  checked={plotByTrade}
                  onCheckedChange={handlePlotByTradeChange}
                />
              </div>
              <div className="flex items-center !mt-1.5 border rounded-md px-3 py-2 w-full justify-between">
                <Label htmlFor="plotByTime" className="text-xs">
                  Time
                </Label>
                <Switch
                  className="data-[state=checked]:bg-blue-500"
                  id="plotByTime"
                  checked={plotByTime}
                  onCheckedChange={handlePlotByTimeChange}
                />
              </div>
              <p className="!mt-8 text-sm">Data in</p>
              <div className="flex items-center !mt-3 border rounded-md px-3 py-2 w-full justify-between">
                <Label htmlFor="dataInDollar" className="text-xs">
                  Dollars $
                </Label>
                <Switch
                  className="data-[state=checked]:bg-blue-500"
                  id="dataInDollar"
                  checked={dataInDollars}
                  onCheckedChange={handleDataInDollarsChange}
                />
              </div>
              <div className="flex items-center !mt-1.5 border rounded-md px-3 py-2 w-full justify-between">
                <Label htmlFor="dataInPercent" className="text-xs">
                  Percentage %
                </Label>
                <Switch
                  className="data-[state=checked]:bg-blue-500"
                  id="dataInPercent"
                  checked={dataInPercent}
                  onCheckedChange={handleDataInPercentChange}
                />
              </div>
            </>
          )}
        </div>
        {monteCarloSelected ? (
          <ScrollArea className="flex-1 rounded-md bg-slate-50 dark:bg-black">
            <div className="p-6">
              <StrategyInfo strategy={portfolio} />
              <MonteCarloAnalysis strategy={portfolio} trades={trades} />
            </div>
          </ScrollArea>
        ) : (
          <ScrollArea className="flex-1 rounded-md bg-slate-50 dark:bg-black">
            <div className="p-6">
              <StrategyInfo strategy={portfolio} />
              <StrategyConfig strategy={portfolio} trades={trades} />
            </div>
            <div
              id="summary"
              ref={sectionRefs.summary}
              className="p-6 space-y-8"
            >
              <Summary strategy={portfolio} />
              <PortfolioGrowth
                  strategy={portfolio}
                  trades={trades}
                  plotByTrade={plotByTrade} benchmarkData={undefined}              />
              <Drawdowns
                strategy={portfolio}
                trades={trades}
                plotByTrade={plotByTrade}
              />
              <AnnualReturnsGraph
                strategy={portfolio}
                trades={trades}
                dataInDollars={dataInDollars}
              />
              <MonthlyReturnsGraph
                strategy={portfolio}
                trades={trades}
                dataInDollars={dataInDollars}
              />
              <MonthlyNetProfitGraph strategy={portfolio} trades={trades} />
              <DailyNetProfitGraph strategy={portfolio} trades={trades} />
              <MonthlyAnalysis trades={trades} />
              <TradeDistribution trades={trades} />
              <TrailingReturns />
            </div>
            <div
              id="activereturns"
              ref={sectionRefs.activereturns}
              className="p-6 space-y-8"
            >
              <ActiveReturnsChart />
            </div>
            <div
              id="metrics"
              ref={sectionRefs.metrics}
              className="p-6 space-y-8"
            >
              <RiskandReturnMetrics strategy={portfolio} />
            </div>
            <div
              id="annualreturns"
              ref={sectionRefs.annualreturns}
              className="p-6 space-y-8"
            >
              <AnnualReturns strategy={portfolio} trades={trades} />
            </div>
            <div
              id="monthlyreturns"
              ref={sectionRefs.monthlyreturns}
              className="p-6 space-y-8"
            >
              <MonthlyReturns strategy={portfolio} trades={trades} />
            </div>
            <div
              id="drawdowns"
              ref={sectionRefs.drawdowns}
              className="p-6 space-y-8"
            >
              <BiggestDrawdowns strategy={portfolio} trades={trades} />
            </div>
            <div
              id="rollingreturns"
              ref={sectionRefs.rollingreturns}
              className="p-6 space-y-8"
            ></div>
            <div id="trades" ref={sectionRefs.trades} className="p-6 space-y-8">
              <TradingPerformance strategy={portfolio} />
              <TradeList trades={trades} />
            </div>
          </ScrollArea>
        )}
      </div>
    </>
  );
};

export default PortfolioPage;
