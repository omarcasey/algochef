"use client";
import React, { useState, useEffect } from "react";
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
  deleteDoc,
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
  const router = useRouter();
  const firestore = useFirestore();

  const [selectedStrategies, setSelectedStrategies] = useState([]);
  const [minStrategies, setMinStrategies] = useState(5);
  const [maxStrategies, setMaxStrategies] = useState(7);
  const [rankingFunction, setRankingFunction] = useState("netProfit");
  const [isComputing, setIsComputing] = useState(false);
  const [generatedPortfolios, setGeneratedPortfolios] = useState([]);
  const [totalCapital, setTotalCapital] = useState(100000);
  const [computationProgress, setComputationProgress] = useState(0);
  const [savedPortfolios, setSavedPortfolios] = useState([]);

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

  const clearTemporaryPortfolios = async () => {
    try {
      const tempPortfoliosQuery = query(
        collection(firestore, "portfolios"),
        where("userId", "==", user.uid),
        where("temporary", "==", true)
      );
      const snapshots = await getDocs(tempPortfoliosQuery);
  
      // For each portfolio document
      await Promise.all(snapshots.docs.map(async (portfolioDoc) => {
        // First delete all trades in the subcollection
        const tradesQuery = query(
          collection(firestore, `portfolios/${portfolioDoc.id}/trades`)
        );
        const tradesSnapshot = await getDocs(tradesQuery);
        await Promise.all(
          tradesSnapshot.docs.map(tradeDoc => 
            deleteDoc(tradeDoc.ref)
          )
        );
  
        // Then delete the portfolio document itself
        await deleteDoc(portfolioDoc.ref);
      }));
    } catch (error) {
      console.error("Error clearing temporary portfolios:", error);
    }
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

  // First, update the generateCombinedTrades function to fetch trades first
  const generateCombinedTrades = async (strategyIds) => {
    // Fetch all trades for each strategy
    const allTradesByStrategy = await Promise.all(
      strategyIds.map(async (strategyId) => {
        const tradesQuery = query(
          collection(firestore, `strategies/${strategyId}/trades`),
          orderBy("exitDate", "asc")
        );
        const tradesSnapshot = await getDocs(tradesQuery);
        return tradesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      })
    );

    // Calculate equal allocations
    const equalAllocation = 1 / strategyIds.length;
    const allocations = new Array(strategyIds.length).fill(equalAllocation);

    // Combine trades with allocations
    let combinedTrades = [];
    allTradesByStrategy.forEach((strategyTrades, index) => {
      const allocation = allocations[index];
      const adjustedTrades = strategyTrades.map((trade) => ({
        ...trade,
        size: trade.size * allocation,
        netProfit: trade.netProfit * allocation,
      }));
      combinedTrades = combinedTrades.concat(adjustedTrades);
    });

    // Sort combined trades by exit date
    return combinedTrades.sort(
      (a, b) => a.exitDate.toMillis() - b.exitDate.toMillis()
    );
  };

  // Then update how it's used in savePortfolio
  const savePortfolio = async (portfolio, isPermanent = false) => {
    try {
      // First save the portfolio document
      const portfolioData = {
        ...portfolio,
        userId: user.uid,
        temporary: !isPermanent,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(
        collection(firestore, "portfolios"),
        portfolioData
      );

      // Then generate and save the combined trades
      const combinedTrades = await generateCombinedTrades(portfolio.strategies);

      // Save trades as a subcollection of the portfolio
      const tradesCollectionRef = collection(
        firestore,
        `portfolios/${docRef.id}/trades`
      );
      await Promise.all(
        combinedTrades.map((trade) => addDoc(tradesCollectionRef, trade))
      );

      return docRef.id;
    } catch (error) {
      console.error("Error saving portfolio:", error);
      return null;
    }
  };

  // Updated computation function
  const startComputation = async () => {
    setIsComputing(true);
    setComputationProgress(0);

    try {
      await clearTemporaryPortfolios();

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

      // After computation, save portfolios
      for (const portfolio of topPortfolios) {
        await savePortfolio(portfolio);
      }

      setGeneratedPortfolios(topPortfolios);
    } catch (error) {
      console.error("Error in portfolio computation:", error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsComputing(false);
      setComputationProgress(100);
    }
  };

  // Function to view a specific portfolio
  const viewPortfolio = (portfolioId) => {
    router.push(`/app/portfolios/${portfolioId}`); // Updated path
  };

  // Fetch saved portfolios on component mount
  useEffect(() => {
    const fetchSavedPortfolios = async () => {
      if (user) {
        const portfoliosQuery = query(
          collection(firestore, "strategies"),
          where("userId", "==", user.uid),
          where("type", "==", "portfolio"),
          orderBy("createdAt", "desc")
        );
        const portfoliosSnapshot = await getDocs(portfoliosQuery);
        setSavedPortfolios(
          portfoliosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      }
    };

    fetchSavedPortfolios();
  }, [user, firestore]);

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
          <h2 className="text-xl font-semibold mb-2">Scan Results</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Strategies</TableHead>
                <TableHead>Net Profit</TableHead>
                <TableHead>Annualized Return</TableHead>
                <TableHead>Sharpe Ratio</TableHead>
                <TableHead>Max Drawdown %</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {generatedPortfolios.map((portfolio) => (
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
                  <TableCell>${portfolio.netProfit.toLocaleString()}</TableCell>
                  <TableCell>
                    {portfolio.annualizedReturn.toFixed(2)}%
                  </TableCell>
                  <TableCell>{portfolio.sharpeRatio.toFixed(2)}</TableCell>
                  <TableCell>{portfolio.maxDrawdownPct.toFixed(2)}%</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => savePortfolio(portfolio, true)}
                      >
                        Save Permanently
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

      {/* Results */}
      {savedPortfolios.length > 0 && (
        <div className="w-full">
          <h2 className="text-xl font-semibold mb-2">Saved Portfolios</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Portfolio ID</TableHead>
                <TableHead>Strategies</TableHead>
                <TableHead>Net Profit</TableHead>
                <TableHead>Annualized Return</TableHead>
                <TableHead>Sharpe Ratio</TableHead>
                <TableHead>Max Drawdown %</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {savedPortfolios.map((portfolio) => (
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
                  <TableCell>
                    <Button onClick={() => viewPortfolio(portfolio.id)}>
                      View
                    </Button>
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
