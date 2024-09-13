import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, LineChart, Line } from "recharts";
import { mean, std } from "mathjs";

const TradeDistribution = ({ strategy }) => {
  const { distribution, mean, stdDev } = strategy.tradeDistribution;

  // Generate bell curve data
  const bellCurveData = [];
  const numPoints = 100;
  const step = (mean + 3 * stdDev - (mean - 3 * stdDev)) / numPoints;
  for (let i = mean - 3 * stdDev; i <= mean + 3 * stdDev; i += step) {
    const gaussian = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((i - mean) / stdDev, 2));
    bellCurveData.push({ x: i, y: gaussian });
  }

  return (
    <div className="rounded-xl shadow-2xl dark:border w-full bg-white dark:bg-black py-6 px-10">
      <h1 className="text-xl text-blue-900 dark:text-white saturate-200 font-medium mb-6">
        Trade Distribution
      </h1>
      <BarChart width={600} height={400} data={distribution} margin={{ top: 20, right: 30, bottom: 5, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="range" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
      <div style={{ marginTop: '20px' }}>
        <h2 className="text-lg text-blue-900 dark:text-white font-medium mb-4">Bell Curve</h2>
        <LineChart width={600} height={400} data={bellCurveData} margin={{ top: 20, right: 30, bottom: 5, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="y" stroke="#ff7300" />
        </LineChart>
      </div>
    </div>
  );
};

export default TradeDistribution;
