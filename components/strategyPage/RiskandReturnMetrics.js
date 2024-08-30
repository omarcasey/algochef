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

const RiskandReturnMetrics = ({strategy}) => {
  return (
    <div className="rounded-xl shadow-2xl dark:border w-full bg-white dark:bg-black py-6 px-10">
      <h1 className="text-xl text-blue-900 dark:text-white saturate-200 font-medium mb-6">
        Risk & Return Metrics
      </h1>
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead>Metric</TableHead>
            <TableHead className="text-right">{strategy.name}</TableHead>
            <TableHead className="text-right">Vanguard 500 Index Investor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="even:bg-gray-100 dark:even:bg-gray-800">
            <TableCell className="font-medium">Arithmetic Mean (monthly)</TableCell>
            <TableCell className="text-right">0.83%</TableCell>
            <TableCell className="text-right">0.79%</TableCell>
          </TableRow>
          <TableRow className="even:bg-gray-100 dark:even:bg-gray-800">
            <TableCell className="font-medium">Arithmetic Mean (annualized)</TableCell>
            <TableCell className="text-right">10.43%</TableCell>
            <TableCell className="text-right">9.95%</TableCell>
          </TableRow>
          <TableRow className="even:bg-gray-100 dark:even:bg-gray-800">
            <TableCell className="font-medium">Geometric Mean (monthly)</TableCell>
            <TableCell className="text-right">0.76%</TableCell>
            <TableCell className="text-right">0.69%</TableCell>
          </TableRow>
          <TableRow className="even:bg-gray-100 dark:even:bg-gray-800">
            <TableCell className="font-medium">Geometric Mean (annualized)</TableCell>
            <TableCell className="text-right">9.57%</TableCell>
            <TableCell className="text-right">8.63%</TableCell>
          </TableRow>
          <TableRow className="even:bg-gray-100 dark:even:bg-gray-800">
            <TableCell className="font-medium">Standard Deviation (monthly)</TableCell>
            <TableCell className="text-right">3.62%</TableCell>
            <TableCell className="text-right">4.49%</TableCell>
          </TableRow>
          <TableRow className="even:bg-gray-100 dark:even:bg-gray-800">
            <TableCell className="font-medium">Standard Deviation (annualized)</TableCell>
            <TableCell className="text-right">12.54%</TableCell>
            <TableCell className="text-right">15.57%</TableCell>
          </TableRow>
          <TableRow className="even:bg-gray-100 dark:even:bg-gray-800">
            <TableCell className="font-medium">Downside Deviation (monthly)</TableCell>
            <TableCell className="text-right">2.34%</TableCell>
            <TableCell className="text-right">3.03%</TableCell>
          </TableRow>
          <TableRow className="even:bg-gray-100 dark:even:bg-gray-800">
            <TableCell className="font-medium">Maximum Drawdown</TableCell>
            <TableCell className="text-right">-21.07%</TableCell>
            <TableCell className="text-right">-50.97%</TableCell>
          </TableRow>
          <TableRow className="even:bg-gray-100 dark:even:bg-gray-800">
            <TableCell className="font-medium">Benchmark Correlation</TableCell>
            <TableCell className="text-right">0.73</TableCell>
            <TableCell className="text-right">1.00</TableCell>
          </TableRow>
          <TableRow className="even:bg-gray-100 dark:even:bg-gray-800">
            <TableCell className="font-medium">Beta(*)</TableCell>
            <TableCell className="text-right">0.58</TableCell>
            <TableCell className="text-right">1.00</TableCell>
          </TableRow>
          <TableRow className="even:bg-gray-100 dark:even:bg-gray-800">
            <TableCell className="font-medium">Alpha (annualized)</TableCell>
            <TableCell className="text-right">4.39%</TableCell>
            <TableCell className="text-right">0.00%</TableCell>
          </TableRow>
          <TableRow className="even:bg-gray-100 dark:even:bg-gray-800">
            <TableCell className="font-medium">R2</TableCell>
            <TableCell className="text-right">52.64%</TableCell>
            <TableCell className="text-right">100.00%</TableCell>
          </TableRow>
          <TableRow className="even:bg-gray-100 dark:even:bg-gray-800">
            <TableCell className="font-medium">Sharpe Ratio</TableCell>
            <TableCell className="text-right">0.63</TableCell>
            <TableCell className="text-right">0.48</TableCell>
          </TableRow>
          <TableRow className="even:bg-gray-100 dark:even:bg-gray-800">
            <TableCell className="font-medium">Sortino Ratio</TableCell>
            <TableCell className="text-right">0.95</TableCell>
            <TableCell className="text-right">0.70</TableCell>
          </TableRow>
          <TableRow className="even:bg-gray-100 dark:even:bg-gray-800">
            <TableCell className="font-medium">Treynor Ratio (%)</TableCell>
            <TableCell className="text-right">13.63</TableCell>
            <TableCell className="text-right">7.54</TableCell>
          </TableRow>
          <TableRow className="even:bg-gray-100 dark:even:bg-gray-800">
            <TableCell className="font-medium">Calmar Ratio</TableCell>
            <TableCell className="text-right">0.21</TableCell>
            <TableCell className="text-right">0.39</TableCell>
          </TableRow>
          <TableRow className="even:bg-gray-100 dark:even:bg-gray-800">
            <TableCell className="font-medium">Modigliani–Modigliani Measure</TableCell>
            <TableCell className="text-right">11.89%</TableCell>
            <TableCell className="text-right">9.53%</TableCell>
          </TableRow>
          <TableRow className="even:bg-gray-100 dark:even:bg-gray-800">
            <TableCell className="font-medium">Active Return</TableCell>
            <TableCell className="text-right">0.94%</TableCell>
            <TableCell className="text-right">N/A</TableCell>
          </TableRow>
          <TableRow className="even:bg-gray-100 dark:even:bg-gray-800">
            <TableCell className="font-medium">Tracking Error</TableCell>
            <TableCell className="text-right">10.79%</TableCell>
            <TableCell className="text-right">N/A</TableCell>
          </TableRow>
          <TableRow className="even:bg-gray-100 dark:even:bg-gray-800">
            <TableCell className="font-medium">Information Ratio</TableCell>
            <TableCell className="text-right">0.09</TableCell>
            <TableCell className="text-right">N/A</TableCell>
          </TableRow>
          <TableRow className="even:bg-gray-100 dark:even:bg-gray-800">
            <TableCell className="font-medium">Skewness</TableCell>
            <TableCell className="text-right">-0.57</TableCell>
            <TableCell className="text-right">-0.57</TableCell>
          </TableRow>
          <TableRow className="even:bg-gray-100 dark:even:bg-gray-800">
            <TableCell className="font-medium">Excess Kurtosis</TableCell>
            <TableCell className="text-right">1.60</TableCell>
            <TableCell className="text-right">0.87</TableCell>
          </TableRow>
          <TableRow className="even:bg-gray-100 dark:even:bg-gray-800">
            <TableCell className="font-medium">Historical Value-at-Risk (5%)</TableCell>
            <TableCell className="text-right">5.30%</TableCell>
            <TableCell className="text-right">7.90%</TableCell>
          </TableRow>
          <TableRow className="even:bg-gray-100 dark:even:bg-gray-800">
            <TableCell className="font-medium">Analytical Value-at-Risk (5%)</TableCell>
            <TableCell className="text-right">5.13%</TableCell>
            <TableCell className="text-right">6.60%</TableCell>
          </TableRow>
          <TableRow className="even:bg-gray-100 dark:even:bg-gray-800">
            <TableCell className="font-medium">Conditional Value-at-Risk (5%)</TableCell>
            <TableCell className="text-right">8.09%</TableCell>
            <TableCell className="text-right">9.98%</TableCell>
          </TableRow>
          <TableRow className="even:bg-gray-100 dark:even:bg-gray-800">
            <TableCell className="font-medium">Upside Capture Ratio (%)</TableCell>
            <TableCell className="text-right">74.76</TableCell>
            <TableCell className="text-right">100.00</TableCell>
          </TableRow>
          <TableRow className="even:bg-gray-100 dark:even:bg-gray-800">
            <TableCell className="font-medium">Downside Capture Ratio (%)</TableCell>
            <TableCell className="text-right">63.15</TableCell>
            <TableCell className="text-right">100.00</TableCell>
          </TableRow>
          <TableRow className="even:bg-gray-100 dark:even:bg-gray-800">
            <TableCell className="font-medium">Safe Withdrawal Rate</TableCell>
            <TableCell className="text-right">9.67%</TableCell>
            <TableCell className="text-right">5.83%</TableCell>
          </TableRow>
          <TableRow className="even:bg-gray-100 dark:even:bg-gray-800">
            <TableCell className="font-medium">Perpetual Withdrawal Rate</TableCell>
            <TableCell className="text-right">6.55%</TableCell>
            <TableCell className="text-right">5.72%</TableCell>
          </TableRow>
          <TableRow className="even:bg-gray-100 dark:even:bg-gray-800">
            <TableCell className="font-medium">Positive Periods</TableCell>
            <TableCell className="text-right">211 out of 319 (66.14%)</TableCell>
            <TableCell className="text-right">206 out of 319 (64.58%)</TableCell>
          </TableRow>
          <TableRow className="even:bg-gray-100 dark:even:bg-gray-800">
            <TableCell className="font-medium">Gain/Loss Ratio</TableCell>
            <TableCell className="text-right">0.93</TableCell>
            <TableCell className="text-right">0.85</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default RiskandReturnMetrics;
