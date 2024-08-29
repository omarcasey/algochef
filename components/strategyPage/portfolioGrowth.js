import { useTheme } from "next-themes";
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const PortfolioGrowth = ({ strategy }) => {
  const { theme, setTheme } = useTheme();

  // Transform the strategy data into a format suitable for Recharts
  const data = strategy.equityCurveData.map(({ x, y }) => ({
    x: new Date(x.seconds * 1000), // Convert seconds to a Date object
    y: y,
    y2: y * 0.8,
  }));

  // Debugging: Check the data format
  console.log("Formatted Data for Chart:", data);

  // Date formatter to show Month and Year
  const dateFormatter = (date) => {
    const options = { year: "numeric", month: "short" }; // 'short' format for month (e.g., "Jan")
    return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
  };

  return (
    <div className="rounded-xl drop-shadow-2xl dark:border w-full bg-white dark:bg-black py-6 px-10">
      <h1 className="text-xl text-blue-900 dark:text-white saturate-200 font-medium mb-6">
        Portfolio Growth
      </h1>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data} margin={{ left: 20 }}>
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
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="x"
            type="number"
            scale="time"
            domain={[
              Math.min(...data.map((d) => d.x.getTime())),
              Math.max(...data.map((d) => d.x.getTime())),
            ]}
            tickFormatter={dateFormatter} // Format x-axis labels as "Jan 2015"
            fontSize={12}
            tickMargin={5}
            // interval={Math.floor(data.length / 18)} // Adjust the interval to control the number of ticks
          />
          <YAxis
            domain={[0, "auto"]}
            tickCount={6}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            allowDecimals={false}
            axisLine={false}
            tickMargin={15}
            tickLine={false}
            fontSize={14}
          />
          <Tooltip
            labelFormatter={(value) => new Date(value).toLocaleDateString()} // Format tooltip date
            formatter={(value) => `$${value.toLocaleString()}`}
          />
          <Area
            type="monotone"
            dataKey="y"
            stroke={theme === "dark" ? "#22c55e" : "#8884d8"}
            fillOpacity={1}
            fill="url(#colorUv)"
            strokeWidth={2}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PortfolioGrowth;
