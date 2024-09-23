import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { IoInformationCircle } from "react-icons/io5";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import numeral from "numeral";

const TradingPerformance = ({ strategy }) => {
  return (
    <div className="rounded-xl shadow-2xl dark:border w-full bg-white dark:bg-black py-6 px-10">
      <h1 className="text-xl text-blue-900 dark:text-white saturate-200 font-medium mb-6">
        Trading Performance
      </h1>
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead>Metric</TableHead>
            <TableHead className="text-right">{strategy.name}</TableHead>
            <TableHead className="text-right">
              Vanguard 500 Index Investor
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="odd:bg-gray-100 dark:odd:bg-gray-800">
            <TableCell className="font-medium">Total Trades</TableCell>
            <TableCell className="text-right">
              {strategy?.metrics?.totalTrades}
            </TableCell>
            <TableCell className="text-right">$10,000</TableCell>
          </TableRow>
          <TableRow className="odd:bg-gray-100 dark:odd:bg-gray-800">
            <TableCell className="font-medium">Winning Trades</TableCell>
            <TableCell className="text-right">
              {strategy?.metrics?.winningTrades}
            </TableCell>
            <TableCell className="text-right">$90,228</TableCell>
          </TableRow>
          <TableRow className="odd:bg-gray-100 dark:odd:bg-gray-800">
            <TableCell className="font-medium">Losing Trades</TableCell>
            <TableCell className="text-right">
              {strategy?.metrics?.losingTrades}
            </TableCell>
            <TableCell className="text-right">10.11%</TableCell>
          </TableRow>
          <TableRow className="odd:bg-gray-100 dark:odd:bg-gray-800">
            <TableCell className="font-medium">Win %</TableCell>
            <TableCell className="text-right">
              {numeral(strategy?.metrics?.winPct).format("0.00")}%
            </TableCell>
            <TableCell className="text-right">15.73%</TableCell>
          </TableRow>
          <TableRow className="odd:bg-gray-100 dark:odd:bg-gray-800">
            <TableCell className="font-medium">Average Trade</TableCell>
            <TableCell className="text-right">
              {numeral(strategy?.metrics?.avgTradeNetProfit).format("$0,0.00")}
            </TableCell>
            <TableCell className="text-right">32.73%</TableCell>
          </TableRow>
          <TableRow className="odd:bg-gray-100 dark:odd:bg-gray-800">
            <TableCell className="font-medium">Median Trade</TableCell>
            <TableCell className="text-right">
              {numeral(strategy?.metrics?.medianTradeNetProfit).format("$0,0.00")}
            </TableCell>
            <TableCell className="text-right">32.73%</TableCell>
          </TableRow>
          <TableRow className="odd:bg-gray-100 dark:odd:bg-gray-800">
            <TableCell className="font-medium">Average Win</TableCell>
            <TableCell className="text-right">
              {numeral(strategy?.metrics?.avgWinAmount).format("$0,0.00")}
            </TableCell>
            <TableCell className="text-right">32.73%</TableCell>
          </TableRow>
          <TableRow className="odd:bg-gray-100 dark:odd:bg-gray-800">
            <TableCell className="font-medium">Median Win</TableCell>
            <TableCell className="text-right">
              {numeral(strategy?.metrics?.medianWinAmount).format("$0,0.00")}
            </TableCell>
            <TableCell className="text-right">-36.73%</TableCell>
          </TableRow>
          <TableRow className="odd:bg-gray-100 dark:odd:bg-gray-800">
            <TableCell className="font-medium">Average Loss</TableCell>
            <TableCell className="text-right">
              {numeral(strategy?.metrics?.avgLossAmount).format("$0,0.00")}
            </TableCell>
            <TableCell className="text-right">0.61</TableCell>
          </TableRow>
          <TableRow className="odd:bg-gray-100 dark:odd:bg-gray-800">
            <TableCell className="font-medium">Median Loss</TableCell>
            <TableCell className="text-right">
              {numeral(strategy?.metrics?.medianLossAmount).format("$0,0.00")}
            </TableCell>
            <TableCell className="text-right">0.91</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default TradingPerformance;
