"use client";

import React, { useState, useEffect } from "react";
import Papa from "papaparse";
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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

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
        // const skip = skipLines ? Math.max(linesToSkip - 1, 0) : 0;
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
    setColumnLabels((prevLabels) => ({
      ...prevLabels,
      [colIndex]: value,
    }));
  };

  const handleDelimiterChange = (type) => (checked) => {
    setDelimiters((prev) => ({
      ...prev,
      [type]: checked,
    }));
  };

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
          <div className="flex flex-row gap-3 mb-3">
            <Select className="">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Saved Formats</SelectLabel>
                  <SelectItem value="Robinhood">Robinhood</SelectItem>
                  <SelectItem value="Fidelity">Fidelity</SelectItem>
                  <SelectItem value="E*Trade">E*Trade</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button className="ml-auto" size="sm" variant={"secondary"}>
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
                          className="ml-2"
                        >
                          <SelectTrigger className="border-none bg-transparent focus:ring-transparent focus:border-none">
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Select a Label</SelectLabel>
                              <SelectItem value=" ">{"."}</SelectItem>
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
              <Checkbox id="merge" className="mr-2" />
              <Label htmlFor="merge">Merge lines two at a time</Label>
            </div>
            <div className="mt-3 ml-auto flex gap-3">
              <Input
                placeholder="Enter strategy name..."
                className="ml-auto w-[20rem]"
              />
              <Button variant={"teal"} className="w-44 bg-blue-600">
                Import
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Import;
