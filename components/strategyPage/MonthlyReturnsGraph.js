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
  const data = strategy.monthlyReturns.map(
    ({ period, netProfit, maxRunup, maxDrawdown }) => ({
      period,
      netProfit: parseFloat(netProfit), // Convert string to float
      maxRunup: parseFloat(maxRunup), // Positive part of run-up
      maxDrawdown: -parseFloat(maxDrawdown), // Negative part of drawdown
    })
  );

  // Date formatter to show Month and Year
  const dateFormatter = (date) => {
    // Split the period into month and year
    const [month, year] = date.split("/");
    // Create a Date object with parsed month and year (month is 0-indexed)
    const parsedDate = new Date(year, month - 1);
    // Format the Date object to 'Mon YYYY'
    const options = { year: "numeric", month: "short" };
    return new Intl.DateTimeFormat("en-US", options).format(parsedDate);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white dark:bg-gray-800 p-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg">
          <p className="label text-gray-700 dark:text-white font-medium">
            {dateFormatter(label)}
          </p>
          <div className="flex flex-row items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
            <p className="text-blue-500 font-semibold">
              {`Net Profit: $${payload[0].value}`}
            </p>
          </div>

          <div className="flex flex-row items-center mt-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
            <p className="text-green-500 font-semibold text-xs">
              {`Max Runup: $${payload[1].value}`}
            </p>
          </div>

          <div className="flex flex-row items-center">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2" />
            <p className="text-red-500 font-semibold text-xs">
              {`Max Drawdown: $${payload[2].value}`}
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
        Monthly Returns
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
            tickFormatter={dateFormatter} // Format x-axis labels as "Jan 2015"
            fontSize={12}
            tickMargin={5}
            interval={Math.floor(data.length / 12)} // Adjust the interval to control the number of ticks
          />
          <YAxis
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            width={80} // Set width to ensure the labels fit
            axisLine={false} // Remove the Y-axis line
            tickMargin={15}
            tickLine={false}
            fontSize={14}
          />
          <Tooltip
            content={<CustomTooltip />} // Use the custom tooltip
          />
          {/* <Legend verticalAlign="top" height={36} /> */}
          <Bar
            dataKey="netProfit"
            stackId="a"
            fill="#097EF2"
            name="Net Profit"
          />
          <Bar
            dataKey="maxRunup"
            stackId="a"
            fill="#50E2B0"
            name="Max Run-up"
            fillOpacity={0.25}
          />
          <Bar
            dataKey="maxDrawdown"
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

export default MonthlyReturnsGraph;
