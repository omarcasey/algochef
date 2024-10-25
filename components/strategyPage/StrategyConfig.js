"use client";
import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { IoInformationCircle } from "react-icons/io5";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import {
  calculateTradingMetrics,
  calculateBenchmarkMetrics,
} from "../processing/dataProcessing";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import {
  doc,
  Timestamp,
  updateDoc,
  collection,
  query,
  getDocs,
  orderBy,
  where,
} from "firebase/firestore";
import { toast } from "@/components/ui/use-toast";

const StrategyConfig = ({ strategy, trades }) => {
  const [initialCapital, setInitialCapital] = useState(
    parseFloat(strategy.metrics.initialCapital)
  );
  const [selectedBenchmark, setSelectedBenchmark] = useState(
    strategy.benchmark || "none"
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const firestore = useFirestore();

  // Query available benchmarks
  const benchmarksRef = collection(firestore, "benchmarks");
  const { data: benchmarksData, status } = useFirestoreCollectionData(
    benchmarksRef,
    {
      idField: "id",
    }
  );

  const fetchBenchmarkData = async (benchmarkSymbol) => {
    try {
      // Get prices subcollection for the benchmark
      const pricesRef = collection(
        firestore,
        "benchmarks",
        benchmarkSymbol,
        "prices"
      );

      // Create query ordered by date
      const q = query(pricesRef, orderBy("date"));

      // Get all prices
      const querySnapshot = await getDocs(q);

      // Convert to array of price data
      const prices = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      console.log(
        `Fetched ${prices.length} price points for ${benchmarkSymbol}`
      );
      return prices;
    } catch (error) {
      console.error("Error fetching benchmark data:", error);
      throw error;
    }
  };

  const reprocessData = async () => {
    setIsProcessing(true);
    try {
      // Calculate strategy metrics
      const metrics = calculateTradingMetrics(trades, initialCapital);

      let benchmarkMetrics = null;

      if (selectedBenchmark !== "none") {
        // Fetch benchmark prices
        const benchmarkPrices = await fetchBenchmarkData(selectedBenchmark);
        console.log("Fetched benchmark prices:", benchmarkPrices);

        // Calculate benchmark metrics for same period as strategy
        benchmarkMetrics = calculateBenchmarkMetrics(
          benchmarkPrices,
          trades,
          initialCapital
        );
        console.log("Calculated benchmark metrics:", benchmarkMetrics);
      }

      // Get the document reference for the existing strategy
      const strategyDocRef = doc(firestore, "strategies", strategy.NO_ID_FIELD);

      // Update strategy document
      await updateDoc(strategyDocRef, {
        metrics: metrics,
        benchmark: selectedBenchmark,
        benchmarkMetrics: benchmarkMetrics,
        updatedAt: Timestamp.now(),
      });

      toast({
        title: "Strategy updated successfully",
      });
    } catch (error) {
      console.error("Error updating strategy:", error);
      toast({
        title: "Strategy updated successfully",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="py-6">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Model Configuration</AccordionTrigger>
          <AccordionContent className="p-1 max-w-6xl flex flex-col space-y-2">
            <div className="flex justify-between">
              <div className="flex flex-row items-center w-1/3">
                <p className="mr-2">Initial Amount</p>
                <TooltipProvider>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger>
                      <IoInformationCircle size={15} className="" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Initial portfolio balance</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                value={initialCapital}
                onChange={(e) =>
                  setInitialCapital(parseFloat(e.target.value) || 0)
                }
                placeholder="Amount..."
                type="number"
                className=""
              />
            </div>
            <div className="flex justify-between">
              <div className="flex flex-row items-center w-1/3">
                <p className="mr-2">Benchmark</p>
                <TooltipProvider>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger>
                      <IoInformationCircle size={15} className="" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Select benchmark index to compare against</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select
                value={selectedBenchmark}
                onValueChange={(value) => setSelectedBenchmark(value)}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Select a benchmark" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="none">None</SelectItem>
                    {status === "success" &&
                      benchmarksData.map((benchmark) => (
                        <SelectItem
                          key={benchmark.id}
                          value={benchmark.id}
                          className="ml-5"
                        >
                          {benchmark.name || benchmark.symbol}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-row !mb-2">
              <div className="flex flex-row items-center w-1/4"></div>
              <Button size={"sm"} className="w-32" onClick={reprocessData}>
                Run
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default StrategyConfig;
