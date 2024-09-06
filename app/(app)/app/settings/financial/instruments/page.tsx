"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { query, collection, where } from "firebase/firestore";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import { LoadingSpinner } from "@/components/ui/spinner";
import numeral from "numeral";

const Instruments = () => {
  const { data: user, status } = useUser();
  const firestore = useFirestore();

  // Create a query to filter strategies by userId
  const instrumentsQuery = query(
    collection(firestore, "instruments"),
    where("userId", "==", user ? user.uid : "")
  );

  // Fetch strategies using Reactfire
  const { data: instruments, status: instrumentsStatus } =
    useFirestoreCollectionData(instrumentsQuery, { idField: "id" });

  if (status === "loading" || instrumentsStatus === "loading") {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <LoadingSpinner size={45} />
      </div>
    );
  }

  if (!user) {
    return <div>Please sign in to view instruments.</div>;
  }

  if (instrumentsStatus === "error") {
    return <div>Error fetching instruments.</div>;
  }

  return (
    <TabsContent value="instruments">
      <Card>
        <CardHeader>
          <CardTitle>Custom Instruments</CardTitle>
          <CardDescription>
            Add custom instruments to your account here.
          </CardDescription>
        </CardHeader>
        <CardContent className="">
          <div className="flex flex-row mb-3">
            <Button className="ml-auto">Add Instrument</Button>
          </div>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Big Point Value</TableHead>
                  <TableHead>Comission</TableHead>
                  <TableHead>Slippage</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {instruments.length ? (
                  instruments.map((instrument) => (
                    <TableRow key={instrument.id} className="">
                      <TableCell>{instrument.name}</TableCell>
                      <TableCell>{instrument.symbol}</TableCell>
                      <TableCell>{instrument.bpv}</TableCell>
                      <TableCell>{numeral(instrument.comission).format("$0,0.00")}</TableCell>
                      <TableCell>{numeral(instrument.slippage).format("$0,0.00")}</TableCell>
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
                            <DropdownMenuItem onClick={() => {}}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {}}>
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
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default Instruments;
