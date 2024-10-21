import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const InstrumentSelect = ({ instruments, selectedInstrument, setSelectedInstrument }) => {
  const [open, setOpen] = useState(false);

  // Separate system and non-system instruments
  const systemInstruments = instruments.filter((instrument) => instrument.userId === "system");
  const nonSystemInstruments = instruments.filter((instrument) => instrument.userId !== "system");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[14rem] justify-between"
        >
          {selectedInstrument
            ? "@" + instruments.find((instrument) => instrument.id === selectedInstrument)?.symbol
            : "Select instrument..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[14rem] p-0">
        <Command>
          <CommandInput placeholder="Search instrument..." />
          <CommandList>
            <CommandEmpty>No instrument found.</CommandEmpty>

            {/* Group for non-system instruments */}
            {nonSystemInstruments.length > 0 && (
              <CommandGroup heading="Custom Instruments">
                {nonSystemInstruments.map((instrument) => (
                  <CommandItem
                    key={instrument.id}
                    onSelect={() => {
                      setSelectedInstrument(instrument.id === selectedInstrument ? null : instrument.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedInstrument === instrument.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    @{instrument.symbol} - {instrument.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Group for system instruments */}
            {systemInstruments.length > 0 && (
              <CommandGroup heading="System Instruments">
                {systemInstruments.map((instrument) => (
                  <CommandItem
                    key={instrument.id}
                    onSelect={() => {
                      setSelectedInstrument(instrument.id === selectedInstrument ? null : instrument.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedInstrument === instrument.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    @{instrument.symbol} - {instrument.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default InstrumentSelect;
