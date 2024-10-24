"use client";
import React, { useState, useEffect, useRef } from "react";
import { useUser } from "reactfire";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import {
  query,
  collection,
  where,
  orderBy,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  writeBatch,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/spinner";
import { calculateTradingMetrics } from "@/components/processing/dataProcessing";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

// Mini Equity Curve Component
const MiniEquityCurve = React.memo(({ trades, width = 120, height = 40 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!trades.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Calculate equity curve data
    const equityData = trades.reduce((acc, trade) => {
      const lastEquity = acc.length > 0 ? acc[acc.length - 1].equity : 0;
      return [...acc, { equity: lastEquity + trade.netProfit }];
    }, []);

    // Normalize data
    const minEquity = Math.min(...equityData.map((d) => d.equity));
    const maxEquity = Math.max(...equityData.map((d) => d.equity));
    const range = maxEquity - minEquity || 1;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw line
    ctx.beginPath();
    ctx.strokeStyle =
      equityData[equityData.length - 1]?.equity > 0 ? "#22c55e" : "#ef4444";
    ctx.lineWidth = 1.5;

    equityData.forEach((point, i) => {
      const x = (i / (equityData.length - 1)) * width;
      const y = height - ((point.equity - minEquity) / range) * height;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  }, [trades, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-[120px] h-[40px]"
    />
  );
});

const StrategySelectionModal = ({
  strategies,
  selectedStrategies,
  onSelectionChange,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Select Strategies ({selectedStrategies.length} selected)
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Strategies</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="flex justify-end mb-4 space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectionChange([])}
            >
              Deselect All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectionChange(strategies.map((s) => s.id))}
            >
              Select All
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Select</TableHead>
                <TableHead>Strategy Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {strategies.map((strategy) => (
                <TableRow key={strategy.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedStrategies.includes(strategy.id)}
                      onCheckedChange={() => {
                        const newSelection = selectedStrategies.includes(
                          strategy.id
                        )
                          ? selectedStrategies.filter(
                              (id) => id !== strategy.id
                            )
                          : [...selectedStrategies, strategy.id];
                        onSelectionChange(newSelection);
                      }}
                    />
                  </TableCell>
                  <TableCell>{strategy.name}</TableCell>
                  <TableCell>
                    <div className="bg-purple-200 dark:bg-purple-950 text-purple-800 dark:text-purple-400 font-medium px-2 py-1.5 rounded-md text-xs w-16 flex items-center justify-center">
                      Future
                    </div>
                  </TableCell>
                  <TableCell>
                    {strategy.createdAt?.toDate().toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PortfolioBuilder = () => {
  const { data: user, status } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const [selectedStrategies, setSelectedStrategies] = useState([]);
  const [minStrategies, setMinStrategies] = useState(3);
  const [maxStrategies, setMaxStrategies] = useState(3);
  const [rankingFunction, setRankingFunction] = useState("netProfit");
  const [isComputing, setIsComputing] = useState(false);
  const [totalCapital, setTotalCapital] = useState(100000);
  const [computationProgress, setComputationProgress] = useState(0);
  const [maxStoredPortfolios, setMaxStoredPortfolios] = useState(50);
  const [rankedPortfolios, setRankedPortfolios] = useState([]);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalCombinations, setTotalCombinations] = useState(0);

  // Query to fetch user's strategies
  const strategiesQuery = query(
    collection(firestore, "strategies"),
    where("userId", "==", user ? user.uid : ""),
    orderBy("createdAt", "desc")
  );

  // Fetch strategies using Reactfire
  const { data: strategies, status: strategiesStatus } =
    useFirestoreCollectionData(strategiesQuery, { idField: "id" });

  // Initialize selected strategies when strategies are loaded
  useEffect(() => {
    if (strategies && strategies.length > 0) {
      setSelectedStrategies(strategies.map((strategy) => strategy.id));
    }
  }, [strategies]);

  // Helper function to insert portfolio in sorted order
  const insertPortfolioInRankedList = (
    newPortfolio,
    currentList,
    rankingKey,
    maxSize
  ) => {
    const updatedList = [...currentList];

    const insertIndex = updatedList.findIndex(
      (portfolio) => portfolio[rankingKey] < newPortfolio[rankingKey]
    );

    if (insertIndex === -1) {
      if (updatedList.length >= maxSize) {
        return updatedList;
      }
      updatedList.push(newPortfolio);
    } else {
      updatedList.splice(insertIndex, 0, newPortfolio);
      if (updatedList.length > maxSize) {
        updatedList.pop();
      }
    }

    return updatedList;
  };

  const generateCombinedTrades = (selectedStrategiesData, allocations) => {
    let combinedTrades = [];

    // First combine all trades with their allocations
    selectedStrategiesData.forEach((strategy, index) => {
      const allocation = allocations[index];
      const adjustedTrades = strategy.trades.map((trade) => ({
        ...trade,
        size: trade.size * allocation,
        netProfit: trade.netProfit * allocation,
        originalStrategy: strategy.id, // Optionally keep track of which strategy it came from
      }));
      combinedTrades = combinedTrades.concat(adjustedTrades);
    });

    // Sort by exit date
    combinedTrades.sort((a, b) => new Date(a.exitDate) - new Date(b.exitDate));

    // Reassign order numbers sequentially
    return combinedTrades.map((trade, index) => ({
      ...trade,
      order: index + 1, // If you want to start from 1 instead of 0
    }));
  };

  // Function to calculate total combinations
  const calculateCombinations = () => {
    const n = selectedStrategies.length;
    let total = 0;
    for (let r = minStrategies; r <= maxStrategies; r++) {
      total += combination(n, r);
    }
    return Math.round(total);
  };

  // Helper function for combination calculation
  const combination = (n, r) => {
    if (r > n) return 0;
    if (r === 0 || r === n) return 1;
    return factorial(n) / (factorial(r) * factorial(n - r));
  };

  // Helper function for factorial calculation
  const factorial = (num) => {
    let result = 1;
    for (let i = 2; i <= num; i++) {
      result *= i;
    }
    return result;
  };

  // Function to generate combinations
  const generateCombinations = (arr, min, max) => {
    const result = [];
    const f = (prefix, arr, k) => {
      if (k === 0) {
        result.push(prefix);
        return;
      }
      for (let i = 0; i < arr.length; i++) {
        f([...prefix, arr[i]], arr.slice(i + 1), k - 1);
      }
    };
    for (let k = min; k <= max; k++) {
      f([], arr, k);
    }
    return result;
  };

  const startComputation = async () => {
    setIsComputing(true);
    setComputationProgress(0);
    setProcessedCount(0);
    setRankedPortfolios([]);

    try {
      const combinations = generateCombinations(
        selectedStrategies,
        minStrategies,
        maxStrategies
      );

      setTotalCombinations(combinations.length);

      // Fetch all trades for selected strategies at once
      const strategiesWithTrades = await Promise.all(
        selectedStrategies.map(async (strategyId) => {
          const strategy = strategies.find((s) => s.id === strategyId);
          const tradesQuery = query(
            collection(firestore, `strategies/${strategyId}/trades`),
            orderBy("exitDate", "asc")
          );
          const tradesSnapshot = await getDocs(tradesQuery);
          const trades = tradesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          return { ...strategy, trades };
        })
      );

      // Process combinations one by one
      for (let i = 0; i < combinations.length; i++) {
        const combination = combinations[i];

        const selectedStrategiesData = strategiesWithTrades.filter((strategy) =>
          combination.includes(strategy.id)
        );

        const equalAllocation = 1 / combination.length;
        const allocations = new Array(combination.length).fill(equalAllocation);

        const combinedTrades = generateCombinedTrades(
          selectedStrategiesData,
          allocations
        );

        const portfolioMetrics = calculateTradingMetrics(
          combinedTrades,
          totalCapital
        );

        const portfolio = {
          id: crypto.randomUUID(),
          strategies: combination,
          strategyNames: selectedStrategiesData.map((s) => s.name),
          trades: combinedTrades,
          metrics: portfolioMetrics,
        };

        setRankedPortfolios((currentRanked) =>
          insertPortfolioInRankedList(
            portfolio,
            currentRanked,
            rankingFunction,
            maxStoredPortfolios
          )
        );

        setProcessedCount(i + 1);
        setComputationProgress(((i + 1) / combinations.length) * 100);

        // Save to localStorage periodically
        if ((i + 1) % 10 === 0 || i === combinations.length - 1) {
          saveToLocalStorage();
        }
      }
    } catch (error) {
      console.error("Error in portfolio computation:", error);
    } finally {
      setIsComputing(false);
      setComputationProgress(100);
      saveToLocalStorage();
    }
  };

  const saveToLocalStorage = () => {
    try {
      localStorage.setItem(
        "portfolioResults",
        JSON.stringify(rankedPortfolios)
      );
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  // Modified save portfolio function
  const savePortfolio = async (portfolio) => {
    try {
      // Create a write batch
      const batch = writeBatch(firestore);

      // Create the main portfolio document reference
      const portfolioRef = doc(collection(firestore, "portfolios"));

      // Prepare the portfolio data without the trades array
      const { trades, ...portfolioData } = portfolio;
      const portfolioDoc = {
        ...portfolioData,
        userId: user.uid,
        createdAt: serverTimestamp(),
        name: portfolioData.id,
      };

      // Set the main portfolio document
      batch.set(portfolioRef, portfolioDoc);

      // Create a trades subcollection and add each trade as a separate document
      trades.forEach((trade) => {
        const tradeRef = doc(collection(portfolioRef, "trades"));
        batch.set(tradeRef, {
          ...trade,
        });
      });

      // Commit the batch
      await batch.commit();

      // Return the portfolio ID
      return portfolioRef.id;
    } catch (error) {
      console.error("Error saving portfolio:", error);
      throw error;
    }
  };

  // Function to view a specific portfolio
  const viewPortfolio = (portfolioId) => {
    router.push(`/app/portfolios/${portfolioId}`);
  };

  const clearResults = () => {
    setRankedPortfolios([]);
    localStorage.removeItem("portfolioResults");
    setComputationProgress(0);
    setProcessedCount(0);
  };

  // Load saved results from localStorage on mount
  useEffect(() => {
    const savedResults = localStorage.getItem("portfolioResults");
    if (savedResults) {
      const parsed = JSON.parse(savedResults);
      setRankedPortfolios(parsed);
    }
  }, []);

  if (status === "loading" || strategiesStatus === "loading") {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <LoadingSpinner size={45} />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      <h1 className="text-2xl font-bold w-full">
        Portfolio Master Automatic Builder
      </h1>

      {/* Step 1: Choose strategies */}
      <div className="w-full">
        <h2 className="text-xl font-semibold mb-2">
          Step 1: Choose Strategies
        </h2>
        <StrategySelectionModal
          strategies={strategies || []}
          selectedStrategies={selectedStrategies}
          onSelectionChange={setSelectedStrategies}
        />
        <p className="mt-2">Selected strategies: {selectedStrategies.length}</p>
        <p>Total combinations to test: {calculateCombinations()}</p>
      </div>

      {/* Step 2: Configure Automatic Builder */}
      <div className="w-full">
        <h2 className="text-xl font-semibold mb-2">
          Step 2: Configure Automatic Builder
        </h2>
        <div className="flex space-x-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Min Strategies:
            </label>
            <Input
              type="number"
              value={minStrategies}
              onChange={(e) => setMinStrategies(Number(e.target.value))}
              min={1}
              max={selectedStrategies.length}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Max Strategies:
            </label>
            <Input
              type="number"
              value={maxStrategies}
              onChange={(e) => setMaxStrategies(Number(e.target.value))}
              min={minStrategies}
              max={selectedStrategies.length}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Total Capital:
            </label>
            <Input
              type="number"
              value={totalCapital}
              onChange={(e) => setTotalCapital(Number(e.target.value))}
              min={1}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Maximum Portfolios to Store:
            </label>
            <Input
              type="number"
              value={maxStoredPortfolios}
              onChange={(e) => setMaxStoredPortfolios(Number(e.target.value))}
              min={1}
              max={1000}
            />
            <p className="text-sm text-gray-500 mt-1">
              Only the top {maxStoredPortfolios} portfolios will be stored and
              displayed
            </p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Ranking Function:
          </label>
          <Select value={rankingFunction} onValueChange={setRankingFunction}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select ranking function" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="netProfit">Net Profit</SelectItem>
              <SelectItem value="annualizedReturn">
                Annualized Return
              </SelectItem>
              <SelectItem value="sharpeRatio">Sharpe Ratio</SelectItem>
              <SelectItem value="maxDrawdownPct">Max Drawdown %</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Step 3: Start Builder */}
      <div className="w-full">
        <h2 className="text-xl font-semibold mb-2">Step 3: Start Builder</h2>
        <Button
          onClick={startComputation}
          disabled={isComputing || selectedStrategies.length === 0}
          className="w-full"
        >
          {isComputing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Computing...
            </>
          ) : (
            "Start Portfolio Generation"
          )}
        </Button>
        {isComputing && (
          <div className="mt-4">
            <Progress value={computationProgress} className="w-full" />
            <p className="text-sm text-center mt-2">
              {processedCount} of {totalCombinations} combinations processed (
              {Math.round(computationProgress)}%)
            </p>
          </div>
        )}
      </div>

      {/* Results */}
      {(rankedPortfolios.length > 0 || isComputing) && (
        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Top Performing Portfolios{" "}
              {isComputing
                ? `(Processing ${processedCount} of ${totalCombinations})`
                : ""}
            </h2>
            <Button
              variant="destructive"
              onClick={clearResults}
              disabled={isComputing}
            >
              Clear Results
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Strategies</TableHead>
                <TableHead>Equity Curve</TableHead>
                <TableHead>Total Trades</TableHead>
                <TableHead>Net Profit</TableHead>
                <TableHead>Annualized Return</TableHead>
                <TableHead>Sharpe Ratio</TableHead>
                <TableHead>Max Drawdown %</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankedPortfolios.map((portfolio) => (
                <TableRow key={portfolio.id}>
                  <TableCell>
                    {portfolio.name || `Portfolio ${portfolio.id}`}
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help underline dotted">
                            {portfolio.strategies.length} strategies
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <ul>
                            {portfolio.strategyNames.map((name, index) => (
                              <li key={index}>{name}</li>
                            ))}
                          </ul>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="px-4">
                    <MiniEquityCurve trades={portfolio.trades} />
                  </TableCell>
                  <TableCell>{portfolio.metrics.totalTrades}</TableCell>
                  <TableCell>
                    ${portfolio.metrics.netProfit.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {portfolio.metrics.annualizedReturn.toFixed(2)}%
                  </TableCell>
                  <TableCell>
                    {portfolio.metrics.sharpeRatio.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {portfolio.metrics.maxDrawdownPct.toFixed(2)}%
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          try {
                            await savePortfolio(portfolio);
                            // Optionally show success message
                            toast({
                              title: "Portfolio saved successfully",
                              description:
                                "You can find it in your saved portfolios",
                            });
                          } catch (error) {
                            // Handle error
                            toast({
                              title: "Error saving portfolio",
                              description: error.message,
                              variant: "destructive",
                            });
                          }
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => viewPortfolio(portfolio.id)}
                      >
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default PortfolioBuilder;
