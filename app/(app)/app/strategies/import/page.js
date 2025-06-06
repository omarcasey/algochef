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
import {
  query,
  collection,
  where,
  addDoc,
  deleteDoc,
  doc,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import { useToast } from "@/components/ui/use-toast";
import {
  processTradeData,
  calculateTradingMetrics,
} from "@/components/processing/dataProcessing";
import { useRouter } from "next/navigation";
import InstrumentSelect from "@/components/import/InstrumentSelect";

const Import = () => {
  const [data, setData] = useState([]);
  const [NoOfColumns, setNoOfColumns] = useState(null);
  const [columnLabels, setColumnLabels] = useState({});
  const [linesToSkip, setLinesToSkip] = useState(1);
  const [skipLimit, setSkipLimit] = useState(1);
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
  const [selectedPositionType, setSelectedPositionType] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [formatName, setFormatName] = useState("");
  const [strategyName, setStrategyName] = useState("");
  const [isClearingFormat, setisClearingFormat] = useState(false);
  const [subtractCommissionSlippage, setSubtractCommissionSlippage] =
    useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Fetch the instruments data
  const { data: user, status: userStatus } = useUser();
  const firestore = useFirestore();

  const instrumentsQuery = query(
    collection(firestore, "instruments"),
    where("userId", "in", [user?.uid, "system"])
  );

  const timeframesQuery = query(
    collection(firestore, "timeframes"),
    where("userId", "in", [user?.uid, "system"])
  );

  const formatsQuery = query(
    collection(firestore, "formats"),
    where("userId", "in", [user?.uid, "system"])
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

          return content
            .split("\n")
            .map((line) => line.split(delimiterRegex))
            .filter((row) => row.some((cell) => cell.trim() !== ""));
        };

        // Normalize content based on the selected delimiters
        const parsedData = parseWithDelimiters(fileContent, delimiters);
        setSkipLimit(parsedData.length - 1);

        // Skip lines if needed
        const filteredData = skipLines
          ? parsedData.slice(linesToSkip)
          : parsedData;

        setData(filteredData);
        // Skip lines if needed
        const headers = skipLines ? filteredData[linesToSkip] : filteredData[0];
        // console.log("headers - " + headers.length);
        setNoOfColumns(headers.length);
        // console.log("labels - " + JSON.stringify(columnLabels));
      } catch (error) {
        console.error("Processing error:", error.message);
      } finally {
        setLoading(false); // End loading
      }
    }
  }, [fileContent, linesToSkip, skipLines, delimiters]);

  // Effect to update the position type when data or column labels change
  useEffect(() => {
    // Find if the "Long/Short" label is selected and get its index
    const longShortEntry = Object.entries(columnLabels).find(
      ([, label]) => label === "Long/Short"
    );

    // Proceed only if the "Long/Short" label is found
    if (longShortEntry) {
      const [longShortIndex] = longShortEntry;

      // Scan the corresponding column in data
      const longShortValues = data.map((row) =>
        row[longShortIndex]?.toLowerCase()
      );

      // Determine the type of positions present in the data
      const hasLong = longShortValues.includes("long");
      const hasShort = longShortValues.includes("short");

      // Set position type based on the column data
      if (hasLong && hasShort) {
        setSelectedPositionType("both");
      } else if (hasLong) {
        setSelectedPositionType("long");
      } else if (hasShort) {
        setSelectedPositionType("short");
      } else {
        setSelectedPositionType(null);
      }
    } else {
      setSelectedPositionType(null); // Reset if "Long/Short" is not selected
    }
  }, [data, columnLabels]);

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
      setColumnLabels(
        selectedFormat.columns.reduce((acc, label, index) => {
          acc[index] = label;
          return acc;
        }, {})
      );
    }
  };

  const saveFormat = async () => {
    if (!formatName) return; // Don't save without a name

    // Initialize columns array with placeholders for each possible index
    const columnsArray = [];
    for (let i = 0; i < NoOfColumns; i++) {
      columnsArray[i] = columnLabels[i] || ""; // Add empty string for missing columns
    }

    const newFormat = {
      name: formatName,
      userId: user.uid,
      columns: columnsArray,
      comma: delimiters.comma,
      semicolon: delimiters.semicolon,
      tab: delimiters.tab,
      space: delimiters.space,
      skip: skipLines,
      skipNumber: linesToSkip,
      mergeLines: mergeLines,
      instrument: selectedInstrument,
      timeframe: selectedTimeframe,
    };
    const docRef = await addDoc(collection(firestore, "formats"), newFormat);
    setSelectedFormat(docRef.id);
    setSaveFormatOpen(false); // Close dialog after saving
    setFormatName("");
  };

  const clearFormat = async () => {
    if (!selectedFormat) return; // No format selected
    try {
      setisClearingFormat(true);
      console.log(selectedFormat);
      await deleteDoc(doc(firestore, "formats", selectedFormat));
      // Optionally reset the selected format and other states
      setSelectedFormat(null);
      setisClearingFormat(false);
    } catch (error) {
      console.error("Error deleting format:", error.message);
    }
  };

  const handleImport = async () => {
    try {
      // Ensure that at least one of the required labels is present
      const hasRequiredLabels =
        Object.values(columnLabels).includes("Entry Date") &&
        Object.values(columnLabels).includes("Entry Price") &&
        Object.values(columnLabels).includes("Exit Date") &&
        Object.values(columnLabels).includes("Exit Price");

      if (!hasRequiredLabels) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "Error: The file must contain 'Entry Date', 'Entry Price', 'Exit Date', 'Exit Price' columns.",
        });
        return;
      }

      if (!selectedInstrument || !selectedTimeframe || !selectedPositionType) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "Error: You must select an instrument, timeframe, and position type.",
        });
        return;
      }

      // Find the full instrument object from the instruments array
      const selectedInstrumentObject = instruments.find(
        (instrument) => instrument.id === selectedInstrument
      );

      if (!selectedInstrumentObject) {
        toast({
          variant: "destructive",
          title: "Instrument not found",
          description: "The selected instrument could not be found.",
        });
        return;
      }

      // Process trade data
      const trades = processTradeData(
        columnLabels,
        data,
        selectedPositionType,
        selectedInstrumentObject,
        subtractCommissionSlippage
      );
      const metrics = calculateTradingMetrics(trades, 10000);
      const monthlyReturns = null;
      const annualReturns = null;

      if (trades.length === 0) {
        toast({
          variant: "destructive",
          title: "No valid trades found",
          description: "Please check your data and try again.",
        });
        return;
      }

      // Create a new strategy document with pre-calculated metrics
      const strategyDoc = await addDoc(collection(firestore, "strategies"), {
        name: strategyName,
        createdAt: Timestamp.now(),
        userId: user.uid,
        instrument: selectedInstrument,
        timeframe: selectedTimeframe,
        positionTypes: selectedPositionType,
        metrics: metrics,
        benchmark: "none",
      });

      // Use a batch write to add all trades
      const batch = writeBatch(firestore);
      const tradesCollection = collection(
        firestore,
        `strategies/${strategyDoc.id}/trades`
      );

      trades.forEach((trade, index) => {
        const tradeDoc = doc(tradesCollection);
        batch.set(tradeDoc, { ...trade, order: index });
      });

      await batch.commit();

      toast({
        title: "Data imported successfully!",
        description: `${trades.length} trades imported.`,
      });

      // Redirect to strategy page
      router.push(`/app/strategies/${strategyDoc.id}`);
    } catch (error) {
      console.error("Import error:", error.message);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Error importing data.",
      });
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
              value={strategyName}
              onChange={(e) => setStrategyName(e.target.value)}
              placeholder="Enter strategy name..."
              className="w-[20rem] border-muted-foreground"
            />
            <Button
              variant={"teal"}
              className="w-44 bg-blue-600"
              onClick={handleImport}
            >
              Import/Log
            </Button>
          </div>
          <div className="flex flex-row gap-3 mb-3">
            <InstrumentSelect
              instruments={instruments}
              selectedInstrument={selectedInstrument}
              setSelectedInstrument={setSelectedInstrument}
            />
            <Select
              value={selectedTimeframe}
              onValueChange={(value) => setSelectedTimeframe(value)}
            >
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
            <Select
              value={selectedPositionType}
              onValueChange={(value) => setSelectedPositionType(value)}
              disabled={Object.values(columnLabels).includes("Long/Short")}
            >
              <SelectTrigger className="w-[8rem]">
                <SelectValue placeholder="Long/Short" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select Position Type</SelectLabel>
                  <SelectItem value="long">Long</SelectItem>
                  <SelectItem value="short">Short</SelectItem>
                  <SelectItem value="both" className="hidden">
                    Both
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="flex flex-row items-center cursor-pointer">
              <Checkbox
                id="commission"
                className="mr-1 ml-4"
                disabled={loading}
                checked={subtractCommissionSlippage}
                onCheckedChange={(checked) =>
                  setSubtractCommissionSlippage(checked)
                }
              />
              <Label className="cursor-pointer" htmlFor="commission">
                Subtract Comission & Slippage
              </Label>
            </div>
            <Select
              value={selectedFormat}
              onValueChange={(value) => handleFormatSelect(value)}
            >
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
            <Button
              size={"sm"}
              variant={"outline"}
              onClick={clearFormat}
              disabled={!selectedFormat || isClearingFormat}
            >
              Clear Format
            </Button>
          </div>
          <div className="rounded-md border flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Line</TableHead>
                  {Array.from({ length: NoOfColumns }).map((_, index) => (
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
                    {Array.from({ length: NoOfColumns }).map((_, colIndex) => (
                      <TableCell key={colIndex}>{row[colIndex]}</TableCell>
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
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value, 10);
                      // Ensure the new value does not exceed SkipLimit
                      if (newValue <= skipLimit) {
                        setLinesToSkip(newValue);
                      } else {
                        setLinesToSkip(skipLimit);
                      }
                    }}
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
            <Input
              value={formatName}
              onChange={(e) => setFormatName(e.target.value)}
              placeholder="Enter Format Name..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveFormatOpen(false)}>
              Cancel
            </Button>
            <Button
              // variant="destructive"
              onClick={saveFormat}
              disabled={!formatName}
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
