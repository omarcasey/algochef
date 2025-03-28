import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  AlertCircle, 
  CheckCircle, 
  Loader2, 
  RefreshCw, 
  Save, 
  Eye, 
  BarChart4 
} from "lucide-react";
import { MiniEquityCurve } from "@/components/charts/mini-equity-curve";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EmptyPlaceholder } from "@/components/ui/empty-placeholder";

export function BuilderResults({ 
  results, 
  status, 
  isProcessing, 
  onViewPortfolio, 
  onSavePortfolio, 
  onClear 
}) {
  const getStatusDisplay = () => {
    if (status === "processing" || isProcessing) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="flex items-center space-x-4 mb-4">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <div>
              <h3 className="text-lg font-semibold">Processing Portfolio Combinations</h3>
              <p className="text-muted-foreground">
                This calculation is running in the cloud and may take several minutes
              </p>
            </div>
          </div>
          <Progress value={45} className="w-full max-w-md" />
          <p className="text-sm text-muted-foreground mt-2">
            When complete, your results will appear here
          </p>
        </div>
      );
    }
    
    if (status === "failed") {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold">Calculation Failed</h3>
          <p className="text-muted-foreground mb-4">
            There was an error processing your portfolio combinations
          </p>
          <Button onClick={onClear}>Try Again</Button>
        </div>
      );
    }
    
    if (status === "completed" && results.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-lg font-semibold">No Viable Portfolios Found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your criteria or selecting different strategies
          </p>
          <Button onClick={onClear}>Start Over</Button>
        </div>
      );
    }
    
    if (!status && results.length === 0) {
      return (
        <EmptyPlaceholder
          icon={BarChart4}
          title="No Results Yet"
          description="Configure your portfolio builder and start processing to see results"
        />
      );
    }
    
    return null;
  };

  const statusDisplay = getStatusDisplay();
  
  if (statusDisplay) {
    return statusDisplay;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Portfolio Results</h3>
          <p className="text-muted-foreground">
            Found {results.length} optimal portfolio combinations
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={onClear}>
            <RefreshCw className="h-4 w-4 mr-2" />
            New Search
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Portfolio</TableHead>
              <TableHead className="hidden md:table-cell">Performance</TableHead>
              <TableHead className="text-right">Net Profit</TableHead>
              <TableHead className="text-right hidden lg:table-cell">Annual Return</TableHead>
              <TableHead className="text-right hidden lg:table-cell">Sharpe</TableHead>
              <TableHead className="text-right hidden lg:table-cell">Max DD</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((portfolio, index) => (
              <TableRow key={portfolio.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-2">
                        <Badge>{portfolio.strategies.length} strategies</Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <ul className="list-disc pl-4 space-y-1">
                          {portfolio.strategyNames.map((name, i) => (
                            <li key={i}>{name}</li>
                          ))}
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <MiniEquityCurve trades={portfolio.trades} />
                </TableCell>
                <TableCell className="text-right font-medium">
                  ${portfolio.netProfit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </TableCell>
                <TableCell className="text-right hidden lg:table-cell">
                  {portfolio.annualizedReturn?.toFixed(2)}%
                </TableCell>
                <TableCell className="text-right hidden lg:table-cell">
                  {portfolio.sharpeRatio?.toFixed(2)}
                </TableCell>
                <TableCell className="text-right hidden lg:table-cell">
                  {portfolio.maxDrawdownPct?.toFixed(2)}%
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onSavePortfolio(portfolio)}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onViewPortfolio(portfolio.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 