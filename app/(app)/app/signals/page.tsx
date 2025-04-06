"use client";
import React from "react";
import { useUser } from "reactfire";
import Link from "next/link";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { StrategyIcon } from "@/components/ui/strategy-icon";

interface Strategy {
  id: string;
  name: string;
  description: string;
  color: string;
  badges: string[];
  keyPoints: string[];
}

const TradingSignalsPage: React.FC = () => {
  const { data: user, status } = useUser();

  const strategies: Strategy[] = [
    {
      id: "trend-following",
      name: "Trend Following",
      description: "Captures market momentum by following established price trends across multiple timeframes.",
      color: "from-blue-600 to-cyan-400",
      badges: ["Momentum", "Technical", "Multi-timeframe"],
      keyPoints: [
        "Follows established market trends",
        "Uses multiple technical indicators for confirmation",
        "Adaptive position sizing based on volatility",
        "Works across various asset classes"
      ]
    },
    {
      id: "mean-reversion",
      name: "Mean Reversion",
      description: "Identifies and capitalizes on price deviations from historical averages, assuming reversion to the mean.",
      color: "from-emerald-600 to-green-400",
      badges: ["Statistical", "Counter-trend", "Short-term"],
      keyPoints: [
        "Capitalizes on statistical price anomalies",
        "Uses Bollinger Bands and RSI divergences",
        "Dynamic entry and exit triggers",
        "Effective in range-bound markets"
      ]
    },
    {
      id: "breakout",
      name: "Breakout",
      description: "Targets price movements beyond key support and resistance levels after periods of consolidation.",
      color: "from-purple-600 to-indigo-400",
      badges: ["Momentum", "Volatility", "Technical"],
      keyPoints: [
        "Capitalizes on range breakouts",
        "Volume-confirmed entry signals",
        "Trailing stop methodology",
        "Captures explosive price movements"
      ]
    },
    {
      id: "ai-adaptive",
      name: "AI Adaptive",
      description: "Leverages machine learning to analyze market conditions and adapt trading parameters in real-time.",
      color: "from-orange-500 to-amber-400",
      badges: ["Machine Learning", "Adaptive", "Multi-strategy"],
      keyPoints: [
        "Self-optimizing parameters",
        "Multi-factor analysis",
        "Regime-switching capabilities",
        "Continuous learning from market data"
      ]
    },
    {
      id: "index-investing",
      name: "Index Investing",
      description: "A passive investment strategy that tracks a broad market index like the S&P 500, providing broad diversification at low cost.",
      color: "from-red-600 to-pink-400",
      badges: ["Passive", "Diversification", "Low Cost"],
      keyPoints: [
        "Broad market exposure with minimal effort",
        "Very low fees and expenses",
        "Tax-efficient approach",
        "Strong long-term historical returns"
      ]
    }
  ];

  if (status === "loading") {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <LoadingSpinner size={45} />
      </div>
    );
  }

  if (!user) {
    return <div>Please sign in to view trading signals.</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Trading Signals</h1>
        <p className="text-muted-foreground">
          Explore proven investment strategies that can help you build a robust portfolio
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {strategies.map((strategy) => (
          <Link href={`/app/signals/${strategy.id}`} key={strategy.id} className="block w-full">
            <Card 
              className="overflow-hidden border border-gray-200 dark:border-gray-800 transition-all hover:shadow-md dark:hover:shadow-gray-800/30 group hover:border-blue-400 dark:hover:border-blue-600 cursor-pointer"
            >
              <div className="flex flex-col md:flex-row">
                {/* Left side with gradient background and title */}
                <div 
                  className={`bg-gradient-to-r ${strategy.color} p-5 relative md:w-1/5 flex flex-col justify-center`}
                >
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative">
                    <div className="bg-white/20 dark:bg-white/20 rounded-full p-1.5 w-8 h-8 flex items-center justify-center mb-2 backdrop-blur-sm">
                      <StrategyIcon name={strategy.id as any} color="white" size={16} />
                    </div>
                    <CardTitle className="text-white text-lg">{strategy.name}</CardTitle>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {strategy.badges.map((badge) => (
                        <Badge key={badge} variant="secondary" className="text-xs font-normal bg-white/20 text-white hover:bg-white/30">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Right side with content */}
                <div className="md:w-4/5 flex flex-col md:flex-row md:items-center">
                  <CardContent className="p-4 flex-grow">
                    <div className="md:flex md:gap-6">
                      <p className="text-sm text-muted-foreground mb-3 md:mb-0 md:w-1/3">
                        {strategy.description}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5 md:w-2/3">
                        {strategy.keyPoints.map((point, index) => (
                          <div key={index} className="flex items-start gap-2 text-xs">
                            <div className="h-4 w-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="h-1 w-1 rounded-full bg-gray-500 dark:bg-gray-400"></span>
                            </div>
                            {point}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <div className="flex items-center pr-4 pl-4 pb-4 md:p-0 md:pr-6">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors">
                      <ArrowRight className="h-3 w-3 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-10 p-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-900/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">Ready to implement these strategies?</h2>
            <p className="text-sm text-muted-foreground max-w-2xl">
              AlgoChef can help you build, test, and implement these strategies with just a few clicks.
              Start building your portfolio today.
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TradingSignalsPage; 