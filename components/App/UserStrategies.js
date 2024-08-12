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

const UserStrategies = () => {
  const { data: user, status } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [filter, setFilter] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [strategyToDelete, setStrategyToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);

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

  const filteredStrategies = strategies.filter((strategy) =>
    strategy.name.toLowerCase().includes(filter.toLowerCase())
  );

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
              <TableHead>Name</TableHead>
              {/* <TableHead>Weight</TableHead> */}
              <TableHead>Details</TableHead>
              <TableHead>Date Created</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStrategies.length ? (
              filteredStrategies.map((strategy) => (
                <TableRow
                  key={strategy.id}
                  data-state={selectedRows.has(strategy.id) ? "selected" : ""}
                  onClick={() => handleRowCheckboxChange(strategy.id)} // Select row on click
                  className="" // Add a pointer cursor to indicate clickable row
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
                      href={`/app/strategies/${strategy.id}/summary`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex w-min"
                    >
                      <div className="bg-green-950 text-green-400 font-medium cursor-pointer px-2 py-1.5 rounded-md text-xs w-24 flex items-center justify-center">
                        View Report
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>{formatDate(strategy.createdAt)}</TableCell>
                  <TableCell>
                    <div className="bg-purple-950 text-purple-400 font-medium px-2 py-1.5 rounded-md text-xs w-16 flex items-center justify-center">
                      Future
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
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
                          onClick={() =>
                            router.push(`/app/strategies/${strategy.id}/summary`)
                          }
                        >
                          View report
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setStrategyToDelete(strategy.id);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7} // Adjust the colspan according to the number of columns
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        {/* Pagination controls if needed */}
      </div>

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
                        <div className="bg-purple-950 text-purple-400 font-medium px-2 py-1.5 rounded-md text-xs w-16 flex items-center justify-center">
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
