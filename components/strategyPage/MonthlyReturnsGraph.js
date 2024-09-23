import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const MonthlyReturnsGraph = ({ strategy, trades, dataInDollars = false }) => {
  const data = useMemo(() => {
    if (!trades || trades.length === 0) {
      console.log("No trades data available");
      return [];
    }

    const monthlyData = {};
    
    // Find the earliest and latest dates
    const dates = trades.map(trade => new Date(trade.exitDate.toDate()));
    const minDate = new Date(Math.min.apply(null, dates));
    const maxDate = new Date(Math.max.apply(null, dates));
    
    // Create entries for all months between minDate and maxDate
    let currentDate = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    while (currentDate <= maxDate) {
      const period = `${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
      monthlyData[period] = {
        period,
        netProfit: 0,
        maxRunup: 0,
        maxDrawdown: 0,
        runningProfit: 0,
        peakProfit: 0,
        lowestProfit: 0,
      };
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    trades.forEach((trade) => {
      const date = new Date(trade.exitDate.toDate());
      const period = `${date.getMonth() + 1}/${date.getFullYear()}`;

      const tradeProfit = trade.netProfit;
      monthlyData[period].netProfit += tradeProfit;
      monthlyData[period].runningProfit += tradeProfit;

      if (monthlyData[period].runningProfit > monthlyData[period].peakProfit) {
        monthlyData[period].peakProfit = monthlyData[period].runningProfit;
        monthlyData[period].lowestProfit = monthlyData[period].runningProfit;
      }

      if (monthlyData[period].runningProfit < monthlyData[period].lowestProfit) {
        monthlyData[period].lowestProfit = monthlyData[period].runningProfit;
      }

      const currentDrawdown = monthlyData[period].peakProfit - monthlyData[period].runningProfit;
      if (currentDrawdown > monthlyData[period].maxDrawdown) {
        monthlyData[period].maxDrawdown = currentDrawdown;
      }

      const currentRunup = monthlyData[period].runningProfit - monthlyData[period].lowestProfit;
      if (currentRunup > monthlyData[period].maxRunup) {
        monthlyData[period].maxRunup = currentRunup;
      }
    });

    return Object.values(monthlyData).map((monthData) => ({
      ...monthData,
      percentNetProfit: (monthData.netProfit / strategy.metrics.initialCapital) * 100,
      percentMaxRunup: (monthData.maxRunup / strategy.metrics.initialCapital) * 100,
      percentMaxDrawdown: (monthData.maxDrawdown / strategy.metrics.initialCapital) * 100,
    }));
  }, [trades, strategy]);

  const dateFormatter = (dateString) => {
    const [month, year] = dateString.split("/");
    if (!month || !year) {
      return "Invalid Date";
    }
    const parsedDate = new Date(parseInt(year), parseInt(month) - 1);
    if (isNaN(parsedDate.getTime())) {
      return "Invalid Date";
    }
    const options = { year: "numeric", month: "short" };
    return new Intl.DateTimeFormat("en-US", options).format(parsedDate);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const { netProfit, maxRunup, maxDrawdown, percentNetProfit, percentMaxRunup, percentMaxDrawdown } = payload[0].payload;
      return (
        <div className="custom-tooltip bg-white dark:bg-gray-800 p-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg">
          <p className="label text-gray-700 dark:text-white font-medium">{dateFormatter(label)}</p>
          <div className="flex flex-row items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
            <p className="text-blue-500 font-semibold">
              {`Net Profit: ${dataInDollars ? `$${netProfit.toLocaleString()}` : `${percentNetProfit.toFixed(2)}%`}`}
            </p>
          </div>
          <div className="flex flex-row items-center mt-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
            <p className="text-green-500 font-semibold text-xs">
              {`Max Runup: ${dataInDollars ? `$${maxRunup.toLocaleString()}` : `${percentMaxRunup.toFixed(2)}%`}`}
            </p>
          </div>
          <div className="flex flex-row items-center">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2" />
            <p className="text-red-500 font-semibold text-xs">
              {`Max Drawdown: ${dataInDollars ? `$${Math.abs(maxDrawdown).toLocaleString()}` : `${Math.abs(percentMaxDrawdown).toFixed(2)}%`}`}
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
          margin={{ left: 15 }}
          stackOffset="sign"
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="period"
            tickFormatter={dateFormatter}
            fontSize={12}
            tickMargin={5}
            interval={Math.floor(data.length / 12)}
          />
          <YAxis
            tickFormatter={(value) => dataInDollars ? `$${value.toLocaleString()}` : `${value}%`}
            width={80}
            axisLine={false}
            tickMargin={15}
            tickLine={false}
            fontSize={14}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey={dataInDollars ? "netProfit" : "percentNetProfit"}
            stackId="a"
            fill="#097EF2"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyReturnsGraph;