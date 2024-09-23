import React, { useMemo } from "react";
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { mean, std } from "mathjs";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="label text-sm font-semibold text-gray-700 dark:text-gray-300">{`Range: ${label}`}</p>
        <p className="intro text-sm text-blue-600 dark:text-blue-400">{`Trade Count: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

const TradeDistribution = ({ trades }) => {
  // Calculate mean and standard deviation from the trades' netProfit
  const tradeProfits = trades.map((trade) => trade.netProfit);
  const calculatedMean = mean(tradeProfits);
  const calculatedStdDev = std(tradeProfits);

  // Generate trade distribution (group trades into bins)
  const numBins = 14;
  const minTrade = Math.min(...tradeProfits);
  const maxTrade = Math.max(...tradeProfits);
  const binWidth = (maxTrade - minTrade) / numBins;

  const distribution = Array.from({ length: numBins }, (_, i) => {
    const rangeStart = minTrade + i * binWidth;
    const rangeEnd = rangeStart + binWidth;
    const count = tradeProfits.filter((profit) => profit >= rangeStart && profit < rangeEnd).length;
    return {
      range: `${rangeStart.toFixed(2)} - ${rangeEnd.toFixed(2)}`,
      count,
      midpoint: (rangeStart + rangeEnd) / 2,
    };
  });

  // Generate bell curve data based on calculated mean and standard deviation
  const bellCurveData = useMemo(() => {
    const maxCount = Math.max(...distribution.map(d => d.count));
    const gaussianValues = distribution.map(({ midpoint }) => {
      return (1 / (calculatedStdDev * Math.sqrt(2 * Math.PI))) * 
             Math.exp(-0.5 * Math.pow((midpoint - calculatedMean) / calculatedStdDev, 2));
    });
    const maxGaussian = Math.max(...gaussianValues);
    
    return gaussianValues.map(gaussian => ({
      bellCurve: (gaussian / maxGaussian) * maxCount  // Scale to match the maximum bar height
    }));
  }, [calculatedMean, calculatedStdDev, distribution]);

  // Combine distribution and bell curve data
  const combinedData = distribution.map((item, index) => ({
    ...item,
    ...bellCurveData[index]
  }));

  return (
    <div className="rounded-xl shadow-2xl dark:border w-full bg-white dark:bg-black py-6 px-10">
      <h1 className="text-xl text-blue-900 dark:text-white saturate-200 font-medium mb-6">
        Trade Distribution with Bell Curve
      </h1>
      <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={combinedData} margin={{ left: 20, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="range" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="count" fill="#097EF2" name="Trade Count" />
        <Line type="monotone" dataKey="bellCurve" stroke="#ff7300" name="Bell Curve" strokeWidth={2} dot={false} />
      </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TradeDistribution;