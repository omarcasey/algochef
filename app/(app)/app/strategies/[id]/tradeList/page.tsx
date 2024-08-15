"use client"
import React from 'react'
import { useStrategy } from '../layout';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";

const TradeList = () => {
    const { strategy } = useStrategy();

  return (
    <div>
        {/* <div className="rounded-md border flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Line</TableHead>
                  {Array.from({ length: NoOfColumns }).map((_, index) => (
                    <TableHead key={index}>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {strategy.data.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell>{rowIndex + 1}</TableCell>
                    {Array.from({ length: NoOfColumns }).map((_, colIndex) => (
                      <TableCell key={colIndex}>{row[colIndex]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div> */}
    </div>
  )
}

export default TradeList