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

const Timeframes = () => {
  return (
    <TabsContent value="timeframes">
      <Card>
        <CardHeader>
          <CardTitle>Custom Timeframes</CardTitle>
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
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )
}

export default Timeframes