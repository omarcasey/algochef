import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { ChevronRight, Search, Filter, CheckSquare, Square } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function StrategySelector({ strategies, selectedStrategies, onSelectionChange }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleStrategy = (strategyId) => {
    if (selectedStrategies.includes(strategyId)) {
      onSelectionChange(selectedStrategies.filter(id => id !== strategyId));
    } else {
      onSelectionChange([...selectedStrategies, strategyId]);
    }
  };

  const selectAll = () => {
    onSelectionChange(strategies.map(s => s.id));
    setIsDialogOpen(false);
  };

  const deselectAll = () => {
    onSelectionChange([]);
    setIsDialogOpen(false);
  };

  const filteredStrategies = strategies.filter(strategy => 
    strategy.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            Select Strategies
            <ChevronRight className="h-4 w-4 opacity-50" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Select Strategies</DialogTitle>
          </DialogHeader>
          
          <div className="relative">
            <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search strategies..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-8"
            />
          </div>
          
          <div className="flex justify-between my-2">
            <Button variant="ghost" size="sm" onClick={selectAll}>
              <CheckSquare className="h-4 w-4 mr-2" />
              Select All
            </Button>
            <Button variant="ghost" size="sm" onClick={deselectAll}>
              <Square className="h-4 w-4 mr-2" />
              Deselect All
            </Button>
          </div>
          
          <ScrollArea className="h-72 rounded-md border">
            <div className="p-2 space-y-1">
              {filteredStrategies.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No strategies found
                </div>
              ) : (
                filteredStrategies.map(strategy => (
                  <div
                    key={strategy.id}
                    className="flex items-center p-2 hover:bg-muted rounded-lg cursor-pointer"
                    onClick={() => toggleStrategy(strategy.id)}
                  >
                    <Checkbox
                      checked={selectedStrategies.includes(strategy.id)}
                      className="mr-2"
                      onCheckedChange={() => toggleStrategy(strategy.id)}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{strategy.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {strategy.description?.substring(0, 60)}
                        {strategy.description?.length > 60 ? "..." : ""}
                      </div>
                    </div>
                    <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-medium px-2 py-1 rounded-md text-xs">
                      Future
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      
      <div className="space-y-2">
        {selectedStrategies.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground border border-dashed rounded-md">
            No strategies selected
          </div>
        ) : (
          <ScrollArea className="h-72 rounded-md border">
            <div className="p-2 space-y-1">
              {selectedStrategies.map(strategyId => {
                const strategy = strategies.find(s => s.id === strategyId);
                if (!strategy) return null;
                
                return (
                  <div
                    key={strategy.id}
                    className="flex items-center p-2 hover:bg-muted rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{strategy.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {strategy.description?.substring(0, 60)}
                        {strategy.description?.length > 60 ? "..." : ""}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleStrategy(strategy.id)}
                    >
                      &times;
                    </Button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
} 