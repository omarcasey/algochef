"use client";

import { useState, useEffect } from "react";
import { useUser, useFirestore, useFirestoreCollectionData } from "reactfire";
import { collection, query, where, orderBy, Query, DocumentData, getDocs } from "firebase/firestore";
import Link from "next/link";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ComposedChart } from 'recharts';
import { TfiStatsUp } from "react-icons/tfi";
import { BsGraphDownArrow, BsBarChartFill } from "react-icons/bs";
import { IoStatsChartSharp, IoCalendarOutline } from "react-icons/io5";
import { Plus } from "lucide-react";
import numeral from "numeral";
import { useTheme } from "next-themes";

// Define type for strategy and trades
interface Strategy {
  id: string;
  name: string;
  createdAt: any;
  positionTypes: string;
  metrics: {
    netProfit: number;
    maxDrawdownAmount: number;
    returnToDrawdownRatio: number;
    totalTrades: number;
    initialCapital: number;
    winRate: number;
    profitFactor: number;
  };
}

interface Trade {
  id: string;
  netProfit: number;
  exitDate: any;
  order: number;
}

interface StrategyWithTrades extends Strategy {
  trades: Trade[];
  equityCurve: EquityPoint[];
}

interface EquityPoint {
  date: number;
  equity: number;
  tradeNumber?: number;
}

