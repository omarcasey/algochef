"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Button } from "@/components/ui/button";
import { StrategyIcon } from "@/components/ui/strategy-icon";

// Mock data for all strategies
const strategies = [
  {
    id: "trend-following",
    name: "Trend Following",
    description: "Captures market momentum by following established price trends across multiple timeframes.",
    longDescription: "Trend Following is a systematic trading strategy that aims to capture profits from extended market movements in either direction. This strategy analyzes price action across multiple timeframes to identify and capitalize on established trends, entering positions in the direction of the prevailing market momentum and exiting when the trend shows signs of reversal.",
    color: "bg-blue-500",
    badges: ["Momentum", "Technical", "Multi-timeframe"],
    keyPoints: [
      "Follows established market trends",
      "Uses multiple technical indicators for confirmation",
      "Adaptive position sizing based on volatility"
    ],
    allocations: [
      { name: "Large Cap US Equities", value: 35 },
      { name: "Technology Sector", value: 25 },
      { name: "Commodities", value: 15 },
      { name: "Forex Majors", value: 15 },
      { name: "Crypto (BTC/ETH)", value: 10 }
    ],
    monthlyPerformance: [
      { name: "Jan", return: 2.4 },
      { name: "Feb", return: -1.2 },
      { name: "Mar", return: 3.5 },
      { name: "Apr", return: 1.8 },
      { name: "May", return: 0.9 },
      { name: "Jun", return: -0.7 },
      { name: "Jul", return: 4.2 },
      { name: "Aug", return: 2.1 },
      { name: "Sep", return: -1.5 },
      { name: "Oct", return: 3.8 },
      { name: "Nov", return: 2.2 },
      { name: "Dec", return: 1.6 },
    ],
    yearlyPerformance: [
      { name: '2019', return: 18.5 },
      { name: '2020', return: 22.3 },
      { name: '2021', return: 31.7 },
      { name: '2022', return: -12.4 },
      { name: '2023', return: 19.8 },
    ],
    riskMetrics: {
      sharpeRatio: 1.82,
      maxDrawdown: -14.5,
      annualVolatility: 12.6,
      winRate: 67,
      avgWin: 2.8,
      avgLoss: -1.2,
    }
  },
  {
    id: "mean-reversion",
    name: "Mean Reversion",
    description: "Identifies and capitalizes on price deviations from historical averages, assuming reversion to the mean.",
    longDescription: "The Mean Reversion strategy is built on the principle that asset prices tend to revert to their historical average over time. This approach identifies securities that have significantly deviated from their statistical norms and takes contrarian positions, anticipating a return to equilibrium prices. The strategy employs statistical models to determine overbought and oversold conditions.",
    color: "bg-green-500",
    badges: ["Statistical", "Counter-trend", "Short-term"],
    keyPoints: [
      "Capitalizes on statistical price anomalies",
      "Uses Bollinger Bands and RSI divergences",
      "Dynamic entry and exit triggers"
    ],
    allocations: [
      { name: "S&P 500 Stocks", value: 30 },
      { name: "Bond ETFs", value: 25 },
      { name: "Volatility Products", value: 15 },
      { name: "Currency Pairs", value: 20 },
      { name: "Commodities", value: 10 }
    ],
    monthlyPerformance: [
      { name: "Jan", return: 1.6 },
      { name: "Feb", return: 2.4 },
      { name: "Mar", return: -0.8 },
      { name: "Apr", return: 2.1 },
      { name: "May", return: 3.2 },
      { name: "Jun", return: 1.5 },
      { name: "Jul", return: -1.2 },
      { name: "Aug", return: 2.7 },
      { name: "Sep", return: 1.9 },
      { name: "Oct", return: -0.5 },
      { name: "Nov", return: 2.4 },
      { name: "Dec", return: 3.1 },
    ],
    yearlyPerformance: [
      { name: '2019', return: 14.2 },
      { name: '2020', return: 18.9 },
      { name: '2021', return: 12.7 },
      { name: '2022', return: 8.4 },
      { name: '2023', return: 16.3 },
    ],
    riskMetrics: {
      sharpeRatio: 1.63,
      maxDrawdown: -9.8,
      annualVolatility: 8.7,
      winRate: 72,
      avgWin: 1.9,
      avgLoss: -1.0,
    }
  },
  {
    id: "breakout",
    name: "Breakout",
    description: "Targets price movements beyond key support and resistance levels after periods of consolidation.",
    longDescription: "The Breakout strategy focuses on identifying assets that are poised to move significantly after breaking through established support or resistance levels. This approach is particularly effective during periods of low volatility followed by market expansion. The strategy employs volume analysis and momentum indicators to confirm legitimate breakouts and filter out false signals.",
    color: "bg-purple-500",
    badges: ["Momentum", "Volatility", "Technical"],
    keyPoints: [
      "Capitalizes on range breakouts",
      "Volume-confirmed entry signals",
      "Trailing stop methodology"
    ],
    allocations: [
      { name: "Growth Stocks", value: 40 },
      { name: "Sector ETFs", value: 20 },
      { name: "Index Futures", value: 15 },
      { name: "Cryptocurrency", value: 15 },
      { name: "Emerging Markets", value: 10 }
    ],
    monthlyPerformance: [
      { name: "Jan", return: 3.8 },
      { name: "Feb", return: -2.1 },
      { name: "Mar", return: 5.2 },
      { name: "Apr", return: 0.9 },
      { name: "May", return: 2.4 },
      { name: "Jun", return: -1.7 },
      { name: "Jul", return: 6.1 },
      { name: "Aug", return: 2.8 },
      { name: "Sep", return: -0.5 },
      { name: "Oct", return: 4.2 },
      { name: "Nov", return: 3.6 },
      { name: "Dec", return: 2.1 },
    ],
    yearlyPerformance: [
      { name: '2019', return: 22.7 },
      { name: '2020', return: 31.5 },
      { name: '2021', return: 42.3 },
      { name: '2022', return: -18.9 },
      { name: '2023', return: 26.4 },
    ],
    riskMetrics: {
      sharpeRatio: 1.75,
      maxDrawdown: -21.3,
      annualVolatility: 18.2,
      winRate: 58,
      avgWin: 4.3,
      avgLoss: -1.8,
    }
  },
  {
    id: "ai-adaptive",
    name: "AI Adaptive",
    description: "Leverages machine learning to analyze market conditions and adapt trading parameters in real-time.",
    longDescription: "The AI Adaptive strategy represents the cutting edge of algorithmic trading, utilizing advanced machine learning models to continuously analyze market conditions and optimize trading parameters. This approach can identify complex patterns across multiple data sources, including price action, economic indicators, sentiment analysis, and alternative data. The strategy adapts in real-time to changing market environments.",
    color: "bg-amber-500",
    badges: ["Machine Learning", "Adaptive", "Multi-strategy"],
    keyPoints: [
      "Self-optimizing parameters",
      "Multi-factor analysis",
      "Regime-switching capabilities"
    ],
    allocations: [
      { name: "Technology", value: 35 },
      { name: "Healthcare", value: 20 },
      { name: "Financial Services", value: 15 },
      { name: "Consumer Discretionary", value: 15 },
      { name: "Energy & Utilities", value: 15 }
    ],
    monthlyPerformance: [
      { name: "Jan", return: 3.2 },
      { name: "Feb", return: 2.8 },
      { name: "Mar", return: -1.5 },
      { name: "Apr", return: 4.1 },
      { name: "May", return: 1.9 },
      { name: "Jun", return: 2.7 },
      { name: "Jul", return: 3.8 },
      { name: "Aug", return: -0.9 },
      { name: "Sep", return: 2.4 },
      { name: "Oct", return: 3.6 },
      { name: "Nov", return: 1.7 },
      { name: "Dec", return: 3.1 },
    ],
    yearlyPerformance: [
      { name: '2019', return: 19.8 },
      { name: '2020', return: 27.6 },
      { name: '2021', return: 34.2 },
      { name: '2022', return: -5.7 },
      { name: '2023', return: 28.9 },
    ],
    riskMetrics: {
      sharpeRatio: 2.14,
      maxDrawdown: -11.2,
      annualVolatility: 14.3,
      winRate: 73,
      avgWin: 2.7,
      avgLoss: -1.3,
    }
  },
];

