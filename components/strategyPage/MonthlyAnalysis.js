import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const MonthlyAnalysis = ({ strategy }) => {
  const data = strategy.monthlyAnalysis;

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
              Average # Trades
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
                {row.averageTrades}
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
