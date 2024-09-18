"use client";

import React, { useState } from "react";
import { useUser } from "reactfire";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import {
  query,
  collection,
  where,
  Timestamp,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingSpinner } from "../ui/spinner";
import { ChevronDown, Loader2, MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import numeral from "numeral";

const UserStrategies = () => {
  const { data: user, status } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [filter, setFilter] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [strategyToDelete, setStrategyToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(""); // New state for edited name

  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  const [checkedItems, setCheckedItems] = useState({
    netProfit: false,
    maxDrawdown: false,
    returnDrawdownRatio: false,
    noOfTrades: false,
    longShort: false,
  });

  const handleItemClick = (key) => {
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleItemSelect = (e) => {
    e.preventDefault();
  };

  // Add new state variables for sorting
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Create a query to filter strategies by userId
  const strategiesQuery = query(
    collection(firestore, "strategies"),
    where("userId", "==", user ? user.uid : "")
  );

  // Fetch strategies using Reactfire
  const { data: strategies, status: strategiesStatus } =
    useFirestoreCollectionData(strategiesQuery, { idField: "id" });

  const handleRowCheckboxChange = (id) => {
    setSelectedRows((prevSelectedRows) => {
      const newSelectedRows = new Set(prevSelectedRows);
      if (newSelectedRows.has(id)) {
        newSelectedRows.delete(id);
      } else {
        newSelectedRows.add(id);
      }
      return newSelectedRows;
    });
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(strategies.map((strategy) => strategy.id)));
    }
    setSelectAll(!selectAll);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toLocaleDateString();
  };

  const handleDeleteStrategy = async () => {
    setIsDeleting(true);
    if (strategyToDelete) {
      const strategyDoc = doc(firestore, "strategies", strategyToDelete);
      await deleteDoc(strategyDoc);
      setIsDeleteDialogOpen(false);
      setStrategyToDelete(null);
    }
    setIsDeleting(false);
  };

  const handleEditStrategy = async () => {
    setIsEditing(true);
    if (strategyToDelete && editedName) {
      const strategyDoc = doc(firestore, "strategies", strategyToDelete);
      await updateDoc(strategyDoc, { name: editedName });
      setIsEditDialogOpen(false);
      setStrategyToDelete(null);
      setEditedName(""); // Clear the edited name state
    }
    setIsEditing(false);
  };

  if (status === "loading" || strategiesStatus === "loading") {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <LoadingSpinner size={45} />
      </div>
    );
  }

  if (!user) {
    return <div>Please sign in to view strategies.</div>;
  }

  if (strategiesStatus === "error") {
    return <div>Error fetching strategies.</div>;
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0); // Reset to first page
  };

  const filteredStrategies = strategies.filter((strategy) =>
    strategy.name.toLowerCase().includes(filter.toLowerCase())
  );

  const sortedStrategies = [...filteredStrategies].sort((a, b) => {
    if (sortConfig.key) {
      const aValue =
        sortConfig.key === "createdAt"
          ? a[sortConfig.key].seconds
          : a[sortConfig.key].toLowerCase();
      const bValue =
        sortConfig.key === "createdAt"
          ? b[sortConfig.key].seconds
          : b[sortConfig.key].toLowerCase();
      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
    }
    return 0;
  });

  // Handle sorting on column header click
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Use sortedStrategies instead of paginatedStrategies in the map function
  const paginatedStrategies = sortedStrategies.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  const pageCount = Math.ceil(filteredStrategies.length / rowsPerPage);
  const startEntry = currentPage * rowsPerPage + 1;
  const endEntry = Math.min(
    startEntry + rowsPerPage - 1,
    filteredStrategies.length
  );

  const handleItemColumnClick = (e) => {
    e.stopPropagation(); // Prevents the dropdown from closing
    // Add any additional logic here
  };

  return (
    <div className="max-w-7xl w-full flex flex-col justify-center">
      <div className="flex items-center py-4 gap-3">
        <Input
          placeholder="Filter names..."
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="max-w-sm"
        />
        <Link href="/app/strategies/import" className="ml-auto">
          <Button variant="outline" className="">
            Add
            <Plus className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <Button
          disabled={selectedRows.size === 0}
          onClick={() => setIsGenerateDialogOpen(true)}
        >
          Generate Report
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={handleSelectAllChange}
                />
              </TableHead>
              <TableHead
                onClick={() => handleSort("name")}
                className="cursor-pointer"
              >
                Name{" "}
                {sortConfig.key === "name"
                  ? sortConfig.direction === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </TableHead>
              <TableHead>Details</TableHead>
              <TableHead
                onClick={() => handleSort("createdAt")}
                className="cursor-pointer"
              >
                Date Created{" "}
                {sortConfig.key === "createdAt"
                  ? sortConfig.direction === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </TableHead>
              <TableHead>Type</TableHead>
              {checkedItems.netProfit && <TableHead>Net Profit</TableHead>}
              {checkedItems.maxDrawdown && <TableHead>Max Drawdown</TableHead>}
              {checkedItems.returnDrawdownRatio && <TableHead>Return / Drawdown Ratio</TableHead>}
              {checkedItems.noOfTrades && <TableHead>No. of Trades</TableHead>}
              {checkedItems.longShort && <TableHead>Long / Short</TableHead>}
              <TableHead className="pr-0">
                <div className="flex flex-row items-center justify-between h-full">
                  <p>Actions</p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="hover:bg-gray-200 transition-all cursor-pointer w-12 h-full flex items-center justify-center">
                        <Plus className="w-4 h-4" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Columns</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onSelect={handleItemSelect}
                        onClick={() => handleItemClick("netProfit")}
                        className="flex items-center"
                      >
                        <Checkbox
                          checked={checkedItems.netProfit}
                          className="w-3.5 h-3.5 mr-2"
                        />
                        Net Profit $
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={handleItemSelect}
                        onClick={() => handleItemClick("maxDrawdown")}
                        className="flex items-center"
                      >
                        <Checkbox
                          checked={checkedItems.maxDrawdown}
                          className="w-3.5 h-3.5 mr-2"
                        />
                        Maximum Drawdown $
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={handleItemSelect}
                        onClick={() => handleItemClick("returnDrawdownRatio")}
                        className="flex items-center"
                      >
                        <Checkbox
                          checked={checkedItems.returnDrawdownRatio}
                          className="w-3.5 h-3.5 mr-2"
                        />
                        Return / Drawdown Ratio
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={handleItemSelect}
                        onClick={() => handleItemClick("noOfTrades")}
                        className="flex items-center"
                      >
                        <Checkbox
                          checked={checkedItems.noOfTrades}
                          className="w-3.5 h-3.5 mr-2"
                        />
                        No. of Trades
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={handleItemSelect}
                        onClick={() => handleItemClick("longShort")}
                        className="flex items-center"
                      >
                        <Checkbox
                          checked={checkedItems.longShort}
                          className="w-3.5 h-3.5 mr-2"
                        />
                        Long / Short
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStrategies.length ? (
              paginatedStrategies.map((strategy) => (
                <TableRow
                  key={strategy.id}
                  data-state={selectedRows.has(strategy.id) ? "selected" : ""}
                  onClick={() => handleRowCheckboxChange(strategy.id)}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.has(strategy.id)}
                      onCheckedChange={() =>
                        handleRowCheckboxChange(strategy.id)
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                  <TableCell>{strategy.name}</TableCell>
                  <TableCell>
                    <Link
                      href={`/app/strategies/${strategy.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex w-min"
                    >
                      <div className="bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 font-medium cursor-pointer px-2 py-1.5 rounded-md text-xs w-24 flex items-center justify-center">
                        View Report
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>{formatDate(strategy.createdAt)}</TableCell>
                  <TableCell>
                    <div className="bg-purple-200 dark:bg-purple-950 text-purple-800 dark:text-purple-400 font-medium px-2 py-1.5 rounded-md text-xs w-16 flex items-center justify-center">
                      Future
                    </div>
                  </TableCell>
                  {checkedItems.netProfit && (
                    <TableCell>
                      {numeral(strategy.metrics["Total Net Profit"]).format("$0,0")}
                    </TableCell>
                  )}
                  {checkedItems.maxDrawdown && (
                    <TableCell>
                      {numeral(strategy.metrics["Max Drawdown $"]).format("$0,0")}
                    </TableCell>
                  )}
                  {checkedItems.returnDrawdownRatio && (
                    <TableCell>
                      {/* {numeral(strategy.metrics["Total Net Profit"]).format("$0,0")} */}
                    </TableCell>
                  )}
                  {checkedItems.noOfTrades && (
                    <TableCell>
                      {strategy.metrics["Total Trades"]}
                    </TableCell>
                  )}
                  {checkedItems.longShort && (
                    <TableCell>
                      {strategy.positionTypes}
                    </TableCell>
                  )}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={(e) => {
                            navigator.clipboard.writeText(strategy.id);
                            e.stopPropagation();
                          }}
                        >
                          Copy strategy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => {
                            setIsDeleteDialogOpen(true);
                            setStrategyToDelete(strategy.id);
                            e.stopPropagation();
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            setIsEditDialogOpen(true);
                            setStrategyToDelete(strategy.id);
                            setEditedName(strategy.name);
                            e.stopPropagation();
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="6" className="text-center">
                  No strategies found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
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
            Showing {startEntry} to {endEntry} of {filteredStrategies.length}{" "}
            entries
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

      {/* Edit Strategy Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Strategy</DialogTitle>
            <DialogDescription>
              Update the name of the strategy.
            </DialogDescription>
          </DialogHeader>
          <div className="mb-4">
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              placeholder="Strategy Name"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleEditStrategy}
              disabled={isEditing}
            >
              {isEditing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this strategy? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteStrategy}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isGenerateDialogOpen}
        onOpenChange={setIsGenerateDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Generate Report</DialogTitle>
            <DialogDescription>
              Are you sure you want to generate a report with the following
              strategies?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="">Strategy</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="">Weight</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from(selectedRows).map((strategyId) => {
                  const strategy = strategies.find((s) => s.id === strategyId);
                  if (!strategy) return null;

                  return (
                    <TableRow key={strategy.id}>
                      <TableCell>{strategy.name}</TableCell>
                      <TableCell>
                        <p className="text-orange-400">@ES.D</p>
                      </TableCell>
                      <TableCell>
                        <div className="bg-purple-200 dark:bg-purple-950 text-purple-800 dark:text-purple-400 font-medium px-2 py-1.5 rounded-md text-xs w-16 flex items-center justify-center">
                          Future
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input type="number" defaultValue={(1.0).toFixed(1)} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsGenerateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
            // variant="destructive"
            // onClick={handleDeleteStrategy}
            // disabled={isDeleting}
            >
              {/* {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} */}
              Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserStrategies;
