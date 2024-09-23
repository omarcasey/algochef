import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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

// ... (CustomTooltip component remains the same)
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-md shadow-md">
        <p className="font-bold text-gray-700 mb-2">Trade {label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex justify-between items-center mb-1">
            <span className="mr-2 font-semibold" style={{ color: entry.color }}>
              {entry.name}:
            </span>
            <span className="font-mono">
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

      // Calculate the maximum drawdown across all simulations
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
      <p className="font-medium mb-4">
        Key Results at Select Confidence Levels
      </p>
      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead>Confidence %</TableHead>
            <TableHead>Net Profit</TableHead>
            <TableHead>Rate of Return %</TableHead>
            <TableHead>Max Drawdown</TableHead>
            <TableHead>Max Drawdown %</TableHead>
            <TableHead>Return-DD Ratio</TableHead>
            <TableHead>Profit Factor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
              <TableCell>{row.confidence.toFixed(1)}</TableCell>
              <TableCell>{numeral(row.netProfit).format("$0,0")}</TableCell>
              <TableCell>{row.rateOfReturn}%</TableCell>
              <TableCell>${row.maxDrawdown}</TableCell>
              <TableCell>{row.maxDrawdownPercent}%</TableCell>
              <TableCell>{row.returnDDRatio}</TableCell>
              <TableCell>{row.profitFactor}</TableCell>
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
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">
        Monte Carlo Results at {confidenceLevel.toFixed(2)}% Confidence
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p>
            Total Net Profit:{" "}
            {numeral(detailedData.totalNetProfit).format("$0,0.00")}
          </p>
          <p>
            Return on Starting Equity:{" "}
            {detailedData.returnOnStartingEquity.toFixed(2)}%
          </p>
          <p>Profit Factor: {detailedData.profitFactor.toFixed(3)}</p>
          <p>
            Percent Profitable: {detailedData.percentProfitable.toFixed(2)}%
          </p>
          <p>
            Largest Winning Trade:{" "}
            {numeral(detailedData.largestWinningTrade).format("$0,0.00")}
          </p>
          <p>
            Largest Losing Trade:{" "}
            {numeral(detailedData.largestLosingTrade).format("$0,0.00")}
          </p>
          <p>
            Average Winning Trade:{" "}
            {numeral(detailedData.avgWinningTrade).format("$0,0.00")}
          </p>
          <p>
            Average Losing Trade:{" "}
            {numeral(detailedData.avgLosingTrade).format("$0,0.00")}
          </p>
        </div>
        <div>
          <p>Max Consecutive Wins: {detailedData.maxConsecutiveWins}</p>
          <p>Max Consecutive Losses: {detailedData.maxConsecutiveLosses}</p>
          <p>
            Average Trade: {numeral(detailedData.avgTrade).format("$0,0.00")}
          </p>
          <p>
            Trade Standard Deviation:{" "}
            {numeral(detailedData.tradeStdDev).format("$0,0.00")}
          </p>
          <p>Win/Loss Ratio: {detailedData.winLossRatio.toFixed(3)}</p>
          <p>
            Return/Drawdown Ratio: {detailedData.returnDrawdownRatio.toFixed(3)}
          </p>
          <p>
            Max Drawdown: {numeral(detailedData.maxDrawdown).format("$0,0.00")}
          </p>
          <p>Max Drawdown %: {detailedData.maxDrawdownPercent.toFixed(2)}%</p>
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

    // Start with a "Trade 0" point where all values are 0
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

    // Return the chart data with "Trade 0" included at the beginning
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
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="frequency">Frequency (max 10,000)</Label>
        <Input
          id="frequency"
          type="number"
          min="1"
          max="10000"
          value={frequency}
          onChange={(e) =>
            setFrequency(Math.min(10000, Math.max(1, parseInt(e.target.value))))
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confidenceLevel">Confidence Level (%)</Label>
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
        />
      </div>
      <Button onClick={runMonteCarloAnalysis}>Run Analysis</Button>

      {results && (
        <>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">
              Monte Carlo Analysis Results
            </h3>
            <ResponsiveContainer width="100%" height={600}>
              <LineChart
                data={chartData}
                margin={{ left: 20, right: 20, top: 20, bottom: 20 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="trade"
                  fontSize={12}
                  tickMargin={5}
                  type="number"
                  domain={[0, chartData.length]}
                  tickFormatter={(value) => `Trade ${value}`}
                />
                <YAxis
                  domain={yDomain}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                  allowDecimals={false}
                  axisLine={false}
                  tickMargin={15}
                  tickLine={false}
                  fontSize={14}
                />
                <Tooltip content={<CustomTooltip />} />
                {/* <Legend /> */}
                <Line
                  type="monotone"
                  dataKey="mean"
                  name="Mean"
                  stroke="#00a6ff"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="lower"
                  name="Lower Bound"
                  stroke="#C70039"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="upper"
                  name="Upper Bound"
                  stroke="#0a6c00"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <ResultsTable
            results={results}
            initialCapital={strategy.metrics.initialCapital}
          />
          <DetailedResults
            results={results}
            confidenceLevel={confidenceLevel}
            initialCapital={strategy.metrics.initialCapital}
          />
        </>
      )}
    </div>
  );
};

export default MonteCarloAnalysis;
