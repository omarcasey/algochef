import React from "react";
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

const AnnualReturns = ({ strategy }) => {
  return (
    <div className="rounded-xl shadow-xl w-full bg-white dark:bg-slate-900 py-6 px-10">
      <h1 className="text-xl text-blue-900 dark:text-white saturate-200 font-medium mb-6">
        Annual Returns
      </h1>
      {/* <PeriodicalReturns data={strategy} period="annual" /> */}
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
            <TableHead className=" font-bold">Inflation</TableHead>
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
          {strategy.annualReturns.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.period}</TableCell>
              <TableCell>2.5%</TableCell>
              <TableCell className="w-20">
                {((item.endEquity / item.startEquity - 1) * 100).toFixed(2)}%
              </TableCell>
              <TableCell>{numeral(item.netProfit).format("$0,0")}</TableCell>
              <TableCell>{numeral(item.endEquity).format("$0,0")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AnnualReturns;
