import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import numeral from "numeral";

// Helper function to calculate profit factor
const calculateProfitFactor = (grossProfit, grossLoss) => {
  return grossLoss !== 0 ? (grossProfit / Math.abs(grossLoss)).toFixed(2) : "N/A";
};

// Helper function to calculate the percentage of profitable trades
const calculatePercentProfitable = (profitableTrades, totalTrades) => {
  return totalTrades > 0 ? ((profitableTrades / totalTrades) * 100).toFixed(2) + "%" : "0%";
};

const MonthlyAnalysis = ({ trades }) => {
  const data = useMemo(() => {
    const monthlyStats = {};

    trades.forEach((trade) => {
      const tradeDate = new Date(trade.exitDate.toDate());
      const month = tradeDate.getMonth(); // 0 = January, 11 = December

      if (!monthlyStats[month]) {
        monthlyStats[month] = {
          totalTrades: 0,
          profitableTrades: 0,
          grossProfit: 0,
          grossLoss: 0,
          netProfit: 0,
        };
      }

      const monthStats = monthlyStats[month];
      monthStats.totalTrades += 1;
      monthStats.netProfit += trade.netProfit;

      if (trade.netProfit > 0) {
        monthStats.grossProfit += trade.netProfit;
        monthStats.profitableTrades += 1;
      } else {
        monthStats.grossLoss += trade.netProfit;
      }
    });

    // Now calculate the required fields for each month
    return Object.keys(monthlyStats).map((monthIndex) => {
      const stats = monthlyStats[monthIndex];
      const averageProfit = (stats.netProfit / stats.totalTrades).toFixed(2);
      const profitFactor = calculateProfitFactor(stats.grossProfit, stats.grossLoss);
      const percentProfitable = calculatePercentProfitable(stats.profitableTrades, stats.totalTrades);

      return {
        period: new Date(2020, monthIndex).toLocaleString("default", { month: "short" }), // Month names like "Jan", "Feb"
        averageProfit: `$${averageProfit}`,
        grossProfit: `${numeral(stats.grossProfit).format("$0,0")}`,
        grossLoss: `(${numeral(Math.abs(stats.grossLoss)).format("$0,0")})`, // Absolute value for loss
        netProfit: `${numeral(stats.netProfit).format("$0,0")}`,
        profitFactor,
        totalTrades: stats.totalTrades,
        percentProfitable,
      };
    });
  }, [trades]);

  return (
    <div className="rounded-xl shadow-2xl dark:border w-full bg-white dark:bg-black py-6 px-10">
      <h1 className="text-xl text-blue-900 dark:text-white saturate-200 font-medium mb-6">
        Monthly Analysis
      </h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Period
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Average Profit
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Gross Profit
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Gross Loss
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Net Profit
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Profit Factor
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Total Trades
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              % Profitable
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={index}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {row.period}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {row.averageProfit}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">
                {row.grossProfit}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400">
                {row.grossLoss}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {row.netProfit}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {row.profitFactor}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {row.totalTrades}
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {row.percentProfitable}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MonthlyAnalysis;
