"use client";
import React, { useState } from "react";
import { useUser } from "reactfire";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { query, collection, where } from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table"; // Adjust import as necessary
import { LoadingSpinner } from "../ui/spinner";

const UserStrategies = () => {
  const { data: user, status } = useUser();
  const firestore = useFirestore();

  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAllChange}
              />
            </TableCell>
            <TableCell className="w-32">Name</TableCell>
            <TableCell>Weight</TableCell>
            <TableCell>Details</TableCell>
            <TableCell>Date Created</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {strategies?.map((strategy) => (
            <TableRow key={strategy.id}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedRows.has(strategy.id)}
                  onChange={() => handleRowCheckboxChange(strategy.id)}
                />
              </TableCell>
              <TableCell>{strategy.id}</TableCell>
              <TableCell>{strategy.name}</TableCell>
              <TableCell>1.0</TableCell>
              <TableCell>{strategy.name}</TableCell>
              <TableCell>{strategy.name}</TableCell>
              <TableCell>{strategy.name}</TableCell>
              {/* Add other cells if needed */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserStrategies;
