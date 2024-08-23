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

const Summary = () => {
  return (
    <div className="rounded-xl shadow-xl w-full bg-white dark:bg-slate-900 py-6 px-10">
      <h1 className="text-xl text-blue-900 dark:text-white saturate-200 font-medium mb-6">
        Performance Summary
      </h1>
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead>Metric</TableHead>
            <TableHead className="text-right">Dual Momentum Model</TableHead>
            <TableHead className="text-right">
              Vanguard 500 Index Investor
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow key={"yer"}>
            <TableCell className="font-medium">Start Balance</TableCell>
            <TableCell className="text-right">$10,000</TableCell>
            <TableCell className="text-right">$10,000</TableCell>
          </TableRow>
          <TableRow key={"yerrrr"}>
            <TableCell className="font-medium">End Balance</TableCell>
            <TableCell className="text-right">$113,409</TableCell>
            <TableCell className="text-right">$90,228</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell colSpan={2} className="text-right">
              $2,500.00
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default Summary;
