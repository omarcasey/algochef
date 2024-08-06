"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { query, collection, where } from "firebase/firestore";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";

const Import = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [columnLabels, setColumnLabels] = useState({});
  const [linesToSkip, setLinesToSkip] = useState(1);
  const [skipLines, setSkipLines] = useState(false);
  const [fileContent, setFileContent] = useState("");
  const [delimiters, setDelimiters] = useState({
    comma: true,
    semicolon: false,
    tab: false,
    space: false,
  });
  const [loading, setLoading] = useState(false); // Loading state
  const [isSaveFormatOpen, setSaveFormatOpen] = useState(false);
  const [mergeLines, setMergeLines] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState(null);

  // Fetch the instruments data
  const { data: user, status: userStatus } = useUser();
  const firestore = useFirestore();

  const instrumentsQuery = query(
    collection(firestore, "instruments"),
    where("userId", "==", user ? user.uid : "")
  );

  const timeframesQuery = query(
    collection(firestore, "timeframes"),
    where("userId", "==", user ? user.uid : "")
  );

  const formatsQuery = query(
    collection(firestore, "formats"),
    where("userId", "==", user ? user.uid : "")
  );

  const { data: instruments, status: instrumentsStatus } =
    useFirestoreCollectionData(instrumentsQuery, { idField: "id" });

  const { data: timeframes, status: timeframesStatus } =
    useFirestoreCollectionData(timeframesQuery, { idField: "id" });

  const { data: formats, status: formatsStatus } = useFirestoreCollectionData(
    formatsQuery,
    { idField: "id" }
  );

  useEffect(() => {
    if (fileContent) {
      try {
        setLoading(true); // Start loading
        // Custom parser to handle multiple delimiters
        const parseWithDelimiters = (content, delimiters) => {
          const delimiterRegex = new RegExp(
            [
              delimiters.comma && ",",
              delimiters.semicolon && ";",
              delimiters.tab && "\\t",
              delimiters.space && "\\s",
            ]
              .filter(Boolean)
              .join("|"),
            "g"
          );

          return content.split("\n").map((line) => line.split(delimiterRegex));
        };

        // Normalize content based on the selected delimiters
        const parsedData = parseWithDelimiters(fileContent, delimiters);

        // Skip lines if needed
        const filteredData = skipLines
          ? parsedData.slice(linesToSkip)
          : parsedData;

        setData(filteredData);
        const headers = filteredData[linesToSkip] || [];
        const headerLabels = headers.map((_, index) => `Column ${index + 1}`);
        setColumns(headerLabels);
        const initialLabels = headerLabels.reduce((acc, _, index) => {
          acc[index] = "";
          return acc;
        }, {});
        setColumnLabels(initialLabels);
      } catch (error) {
        console.error("Processing error:", error.message);
      } finally {
        setLoading(false); // End loading
      }
    }
  }, [fileContent, linesToSkip, skipLines, delimiters]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true); // Start loading
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileContent(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleLabelChange = (colIndex, value) => {
    setColumnLabels((prevLabels) => {
      // Create a new copy of the labels
      const newLabels = { ...prevLabels };
      // Find the key of the column that has the same label
      const existingKey = Object.keys(newLabels).find(
        (key) => newLabels[key] === value
      );

      // If the label is already assigned to another column, clear it
      if (existingKey !== undefined) {
        newLabels[existingKey] = "";
      }

      // Set the new label for the current column
      newLabels[colIndex] = value;

      return newLabels;
    });
  };

  const handleDelimiterChange = (type) => (checked) => {
    setDelimiters((prev) => ({
      ...prev,
      [type]: checked,
    }));
  };

  const handleFormatSelect = async (formatId) => {
    setSelectedFormat(formatId);
    console.log("yuh");
    const selectedFormat = formats.find((format) => format.id === formatId);
    if (selectedFormat) {
      // Set delimiters
      setDelimiters({
        comma: selectedFormat.comma,
        semicolon: selectedFormat.semicolon,
        tab: selectedFormat.tab,
        space: selectedFormat.space,
      });

      // Set other settings
      setSkipLines(selectedFormat.skip);
      setLinesToSkip(selectedFormat.skipNumber);
      setMergeLines(selectedFormat.mergeLines);
      const selectedInstrument = instruments.find(
        (instrument) => instrument.id === selectedFormat.instrument
      );
      if (selectedInstrument) {
        setSelectedInstrument(selectedInstrument.id);
      }

      const selectedTimeframe = timeframes.find(
        (timeframe) => timeframe.id === selectedFormat.timeframe
      );
      if (selectedTimeframe) {
        setSelectedTimeframe(selectedTimeframe.id);
      }

      // Set columns based on format
      console.log("yer");
      setColumnLabels(
        selectedFormat.columns.reduce((acc, label, index) => {
          acc[index] = label;
          return acc;
        }, {})
      );
    }
  };

  if (userStatus === "loading" || instrumentsStatus === "loading") {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <LoadingSpinner size={45} />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <div className="py-4">
        <Input
          type="file"
          accept=".csv, .txt"
          onChange={handleFileUpload}
          disabled={loading}
        />
      </div>
      {loading && <LoadingSpinner />}
      {!loading && data.length > 0 && (
        <>
          <div className="flex gap-3 mb-6 justify-center">
            <Input
              placeholder="Enter strategy name..."
              className="w-[20rem] border-muted-foreground"
            />
            <Button variant={"teal"} className="w-44 bg-blue-600" onClick={() => console.log(selectedInstrument)}>
              Import/Log
            </Button>
          </div>
          <div className="flex flex-row gap-3 mb-3">
            <Select value={selectedInstrument} onValueChange={(value) => setSelectedInstrument(value)}>
              <SelectTrigger className="w-[14rem] mr-5">
                <SelectValue placeholder="Instruments" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="">Select an Instrument</SelectLabel>
                  <SelectItem value="ex1">Example 1</SelectItem>
                  <SelectItem value="ex2">Example 2</SelectItem>
                  <SelectItem value="ex3">Example 3</SelectItem>
                  <SelectSeparator />
                  <SelectLabel>Custom</SelectLabel>
                  {instruments.map((instrument) => (
                    <SelectItem key={instrument.id} value={instrument.id}>
                      {instrument.name} - {instrument.symbol}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select value={selectedTimeframe} onValueChange={(value) => setSelectedTimeframe(value)}>
              <SelectTrigger className="w-[14rem]">
                <SelectValue placeholder="Timeframes" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select a Timeframe</SelectLabel>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                  <SelectItem value="YTD">Year-to-Date (YTD)</SelectItem>
                  <SelectItem value="Annual">Annual</SelectItem>
                  <SelectSeparator />
                  <SelectLabel>Custom</SelectLabel>
                  {timeframes.map((timeframe) => (
                    <SelectItem key={timeframe.id} value={timeframe.id}>
                      {timeframe.value} {timeframe.unit}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select value={selectedFormat} onValueChange={(value) => handleFormatSelect(value)}>
              <SelectTrigger className="w-[180px] ml-auto">
                <SelectValue placeholder="Select a Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Saved Formats</SelectLabel>
                  {formats.map((format) => (
                    <SelectItem key={format.id} value={format.id}>
                      {format.name}
                    </SelectItem>
                  ))}
                  <SelectItem>Ok</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button
              onClick={() => setSaveFormatOpen(true)}
              className=""
              size="sm"
              variant={"secondary"}
            >
              Save Format
            </Button>
            <Button size={"sm"} variant={"outline"}>
              Clear Format
            </Button>
          </div>
          <div className="rounded-md border flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Line</TableHead>
                  {columns.map((header, index) => (
                    <TableHead key={index}>
                      <div className="flex items-center">
                        <Select
                          value={columnLabels[index] || ""}
                          onValueChange={(value) =>
                            handleLabelChange(index, value)
                          }
                        >
                          <SelectTrigger className="border-none bg-transparent focus:ring-transparent focus:border-none">
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Select a Label</SelectLabel>
                              <SelectItem value="Entry Date">
                                Entry Date
                              </SelectItem>
                              <SelectItem value="Entry Time">
                                Entry Time
                              </SelectItem>
                              <SelectItem value="Entry Price">
                                Entry Price
                              </SelectItem>
                              <SelectItem value="Exit Date">
                                Exit Date
                              </SelectItem>
                              <SelectItem value="Exit Time">
                                Exit Time
                              </SelectItem>
                              <SelectItem value="Exit Price">
                                Exit Price
                              </SelectItem>
                              <SelectItem value="Long/Short">
                                Long/Short
                              </SelectItem>
                              <SelectItem value="P/L">P/L</SelectItem>
                              <SelectItem value="Size">Size</SelectItem>
                              <SelectItem value="Symbol">Symbol</SelectItem>
                              <SelectItem value="ATR">ATR</SelectItem>
                              <SelectItem value="Currency Rate">
                                Currency Rate
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell>{rowIndex + 1}</TableCell>
                    {row.map((cell, colIndex) => (
                      <TableCell key={colIndex}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-row items-center justify-between pt-5 pb-3">
            <div className="flex flex-row items-center">
              <Checkbox
                id="skip"
                className="mr-2"
                checked={skipLines}
                onCheckedChange={(checked) => setSkipLines(checked)}
              />
              <Label className="cursor-pointer" htmlFor="skip">
                <div className="flex flex-row space-x-2 items-center">
                  <p className="text-nowrap">Skip first</p>
                  <Input
                    type="number"
                    value={linesToSkip}
                    onChange={(e) =>
                      setLinesToSkip(parseInt(e.target.value, 10))
                    }
                    className="w-16 h-8"
                    min="0"
                    // disabled={!skipLines}
                  />
                  <p className="text-nowrap">lines</p>
                </div>
              </Label>
            </div>
            <div className="flex flex-row space-x-4">
              <div className="flex flex-row items-center cursor-pointer">
                <Checkbox
                  id="tab"
                  className="mr-1"
                  checked={delimiters.tab}
                  onCheckedChange={handleDelimiterChange("tab")}
                  disabled={loading}
                />
                <Label className="cursor-pointer" htmlFor="tab">
                  Tab
                </Label>
              </div>
              <div className="flex flex-row items-center cursor-pointer">
                <Checkbox
                  defaultChecked
                  id="comma"
                  className="mr-1"
                  checked={delimiters.comma}
                  onCheckedChange={handleDelimiterChange("comma")}
                  disabled={loading}
                />
                <Label className="cursor-pointer" htmlFor="comma">
                  Comma
                </Label>
              </div>
              <div className="flex flex-row items-center cursor-pointer">
                <Checkbox
                  id="space"
                  className="mr-1"
                  checked={delimiters.space}
                  onCheckedChange={handleDelimiterChange("space")}
                  disabled={loading}
                />
                <Label className="cursor-pointer" htmlFor="space">
                  Space
                </Label>
              </div>
              <div className="flex flex-row items-center cursor-pointer">
                <Checkbox
                  id="semicolon"
                  className="mr-1"
                  checked={delimiters.semicolon}
                  onCheckedChange={handleDelimiterChange("semicolon")}
                  disabled={loading}
                />
                <Label className="cursor-pointer" htmlFor="semicolon">
                  Semicolon
                </Label>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-3">
            <div className="flex flex-row items-start">
              <Checkbox
                id="merge"
                className="mr-2"
                checked={mergeLines}
                onCheckedChange={(checked) => setMergeLines(checked)}
              />
              <Label htmlFor="merge">Merge lines two at a time</Label>
            </div>
          </div>
        </>
      )}

      <Dialog open={isSaveFormatOpen} onOpenChange={setSaveFormatOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Format</DialogTitle>
            <DialogDescription>
              Are you sure you want to save these import settings?
            </DialogDescription>
          </DialogHeader>
          <div>
            <Input placeholder="Enter Format Name..." />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveFormatOpen(false)}>
              Cancel
            </Button>
            <Button
            // variant="destructive"
            // onClick={handleDeleteStrategy}
            // disabled={isDeleting}
            >
              {/* {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} */}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Import;
