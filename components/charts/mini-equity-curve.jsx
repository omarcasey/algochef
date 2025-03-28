import React, { useEffect, useRef } from "react";

export const MiniEquityCurve = React.memo(({ trades = [], width = 120, height = 40 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!trades || !trades.length) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");

    // Calculate equity curve data
    const equityData = trades.reduce((acc, trade) => {
      const lastEquity = acc.length > 0 ? acc[acc.length - 1].equity : 0;
      return [...acc, { equity: lastEquity + (trade.netProfit || 0) }];
    }, []);

    // Normalize data
    const minEquity = Math.min(...equityData.map((d) => d.equity));
    const maxEquity = Math.max(...equityData.map((d) => d.equity));
    const range = maxEquity - minEquity || 1;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw line
    ctx.beginPath();
    ctx.strokeStyle =
      equityData[equityData.length - 1]?.equity > 0 ? "#22c55e" : "#ef4444";
    ctx.lineWidth = 1.5;

    equityData.forEach((point, i) => {
      const x = (i / (equityData.length - 1)) * width;
      const y = height - ((point.equity - minEquity) / range) * height;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  }, [trades, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-[120px] h-[40px]"
    />
  );
}); 