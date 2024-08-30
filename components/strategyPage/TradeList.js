import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const TradeList = ({ strategy }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  // Transform Firestore data
  const transformData = (firestoreData) => {
    return firestoreData.map((entry) => {
      return Object.values(entry).flat();
    });
  };

  const data = transformData(strategy.data);
  const labels = strategy.columnLabels;

  // Slice data for pagination
  const paginatedData = data.slice(
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

  const pageCount = Math.ceil(data.length / rowsPerPage);
  const startEntry = currentPage * rowsPerPage + 1;
  const endEntry = Math.min(startEntry + rowsPerPage - 1, data.length);

  return (
    <div className="rounded-xl shadow-2xl dark:border w-full bg-white dark:bg-black py-6 px-10">
      <h1 className="text-xl text-blue-900 dark:text-white saturate-200 font-medium mb-6">
        Trade Raw Data
      </h1>
      <div className="">
        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow>
              {data.length > 0 &&
                data[0].map((_, idx) => (
                  <TableHead key={idx} className="">
                    {labels[idx] ? labels[idx] : ``}
                  </TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className="odd:bg-gray-100 dark:odd:bg-gray-800"
              >
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex} className="p-3">
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
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
            Showing {startEntry} to {endEntry} of {data.length} entries
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(0)}
              disabled={currentPage === 0}
              className={`bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm cursor-pointer ${
                currentPage === 0 ? "text-gray-400 cursor-not-allowed" : ""
              }`}
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
              className={`bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm cursor-pointer ${
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
              className={`bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm cursor-pointer ${
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
              className={`bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm cursor-pointer ${
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

export default TradeList;
