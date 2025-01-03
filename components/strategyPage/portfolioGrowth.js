import { useTheme } from "next-themes";
import React, { useEffect, useMemo } from "react";
import {
  ComposedChart,  // Changed from AreaChart to ComposedChart
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const PortfolioGrowth = ({ strategy, trades, plotByTrade = false, benchmarkData }) => {
  // Process trades to create equity curve data
  const data = useMemo(() => {
    if (!trades || trades.length === 0) {
      return [];
    }

    // Process strategy data
    let equity = strategy.metrics.initialCapital;
    const allData = [];

    // Add initial point
    allData.push({
      date: trades[0].exitDate.toDate().getTime(),
      equity: strategy.metrics.initialCapital
    });

    // Add trade points
    trades.forEach((trade, index) => {
      equity += trade.netProfit;
      allData.push({
        date: trade.exitDate.toDate().getTime(),
        equity: equity,
        tradeNumber: index + 1,
      });
    });

    // Add benchmark data points
    if (benchmarkData) {
      benchmarkData.forEach(point => {
        // Find if there's already a point for this date
        const existingPoint = allData.find(d => d.date === point.date);
        if (existingPoint) {
          existingPoint.benchmarkEquity = point.benchmarkEquity;
        } else {
          allData.push({
            date: point.date,
            benchmarkEquity: point.benchmarkEquity
          });
        }
      });
    }

    // Sort all points by date
    return allData.sort((a, b) => a.date - b.date);
  }, [trades, strategy.metrics.initialCapital, benchmarkData]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const xValue = plotByTrade
        ? `Trade ${label}`
        : new Date(label).toLocaleDateString();
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg">
          <p className="text-gray-700 dark:text-white font-medium">{xValue}</p>
          <div className="flex flex-col space-y-2">
            {payload[0]?.value && (
              <div className="flex flex-row items-center">
                <div className="w-2 h-2 bg-blue-600 dark:bg-green-400 rounded-full mr-2" />
                <p className="text-blue-600 dark:text-green-400 font-semibold">
                  {`${strategy.name}: $${payload[0].value.toLocaleString()}`}
                </p>
              </div>
            )}
            {payload[1]?.value && (
              <div className="flex flex-row items-center">
                <div className="w-2 h-2 bg-red-500 dark:bg-red-400 rounded-full mr-2" />
                <p className="text-red-500 dark:text-red-400 font-semibold">
                  {`${strategy.benchmark}: $${payload[1].value.toLocaleString()}`}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const { theme } = useTheme();

  const dateFormatter = (date) => {
    const options = { year: "numeric", month: "short" };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
  };

  const xAxisProps = plotByTrade
    ? {
        dataKey: "tradeNumber",
        type: "number",
        domain: [1, trades.length],
        tickFormatter: (value) => `Trade ${value}`,
      }
    : {
        dataKey: "date",
        type: "number",
        scale: "time",
        domain: [
          Math.min(...data.map((d) => d.date)),
          Math.max(...data.map((d) => d.date)),
        ],
        tickFormatter: dateFormatter,
        interval: Math.floor(data.length / 12),
      };

  return (
    <div className="rounded-xl shadow-2xl dark:border w-full bg-white dark:bg-black py-6 px-10">
      <h1 className="text-xl text-blue-900 dark:text-white saturate-200 font-medium mb-6">
        Portfolio Growth
      </h1>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data} margin={{ left: 20, right: 20 }}>
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={theme === "dark" ? "#22c55e" : "#097EF2"}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={theme === "dark" ? "#22c55e" : "#097EF2"}
                stopOpacity={0}
              />
            </linearGradient>
            <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={theme === "dark" ? "#ef4444" : "#ef4444"}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={theme === "dark" ? "#ef4444" : "#ef4444"}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis {...xAxisProps} fontSize={12} tickMargin={5} />
          <YAxis
            dataKey="equity"
            domain={["auto", "auto"]}
            tickCount={6}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            allowDecimals={false}
            axisLine={false}
            tickMargin={15}
            tickLine={false}
            fontSize={14}
          />
          <Tooltip content={<CustomTooltip />} />
          {/* Strategy line */}
          <Area
            type="monotone"
            dataKey="equity"
            name={strategy.name}
            stroke={theme === "dark" ? "#22c55e" : "#8884d8"}
            fillOpacity={1}
            fill="url(#colorUv)"
            strokeWidth={2}
            dot={false}
            connectNulls={true}
          />
          {/* Benchmark line */}
          {benchmarkData && (
            <Area
              type="linear"
              dataKey="benchmarkEquity"
              name={strategy.benchmark}
              stroke={theme === "dark" ? "#ef4444" : "#ef4444"}
              fillOpacity={0.5}
              fill="url(#colorBenchmark)"
              strokeWidth={2}
              dot={false}
              connectNulls={true}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PortfolioGrowth;