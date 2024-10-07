"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
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
import { MoreHorizontal, Loader2 } from "lucide-react";
import { query, collection, where, addDoc, doc, updateDoc, deleteDoc, getDocs } from "firebase/firestore";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import { LoadingSpinner } from "@/components/ui/spinner";
import numeral from "numeral";
import { toast } from "@/components/ui/use-toast";

const Instruments = () => {
  const { data: user, status } = useUser();
  const firestore = useFirestore();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newInstrument, setNewInstrument] = useState({
    name: "",
    symbol: "",
    bpv: "",
    commission: "",
    slippage: "",
    marginReq: "",
  });
  const [editingInstrument, setEditingInstrument] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const instrumentsQuery = query(
    collection(firestore, "instruments"),
    where("userId", "==", user ? user.uid : "")
  );

  const { data: instruments, status: instrumentsStatus } =
    useFirestoreCollectionData(instrumentsQuery, { idField: "id" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInstrument((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingInstrument((prev) => ({ ...prev, [name]: value }));
  };

  const checkSymbolExists = async (symbol, excludeId = null) => {
    const symbolQuery = query(
      collection(firestore, "instruments"),
      where("userId", "==", user.uid),
      where("symbol", "==", symbol)
    );
    const querySnapshot = await getDocs(symbolQuery);
    return querySnapshot.docs.some(doc => doc.id !== excludeId);
  };

  const handleAddInstrument = async () => {
    setIsSubmitting(true);
    try {
      const symbolExists = await checkSymbolExists(newInstrument.symbol);
      if (symbolExists) {
        toast({
          title: "Symbol already exists",
          description: "An instrument with this symbol already exists in your account.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      await addDoc(collection(firestore, "instruments"), {
        ...newInstrument,
        userId: user.uid,
        bpv: parseFloat(newInstrument.bpv),
        commission: parseFloat(newInstrument.commission),
        slippage: parseFloat(newInstrument.slippage),
        marginReq: parseFloat(newInstrument.marginReq),
      });
      setIsAddDialogOpen(false);
      setNewInstrument({
        name: "",
        symbol: "",
        bpv: "",
        commission: "",
        slippage: "",
        marginReq: "",
      });
      toast({
        title: "Instrument added",
        description: "The new instrument has been successfully added.",
      });
    } catch (error) {
      console.error("Error adding instrument:", error);
      toast({
        title: "Error",
        description: "An error occurred while adding the instrument.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditInstrument = async () => {
    setIsSubmitting(true);
    try {
      const symbolExists = await checkSymbolExists(editingInstrument.symbol, editingInstrument.id);
      if (symbolExists) {
        toast({
          title: "Symbol already exists",
          description: "Another instrument with this symbol already exists in your account.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const instrumentRef = doc(firestore, "instruments", editingInstrument.id);
      await updateDoc(instrumentRef, {
        ...editingInstrument,
        bpv: parseFloat(editingInstrument.bpv),
        commission: parseFloat(editingInstrument.commission),
        slippage: parseFloat(editingInstrument.slippage),
        marginReq: parseFloat(editingInstrument.marginReq),
      });
      setIsEditDialogOpen(false);
      setEditingInstrument(null);
      toast({
        title: "Instrument updated",
        description: "The instrument has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating instrument:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating the instrument.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteInstrument = async (instrumentId) => {
    if (window.confirm("Are you sure you want to delete this instrument?")) {
      try {
        const instrumentRef = doc(firestore, "instruments", instrumentId);
        await deleteDoc(instrumentRef);
        toast({
          title: "Instrument deleted",
          description: "The instrument has been successfully deleted.",
        });
      } catch (error) {
        console.error("Error deleting instrument:", error);
        toast({
          title: "Error",
          description: "An error occurred while deleting the instrument.",
          variant: "destructive",
        });
      }
    }
  };

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
    <>
      <TabsContent value="instruments">
        <Card>
          <CardHeader>
            <CardTitle>Custom Instruments</CardTitle>
            <CardDescription>
              Add custom instruments to your account here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-row mb-3">
              <Button
                className="ml-auto"
                onClick={() => setIsAddDialogOpen(true)}
              >
                Add Instrument
              </Button>
            </div>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Big Point Value</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Slippage</TableHead>
                    <TableHead>Margin Requirement</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {instruments.length ? (
                    instruments.map((instrument) => (
                      <TableRow key={instrument.id}>
                        <TableCell>{instrument.name}</TableCell>
                        <TableCell>{instrument.symbol}</TableCell>
                        <TableCell>{instrument.bpv}</TableCell>
                        <TableCell>
                          {numeral(instrument.commission).format("$0,0.00")}
                        </TableCell>
                        <TableCell>
                          {numeral(instrument.slippage).format("$0,0.00")}
                        </TableCell>
                        <TableCell>
                          {numeral(instrument.marginReq).format("$0,0")}
                        </TableCell>
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
                                onClick={() => {
                                  setEditingInstrument(instrument);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDeleteInstrument(instrument.id)
                                }
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
                      <TableCell colSpan={7} className="h-24 text-center">
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

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Instrument</DialogTitle>
            <DialogDescription>
              Enter the details of the new instrument below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={newInstrument.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="symbol" className="text-right">
                Symbol
              </Label>
              <Input
                id="symbol"
                name="symbol"
                value={newInstrument.symbol}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bpv" className="text-right">
                Big Point Value
              </Label>
              <Input
                id="bpv"
                name="bpv"
                type="number"
                value={newInstrument.bpv}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="commission" className="text-right">
                Commission
              </Label>
              <Input
                id="commission"
                name="commission"
                type="number"
                value={newInstrument.commission}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="slippage" className="text-right">
                Slippage
              </Label>
              <Input
                id="slippage"
                name="slippage"
                type="number"
                value={newInstrument.slippage}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="marginReq" className="text-right">
                Margin Req.
              </Label>
              <Input
                id="marginReq"
                name="marginReq"
                type="number"
                value={newInstrument.marginReq}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddInstrument} disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isSubmitting ? "Adding..." : "Add Instrument"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Instrument</DialogTitle>
            <DialogDescription>
              Update the details of the instrument below.
            </DialogDescription>
          </DialogHeader>
          {editingInstrument && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={editingInstrument.name}
                  onChange={handleEditInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-symbol" className="text-right">
                  Symbol
                </Label>
                <Input
                  id="edit-symbol"
                  name="symbol"
                  value={editingInstrument.symbol}
                  onChange={handleEditInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-bpv" className="text-right">
                  Big Point Value
                </Label>
                <Input
                  id="edit-bpv"
                  name="bpv"
                  type="number"
                  value={editingInstrument.bpv}
                  onChange={handleEditInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-commission" className="text-right">
                  Commission
                </Label>
                <Input
                  id="edit-commission"
                  name="commission"
                  type="number"
                  value={editingInstrument.commission}
                  onChange={handleEditInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-slippage" className="text-right">
                  Slippage
                </Label>
                <Input
                  id="edit-slippage"
                  name="slippage"
                  type="number"
                  value={editingInstrument.slippage}
                  onChange={handleEditInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-marginReq" className="text-right">
                  Margin Req.
                </Label>
                <Input
                  id="edit-marginReq"
                  name="marginReq"
                  type="number"
                  value={editingInstrument.marginReq}
                  onChange={handleEditInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditInstrument} disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isSubmitting ? "Updating..." : "Update Instrument"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Instruments;
