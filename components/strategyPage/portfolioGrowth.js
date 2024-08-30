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
  Legend,
} from "recharts";
import Drawdowns from "./Drawdowns";

const PortfolioGrowth = ({ strategy }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white dark:bg-gray-800 p-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg">
          <p className="label text-gray-700 dark:text-white font-medium">{`${new Date(
            label
          ).toLocaleDateString()}`}</p>
          <div className="flex flex-row items-center">
            <div className="w-2 h-2 bg-blue-600 dark:bg-green-400 rounded-full mr-2" />
            <p className="intro text-blue-600 dark:text-green-400 font-semibold">
              {`${strategy.name}: $${payload[0].value.toLocaleString()}`}
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  const { theme, setTheme } = useTheme();

  // Transform the strategy data into a format suitable for Recharts
  // const data = strategy.equityCurveData.map(({ x, y }) => ({
  //   x: new Date(x.seconds * 1000), // Convert seconds to a Date object
  //   y: y,
  //   y2: y * 0.8,
  // }));

  // Transform the strategy's monthlyReturns data for Recharts, setting the date to the last day of the month
  const data = strategy.monthlyReturns.map(({ period, endEquity }) => {
    // Convert the period (e.g., "6/2017") to the last day of that month
    const [month, year] = period.split("/").map(Number);
    const date = new Date(year, month, 0); // Creates a Date object set to the last day of the month (0 gets the last day of the previous month)
    return {
      x: date,
      y: parseFloat(endEquity), // Convert endEquity to a number
    };
  });

  // Add the initial data point for the start equity of the first month
  if (strategy.monthlyReturns.length > 0) {
    const firstReturn = strategy.monthlyReturns[0];
    const [firstMonth, firstYear] = firstReturn.period.split("/").map(Number);
    const startEquity = parseFloat(firstReturn.startEquity);

    // Calculate the date for the previous month
    const startMonthDate = new Date(firstYear, firstMonth - 1, 0); // Set to the last day of the previous month
    data.unshift({
      x: startMonthDate,
      y: startEquity,
    });
  }

  // Debugging: Check the data format
  console.log("Formatted Data for Chart:", data);

  // Date formatter to show Month and Year
  const dateFormatter = (date) => {
    const options = { year: "numeric", month: "short" }; // 'short' format for month (e.g., "Jan")
    return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
  };

  return (
    <div className="rounded-xl shadow-2xl dark:border w-full bg-white dark:bg-black py-6 px-10">
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
            hide
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
            content={<CustomTooltip />} // Use the custom tooltip
          />
          {/* <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: 10 }}
          /> */}
          <Area
            type="linear"
            dataKey="y"
            name={strategy.name}
            stroke={theme === "dark" ? "#22c55e" : "#8884d8"}
            fillOpacity={1}
            fill="url(#colorUv)"
            strokeWidth={2}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
      <Drawdowns strategy={strategy} />
    </div>
  );
};

export default PortfolioGrowth;
