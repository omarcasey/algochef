import numeral from "numeral";
import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MonthlyNetProfitGraph = ({ strategy, trades }) => {
  const data = useMemo(() => {
    if (!trades || trades.length === 0) {
      console.log("No trades data available");
      return [];
    }

    const monthlyNetProfit = Array(12).fill(0);

    trades.forEach((trade) => {
      monthlyNetProfit[trade.exitMonth - 1] += trade.netProfit;
    });

    return monthlyNetProfit.map((profit, index) => ({
      month: new Date(1970, index).toLocaleString("default", {
        month: "short",
      }),
      netProfit: profit,
    }));
  }, [trades]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value = payload[0].payload.netProfit;
      return (
        <div className="custom-tooltip bg-white dark:bg-gray-800 p-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg">
          <p className="label text-gray-700 dark:text-white font-medium">
            {label}
          </p>
          <div className="flex flex-row items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
            <p className="text-blue-500 font-semibold">
              {`Net Profit: ${numeral(value).format("$0,0")}`}
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
        Monthly Net Profit
      </h1>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ left: 15 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            stroke="#8884d8"
            fontSize={12}
            tickMargin={5}
          />
          <YAxis
            tickFormatter={(value) => `${numeral(value).format("$0,0")}`}
            width={80}
            axisLine={false}
            tickMargin={15}
            tickLine={false}
            fontSize={14}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="netProfit" fill="#097EF2" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyNetProfitGraph;
