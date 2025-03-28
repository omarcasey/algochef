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
import {
  collection,
  doc,
  orderBy,
  query,
  getDocs,
  where,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BsGraphDownArrow, BsTable } from "react-icons/bs";
import { TfiStatsUp } from "react-icons/tfi";
import { IoCalendarClearOutline } from "react-icons/io5";
import { IoCalendarOutline } from "react-icons/io5";
import { IoIosCheckboxOutline } from "react-icons/io";
import { IoStatsChartSharp } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import {
  IoAnalyticsSharp,
  IoArrowBack,
  IoDownloadOutline,
  IoPrintOutline,
  IoShareOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { GoSidebarCollapse } from "react-icons/go";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Custom animated switch component
const AnimatedSwitch = ({ id, checked, onChange }) => {
  return (
    <div 
      className="relative inline-flex h-[18px] w-[32px] shrink-0 scale-75 origin-right cursor-pointer rounded-full border-2 border-transparent transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-200 dark:data-[state=unchecked]:bg-gray-700"
      data-state={checked ? "checked" : "unchecked"}
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      id={id}
    >
      <span 
        data-state={checked ? "checked" : "unchecked"}
        className="pointer-events-none block h-3.5 w-3.5 rounded-full bg-white shadow-lg ring-0 transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] data-[state=checked]:translate-x-[14px] data-[state=unchecked]:translate-x-0 data-[state=checked]:scale-105"
      />
    </div>
  );
};

// Strategy components
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

const StrategyPage = () => {
  const params = useParams();
  const { data: user, status } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(true);
  const [plotByTrade, setPlotByTrade] = useState(true);
  const [plotByTime, setPlotByTime] = useState(false);
  const [dataInDollars, setDataInDollars] = useState(true);
  const [dataInPercent, setDataInPercent] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [currentSection, setCurrentSection] = useState("summary");
  const [benchmarkData, setBenchmarkData] = useState(null);

  const sectionRefs = {
    summary: useRef(null),
    activereturns: useRef(null),
    metrics: useRef(null),
    annualreturns: useRef(null),
    monthlyreturns: useRef(null),
    drawdowns: useRef(null),
    rollingreturns: useRef(null),
    trades: useRef(null),
  };

  const strategyId = params?.id;

  // Get strategy data
  const strategyRef = doc(firestore, "strategies", strategyId);
  const { data: strategy, status: strategyStatus } =
    useFirestoreDocData(strategyRef);

  const tradesCollectionRef = collection(
    firestore,
    `strategies/${strategyId}/trades`
  );
  const tradesQuery = query(tradesCollectionRef, orderBy("order"));
  const { data: tradesData, status: tradesStatus } =
    useFirestoreCollection(tradesQuery);

  // Fetch benchmark data
  useEffect(() => {
    const fetchBenchmarkData = async () => {
      if (
        strategy?.benchmark &&
        strategy.benchmark !== "none" &&
        trades?.length > 0
      ) {
        try {
          console.log("Fetching benchmark data for:", strategy.benchmark);

          // Get strategy date range
          const strategyStartDate = new Date(
            Math.min(...trades.map((t) => t.exitDate.toDate()))
          );
          const strategyEndDate = new Date(
            Math.max(...trades.map((t) => t.exitDate.toDate()))
          );

          console.log(
            "Strategy date range:",
            strategyStartDate,
            "to",
            strategyEndDate
          );

          // Fetch benchmark prices
          const pricesRef = collection(
            firestore,
            "benchmarks",
            strategy.benchmark,
            "prices"
          );
          const q = query(
            pricesRef,
            orderBy("date"),
            where("date", ">=", strategyStartDate),
            where("date", "<=", strategyEndDate)
          );
          const querySnapshot = await getDocs(q);
          const prices = querySnapshot.docs.map((doc) => doc.data());

          console.log("Fetched prices:", prices.length);

          // Calculate daily benchmark equity
          let benchmarkEquity = strategy.metrics.initialCapital;
          const dailyEquity = prices.reduce((acc, price) => {
            // Apply daily return
            benchmarkEquity *= 1 + price.return;

            acc.push({
              date: price.date.toDate().getTime(),
              benchmarkEquity: benchmarkEquity,
            });

            return acc;
          }, []);

          console.log("Processed benchmark data:", dailyEquity);
          setBenchmarkData(dailyEquity);
        } catch (error) {
          console.error("Error fetching benchmark data:", error);
          setBenchmarkData(null);
        }
      } else {
        console.log("No benchmark selected or benchmark is none");
        setBenchmarkData(null);
      }
    };

    if (strategy && tradesData) {
      const trades = tradesData.docs.map((doc) => doc.data());
      if (trades.length > 0) {
        fetchBenchmarkData();
      }
    }
  }, [strategy, tradesData, firestore]);

  // Intersection Observer to update active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSection(entry.target.id);
          }
        });
      },
      { threshold: 0.2 }
    );

    Object.values(sectionRefs).forEach(
      (ref) => ref.current && observer.observe(ref.current)
    );

    return () => {
      Object.values(sectionRefs).forEach(
        (ref) => ref.current && observer.unobserve(ref.current)
      );
    };
  }, [strategyStatus, tradesStatus]);

  // Handler functions
  const handlePlotByTradeChange = (checked) => {
    setPlotByTrade(checked);
    setPlotByTime(!checked);
  };

  const handlePlotByTimeChange = (checked) => {
    setPlotByTime(checked);
    setPlotByTrade(!checked);
  };

  const handleDataInDollarsChange = (checked) => {
    setDataInDollars(checked);
    setDataInPercent(!checked);
  };

  const handleDataInPercentChange = (checked) => {
    setDataInPercent(checked);
    setDataInDollars(!checked);
  };

  const scrollToSection = (sectionId) => {
    setCurrentSection(sectionId);
    sectionRefs[sectionId].current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    // Add class to body to prevent scrolling
    document.body.classList.add("overflow-hidden");

    return () => {
      // Remove class when component unmounts
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  // Now handle conditional renders
  if (!strategyId) {
    return <div>Strategy ID is missing.</div>;
  }

  if (
    status === "loading" ||
    strategyStatus === "loading" ||
    tradesStatus === "loading"
  ) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <LoadingSpinner size={45} />
      </div>
    );
  }

  if (!user) {
    return <div>Please sign in to view strategies.</div>;
  }

  if (strategyStatus === "error" || tradesStatus === "error") {
    return <div>Error fetching data. Please try again later.</div>;
  }

  const trades = tradesData ? tradesData.docs.map((doc) => doc.data()) : [];

  // Sidebar Component to keep code DRY
  const SidebarComponent = () => (
    <div
      className={`h-full flex flex-col border-r transition-all duration-300 ${
        isExpanded ? "w-56 px-2" : "w-[4rem] px-1"
      }`}
    >
      <div
        className={`flex ${
          isExpanded ? "justify-end" : "justify-center"
        } py-4 flex-shrink-0`}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="rounded-full h-8 w-8 p-0 flex-shrink-0"
        >
          <GoSidebarCollapse
            className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
          />
        </Button>
      </div>

      <div className="flex-grow overflow-y-auto">
        {isExpanded && (
          <div className="px-2">
            <p className="mb-3 text-gray-400 text-xs uppercase font-medium">
              {activeTab === "overview"
                ? "Report Sections"
                : activeTab === "performance"
                ? "Performance Metrics"
                : "Advanced Analysis"}
            </p>
          </div>
        )}

        {activeTab === "overview" && (
          <>
            <Button
              variant={currentSection === "summary" ? "secondary" : "ghost"}
              size="sm"
              className="w-full flex items-center justify-start mb-1 pl-3"
              onClick={() => scrollToSection("summary")}
            >
              <IoEyeOutline size={16} className="mr-2 shrink-0" />
              <p className={`font-normal ${isExpanded ? "" : "hidden"}`}>
                Summary
              </p>
            </Button>
            <Button
              variant={currentSection === "metrics" ? "secondary" : "ghost"}
              size="sm"
              className="w-full flex items-center justify-start mb-1 pl-3"
              onClick={() => scrollToSection("metrics")}
            >
              <IoIosCheckboxOutline size={16} className="mr-2 shrink-0" />
              <p className={`font-normal ${isExpanded ? "" : "hidden"}`}>
                Key Metrics
              </p>
            </Button>
            <Button
              variant={
                currentSection === "activereturns" ? "secondary" : "ghost"
              }
              size="sm"
              className="w-full flex items-center justify-start mb-1 pl-3"
              onClick={() => scrollToSection("activereturns")}
            >
              <IoStatsChartSharp className="mr-2 shrink-0 h-4 w-4" />
              <p className={`font-normal ${isExpanded ? "" : "hidden"}`}>
                Returns
              </p>
            </Button>
            <Button
              variant={currentSection === "trades" ? "secondary" : "ghost"}
              size="sm"
              className="w-full flex items-center justify-start mb-1 pl-3"
              onClick={() => scrollToSection("trades")}
            >
              <BsTable className="mr-2 shrink-0 h-4 w-4" />
              <p className={`font-normal ${isExpanded ? "" : "hidden"}`}>
                Trades
              </p>
            </Button>
          </>
        )}

        {activeTab === "performance" && (
          <>
            <Button
              variant={
                currentSection === "annualreturns" ? "secondary" : "ghost"
              }
              size="sm"
              className="w-full flex items-center justify-start mb-1 pl-3"
              onClick={() => scrollToSection("annualreturns")}
            >
              <IoCalendarClearOutline className="mr-2 shrink-0 h-4 w-4" />
              <p className={`font-normal ${isExpanded ? "" : "hidden"}`}>
                Annual Returns
              </p>
            </Button>
            <Button
              variant={
                currentSection === "monthlyreturns" ? "secondary" : "ghost"
              }
              size="sm"
              className="w-full flex items-center justify-start mb-1 pl-3"
              onClick={() => scrollToSection("monthlyreturns")}
            >
              <IoCalendarOutline className="mr-2 shrink-0 h-4 w-4" />
              <p className={`font-normal ${isExpanded ? "" : "hidden"}`}>
                Monthly Returns
              </p>
            </Button>
            <Button
              variant={currentSection === "drawdowns" ? "secondary" : "ghost"}
              size="sm"
              className="w-full flex items-center justify-start mb-1 pl-3"
              onClick={() => scrollToSection("drawdowns")}
            >
              <BsGraphDownArrow className="mr-2 shrink-0 h-4 w-4" />
              <p className={`font-normal ${isExpanded ? "" : "hidden"}`}>
                Drawdowns
              </p>
            </Button>
            <Button
              variant={
                currentSection === "rollingreturns" ? "secondary" : "ghost"
              }
              size="sm"
              className="w-full flex items-center justify-start mb-1 pl-3"
              onClick={() => scrollToSection("rollingreturns")}
            >
              <TfiStatsUp className="mr-2 shrink-0 h-4 w-4" />
              <p className={`font-normal ${isExpanded ? "" : "hidden"}`}>
                Rolling Returns
              </p>
            </Button>
          </>
        )}

        {activeTab === "analysis" && (
          <Button
            variant="ghost"
            size="sm"
            className={`w-full flex items-center justify-start mb-1 pl-3 ${
              activeTab === "analysis" && "bg-blue-50 text-blue-700"
            }`}
            onClick={() => setActiveTab("analysis")}
          >
            <IoAnalyticsSharp className="mr-2 shrink-0 h-4 w-4" />
            <p className={`font-normal ${isExpanded ? "" : "hidden"}`}>
              Monte Carlo
            </p>
          </Button>
        )}
      </div>

      {/* Only show Display Options when on Overview tab */}
      {activeTab === "overview" && (
        <div className={`mt-auto transition-all duration-300 ${isExpanded ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4 pointer-events-none'}`}>
          {isExpanded && (
            <div className="mx-2 mb-2 flex-shrink-0 rounded-lg bg-gray-50/70 dark:bg-gray-800/30 overflow-hidden border border-gray-100 dark:border-gray-800/50">
              <div className="px-3 py-2 border-b border-gray-200/70 dark:border-gray-700/30 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Display Options
                </span>
              </div>
              <div className="px-3 py-2 space-y-3 text-sm">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="plotByTrade"
                      className="text-xs text-gray-600 dark:text-gray-400 font-normal cursor-pointer"
                    >
                      By Trade
                    </Label>
                    <AnimatedSwitch
                      id="plotByTrade"
                      checked={plotByTrade}
                      onChange={handlePlotByTradeChange}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="plotByTime"
                      className="text-xs text-gray-600 dark:text-gray-400 font-normal cursor-pointer"
                    >
                      By Time
                    </Label>
                    <AnimatedSwitch
                      id="plotByTime"
                      checked={plotByTime}
                      onChange={handlePlotByTimeChange}
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200/70 dark:border-gray-700/30 pt-2 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="dataInDollar"
                      className="text-xs text-gray-600 dark:text-gray-400 font-normal cursor-pointer"
                    >
                      Dollars ($)
                    </Label>
                    <AnimatedSwitch
                      id="dataInDollar"
                      checked={dataInDollars}
                      onChange={handleDataInDollarsChange}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="dataInPercent"
                      className="text-xs text-gray-600 dark:text-gray-400 font-normal cursor-pointer"
                    >
                      Percentage (%)
                    </Label>
                    <AnimatedSwitch
                      id="dataInPercent"
                      checked={dataInPercent}
                      onChange={handleDataInPercentChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full overflow-hidden">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-col h-full"
      >
        {/* Compact header with strategy name and actions */}
        <div className="z-20 bg-white dark:bg-gray-900 border-b flex items-center justify-between h-14 px-4 flex-shrink-0">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/app/strategies")}
              className="h-8 w-8 mr-3"
            >
              <IoArrowBack className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2">
              <h1 className="text-base font-medium truncate max-w-[180px]">
                {strategy?.name}
              </h1>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <TabsList className="grid w-[320px] grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground hidden sm:inline mr-3">
              Updated:{" "}
              {strategy?.updatedAt
                ? new Date(strategy.updatedAt.toDate()).toLocaleDateString()
                : "N/A"}
            </span>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <IoShareOutline className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <IoDownloadOutline className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <IoPrintOutline className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <SidebarComponent />

          {/* Main content */}
          <div className="flex-1 overflow-hidden">
            <TabsContent
              value="analysis"
              className="h-full flex flex-col m-0 p-0 data-[state=active]:flex data-[state=inactive]:hidden"
            >
              <ScrollArea className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-6 pb-24">
                  <StrategyInfo strategy={strategy} />
                  <Card className="w-full">
                    <CardContent className="p-0">
                      <MonteCarloAnalysis strategy={strategy} trades={trades} />
                    </CardContent>
                  </Card>
                  <div className="h-12"></div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent
              value="overview"
              className="h-full flex flex-col m-0 p-0 data-[state=active]:flex data-[state=inactive]:hidden"
            >
              <ScrollArea className="flex-1 overflow-y-auto">
                {/* <div className="p-6">
                  <StrategyInfo strategy={strategy} />
                </div> */}
                <div
                  id="summary"
                  ref={sectionRefs.summary}
                  className="p-6 space-y-6"
                >
                  <h2 className="text-xl font-semibold mb-4">
                    Summary
                  </h2>
                  <div className="space-y-6">
                    <Card className="w-full">
                      <CardContent className="p-0">
                        <Summary strategy={strategy} />
                      </CardContent>
                    </Card>
                    <Card className="w-full">
                      <CardContent className="p-0">
                        <PortfolioGrowth
                          strategy={strategy}
                          trades={trades}
                          plotByTrade={plotByTrade}
                          benchmarkData={benchmarkData}
                        />
                      </CardContent>
                    </Card>
                  </div>
                  <Card className="w-full">
                    <CardContent className="p-0">
                      <Drawdowns
                        strategy={strategy}
                        trades={trades}
                        plotByTrade={plotByTrade}
                      />
                    </CardContent>
                  </Card>
                </div>

                <div
                  id="metrics"
                  ref={sectionRefs.metrics}
                  className="p-6 space-y-6"
                >
                  <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
                  <Card className="w-full">
                    <CardContent className="p-0">
                      <RiskandReturnMetrics strategy={strategy} />
                    </CardContent>
                  </Card>
                </div>

                <div
                  id="activereturns"
                  ref={sectionRefs.activereturns}
                  className="p-6 space-y-6"
                >
                  <h2 className="text-xl font-semibold mb-4">
                    Return Analysis
                  </h2>
                  <div className="space-y-6">
                    <Card className="w-full">
                      <CardContent className="p-0">
                        <AnnualReturnsGraph
                          strategy={strategy}
                          trades={trades}
                          dataInDollars={dataInDollars}
                        />
                      </CardContent>
                    </Card>
                    <Card className="w-full">
                      <CardContent className="p-0">
                        <MonthlyReturnsGraph
                          strategy={strategy}
                          trades={trades}
                          dataInDollars={dataInDollars}
                        />
                      </CardContent>
                    </Card>
                  </div>
                  <div className="space-y-6">
                    <Card className="w-full">
                      <CardContent className="p-0">
                        <MonthlyNetProfitGraph
                          strategy={strategy}
                          trades={trades}
                        />
                      </CardContent>
                    </Card>
                    <Card className="w-full">
                      <CardContent className="p-0">
                        <DailyNetProfitGraph
                          strategy={strategy}
                          trades={trades}
                        />
                      </CardContent>
                    </Card>
                  </div>
                  <Card className="w-full">
                    <CardContent className="p-0">
                      <ActiveReturnsChart />
                    </CardContent>
                  </Card>
                </div>

                <div
                  id="trades"
                  ref={sectionRefs.trades}
                  className="p-6 space-y-6 pb-24"
                >
                  <h2 className="text-xl font-semibold mb-4">Trade Analysis</h2>
                  <div className="space-y-6">
                    <Card className="w-full">
                      <CardContent className="p-0">
                        <MonthlyAnalysis trades={trades} />
                      </CardContent>
                    </Card>
                    <Card className="w-full">
                      <CardContent className="p-0">
                        <TradeDistribution trades={trades} />
                      </CardContent>
                    </Card>
                  </div>
                  <Card className="w-full">
                    <CardContent className="p-0">
                      <TradingPerformance strategy={strategy} />
                    </CardContent>
                  </Card>
                  <Card className="w-full">
                    <CardContent className="p-0">
                      <TradeList trades={trades} />
                    </CardContent>
                  </Card>
                  <div className="h-12"></div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent
              value="performance"
              className="h-full flex flex-col m-0 p-0 data-[state=active]:flex data-[state=inactive]:hidden"
            >
              <ScrollArea className="flex-1 overflow-y-auto">
                <div
                  id="annualreturns"
                  ref={sectionRefs.annualreturns}
                  className="p-6 space-y-6"
                >
                  <h2 className="text-xl font-semibold mb-4">
                    Annual Performance
                  </h2>
                  <Card className="w-full">
                    <CardContent className="p-0">
                      <AnnualReturns strategy={strategy} trades={trades} />
                    </CardContent>
                  </Card>
                </div>
                <div
                  id="monthlyreturns"
                  ref={sectionRefs.monthlyreturns}
                  className="p-6 space-y-6"
                >
                  <h2 className="text-xl font-semibold mb-4">
                    Monthly Performance
                  </h2>
                  <Card className="w-full">
                    <CardContent className="p-0">
                      <MonthlyReturns strategy={strategy} trades={trades} />
                    </CardContent>
                  </Card>
                </div>
                <div
                  id="drawdowns"
                  ref={sectionRefs.drawdowns}
                  className="p-6 space-y-6"
                >
                  <h2 className="text-xl font-semibold mb-4">
                    Drawdown Analysis
                  </h2>
                  <Card className="w-full">
                    <CardContent className="p-0">
                      <BiggestDrawdowns strategy={strategy} trades={trades} />
                    </CardContent>
                  </Card>
                </div>
                <div
                  id="rollingreturns"
                  ref={sectionRefs.rollingreturns}
                  className="p-6 space-y-6 pb-24"
                >
                  <h2 className="text-xl font-semibold mb-4">
                    Rolling Returns
                  </h2>
                  <Card className="w-full">
                    <CardContent className="p-0">
                      <TrailingReturns />
                    </CardContent>
                  </Card>
                  <div className="h-12"></div>
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default StrategyPage;
