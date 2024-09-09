import { useTheme } from "next-themes";
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Drawdowns = ({ strategy }) => {
  const { theme } = useTheme();

  // Transform strategy data to use date and value format
  const equityCurveDataForDrawDown = strategy.equityCurveData.map(
    ({ x, y }) => ({
      x: new Date(x.seconds * 1000), // Convert seconds to Date object
      y,
    })
  );

  // Function to calculate drawdowns from equity curve data
  const calculateDrawdown = (equityCurveData) => {
    let maxEquity = -Infinity;
    return equityCurveData.map((data) => {
      maxEquity = Math.max(maxEquity, data.y);
      const drawdown = ((data.y - maxEquity) / maxEquity) * 100; // Convert drawdown to percentage
      return { x: data.x, y: drawdown };
    });
  };

  // Function to calculate dollar drawdowns from equity curve data
  const calculateDrawdownDollar = (equityCurveData) => {
    let maxEquity = -Infinity;
    return equityCurveData.map((data) => {
      maxEquity = Math.max(maxEquity, data.y);
      const drawdown = (maxEquity - data.y) * -1; // Calculate dollar drawdown
      return { x: data.x, y: drawdown };
    });
  };

  // Calculate drawdown data
  const drawdownData = calculateDrawdown(equityCurveDataForDrawDown);

  // Calculate drawdown data
  const drawdownDataDollar = calculateDrawdownDollar(
    equityCurveDataForDrawDown
  );

  // Custom Tooltip component for Drawdowns graph
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white dark:bg-gray-800 p-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg">
          <p className="label text-gray-700 dark:text-white font-medium">{`${new Date(
            label
          ).toLocaleDateString()}`}</p>
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

  // Custom Tooltip component for Drawdowns graph
  const CustomTooltipDollar = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white dark:bg-gray-800 p-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg">
          <p className="label text-gray-700 dark:text-white font-medium">{`${new Date(
            label
          ).toLocaleDateString()}`}</p>
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

  // Date formatter for X-axis
  const dateFormatter = (date) => {
    const options = { year: "numeric", month: "short" }; // 'short' format for month (e.g., "Jan")
    return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
  };

  return (
    <div className="rounded-xl shadow-2xl dark:border w-full bg-white dark:bg-black py-6 px-10">
      <h1 className="text-xl text-blue-900 dark:text-white saturate-200 font-medium mb-6">
        Drawdowns
      </h1>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={drawdownData} margin={{ left: 20 }}>
          <defs>
            <linearGradient id="colorDrawdown" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={theme === "dark" ? "#FF0000" : "#FF0000"}
                stopOpacity={0}
              />
              <stop
                offset="95%"
                stopColor={theme === "dark" ? "#FF0000" : "#FF0000"}
                stopOpacity={0.8}
              />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="x"
            type="number"
            scale="time"
            domain={[
              Math.min(...drawdownData.map((d) => d.x.getTime())),
              Math.max(...drawdownData.map((d) => d.x.getTime())),
            ]}
            tickFormatter={dateFormatter}
            fontSize={12}
            tickMargin={5}
            axisLine={true} // Show the axis line
            tick={false} // Hide the ticks
            // hide
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickFormatter={(tick) => `${tick.toFixed(1)}%`}
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          {/* <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: 10 }}
          /> */}
          <Area
            type="monotone"
            dataKey="y"
            name={strategy.name}
            stroke={theme === "dark" ? "#FF0000" : "#FF0000"}
            fillOpacity={1}
            fill="url(#colorDrawdown)"
            strokeWidth={2}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={drawdownDataDollar} margin={{ left: 20 }}>
          <defs>
            <linearGradient id="colorDrawdown" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={theme === "dark" ? "#FF0000" : "#FF0000"}
                stopOpacity={0}
              />
              <stop
                offset="95%"
                stopColor={theme === "dark" ? "#FF0000" : "#FF0000"}
                stopOpacity={0.8}
              />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="x"
            type="number"
            scale="time"
            domain={[
              Math.min(...drawdownDataDollar.map((d) => d.x.getTime())),
              Math.max(...drawdownDataDollar.map((d) => d.x.getTime())),
            ]}
            tickFormatter={dateFormatter}
            fontSize={12}
            tickMargin={5}
            interval={Math.floor(drawdownDataDollar.length / 12)} // Adjust the interval to control the number of ticks
            // hide
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickFormatter={(tick) => `$${tick.toFixed(0)}`}
            fontSize={12}
          />
          <Tooltip content={<CustomTooltipDollar />} />
          {/* <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: 10 }}
          /> */}
          <Area
            type="monotone"
            dataKey="y"
            name={strategy.name}
            stroke={theme === "dark" ? "#FF0000" : "#FF0000"}
            fillOpacity={1}
            fill="url(#colorDrawdown)"
            strokeWidth={2}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Drawdowns;
