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
          maxRunup: 0, // Track the highest gain (from trough to peak)
          maxDrawdown: 0, // Track the largest peak-to-trough drawdown
          runningEquity: 0, // Track current equity
          peakEquity: runningCapital, // Track peak equity
          troughEquity: runningCapital, // Track the lowest point before peak equity
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
      }

      // Update trough equity if the current equity is lower than the previous trough
      if (annualData[year].runningEquity < annualData[year].troughEquity) {
        annualData[year].troughEquity = annualData[year].runningEquity;
      }

      // Calculate drawdown as the difference between peak and current equity
      const drawdown =
        annualData[year].peakEquity - annualData[year].runningEquity;

      // Update max drawdown if this drawdown is larger than previous ones
      if (drawdown > annualData[year].maxDrawdown) {
        annualData[year].maxDrawdown = drawdown;
      }

      // Calculate runup as the difference between current equity and trough equity
      const runup =
        annualData[year].runningEquity - annualData[year].troughEquity;

      // Update max runup if this runup is larger than previous ones
      if (runup > annualData[year].maxRunup) {
        annualData[year].maxRunup = runup;
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
        adjustedMaxDrawdown:
          yearData.netProfit < 0
            ? yearData.maxDrawdown - yearData.netProfit
            : yearData.maxDrawdown,
        adjustedMaxRunup:
          yearData.netProfit > 0
            ? yearData.maxRunup - yearData.netProfit
            : yearData.maxRunup,
      };
    });
  }, [trades, dataInDollars, strategy]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const { netProfit, maxRunup, maxDrawdown } = payload[0].payload;
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
                  : `${netProfit.toFixed(2)}%`
              }`}
            </p>
          </div>

          <div className="flex flex-row items-center mt-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
            <p className="text-green-500 font-semibold text-xs">
              {`Max Runup: ${
                dataInDollars
                  ? `$${maxRunup.toLocaleString()}`
                  : `${maxRunup.toFixed(2)}%`
              }`}
            </p>
          </div>

          <div className="flex flex-row items-center">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2" />
            <p className="text-red-500 font-semibold text-xs">
              {`Max Drawdown: (${
                dataInDollars
                  ? `$${Math.abs(maxDrawdown).toLocaleString()}`
                  : `${Math.abs(maxDrawdown).toFixed(2)}%`
              })`}
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  console.log(data);

  return (
    <div className="rounded-xl shadow-2xl dark:border w-full bg-white dark:bg-black py-6 px-10">
      <h1 className="text-xl text-blue-900 dark:text-white saturate-200 font-medium mb-6">
        Annual Returns
      </h1>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ left: 15 }} // Adjust margins
          stackOffset="sign" // Stacks the bars relative to the base line (0)
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="period"
            fontSize={12}
            tickMargin={5}
            interval={Math.floor(data.length / 12)} // Adjust the interval to control the number of ticks
          />
          <YAxis
            tickFormatter={(value) =>
              dataInDollars ? `$${value.toLocaleString()}` : `${value}%`
            }
            width={80} // Set width to ensure the labels fit
            axisLine={false} // Remove the Y-axis line
            tickMargin={15}
            tickLine={false}
            fontSize={14}
            domain={["auto", "auto"]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="netProfit"
            stackId="a"
            fill="#097EF2"
            name="Net Profit"
          />
          <Bar
            dataKey="adjustedMaxRunup"
            stackId="a"
            fill="#50E2B0"
            name="Max Run-up"
            fillOpacity={0.25}
          />
          <Bar
            dataKey="adjustedMaxDrawdown"
            stackId="a"
            fill="#F95F62"
            name="Max Drawdown"
            fillOpacity={0.25}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnnualReturnsGraph;
