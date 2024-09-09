import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const MonthlyReturnsGraph = ({ strategy }) => {
  // Transform the strategy data into a format suitable for Recharts
  const data = strategy.monthlyReturns.map(({ period, netProfit, maxRunup, maxDrawdown }) => ({
    period,
    netProfit: parseFloat(netProfit), // Convert string to float
    maxRunup: parseFloat(maxRunup), // Positive part of run-up
    maxDrawdown: -parseFloat(maxDrawdown), // Negative part of drawdown
  }));

  return (
    <div className="rounded-xl shadow-2xl dark:border w-full bg-white dark:bg-black py-6 px-10">
      <h1 className="text-xl text-blue-900 dark:text-white saturate-200 font-medium mb-6">
        Monthly Returns
      </h1>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ left: 15 }} // Adjust margins
          stackOffset="sign" // Stacks the bars relative to the base line (0)
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey="period" />
          <YAxis
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            width={80} // Set width to ensure the labels fit
            axisLine={false} // Remove the Y-axis line
            tickMargin={15}
            tickLine={false}
          />
          <Tooltip
            formatter={(value) => `$${value.toLocaleString()}`}
            cursor={{ fill: "transparent" }} // Remove overlay on hover
          />
          <Legend verticalAlign="top" height={36} />
          <Bar dataKey="netProfit" stackId="a" fill="#097EF2" name="Net Profit" />
          <Bar dataKey="maxRunup" stackId="a" fill="#50E2B0" name="Max Run-up" />
          <Bar dataKey="maxDrawdown" stackId="a" fill="#F95F62" name="Max Drawdown" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyReturnsGraph;
