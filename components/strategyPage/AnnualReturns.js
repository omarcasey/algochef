import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import numeral from "numeral";

// Helper function to calculate annual returns
const calculateAnnualReturns = (trades, initialCapital) => {
  const annualReturns = {};

  trades.forEach((trade) => {
    const year = trade.exitYear;
    const profit = trade.netProfit;

    if (!annualReturns[year]) {
      annualReturns[year] = {
        netProfit: 0,
        startEquity: 0,
        endEquity: 0,
      };
    }

    // Add profit for the year
    annualReturns[year].netProfit += profit;
  });

  // Sort years and calculate cumulative equity
  const sortedYears = Object.keys(annualReturns).sort();
  let cumulativeEquity = initialCapital;

  sortedYears.forEach((year) => {
    annualReturns[year].startEquity = cumulativeEquity;
    annualReturns[year].endEquity = cumulativeEquity + annualReturns[year].netProfit;
    cumulativeEquity = annualReturns[year].endEquity;
  });

  // Convert the object to an array for easier display
  return sortedYears.map((year) => ({
    year: year,
    ...annualReturns[year],
  }));
};

const AnnualReturns = ({ strategy, trades }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  // Calculate the annual returns based on trades and initial capital
  const annualReturns = useMemo(() => 
    calculateAnnualReturns(trades, strategy.metrics.initialCapital), 
    [trades, strategy.metrics.initialCapital]
  );

  // Reverse the data to start from the most recent year
  const reversedData = [...annualReturns].reverse();

  // Slice data for pagination
  const paginatedData = reversedData.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  // Handle page change
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0); // Reset to first page
  };

  const pageCount = Math.ceil(reversedData.length / rowsPerPage);
  const startEntry = currentPage * rowsPerPage + 1;
  const endEntry = Math.min(startEntry + rowsPerPage - 1, reversedData.length);

  return (
    <div className="rounded-xl shadow-2xl dark:border w-full bg-white dark:bg-black py-6 px-10">
      <h1 className="text-xl text-blue-900 dark:text-white saturate-200 font-medium mb-6">
        Annual Returns
      </h1>
      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 font-bold">Year</TableHead>
            <TableHead className="font-bold">Net Profit</TableHead>
            <TableHead className="font-bold">Start Equity</TableHead>
            <TableHead className="font-bold">End Equity</TableHead>
            <TableHead className="font-bold">Annual Return (%)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((item, index) => (
            <TableRow key={index} className="odd:bg-gray-100 dark:odd:bg-gray-800">
              <TableCell>{item.year}</TableCell>
              <TableCell>{numeral(item.netProfit).format("$0,0.00")}</TableCell>
              <TableCell>{numeral(item.startEquity).format("$0,0.00")}</TableCell>
              <TableCell>{numeral(item.endEquity).format("$0,0.00")}</TableCell>
              <TableCell>
                {((item.endEquity / item.startEquity - 1) * 100).toFixed(2)}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-col mt-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center text-sm">
            <span className="mr-2">Show</span>
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="border border-gray-300 dark:border-gray-600 rounded-md p-1"
            >
              <option value={12}>12</option>
              <option value={36}>36</option>
              <option value={60}>60</option>
              <option value={100}>100</option>
            </select>
            <span className="ml-2">entries</span>
          </div>
          <div className="text-sm">
            Showing {startEntry} to {endEntry} of {reversedData.length} entries
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(0)}
              disabled={currentPage === 0}
              className={`bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm ${
                currentPage === 0 ? "text-gray-400 cursor-not-allowed" : ""
              }`}
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
              className={`bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm ${
                currentPage === 0 ? "text-gray-400 cursor-not-allowed" : ""
              }`}
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, pageCount - 1))
              }
              disabled={currentPage >= pageCount - 1}
              className={`bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm ${
                currentPage >= pageCount - 1
                  ? "text-gray-400 cursor-not-allowed"
                  : ""
              }`}
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(pageCount - 1)}
              disabled={currentPage >= pageCount - 1}
              className={`bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm ${
                currentPage >= pageCount - 1
                  ? "text-gray-400 cursor-not-allowed"
                  : ""
              }`}
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnualReturns;