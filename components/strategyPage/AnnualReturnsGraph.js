import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const AnnualReturnsGraph = ({ strategy, trades, dataInDollars = false }) => {
  // Process trades to aggregate data by year
  const data = useMemo(() => {
    if (!trades || trades.length === 0) {
      console.log("No trades data available");
      return [];
    }

    const initialCapital = strategy?.metrics?.initialCapital;
    let runningCapital = initialCapital; // Track capital as it grows over the years
    const annualData = {};

    trades.forEach((trade) => {
      const year = trade.exitYear;
      if (!annualData[year]) {
        annualData[year] = {
          period: year,
          netProfit: 0,
          startingCapital: runningCapital, // The capital at the start of the year
          maxRunup: 0,
          maxDrawdown: 0,
          runningEquity: runningCapital,
          peakEquity: runningCapital,
          lowestEquity: runningCapital,
        };
      }

      const tradeProfit = trade.netProfit;
      annualData[year].netProfit += tradeProfit;

      // Update running equity
      annualData[year].runningEquity += tradeProfit;
      runningCapital += tradeProfit;

      // Update peak equity if the current equity exceeds the previous peak
      if (annualData[year].runningEquity > annualData[year].peakEquity) {
        annualData[year].peakEquity = annualData[year].runningEquity;
        // Reset lowest equity when we reach a new peak
        annualData[year].lowestEquity = annualData[year].runningEquity;
      }

      // Update lowest equity if the current equity is lower than the previous lowest
      if (annualData[year].runningEquity < annualData[year].lowestEquity) {
        annualData[year].lowestEquity = annualData[year].runningEquity;
      }

      // Calculate current drawdown
      const currentDrawdown =
        annualData[year].peakEquity - annualData[year].runningEquity;

      // Update max drawdown if this drawdown is larger than previous ones
      if (currentDrawdown > annualData[year].maxDrawdown) {
        annualData[year].maxDrawdown = currentDrawdown;
      }

      // Calculate current runup
      const currentRunup =
        annualData[year].runningEquity - annualData[year].lowestEquity;

      // Update max runup if this runup is larger than previous ones
      if (currentRunup > annualData[year].maxRunup) {
        annualData[year].maxRunup = currentRunup;
      }
    });

    // Now convert the object to an array and calculate returns based on the starting capital for each year
    return Object.values(annualData).map((yearData) => {
      const percentReturnValue =
        (yearData.netProfit / yearData.startingCapital) * 100; // Calculate percent return
      const percentMaxRunup =
        (yearData.maxRunup / yearData.startingCapital) * 100;
      const percentMaxDrawdown =
        (yearData.maxDrawdown / yearData.startingCapital) * 100;

      return {
        ...yearData,
        percentReturnValue: percentReturnValue,
        percentMaxRunup: percentMaxRunup,
        percentMaxDrawdown: percentMaxDrawdown,
        adjustedMaxDrawdown:
          yearData.netProfit < 0
            ? yearData.maxDrawdown - yearData.netProfit
            : yearData.maxDrawdown,
        adjustedMaxRunup:
          yearData.netProfit > 0
            ? yearData.maxRunup - yearData.netProfit
            : yearData.maxRunup,
        adjustedPercentMaxDrawdown:
          percentReturnValue < 0
            ? percentMaxDrawdown - percentReturnValue
            : percentMaxDrawdown,
        adjustedPercentMaxRunup:
          percentReturnValue > 0
            ? percentMaxRunup - percentReturnValue
            : percentMaxRunup,
      };
    });
  }, [trades, dataInDollars, strategy]);

  console.log(data);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const {
        netProfit,
        maxRunup,
        maxDrawdown,
        percentMaxDrawdown,
        percentMaxRunup,
        percentReturnValue,
      } = payload[0].payload;
      return (
        <div className="custom-tooltip bg-white dark:bg-gray-800 p-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg">
          <p className="label text-gray-700 dark:text-white font-medium">
            {label}
          </p>
          <div className="flex flex-row items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
            <p className="text-blue-500 font-semibold">
              {`Net Profit: ${
                dataInDollars
                  ? `$${netProfit.toLocaleString()}`
                  : `${percentReturnValue.toFixed(2)}%`
              }`}
            </p>
          </div>

          <div className="flex flex-row items-center mt-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
            <p className="text-green-500 font-semibold text-xs">
              {`Max Runup: ${
                dataInDollars
                  ? `$${maxRunup.toLocaleString()}`
                  : `${percentMaxRunup.toFixed(2)}%`
              }`}
            </p>
          </div>

          <div className="flex flex-row items-center">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2" />
            <p className="text-red-500 font-semibold text-xs">
              {`Max Drawdown: (${
                dataInDollars
                  ? `$${Math.abs(maxDrawdown).toLocaleString()}`
                  : `${Math.abs(percentMaxDrawdown).toFixed(2)}%`
              })`}
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="rounded-xl shadow-2xl dark:border w-full bg-white dark:bg-black py-6 px-10">
      <h1 className="text-xl text-blue-900 dark:text-white saturate-200 font-medium mb-6">
        Annual Returns
      </h1>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ left: 15 }}
          stackOffset="sign"
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="period"
            fontSize={12}
            tickMargin={5}
            interval={Math.floor(data.length / 12)}
          />
          <YAxis
            tickFormatter={(value) =>
              dataInDollars ? `$${value.toLocaleString()}` : `${value}%`
            }
            width={80}
            axisLine={false}
            tickMargin={15}
            tickLine={false}
            fontSize={14}
            domain={["auto", "auto"]}
          />
          <Tooltip content={<CustomTooltip />} />
          {/* <Bar
            dataKey={
              dataInDollars
                ? "adjustedMaxDrawdown"
                : "adjustedPercentMaxDrawdown"
            }
            stackId="a"
            fill="#F95F62"
            name={
              dataInDollars
                ? "adjustedMaxDrawdown"
                : "adjustedPercentMaxDrawdown"
            }
            fillOpacity={0.8}
          /> */}
          <Bar
            dataKey={dataInDollars ? "netProfit" : "percentReturnValue"}
            stackId="a"
            fill="#097EF2"
            name={dataInDollars ? "netProfit" : "percentReturnValue"}
          />
          {/* <Bar
            dataKey={
              dataInDollars ? "adjustedMaxRunup" : "adjustedPercentMaxRunup"
            }
            stackId="a"
            fill="#50E2B0"
            name={
              dataInDollars ? "adjustedMaxRunup" : "adjustedPercentMaxRunup"
            }
            fillOpacity={0.8}
          /> */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnnualReturnsGraph;