// Current signal mock data (placeholder)
const mockSignals = [
  { asset: "AAPL", direction: "BUY", price: "$187.42", confidence: "High", timestamp: "2 hours ago" },
  { asset: "MSFT", direction: "BUY", price: "$410.13", confidence: "Medium", timestamp: "4 hours ago" },
  { asset: "TSLA", direction: "SELL", price: "$255.86", confidence: "High", timestamp: "1 day ago" },
  { asset: "GOOGL", direction: "HOLD", price: "$162.75", confidence: "Low", timestamp: "5 hours ago" },
  { asset: "AMZN", direction: "BUY", price: "$179.22", confidence: "High", timestamp: "3 hours ago" },
];

export default function StrategyDetail() {
  const params = useParams();
  const [strategy, setStrategy] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real application, this would be an API call
    const strategyId = params?.strategyId as string;
    const foundStrategy = strategies.find((s) => s.id === strategyId);
    
    if (foundStrategy) {
      setStrategy(foundStrategy);
    }
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [params]);

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-8 pb-16">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse w-10 h-10"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 animate-pulse rounded w-48"></div>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded w-full max-w-md"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded w-3/4"></div>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  if (!strategy) {
    return <div className="text-center py-12">Strategy not found</div>;
  }

  return (
    <div className="flex flex-col space-y-8 pb-16">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-3">
          <div className={cn("p-2 rounded-full", strategy.color)}>
            <StrategyIcon name={strategy.id as any} className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold">{strategy.name}</h1>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {strategy.badges.map((badge: string) => (
            <Badge key={badge} variant="secondary">
              {badge}
            </Badge>
          ))}
        </div>
        
        <div className="mt-6 mb-4 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
          <div className="relative h-[200px] w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex items-center justify-center">
              <div className="text-center">
                <div className={cn("p-4 rounded-full mx-auto", strategy.color)}>
                  <StrategyIcon name={strategy.id as any} className="h-10 w-10 text-white" />
                </div>
                <div className="text-xl font-medium mt-4">{strategy.name} Strategy</div>
                <div className="text-sm text-muted-foreground mt-2">Performance visualization</div>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-lg text-muted-foreground mt-2">
          {strategy.longDescription}
        </p>
      </div>

      <Tabs defaultValue="allocation" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="allocation">Allocation</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="metrics">Risk Metrics</TabsTrigger>
          <TabsTrigger value="signals">Current Signals</TabsTrigger>
        </TabsList>

        <TabsContent value="allocation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Asset Allocation</CardTitle>
              <CardDescription>
                Recommended allocation for optimal performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChartVisualization data={strategy.allocations} />
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {strategy.allocations.map((item: any) => (
                  <div key={item.name} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full bg-blue-${300 + (item.value % 5) * 100}`} />
                      <span className="ml-2">{item.name}</span>
                    </div>
                    <span className="font-semibold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance (Current Year)</CardTitle>
              <CardDescription>
                Monthly returns in percentage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={strategy.monthlyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Return']} />
                    <Bar 
                      dataKey="return" 
                      fill="#3b82f6" 
                      radius={[4, 4, 0, 0]}
                      isAnimationActive={true}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historical Annual Returns</CardTitle>
              <CardDescription>
                Yearly performance over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={strategy.yearlyPerformance}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Return']} />
                    <Area 
                      type="monotone" 
                      dataKey="return" 
                      stroke="#3b82f6"
                      fill="url(#colorReturn)"
                      isAnimationActive={true}
                    />
                    <defs>
                      <linearGradient id="colorReturn" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard 
              title="Sharpe Ratio" 
              value={strategy.riskMetrics.sharpeRatio.toFixed(2)} 
              description="Risk-adjusted return" 
              trend={strategy.riskMetrics.sharpeRatio > 1.7 ? "positive" : "neutral"}
            />
            <MetricCard 
              title="Max Drawdown" 
              value={`${strategy.riskMetrics.maxDrawdown}%`} 
              description="Largest peak-to-trough decline" 
              trend="negative"
            />
            <MetricCard 
              title="Annual Volatility" 
              value={`${strategy.riskMetrics.annualVolatility}%`} 
              description="Standard deviation of returns" 
              trend={strategy.riskMetrics.annualVolatility < 15 ? "positive" : "negative"}
            />
            <MetricCard 
              title="Win Rate" 
              value={`${strategy.riskMetrics.winRate}%`} 
              description="Percentage of winning trades" 
              trend={strategy.riskMetrics.winRate > 65 ? "positive" : "neutral"}
            />
            <MetricCard 
              title="Average Win" 
              value={`${strategy.riskMetrics.avgWin}%`} 
              description="Average return on winning trades" 
              trend="positive"
            />
            <MetricCard 
              title="Average Loss" 
              value={`${strategy.riskMetrics.avgLoss}%`} 
              description="Average return on losing trades" 
              trend="negative"
            />
          </div>
        </TabsContent>

        <TabsContent value="signals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Trading Signals</CardTitle>
              <CardDescription>
                Latest signals generated by the strategy (updated every 4 hours)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Asset</th>
                      <th className="text-left py-3 px-4">Signal</th>
                      <th className="text-left py-3 px-4">Price</th>
                      <th className="text-left py-3 px-4">Confidence</th>
                      <th className="text-left py-3 px-4">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockSignals.map((signal, index) => (
                      <tr 
                        key={index} 
                        className={cn(
                          "border-b",
                          index % 2 === 0 ? "bg-muted/30" : "bg-background"
                        )}
                      >
                        <td className="py-3 px-4 font-medium">{signal.asset}</td>
                        <td className="py-3 px-4">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              signal.direction === "BUY" ? "text-green-600 border-green-600 bg-green-100/10" :
                              signal.direction === "SELL" ? "text-red-600 border-red-600 bg-red-100/10" :
                              "text-yellow-600 border-yellow-600 bg-yellow-100/10"
                            )}
                          >
                            {signal.direction}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">{signal.price}</td>
                        <td className="py-3 px-4">
                          <Badge 
                            variant="secondary"
                            className={cn(
                              signal.confidence === "High" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                              signal.confidence === "Medium" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                              "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            )}
                          >
                            {signal.confidence}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{signal.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-8 text-center">
                <p className="text-muted-foreground mb-4">
                  AlgoChef automatically executes these signals for Premium users.
                </p>
                <Button>
                  Upgrade to Premium
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// MetricCard component for risk metrics
function MetricCard({ 
  title, 
  value, 
  description, 
  trend 
}: { 
  title: string; 
  value: string; 
  description: string; 
  trend: "positive" | "negative" | "neutral" 
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {trend === "positive" && <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-1"><ArrowUpRight className="h-3 w-3 text-green-600" /></div>}
          {trend === "negative" && <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-1"><ArrowUpRight className="h-3 w-3 text-red-600 rotate-90" /></div>}
        </div>
        <div className="text-2xl font-bold mt-1">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

// PieChart visualization component
function PieChartVisualization({ data }: { data: any[] }) {
  const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe', '#2563eb', '#1d4ed8'];
  
  return (
    <PieChart width={700} height={350}>
      <Tooltip formatter={(value) => [`${value}%`, 'Allocation']} />
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={130}
        fill="#8884d8"
        dataKey="value"
        label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  );
} 