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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { processData, processData2 } from "../processing/dataProcessing";
import { useFirestore } from "reactfire";
import { doc, Timestamp, updateDoc } from "firebase/firestore";

const StrategyConfig = ({ strategy }) => {
  const [initialCapital, setInitialCapital] = useState(parseFloat(strategy.metrics["Initial Capital"]));
  const firestore = useFirestore();

  const reprocessData = async () => {
    // Transform Firestore data
    const transformData = (firestoreData) => {
      return firestoreData.map((entry) => {
        return Object.values(entry).flat();
      });
    };

    const data = transformData(strategy.data);

    const result = processData(strategy.columnLabels, data, initialCapital);
    const annualReturns = processData2(strategy.columnLabels, data, initialCapital, "year");
    const monthlyReturns = processData2(strategy.columnLabels, data, initialCapital, "month");
    const weeklyReturns = processData2(strategy.columnLabels, data, initialCapital, "week");
    const dailyReturns = processData2(strategy.columnLabels, data, initialCapital, "day");

    console.log(result);

    try {
      console.log("yo")
      console.log(strategy.NO_ID_FIELD)

      // Get the document reference for the existing strategy
      const strategyDocRef = doc(firestore, "strategies", strategy.NO_ID_FIELD);
      

      // Update the existing strategy document
      await updateDoc(strategyDocRef, {
        metrics: result.metrics,
        equityCurveData: result.equityCurveData,
        updatedAt: Timestamp.now(), // Track when the update occurred
        annualReturns: annualReturns,
        monthlyReturns: monthlyReturns,
        weeklyReturns: weeklyReturns,
        dailyReturns: dailyReturns,
      });

      console.log("Strategy updated successfully");
    } catch (error) {
      console.error("Error updating strategy: ", error);
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
                onChange={(e) => setInitialCapital(parseFloat(e.target.value) || 0)} // Converts to number, defaults to 0 if empty
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
                      <p>
                        Select benchmark index or an imported benchmark series
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select>
                <SelectTrigger className="" defaultValue="none">
                  <SelectValue placeholder="Select a benchmark" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="ticker">Specify Ticker...</SelectItem>
                    <SelectItem value="blueberry">
                      Import Benchmark...
                    </SelectItem>
                    <SelectLabel className="mt-1">
                      Benchmark Portfolio
                    </SelectLabel>
                    <SelectItem className="ml-5" value="v500index">
                      Vanguard 500 Index Investor
                    </SelectItem>
                    <SelectItem className="ml-5" value="vbindex">
                      Vanguard Balanced Index Inv
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-row">
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
