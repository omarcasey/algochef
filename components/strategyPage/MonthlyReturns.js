import React from 'react'
import PeriodicalReturns from "@/components/App/PeriodicalReturns";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import numeral from "numeral";

const MonthlyReturns = ({ strategy }) => {
  // Reverse the monthlyReturns array to show most recent months first
  const reversedReturns = [...strategy.monthlyReturns].reverse();

  return (
    <div className="rounded-xl shadow-xl w-full bg-white dark:bg-slate-900 py-6 px-10">
      <h1 className="text-xl text-blue-900 dark:text-white saturate-200 font-medium mb-6">
        Monthly Returns
      </h1>
      {/* <PeriodicalReturns data={strategy} period="monthly" /> */}
      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead colSpan={2} className="text-right"></TableHead>
            <TableHead
              colSpan={3}
              className="text-left font-bold border-l border-r"
            >
              Dual Momentum Model
            </TableHead>
            <TableHead
              colSpan={3}
              className="text-left font-bold border-l border-r"
            >
              Vanguard 500 Index Investor
            </TableHead>
          </TableRow>
          <TableRow>
            <TableHead className="w-16 font-bold">Year</TableHead>
            <TableHead className=" font-bold">Month</TableHead>
            <TableHead colSpan={2} className="borderborder-r-0 font-bold">
              Return
            </TableHead>
            <TableHead className="border border-l-0 font-bold">
              Balance
            </TableHead>
            <TableHead colSpan={2} className="border border-r-0 font-bold">
              Return
            </TableHead>
            <TableHead className="border border-l-0 font-bold">
              Balance
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reversedReturns.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.year}</TableCell>
              <TableCell>{item.month}</TableCell>
              <TableCell className="w-20">
                <p>
                {((item.endEquity / item.startEquity - 1) * 100).toFixed(2)}%
                </p>
              </TableCell>
              <TableCell>{numeral(item.netProfit).format("$0,0")}</TableCell>
              <TableCell>{numeral(item.endEquity).format("$0,0")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default MonthlyReturns
