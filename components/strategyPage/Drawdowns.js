import React from "react";
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

const Drawdowns = ({ strategy }) => {
  const equityCurveDataforDrawDown = strategy.equityCurveData.map(
    (point, index) => ({
      x: index,
      y: point.y,
    })
  );

  const calculateDrawdown = (equityCurveData) => {
    let maxEquity = -Infinity;
    const drawdownData = equityCurveData.map((data) => {
      maxEquity = Math.max(maxEquity, data.y);
      const drawdown = ((data.y - maxEquity) / maxEquity) * 100; // Convert drawdown to percentage
      return { x: data.x, y: drawdown };
    });
    return drawdownData;
  };

  const drawdownData = calculateDrawdown(equityCurveDataforDrawDown);

  return (
    <div className="rounded-xl shadow-xl w-full bg-white dark:bg-slate-900 py-6 px-10">
      <h1 className="text-xl text-blue-900 dark:text-white saturate-200 font-medium mb-6">
        Drawdowns
      </h1>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={drawdownData} margin={{ left: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="x"
            // tickFormatter={(tick) => `Day ${tick}`}
          />
          <YAxis
            axisLine={false} // Remove the Y-axis line
            // tickMargin={15}
            fontSize={12}
            tickLine={false}
            tickFormatter={(tick) => `${tick}.0%`}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            name={strategy.name}
            dataKey="y"
            stroke="#0000FF"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Drawdowns;
