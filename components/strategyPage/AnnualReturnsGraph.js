import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const AnnualReturnsGraph = ({ strategy }) => {
  // Transform the strategy data into a format suitable for Recharts
  const data = strategy.annualReturns.map(({ period, netProfit }) => ({
    period,
    netProfit: parseFloat(netProfit), // Convert string to float
    Benchmark: parseFloat(netProfit) * 0.5,
  }));

  return (
    <div className="rounded-xl shadow-xl w-full bg-white dark:bg-slate-900 py-6 px-10">
      <h1 className="text-xl text-blue-900 dark:text-white saturate-200 font-medium mb-6">
        Annual Returns
      </h1>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart 
          data={data}
          margin={{ left: 15,}} // Adjust margins
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey="period" />
          <YAxis 
            tickFormatter={(value) => `$${value.toLocaleString()}`} 
            width={80} // Set width to ensure the labels fit
            axisLine={false}  // Remove the Y-axis line
            tickMargin={15}
            tickLine={false}
          />
          <Tooltip 
            formatter={(value) => `$${value.toLocaleString()}`}
            cursor={{ fill: 'transparent' }} // Remove overlay on hover
          />
          <Bar dataKey="netProfit" fill="#097EF2" />
          <Bar dataKey="Benchmark" fill="#50E2B0" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnnualReturnsGraph;
