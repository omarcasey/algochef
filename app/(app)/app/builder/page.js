"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "reactfire";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { query, collection, where, orderBy, getDocs } from "firebase/firestore";
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
import { Progress } from "@/components/ui/progress"; // Import the Progress component
import { Loader2 } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/spinner";
import {
  combineStrategyTrades,
  calculateTradingMetrics,
  calculatePortfolioMetrics,
} from "@/components/processing/dataProcessing";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PortfolioBuilder = () => {
  const { data: user, status } = useUser();
  const firestore = useFirestore();

  const [selectedStrategies, setSelectedStrategies] = useState([]);
  const [minStrategies, setMinStrategies] = useState(5);
  const [maxStrategies, setMaxStrategies] = useState(7);
  const [rankingFunction, setRankingFunction] = useState("netProfit");
  const [isComputing, setIsComputing] = useState(false);
  const [generatedPortfolios, setGeneratedPortfolios] = useState([]);
  const [totalCapital, setTotalCapital] = useState(100000);
  const [computationProgress, setComputationProgress] = useState(0);

  // Query to fetch user's strategies
  const strategiesQuery = query(
    collection(firestore, "strategies"),
    where("userId", "==", user ? user.uid : ""),
    orderBy("createdAt", "desc")
  );

  // Fetch strategies using Reactfire
  const { data: strategies, status: strategiesStatus } =
    useFirestoreCollectionData(strategiesQuery, { idField: "id" });

  // Function to fetch trades for a strategy
  const fetchTradesForStrategy = async (strategyId) => {
    const tradesQuery = query(
      collection(firestore, `strategies/${strategyId}/trades`),
      orderBy("exitDate", "asc")
    );
    const tradesSnapshot = await getDocs(tradesQuery);
    return tradesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  // Function to toggle strategy selection
  const toggleStrategySelection = (strategyId) => {
    setSelectedStrategies((prev) =>
      prev.includes(strategyId)
        ? prev.filter((id) => id !== strategyId)
        : [...prev, strategyId]
    );
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

  // Helper function for factorial calculation (iterative version)
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

  // Updated computation function
  const startComputation = async () => {
    setIsComputing(true);
    setComputationProgress(0);

    try {
      // Generate all possible combinations
      const combinations = generateCombinations(
        selectedStrategies,
        minStrategies,
        maxStrategies
      );

      // Fetch trades for all selected strategies
      const strategiesWithTrades = await Promise.all(
        selectedStrategies.map(async (strategyId) => {
          const strategy = strategies.find((s) => s.id === strategyId);
          const trades = await fetchTradesForStrategy(strategyId);
          return { ...strategy, trades };
        })
      );

      // Calculate performance for each combination
      const portfolios = [];
      for (let i = 0; i < combinations.length; i++) {
        const combination = combinations[i];
        const selectedStrategiesData = strategiesWithTrades.filter((strategy) =>
          combination.includes(strategy.id)
        );
        const equalAllocation = 1 / combination.length;
        const allocations = new Array(combination.length).fill(equalAllocation);

        // Combine trades from all strategies in the combination
        const combinedTrades = combineStrategyTrades(
          selectedStrategiesData,
          allocations,
          totalCapital
        );

        // Calculate portfolio metrics based on combined trades
        const portfolioMetrics = calculateTradingMetrics(
          combinedTrades,
          totalCapital
        );

        portfolios.push({
          id: i + 1,
          strategies: combination,
          strategyNames: selectedStrategiesData.map((s) => s.name),
          ...portfolioMetrics,
        });

        // Update progress
        setComputationProgress(((i + 1) / combinations.length) * 100);
      }

      // Sort portfolios based on ranking function
      portfolios.sort((a, b) => b[rankingFunction] - a[rankingFunction]);

      // Take top 10 portfolios
      const topPortfolios = portfolios.slice(0, 10);

      setGeneratedPortfolios(topPortfolios);
    } catch (error) {
      console.error("Error in portfolio computation:", error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsComputing(false);
      setComputationProgress(100);
    }
  };

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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Select</TableHead>
              <TableHead>Strategy Name</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {strategies.map((strategy) => (
              <TableRow key={strategy.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedStrategies.includes(strategy.id)}
                    onCheckedChange={() => toggleStrategySelection(strategy.id)}
                  />
                </TableCell>
                <TableCell>{strategy.name}</TableCell>
                <TableCell>
                  <div className="bg-purple-200 dark:bg-purple-950 text-purple-800 dark:text-purple-400 font-medium px-2 py-1.5 rounded-md text-xs w-16 flex items-center justify-center">
                    Future
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
            <label>Min Strategies:</label>
            <Input
              type="number"
              value={minStrategies}
              onChange={(e) => setMinStrategies(Number(e.target.value))}
              min={1}
              max={selectedStrategies.length}
            />
          </div>
          <div>
            <label>Max Strategies:</label>
            <Input
              type="number"
              value={maxStrategies}
              onChange={(e) => setMaxStrategies(Number(e.target.value))}
              min={minStrategies}
              max={selectedStrategies.length}
            />
          </div>
          <div>
            <label>Total Capital:</label>
            <Input
              type="number"
              value={totalCapital}
              onChange={(e) => setTotalCapital(Number(e.target.value))}
              min={1}
            />
          </div>
        </div>
        <div>
          <label>Ranking Function:</label>
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
        >
          {isComputing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Computing...
            </>
          ) : (
            "Compute"
          )}
        </Button>
        {isComputing && (
          <div className="mt-4">
            <Progress value={computationProgress} className="w-full" />
            <p className="text-sm text-center mt-2">
              {Math.round(computationProgress)}% Complete
            </p>
          </div>
        )}
      </div>

      {/* Results */}
      {generatedPortfolios.length > 0 && (
        <div className="w-full">
          <h2 className="text-xl font-semibold mb-2">
            Top Generated Portfolios
          </h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Portfolio ID</TableHead>
                <TableHead>Strategies</TableHead>
                <TableHead>Net Profit</TableHead>
                <TableHead>Annualized Return</TableHead>
                <TableHead>Sharpe Ratio</TableHead>
                <TableHead>Max Drawdown %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {generatedPortfolios.map((portfolio) => (
                <TableRow key={portfolio.id}>
                  <TableCell>{portfolio.id}</TableCell>
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
                  <TableCell>${portfolio.netProfit.toLocaleString()}</TableCell>
                  <TableCell>
                    {portfolio.annualizedReturn.toFixed(2)}%
                  </TableCell>
                  <TableCell>{portfolio.sharpeRatio.toFixed(2)}</TableCell>
                  <TableCell>{portfolio.maxDrawdownPct.toFixed(2)}%</TableCell>
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
