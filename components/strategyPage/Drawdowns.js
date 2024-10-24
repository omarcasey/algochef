import { useTheme } from "next-themes";
import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Drawdowns = ({ strategy, trades, plotByTrade = false }) => {
  const { theme } = useTheme();

  // Process trades to create equity curve and drawdown data
  const { drawdownData, drawdownDataDollar } = useMemo(() => {
    if (!trades || trades.length === 0) {
      console.log("No trades data available");
      return { drawdownData: [], drawdownDataDollar: [] };
    }

    let equity = strategy.metrics.initialCapital;
    let maxEquity = equity;
    let equityCurve = [];

    trades.forEach((trade, index) => {
      equity += trade.netProfit;
      maxEquity = Math.max(maxEquity, equity);
      const drawdownPercent = ((equity - maxEquity) / maxEquity) * 100;
      const drawdownDollar = equity - maxEquity;
      
      // Include both date and index-based values
      const dataPoint = {
        date: trade.exitDate.toDate().getTime(),
        equity: equity,
        drawdownPercent: drawdownPercent,
        drawdownDollar: drawdownDollar,
        tradeNumber: index + 1,
        // Use xValue for consistent animation
        xValue: plotByTrade ? index + 1 : trade.exitDate.toDate().getTime(),
      };
      equityCurve.push(dataPoint);
    });

    return {
      drawdownData: equityCurve,
      drawdownDataDollar: equityCurve,
    };
  }, [trades, strategy.metrics.initialCapital]); // Remove plotByTrade dependency

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const xValue = plotByTrade 
        ? `Trade ${label}` 
        : new Date(label).toLocaleDateString();
      return (
        <div className="custom-tooltip bg-white dark:bg-gray-800 p-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg">
          <p className="label text-gray-700 dark:text-white font-medium">{xValue}</p>
          <div className="flex flex-row items-center">
            <div className="w-2 h-2 bg-red-600 rounded-full mr-2" />
            <p className="intro text-red-600 font-semibold">
              {`${strategy.name}: ${payload[0].value.toFixed(2)}%`}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomTooltipDollar = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const xValue = plotByTrade 
        ? `Trade ${label}` 
        : new Date(label).toLocaleDateString();
      return (
        <div className="custom-tooltip bg-white dark:bg-gray-800 p-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg">
          <p className="label text-gray-700 dark:text-white font-medium">{xValue}</p>
          <div className="flex flex-row items-center">
            <div className="w-2 h-2 bg-red-600 rounded-full mr-2" />
            <p className="intro text-red-600 font-semibold">
              {`${strategy.name}: $${payload[0].value.toFixed(2)}`}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const dateFormatter = (date) => {
    const options = { year: "numeric", month: "short" };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
  };

  const xAxisFormatter = (value) => {
    if (plotByTrade) {
      return `Trade ${value}`;
    }
    return dateFormatter(value);
  };

  // Use consistent xValue for both charts
  const xAxisProps = {
    dataKey: "xValue",
    type: "number",
    scale: plotByTrade ? "linear" : "time",
    domain: plotByTrade 
      ? [1, drawdownData.length]
      : [
          Math.min(...drawdownData.map((d) => d.date)),
          Math.max(...drawdownData.map((d) => d.date)),
        ],
    tickFormatter: xAxisFormatter,
    interval: plotByTrade ? undefined : Math.floor(drawdownData.length / 12),
  };

  return (
    <div className="rounded-xl shadow-2xl dark:border w-full bg-white dark:bg-black py-6 px-10">
      <h1 className="text-xl text-blue-900 dark:text-white saturate-200 font-medium mb-6">
        Drawdowns
      </h1>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={drawdownDataDollar} margin={{ left: 20, right: 20 }}>
          <defs>
            <linearGradient id="colorDrawdownDollar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF0000" stopOpacity={0} />
              <stop offset="95%" stopColor="#FF0000" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis {...xAxisProps} fontSize={12} tickMargin={5} hide />
          <YAxis
            dataKey="drawdownDollar"
            axisLine={false}
            tickLine={false}
            tickFormatter={(tick) => `$${tick.toFixed(0)}`}
            fontSize={12}
          />
          <Tooltip content={<CustomTooltipDollar />} />
          <Area
            type="monotone"
            dataKey="drawdownDollar"
            name={strategy.name}
            stroke="#FF0000"
            fillOpacity={1}
            fill="url(#colorDrawdownDollar)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={drawdownData} margin={{ left: 20, right: 20 }}>
          <defs>
            <linearGradient id="colorDrawdown" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF0000" stopOpacity={0} />
              <stop offset="95%" stopColor="#FF0000" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis {...xAxisProps} fontSize={12} tickMargin={5} />
          <YAxis
            dataKey="drawdownPercent"
            axisLine={false}
            tickLine={false}
            tickFormatter={(tick) => `${tick.toFixed(1)}%`}
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="drawdownPercent"
            name={strategy.name}
            stroke="#FF0000"
            fillOpacity={1}
            fill="url(#colorDrawdown)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Drawdowns;