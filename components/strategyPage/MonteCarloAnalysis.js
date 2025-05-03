import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import numeral from "numeral";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-4 border border-border rounded-md shadow-md">
        <p className="font-bold text-foreground mb-2">Trade {label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex justify-between items-center mb-1">
            <span className="mr-2 font-semibold" style={{ color: entry.color }}>
              {entry.name}:
            </span>
            <span className="font-mono text-foreground">
              $
              {Number(entry.value).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const confidenceLevels = [
  50, 60, 70, 80, 85, 90, 91, 92, 93, 94, 95, 95.5, 96, 96.5, 97, 97.5, 98,
  98.5, 99, 99.1, 99.2, 99.3, 99.4, 99.5, 99.6, 99.7, 99.8, 99.9, 100,
];

const ResultsTable = ({ results, initialCapital }) => {
  const tableData = useMemo(() => {
    return confidenceLevels.map((level) => {
      const index = Math.floor((level / 100) * (results.length - 1));
      const result = results[index];
      const netProfit = result.mean;
      const rateOfReturn = (netProfit / initialCapital) * 100;
      const maxDrawdown = Math.max(...result.drawdowns);
      const maxDrawdownPercent = (maxDrawdown / initialCapital) * 100;
      const returnDDRatio =
        maxDrawdownPercent !== 0
          ? Math.abs(rateOfReturn / maxDrawdownPercent)
          : Infinity;
      const profitFactor =
        Math.abs(result.totalLoss) !== 0
          ? result.totalGain / Math.abs(result.totalLoss)
          : Infinity;
      return {
        confidence: level,
        netProfit: netProfit.toFixed(2),
        rateOfReturn: rateOfReturn.toFixed(2),
        maxDrawdown: maxDrawdown.toFixed(2),
        maxDrawdownPercent: maxDrawdownPercent.toFixed(2),
        returnDDRatio: returnDDRatio.toFixed(2),
        profitFactor: profitFactor.toFixed(2),
      };
    });
  }, [results, initialCapital]);

  return (
    <div className="mt-4 overflow-x-auto">
      <h3 className="font-semibold text-lg mb-2 text-foreground">Key Results at Select Confidence Levels</h3>
      <Table className="bg-background rounded-lg border">
        <TableHeader>
          <TableRow>
            <TableHead className="text-foreground">Confidence %</TableHead>
            <TableHead className="text-foreground">Net Profit</TableHead>
            <TableHead className="text-foreground">Rate of Return %</TableHead>
            <TableHead className="text-foreground">Max Drawdown</TableHead>
            <TableHead className="text-foreground">Max Drawdown %</TableHead>
            <TableHead className="text-foreground">Return-DD Ratio</TableHead>
            <TableHead className="text-foreground">Profit Factor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-muted/50" : ""}>
              <TableCell className="text-foreground">{row.confidence.toFixed(1)}</TableCell>
              <TableCell className="text-foreground">{numeral(row.netProfit).format("$0,0")}</TableCell>
              <TableCell className="text-foreground">{row.rateOfReturn}%</TableCell>
              <TableCell className="text-foreground">${row.maxDrawdown}</TableCell>
              <TableCell className="text-foreground">{row.maxDrawdownPercent}%</TableCell>
              <TableCell className="text-foreground">{row.returnDDRatio}</TableCell>
              <TableCell className="text-foreground">{row.profitFactor}</TableCell>
            </tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const DetailedResults = ({ results, confidenceLevel, initialCapital }) => {
  const detailedData = useMemo(() => {
    if (!results) return null;
    const index = Math.floor((confidenceLevel / 100) * (results.length - 1));
    const result = results[index];
    const netProfit = result.mean;
    const rateOfReturn = (netProfit / initialCapital) * 100;
    const maxDrawdown = Math.max(...result.drawdowns);
    const maxDrawdownPercent = (maxDrawdown / initialCapital) * 100;
    const winningTrades = results.filter((r) => r.mean > 0);
    const losingTrades = results.filter((r) => r.mean <= 0);
    const avgWinningTrade =
      winningTrades.reduce((sum, r) => sum + r.mean, 0) / winningTrades.length;
    const avgLosingTrade =
      losingTrades.reduce((sum, r) => sum + r.mean, 0) / losingTrades.length;
    const largestWinningTrade = Math.max(...winningTrades.map((r) => r.mean));
    const largestLosingTrade = Math.min(...losingTrades.map((r) => r.mean));
    const avgTrade =
      results.reduce((sum, r) => sum + r.mean, 0) / results.length;
    const tradeStdDev = Math.sqrt(
      results.reduce((sum, r) => sum + Math.pow(r.mean - avgTrade, 2), 0) /
        results.length
    );
    return {
      totalNetProfit: netProfit,
      returnOnStartingEquity: rateOfReturn,
      profitFactor: result.totalGain / Math.abs(result.totalLoss),
      percentProfitable: (winningTrades.length / results.length) * 100,
      largestWinningTrade,
      largestLosingTrade,
      avgWinningTrade,
      avgLosingTrade,
      avgTrade,
      tradeStdDev,
      maxConsecutiveWins: getMaxConsecutive(results, true),
      maxConsecutiveLosses: getMaxConsecutive(results, false),
      winLossRatio: winningTrades.length / losingTrades.length,
      returnDrawdownRatio: Math.abs(rateOfReturn / maxDrawdownPercent),
      maxDrawdown,
      maxDrawdownPercent,
    };
  }, [results, confidenceLevel, initialCapital]);

  if (!detailedData) return null;

  return (
    <div className="mt-8 bg-muted/50 rounded-lg p-6 border">
      <h3 className="text-lg font-semibold mb-4 text-foreground">
        Monte Carlo Results at {confidenceLevel.toFixed(2)}% Confidence
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="mb-1 font-medium text-foreground">Total Net Profit: <span className="font-mono text-primary">{numeral(detailedData.totalNetProfit).format("$0,0.00")}</span></p>
          <p className="mb-1 text-foreground">Return on Starting Equity: <span className="font-mono">{detailedData.returnOnStartingEquity.toFixed(2)}%</span></p>
          <p className="mb-1 text-foreground">Profit Factor: <span className="font-mono">{detailedData.profitFactor.toFixed(3)}</span></p>
          <p className="mb-1 text-foreground">Percent Profitable: <span className="font-mono">{detailedData.percentProfitable.toFixed(2)}%</span></p>
          <p className="mb-1 text-foreground">Largest Winning Trade: <span className="font-mono">{numeral(detailedData.largestWinningTrade).format("$0,0.00")}</span></p>
          <p className="mb-1 text-foreground">Largest Losing Trade: <span className="font-mono">{numeral(detailedData.largestLosingTrade).format("$0,0.00")}</span></p>
          <p className="mb-1 text-foreground">Average Winning Trade: <span className="font-mono">{numeral(detailedData.avgWinningTrade).format("$0,0.00")}</span></p>
          <p className="mb-1 text-foreground">Average Losing Trade: <span className="font-mono">{numeral(detailedData.avgLosingTrade).format("$0,0.00")}</span></p>
        </div>
        <div>
          <p className="mb-1 text-foreground">Max Consecutive Wins: <span className="font-mono">{detailedData.maxConsecutiveWins}</span></p>
          <p className="mb-1 text-foreground">Max Consecutive Losses: <span className="font-mono">{detailedData.maxConsecutiveLosses}</span></p>
          <p className="mb-1 text-foreground">Average Trade: <span className="font-mono">{numeral(detailedData.avgTrade).format("$0,0.00")}</span></p>
          <p className="mb-1 text-foreground">Trade Standard Deviation: <span className="font-mono">{numeral(detailedData.tradeStdDev).format("$0,0.00")}</span></p>
          <p className="mb-1 text-foreground">Win/Loss Ratio: <span className="font-mono">{detailedData.winLossRatio.toFixed(3)}</span></p>
          <p className="mb-1 text-foreground">Return/Drawdown Ratio: <span className="font-mono">{detailedData.returnDrawdownRatio.toFixed(3)}</span></p>
          <p className="mb-1 text-foreground">Max Drawdown: <span className="font-mono">{numeral(detailedData.maxDrawdown).format("$0,0.00")}</span></p>
          <p className="mb-1 text-foreground">Max Drawdown %: <span className="font-mono">{detailedData.maxDrawdownPercent.toFixed(2)}%</span></p>
        </div>
      </div>
    </div>
  );
};

const getMaxConsecutive = (results, isWin) => {
  let max = 0;
  let current = 0;
  for (const result of results) {
    if ((isWin && result.mean > 0) || (!isWin && result.mean <= 0)) {
      current++;
      max = Math.max(max, current);
    } else {
      current = 0;
    }
  }
  return max;
};

const MonteCarloAnalysis = ({ strategy, trades }) => {
  const [frequency, setFrequency] = useState(1000);
  const [confidenceLevel, setConfidenceLevel] = useState(95);
  const [results, setResults] = useState(null);

  // Empty state for no trades
  if (!trades || trades.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-8">
        <div className="text-2xl font-semibold text-muted-foreground mb-2">No Trades Available</div>
        <div className="text-md text-muted-foreground/80">This strategy does not have any trades to analyze. Please select a different strategy.</div>
      </div>
    );
  }

  const runMonteCarloAnalysis = () => {
    const simulations = [];
    for (let i = 0; i < frequency; i++) {
      const shuffledTrades = [...trades].sort(() => Math.random() - 0.5);
      let cumulativeProfit = 0;
      let maxProfit = 0;
      let totalGain = 0;
      let totalLoss = 0;
      const drawdowns = [];
      const profitCurve = shuffledTrades.map((trade) => {
        cumulativeProfit += trade.netProfit;
        if (cumulativeProfit > maxProfit) {
          maxProfit = cumulativeProfit;
        }
        const drawdown = maxProfit - cumulativeProfit;
        drawdowns.push(drawdown);
        if (trade.netProfit > 0) totalGain += trade.netProfit;
        else totalLoss += trade.netProfit;
        return { cumulativeProfit, drawdown, totalGain, totalLoss };
      });
      simulations.push(profitCurve);
    }
    const results = simulations[0].map((_, index) => {
      const values = simulations
        .map((sim) => sim[index].cumulativeProfit)
        .sort((a, b) => a - b);
      const drawdowns = simulations.map((sim) => sim[index].drawdown);
      const totalGains = simulations.map((sim) => sim[index].totalGain);
      const totalLosses = simulations.map((sim) => sim[index].totalLoss);
      return {
        trade: index + 1,
        mean: values.reduce((sum, val) => sum + val, 0) / frequency,
        lower: values[Math.floor((1 - confidenceLevel / 100) * frequency)],
        upper: values[Math.ceil((confidenceLevel / 100) * frequency)],
        drawdowns: drawdowns,
        totalGain: totalGains.reduce((sum, val) => sum + val, 0) / frequency,
        totalLoss: totalLosses.reduce((sum, val) => sum + val, 0) / frequency,
      };
    });
    setResults(results);
  };

  const chartData = useMemo(() => {
    if (!results) return [];
    const initialPoint = {
      trade: 0,
      mean: 0,
      lower: 0,
      upper: 0,
    };
    const data = results.map((r) => ({
      trade: r.trade,
      mean: parseFloat(r.mean.toFixed(2)),
      lower: parseFloat(r.lower.toFixed(2)),
      upper: parseFloat(r.upper.toFixed(2)),
    }));
    return [initialPoint, ...data];
  }, [results]);

  const yDomain = useMemo(() => {
    if (chartData.length === 0) return [0, 100];
    const allValues = chartData.flatMap((d) => [d.lower, d.mean, d.upper]);
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    const padding = (maxValue - minValue) * 0.1;
    return [Math.floor(minValue - padding), Math.ceil(maxValue + padding)];
  }, [chartData]);

  return (
    <div className="w-full space-y-8 pb-4">
      {/* Input Section */}
      <div className="bg-background rounded-lg border p-6 mb-4 shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-foreground">Simulation Parameters</h2>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="frequency" className="text-foreground">Frequency (max 10,000)</Label>
            <Input
              id="frequency"
              type="number"
              min="1"
              max="10000"
              value={frequency}
              onChange={(e) =>
                setFrequency(Math.min(10000, Math.max(1, parseInt(e.target.value))))
              }
              className="mt-1"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="confidenceLevel" className="text-foreground">Confidence Level (%)</Label>
            <Input
              id="confidenceLevel"
              type="number"
              min="1"
              max="99"
              value={confidenceLevel}
              onChange={(e) =>
                setConfidenceLevel(
                  Math.min(99, Math.max(1, parseInt(e.target.value)))
                )
              }
              className="mt-1"
            />
          </div>
          <Button
            onClick={runMonteCarloAnalysis}
            className="h-10 px-4 text-base font-medium"
          >
            Run Analysis
          </Button>
        </div>
      </div>

      {/* Chart Section */}
      {results && (
        <div className="bg-background rounded-lg border p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-foreground">Monte Carlo Simulation Chart</h2>
          <ResponsiveContainer width="100%" height={500}>
            <LineChart
              data={chartData}
              margin={{ left: 20, right: 20, top: 20, bottom: 20 }}
            >
              <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="trade"
                fontSize={12}
                tickMargin={5}
                type="number"
                domain={[0, chartData.length]}
                tickFormatter={(value) => `Trade ${value}`}
                stroke="hsl(var(--foreground))"
                tick={{ fill: "hsl(var(--foreground))" }}
              />
              <YAxis
                domain={yDomain}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                allowDecimals={false}
                axisLine={false}
                tickMargin={15}
                tickLine={false}
                fontSize={14}
                stroke="hsl(var(--foreground))"
                tick={{ fill: "hsl(var(--foreground))" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="mean"
                name="Mean"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="lower"
                name="Lower Bound"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="upper"
                name="Upper Bound"
                stroke="hsl(142.1 76.2% 36.3%)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Detailed Results Section */}
      {results && (
        <DetailedResults
          results={results}
          confidenceLevel={confidenceLevel}
          initialCapital={strategy.metrics.initialCapital}
        />
      )}

      {/* Results Table Section */}
      {results && (
        <div className="bg-background rounded-lg border p-6 shadow-sm">
          <ResultsTable results={results} initialCapital={strategy.metrics.initialCapital} />
        </div>
      )}
      
    </div>
  );
};

export default MonteCarloAnalysis;
