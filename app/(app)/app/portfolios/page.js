"use client";
import React, { useState, useEffect } from "react";
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
  orderBy,
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
import { LoadingSpinner } from "@/components/ui/spinner";
import { Loader2, MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import numeral from "numeral";

const Portfolios = () => {
  const { data: user, status } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [filter, setFilter] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [portfolioToDelete, setPortfolioToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  const [checkedItems, setCheckedItems] = useState(() => {
    const savedPreferences = localStorage.getItem("portfolioColumnPreferences");
    return savedPreferences
      ? JSON.parse(savedPreferences)
      : {
          netProfit: true,
          maxDrawdown: true,
          sharpeRatio: true,
          noOfStrategies: true,
        };
  });

  useEffect(() => {
    localStorage.setItem(
      "portfolioColumnPreferences",
      JSON.stringify(checkedItems)
    );
  }, [checkedItems]);

  const handleItemClick = (key) => {
    setCheckedItems((prev) => {
      const newCheckedItems = { ...prev, [key]: !prev[key] };
      localStorage.setItem(
        "portfolioColumnPreferences",
        JSON.stringify(newCheckedItems)
      );
      return newCheckedItems;
    });
  };

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Create a query to fetch portfolios
  const portfoliosQuery = query(
    collection(firestore, "portfolios"),
    where("userId", "==", user ? user.uid : ""),
    orderBy("createdAt", "desc")
  );

  // Fetch portfolios using Reactfire
  const { data: portfolios, status: portfoliosStatus } =
    useFirestoreCollectionData(portfoliosQuery, { idField: "id" });

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
      setSelectedRows(new Set(portfolios.map((portfolio) => portfolio.id)));
    }
    setSelectAll(!selectAll);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toLocaleDateString();
  };

  const handleDeletePortfolio = async () => {
    setIsDeleting(true);
    if (portfolioToDelete) {
      const portfolioDoc = doc(firestore, "portfolios", portfolioToDelete);
      await deleteDoc(portfolioDoc);
      setIsDeleteDialogOpen(false);
      setPortfolioToDelete(null);
    }
    setIsDeleting(false);
  };

  const handleEditPortfolio = async () => {
    setIsEditing(true);
    if (portfolioToDelete && editedName) {
      const portfolioDoc = doc(firestore, "portfolios", portfolioToDelete);
      await updateDoc(portfolioDoc, { name: editedName });
      setIsEditDialogOpen(false);
      setPortfolioToDelete(null);
      setEditedName("");
    }
    setIsEditing(false);
  };

  if (status === "loading" || portfoliosStatus === "loading") {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <LoadingSpinner size={45} />
      </div>
    );
  }

  if (!user) {
    return <div>Please sign in to view portfolios.</div>;
  }

  if (portfoliosStatus === "error") {
    return <div>Error fetching portfolios.</div>;
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const filteredPortfolios = portfolios.filter((portfolio) =>
    portfolio?.name?.toLowerCase().includes(filter.toLowerCase())
  );

  const sortedPortfolios = [...filteredPortfolios].sort((a, b) => {
    if (sortConfig.key) {
      let aValue, bValue;

      switch (sortConfig.key) {
        case "createdAt":
          aValue = a[sortConfig.key].seconds;
          bValue = b[sortConfig.key].seconds;
          break;
        case "netProfit":
          aValue = a.metrics?.netProfit || 0;
          bValue = b.metrics?.netProfit || 0;
          break;
        case "maxDrawdown":
          aValue = a.metrics?.maxDrawdownAmount || 0;
          bValue = b.metrics?.maxDrawdownAmount || 0;
          break;
        case "sharpeRatio":
          aValue = a.metrics?.sharpeRatio || 0;
          bValue = b.metrics?.sharpeRatio || 0;
          break;
        case "noOfStrategies":
          aValue = a.strategies?.length || 0;
          bValue = b.strategies?.length || 0;
          break;
        default:
          aValue = a[sortConfig.key]?.toLowerCase();
          bValue = b[sortConfig.key]?.toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
    }
    return 0;
  });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const paginatedPortfolios = sortedPortfolios.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  const pageCount = Math.ceil(filteredPortfolios.length / rowsPerPage);
  const startEntry = currentPage * rowsPerPage + 1;
  const endEntry = Math.min(
    startEntry + rowsPerPage - 1,
    filteredPortfolios.length
  );

  return (
    <div className="flex flex-col w-full items-center">
      <h2 className="text-3xl leading-5 font-bold tracking-tight mb-6 w-full">
        Portfolios
      </h2>
      <div className="max-w-7xl w-full flex flex-col justify-center">
        <div className="flex items-center py-4 gap-3">
          <Input
            placeholder="Filter portfolios..."
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="max-w-sm"
          />
          <Link href="/app/portfolios/create" className="ml-auto">
            <Button variant="outline">
              Create Portfolio
              <Plus className="ml-2 h-4 w-4" />
            </Button>
          </Link>
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
                {checkedItems.netProfit && (
                  <TableHead
                    onClick={() => handleSort("netProfit")}
                    className="cursor-pointer"
                  >
                    Net Profit{" "}
                    {sortConfig.key === "netProfit"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </TableHead>
                )}
                {checkedItems.maxDrawdown && (
                  <TableHead
                    onClick={() => handleSort("maxDrawdown")}
                    className="cursor-pointer"
                  >
                    Max Drawdown{" "}
                    {sortConfig.key === "maxDrawdown"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </TableHead>
                )}
                {checkedItems.sharpeRatio && (
                  <TableHead
                    onClick={() => handleSort("sharpeRatio")}
                    className="cursor-pointer"
                  >
                    Sharpe Ratio{" "}
                    {sortConfig.key === "sharpeRatio"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </TableHead>
                )}
                {checkedItems.noOfStrategies && (
                  <TableHead
                    onClick={() => handleSort("noOfStrategies")}
                    className="cursor-pointer"
                  >
                    No. of Strategies{" "}
                    {sortConfig.key === "noOfStrategies"
                      ? sortConfig.direction === "asc"
                        ? "▲"
                        : "▼"
                      : ""}
                  </TableHead>
                )}
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
                        {Object.entries(checkedItems).map(([key, checked]) => (
                          <DropdownMenuItem
                            key={key}
                            onSelect={(e) => e.preventDefault()}
                            onClick={() => handleItemClick(key)}
                            className="flex items-center"
                          >
                            <Checkbox
                              checked={checked}
                              className="w-3.5 h-3.5 mr-2"
                            />
                            {key.charAt(0).toUpperCase() +
                              key
                                .slice(1)
                                .replace(/([A-Z])/g, " $1")
                                .trim()}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPortfolios.length ? (
                paginatedPortfolios.map((portfolio) => (
                  <TableRow
                    key={portfolio.id}
                    data-state={
                      selectedRows.has(portfolio.id) ? "selected" : ""
                    }
                    onClick={() => handleRowCheckboxChange(portfolio.id)}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(portfolio.id)}
                        onCheckedChange={() =>
                          handleRowCheckboxChange(portfolio.id)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                    <TableCell>{portfolio.name}</TableCell>
                    <TableCell>
                      <Link
                        href={`/app/portfolios/${portfolio.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex w-min"
                      >
                        <div className="bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 font-medium cursor-pointer px-2 py-1.5 rounded-md text-xs w-24 flex items-center justify-center">
                          View Report
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>{formatDate(portfolio.createdAt)}</TableCell>
                    {checkedItems.netProfit && (
                      <TableCell>
                        {(() => {
                          const profit = portfolio.metrics?.netProfit;
                          if (profit === undefined) return "";
                          const isNegative = profit < 0;
                          const formattedProfit = numeral(
                            Math.abs(profit)
                          ).format("$0,0");
                          return (
                            <p
                              className={
                                isNegative
                                  ? "text-red-600 dark:text-red-400"
                                  : "text-green-600 dark:text-green-400"
                              }
                            >
                              {isNegative
                                ? `(${formattedProfit})`
                                : formattedProfit}
                            </p>
                          );
                        })()}
                      </TableCell>
                    )}
                    {checkedItems.maxDrawdown && (
                      <TableCell>
                        {(() => {
                          const maxDrawdown =
                            portfolio.metrics?.maxDrawdownAmount;
                          if (maxDrawdown === undefined) return "";
                          const formattedDrawdown = numeral(
                            Math.abs(maxDrawdown)
                          ).format("$0,0");
                          return (
                            <p className="text-red-600 dark:text-red-400">
                              ({formattedDrawdown})
                            </p>
                          );
                        })()}
                      </TableCell>
                    )}
                    {checkedItems.sharpeRatio && (
                      <TableCell>
                        {numeral(portfolio.metrics?.sharpeRatio).format("0.00")}
                      </TableCell>
                    )}
                    {checkedItems.noOfStrategies && (
                      <TableCell>{portfolio.strategies?.length || 0}</TableCell>
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
                              navigator.clipboard.writeText(portfolio.id);
                              e.stopPropagation();
                            }}
                          >
                            Copy portfolio ID
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => {
                              setIsDeleteDialogOpen(true);
                              setPortfolioToDelete(portfolio.id);
                              e.stopPropagation();
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              setIsEditDialogOpen(true);
                              setPortfolioToDelete(portfolio.id);
                              setEditedName(portfolio.name);
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
                    No portfolios found.
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
              Showing {startEntry} to {endEntry} of {filteredPortfolios.length}{" "}
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

        {/* Edit Portfolio Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Portfolio</DialogTitle>
              <DialogDescription>
                Update the name of the portfolio.
              </DialogDescription>
            </DialogHeader>
            <div className="mb-4">
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Portfolio Name"
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
                onClick={handleEditPortfolio}
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

        {/* Delete Portfolio Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this portfolio? This action
                cannot be undone.
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
                onClick={handleDeletePortfolio}
                disabled={isDeleting}
              >
                {isDeleting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Portfolios;