const Dashboard = () => {
  const { data: user, status } = useUser();
  const firestore = useFirestore();
  const [isLoading, setIsLoading] = useState(true);
  const [strategies, setStrategies] = useState<StrategyWithTrades[]>([]);
  const { theme } = useTheme();
  
  // Create a query to filter strategies by userId
  let strategiesQuery: Query<DocumentData> | null = null;
  
  if (user?.uid) {
    strategiesQuery = query(
      collection(firestore, "strategies"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
  }

  // Fetch strategies using Reactfire
  const { data: strategiesData, status: strategiesStatus } = useFirestoreCollectionData(
    strategiesQuery || query(collection(firestore, "strategies")), 
    { idField: "id" }
  );

  // Fetch trades for each strategy and build equity curves
  const fetchTradesForStrategies = async (strategies: Strategy[]) => {
    const strategiesWithTrades: StrategyWithTrades[] = [];
    
    for (const strategy of strategies) {
      // Query trades for this strategy
      const tradesQuery = query(
        collection(firestore, `strategies/${strategy.id}/trades`),
        orderBy("order")
      );
      
      try {
        const tradesSnapshot = await getDocs(tradesQuery);
        const trades = tradesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Trade));
        
        // Generate equity curve
        const equityCurve = generateEquityCurve(strategy, trades);
        
        strategiesWithTrades.push({
          ...strategy,
          trades,
          equityCurve
        });
      } catch (error) {
        console.error(`Error fetching trades for strategy ${strategy.id}:`, error);
        // Still add the strategy even if trades fetch fails
        strategiesWithTrades.push({
          ...strategy,
          trades: [],
          equityCurve: []
        });
      }
    }
    
    return strategiesWithTrades;
  };
  
  // Generate equity curve from trades
  const generateEquityCurve = (strategy: Strategy, trades: Trade[]): EquityPoint[] => {
    if (!trades || trades.length === 0) {
      return [];
    }
    
    let equity = strategy.metrics.initialCapital;
    const equityCurve: EquityPoint[] = [];
    
    // Add initial point
    if (trades[0]?.exitDate) {
      equityCurve.push({
        date: trades[0].exitDate.toDate().getTime(),
        equity: strategy.metrics.initialCapital
      });
    }
    
    // Add trade points
    trades.forEach((trade, index) => {
      equity += trade.netProfit;
      if (trade.exitDate) {
        equityCurve.push({
          date: trade.exitDate.toDate().getTime(),
          equity: equity,
          tradeNumber: index + 1,
        });
      }
    });
    
    return equityCurve.sort((a, b) => a.date - b.date);
  };

  // Update strategies state when data changes
  useEffect(() => {
    const loadStrategiesAndTrades = async () => {
      if (strategiesStatus === 'success' && user?.uid) {
        const baseStrategies = strategiesData as Strategy[];
        const strategiesWithTrades = await fetchTradesForStrategies(baseStrategies);
        setStrategies(strategiesWithTrades);
        setIsLoading(false);
      }
    };
    
    loadStrategiesAndTrades();
  }, [strategiesData, strategiesStatus, user, firestore]);
  
  // Calculate summary stats
  const getTotalProfit = () => {
    if (!strategies?.length) return 0;
    return strategies.reduce((sum, strategy) => sum + (strategy.metrics?.netProfit || 0), 0);
  };
  
  const getAverageDrawdown = () => {
    if (!strategies?.length) return 0;
    return strategies.reduce((sum, strategy) => sum + (strategy.metrics?.maxDrawdownAmount || 0), 0) / strategies.length;
  };
  
  const getAverageWinRate = () => {
    if (!strategies?.length) return 0;
    return strategies.reduce((sum, strategy) => sum + (strategy.metrics?.winRate || 0), 0) / strategies.length;
  };
  
  const getTotalTrades = () => {
    if (!strategies?.length) return 0;
    return strategies.reduce((sum, strategy) => sum + (strategy.metrics?.totalTrades || 0), 0);
  };

  // Generate chart data
  const getProfitByStrategy = () => {
    if (!strategies?.length) return [];
    return strategies.slice(0, 5).map(strategy => ({
      name: strategy.name,
      value: strategy.metrics?.netProfit || 0
    }));
  };

  const getPositionTypeData = () => {
    if (!strategies?.length) return [];
    
    const typeCounts = strategies.reduce((acc, strategy) => {
      const type = strategy.positionTypes || "Unknown";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(typeCounts).map(([name, value]) => ({ name, value }));
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return numeral(value).format('$0,0.00');
  };

  // Custom tooltip for equity charts
  const CustomTooltip = ({ active, payload, label, strategyName }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg">
          <p className="text-gray-700 dark:text-white text-xs font-medium">
            {new Date(label).toLocaleDateString()}
          </p>
          <div className="flex flex-row items-center mt-1">
            <div className="w-2 h-2 bg-blue-600 dark:bg-green-400 rounded-full mr-2" />
            <p className="text-blue-600 dark:text-green-400 text-xs font-semibold">
              {`${strategyName}: ${formatCurrency(payload[0].value)}`}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Loading state
  if (status === "loading" || strategiesStatus === "loading" || isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <LoadingSpinner size={45} />
      </div>
    );
  }

  // Not authenticated
  if (strategiesStatus === "success" && !user) {
    return (
      <div className="h-screen w-full flex items-center justify-center flex-col gap-4">
        <p>Please log in to view your dashboard</p>
        <Link href="/login">
          <Button>Login</Button>
        </Link>
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-end justify-between space-y-2 mb-6">
        <h2 className="text-3xl leading-5 font-bold tracking-tight">
          Dashboard
        </h2>
        <Link href="/app/strategies/import">
          <Button variant="outline">
            Add Strategy
            <Plus className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Net Profit
            </CardTitle>
            <IoStatsChartSharp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getTotalProfit() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(getTotalProfit())}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {strategies?.length || 0} strategies
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Drawdown
            </CardTitle>
            <BsGraphDownArrow className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(Math.abs(getAverageDrawdown()))}
            </div>
            <p className="text-xs text-muted-foreground">
              Average maximum drawdown
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Win Rate</CardTitle>
            <TfiStatsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {numeral(getAverageWinRate() / 100).format('0.0%')}
            </div>
            <p className="text-xs text-muted-foreground">
              Successful trades percentage
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Trades
            </CardTitle>
            <BsBarChartFill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalTrades()}</div>
            <p className="text-xs text-muted-foreground">
              Across all strategies
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Portfolio Overview</TabsTrigger>
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Bar chart for profit by strategy */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Net Profit by Strategy</CardTitle>
                <CardDescription>
                  Top {Math.min(5, strategies?.length || 0)} strategies by net profit
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getProfitByStrategy()}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Bar dataKey="value" fill="#8884d8" name="Net Profit">
                      {getProfitByStrategy().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.value >= 0 ? '#4ade80' : '#ef4444'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pie chart for strategy position types */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Strategy Types</CardTitle>
                <CardDescription>
                  Distribution by position type
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getPositionTypeData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      strokeWidth={theme === "dark" ? 0 : 1}
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      className="drop-shadow-xl"
                    >
                      {getPositionTypeData().map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                          opacity={theme === "dark" ? 0.9 : 0.8}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => value} 
                      contentStyle={{ 
                        backgroundColor: theme === "dark" ? "#1f2937" : "#fff",
                        borderRadius: "8px", 
                        border: theme === "dark" ? "1px solid #374151" : "1px solid #e5e7eb",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-4 pt-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {strategies && strategies.length > 0 ? (
              strategies.map((strategy) => (
                <Link href={`/app/strategies/${strategy.id}`} key={strategy.id}>
                  <Card className="cursor-pointer hover:border-blue-400 transition-all">
                    <CardHeader className="pb-2">
                      <CardTitle>{strategy.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <IoCalendarOutline size={12} />
                        {new Date(strategy.createdAt.toDate()).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Net Profit</p>
                          <p className={`text-sm font-semibold ${strategy.metrics?.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(strategy.metrics?.netProfit || 0)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Max Drawdown</p>
                          <p className="text-sm font-semibold text-red-600">
                            {formatCurrency(Math.abs(strategy.metrics?.maxDrawdownAmount || 0))}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Win Rate</p>
                          <p className="text-sm font-semibold">
                            {numeral((strategy.metrics?.winRate || 0) / 100).format('0.0%')}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Total Trades</p>
                          <p className="text-sm font-semibold">
                            {strategy.metrics?.totalTrades || 0}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4 h-32">
                        {strategy.equityCurve.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={strategy.equityCurve}>
                              <defs>
                                <linearGradient id={`colorGradient-${strategy.id}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop
                                    offset="5%"
                                    stopColor={theme === "dark" ? "#22c55e" : "#097EF2"}
                                    stopOpacity={0.8}
                                  />
                                  <stop
                                    offset="95%"
                                    stopColor={theme === "dark" ? "#22c55e" : "#097EF2"}
                                    stopOpacity={0}
                                  />
                                </linearGradient>
                              </defs>
                              <YAxis 
                                hide={true}
                                domain={['auto', 'auto']}
                              />
                              <XAxis 
                                dataKey="date"
                                type="number"
                                scale="time"
                                domain={['auto', 'auto']}
                                hide={true}
                              />
                              <Tooltip 
                                content={<CustomTooltip strategyName={strategy.name} />}
                              />
                              <Area
                                type="monotone"
                                dataKey="equity"
                                stroke={theme === "dark" ? "#22c55e" : "#097EF2"}
                                fillOpacity={1}
                                fill={`url(#colorGradient-${strategy.id})`}
                                strokeWidth={2}
                                dot={false}
                              />
                            </ComposedChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <p className="text-xs text-muted-foreground">No trade data available</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4">
                        <div className={`text-xs w-full font-medium px-2 py-1 rounded-md text-center ${
                          strategy.positionTypes?.toLowerCase() === "long"
                            ? "bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-300"
                            : strategy.positionTypes?.toLowerCase() === "short"
                            ? "bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-300"
                            : "bg-orange-200 dark:bg-orange-950 text-orange-800 dark:text-orange-400"
                        }`}>
                          {strategy.positionTypes ? strategy.positionTypes.charAt(0).toUpperCase() + strategy.positionTypes.slice(1) : "Both"}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No strategies found. Add your first strategy to get started.</p>
                <Link href="/app/strategies/import" className="mt-4 inline-block">
                  <Button>
                    Add Strategy
                    <Plus className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
