import React, { useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const BiggestDrawdowns = ({ strategy, trades }) => {
  const formatDate = (date) => {
    return date.toDate().toLocaleString('default', { month: 'short', year: 'numeric' });
  };

  const calculatePeriod = (startDate, endDate) => {
    const milliseconds = endDate.getTime() - startDate.getTime();
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30.44); // Average number of days in a month
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (days === 0) {
      return "1 day"; // Minimum period
    } else if (days < 30) {
      return `${days} day${days !== 1 ? 's' : ''}`;
    } else if (years === 0) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
  };

  const drawdowns = useMemo(() => {
    if (!trades || trades.length === 0) {
      console.log("No trades data available");
      return [];
    }

    let equity = strategy.metrics.initialCapital;
    let maxEquity = equity;
    let drawdowns = [];
    let currentDrawdown = null;

    trades.forEach((trade) => {
      equity += trade.netProfit;
      
      if (equity < maxEquity) {
        if (!currentDrawdown) {
          currentDrawdown = {
            startDate: trade.exitDate,
            startEquity: maxEquity,
            lowEquity: equity,
            lowDate: trade.exitDate,
            recoveryDate: null,
          };
        } else if (equity < currentDrawdown.lowEquity) {
          currentDrawdown.lowEquity = equity;
          currentDrawdown.lowDate = trade.exitDate;
        }
      } else if (currentDrawdown && equity >= currentDrawdown.startEquity) {
        currentDrawdown.recoveryDate = trade.exitDate;
        drawdowns.push(currentDrawdown);
        currentDrawdown = null;
      }

      if (equity > maxEquity) {
        maxEquity = equity;
      }
    });

    // If there's an unfinished drawdown at the end
    if (currentDrawdown) {
      drawdowns.push(currentDrawdown);
    }

    return drawdowns
      .map(dd => ({
        ...dd,
        drawdownPercent: ((dd.lowEquity - dd.startEquity) / dd.startEquity) * 100,
        length: calculatePeriod(dd.startDate.toDate(), dd.lowDate.toDate()),
        recoveryLength: dd.recoveryDate ? 
          calculatePeriod(dd.lowDate.toDate(), dd.recoveryDate.toDate()) : 
          null,
      }))
      .sort((a, b) => a.drawdownPercent - b.drawdownPercent)
      .slice(0, 10);
  }, [trades, strategy.metrics.initialCapital]);

  return (
    <div className="rounded-xl shadow-2xl dark:border w-full bg-white dark:bg-black py-6 px-10">
      <h1 className="text-xl text-blue-900 dark:text-white saturate-200 font-medium mb-6">
        10 Biggest Drawdowns
      </h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Length</TableHead>
            <TableHead>Recovered By</TableHead>
            <TableHead>Recovery Length</TableHead>
            <TableHead>Underwater Period</TableHead>
            <TableHead>Drawdown %</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drawdowns.map((dd, index) => (
            <TableRow key={index} className="odd:bg-gray-100 dark:odd:bg-gray-800">
              <TableCell>{formatDate(dd.startDate)}</TableCell>
              <TableCell>{formatDate(dd.lowDate)}</TableCell>
              <TableCell>{dd.length}</TableCell>
              <TableCell>{dd.recoveryDate ? formatDate(dd.recoveryDate) : 'Not Recovered'}</TableCell>
              <TableCell>{dd.recoveryLength || 'N/A'}</TableCell>
              <TableCell>
                {dd.recoveryDate ? 
                  calculatePeriod(dd.startDate.toDate(), dd.recoveryDate.toDate()) : 
                  'Ongoing'}
              </TableCell>
              <TableCell>{dd.drawdownPercent.toFixed(2)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default BiggestDrawdowns;