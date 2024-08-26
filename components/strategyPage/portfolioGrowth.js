import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const PortfolioGrowth = ({ strategy }) => {
  // Transform the strategy data into a format suitable for Recharts
  const data = strategy.equityCurveData.map(({ x, y }) => ({
    x: x,
    y: y,
    y2: y*0.8
  }));

  return (
    <div className="rounded-xl shadow-xl w-full bg-white dark:bg-slate-900 py-6 px-10">
      <h1 className="text-xl text-blue-900 dark:text-white saturate-200 font-medium mb-6">
        Portfolio Growth
      </h1>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ left: 35, }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="x" />
          <YAxis
            domain={[0, "auto"]} // Set domain with rounded maxY
            tickCount={6}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            allowDecimals={false}
            axisLine={false}  // Remove the Y-axis line
            tickMargin={15}
            tickLine={false}
          />
          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
          <Line
            type="monotone"
            dataKey="y"
            stroke="#0000FF"
            strokeWidth={2}  // Blue line thickness
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="y2"
            stroke="#00FF00" // Green line
            strokeWidth={2}   // Green line thickness
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PortfolioGrowth;
