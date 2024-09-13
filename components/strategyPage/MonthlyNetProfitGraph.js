import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MonthlyNetProfitGraph = ({ strategy }) => {
  const calculateMonthlyNetProfit = (monthlyReturns) => {
    // An array with 12 entries for the 12 months
    const monthlyNetProfit = Array(12).fill(0);

    monthlyReturns.forEach((item) => {
      const month = parseInt(item.period.split("/")[0]) - 1; // Get month and convert it to 0-based index
      monthlyNetProfit[month] += parseFloat(item.netProfit); // Add net profit to respective month
    });

    return monthlyNetProfit;
  };

  const monthlyTotalNetProfitData = calculateMonthlyNetProfit(
    strategy.monthlyReturns
  );

  // Prepare data for Recharts, adding month names for the X-axis
  const data = monthlyTotalNetProfitData.map((profit, index) => ({
    month: new Date(0, index).toLocaleString("default", { month: "short" }), // "Jan", "Feb", etc.
    netProfit: profit,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white dark:bg-gray-800 p-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg">
          <p className="label text-gray-700 dark:text-white font-medium">
            {label}
          </p>
          <div className="flex flex-row items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
            <p className="text-blue-500 font-semibold">
              {`Net Profit: $${payload[0].value}`}
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
          <Bar dataKey="netProfit" fill="#097EF2" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyNetProfitGraph;
