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

const DailyNetProfitGraph = ({ strategy }) => {
  const calculateDailyNetProfit = (dailyReturns) => {
    // Initialize an array to store net profit for each weekday (Monday to Friday)
    const dailyNetProfit = Array(5).fill(0); // Array for Mon-Fri only

    dailyReturns.forEach((item) => {
      // Split the date string and rearrange to 'YYYY-MM-DD' format
      const [day, month, year] = item.period.split("/");
      const date = new Date(`${year}-${month}-${day}`);
      const dayOfWeek = date.getDay(); // getDay() returns 0 (Sunday) to 6 (Saturday)
      console.log(dayOfWeek);

      // Exclude weekends: Sunday (0) and Saturday (6)
      if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Mon (1) to Fri (5)
        dailyNetProfit[dayOfWeek - 1] += parseFloat(item.netProfit); // Adjust index to fit array (0-4)
      }
    });

    return dailyNetProfit;
  };

  const dailyNetProfitData = calculateDailyNetProfit(strategy.dailyReturns);
  console.log(strategy.dailyReturns);
  console.log(dailyNetProfitData);

  // Prepare data for Recharts, adding weekday names for the X-axis
  const data = dailyNetProfitData.map((profit, index) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri"][index], // Labels for weekdays
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
              {`Net Profit: $${payload[0].value.toFixed(2)}`}
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
        Daily Net Profit
      </h1>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ left: 15 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
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
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="netProfit" fill="#097EF2" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyNetProfitGraph;
