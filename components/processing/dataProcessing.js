import Decimal from "decimal.js";
import { mean, std } from "mathjs";

export const processData = (columnLabels, data) => {
  const columns = Object.values(columnLabels);
  const rows = data;

  if (!rows.length) {
    console.error("No data found.");
    return;
  }

  let totalProfit = 0;
  let totalTrades = 0;
  let winningTrades = 0;
  let losingTrades = 0;
  let evenTrades = 0;
  let grossProfit = 0;
  let grossLoss = 0;
  let largestWin = 0;
  let largestLoss = 0;
  let consecutiveWins = 0;
  let consecutiveLosses = 0;
  let maxConsecutiveWins = 0;
  let maxConsecutiveLosses = 0;
  let currentPeak = 0;
  let maxDrawdownDollar = 0;
  let maxDrawdownPercent = 0;
  const initialCapital = 100000;
  let totalDays = 0;
  let totalProfitableMonths = 0;
  let previousEntryDate = null;
  const monthlyReturns = [];
  let currentMonthProfit = 0;
  let previousMonth = null;
  let longestFlatPeriod = 0;
  let currentFlatPeriod = 0;
  let lastProfit = 0;
  let maxShares = 0;
  let currentDrawdownStart = 0;
  let longestDrawdown = 0;
  let maxDrawdownStart = 0;
  let maxRunup = 0;
  let maxRunupStart = 0;
  let longestRunup = 0;
  let maxFuturesContracts = 0;
  let maxForexContracts = 0;
  let maxDrawdown = 0;

  const equityCurveData = [];

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    const entryDate = new Date(row[columns.indexOf("Entry Date")]);
    const entryPrice = parseFloat(row[columns.indexOf("Entry Price")]);
    const exitPrice = parseFloat(row[columns.indexOf("Exit Price")]);

    // Check if 'Size' column exists
    const sizeIndex = columns.indexOf("Size");
    const size = sizeIndex !== -1 ? parseInt(row[sizeIndex]) : 1;

    const profit = (exitPrice - entryPrice) * size;
    console.log(profit);

    totalTrades++;

    if (profit > 0) {
      winningTrades++;
      grossProfit += profit;
      largestWin = Math.max(largestWin, profit);
      consecutiveWins++;
      consecutiveLosses = 0;

      if (lastProfit <= 0) {
        const periodLength = index - currentDrawdownStart;
        longestDrawdown = Math.max(longestDrawdown, periodLength);

        if (profit === 0) {
          currentFlatPeriod = periodLength;
        } else {
          currentFlatPeriod = 0;
          maxRunupStart = index;
        }
      }

      // Check if maxRunupStart is defined in equityCurveData
      if (equityCurveData[maxRunupStart]) {
        maxRunup = Math.max(
          maxRunup,
          totalProfit - equityCurveData[maxRunupStart].y
        );
      } else {
        maxRunup = totalProfit;
      }

      longestRunup = Math.max(longestRunup, index - maxRunupStart + 1);
    } else if (profit < 0) {
      losingTrades++;
      grossLoss += profit;
      largestLoss = Math.min(largestLoss, profit);
      consecutiveLosses++;
      consecutiveWins = 0;

      if (lastProfit >= 0) {
        const periodLength = index - maxRunupStart;
        longestRunup = Math.max(longestRunup, periodLength);

        if (profit === 0) {
          currentFlatPeriod = periodLength;
        } else {
          currentFlatPeriod = 0;
          currentDrawdownStart = index;
        }
      }

      // Check if maxDrawdownStart is defined in equityCurveData
      if (equityCurveData[maxDrawdownStart]) {
        maxDrawdown = Math.max(
          maxDrawdown,
          equityCurveData[maxDrawdownStart].y - totalProfit
        );
      } else {
        maxDrawdown = totalProfit;
      }

      longestDrawdown = Math.max(
        longestDrawdown,
        index - currentDrawdownStart + 1
      );
    } else {
      evenTrades++;
      currentFlatPeriod++;
    }

    totalProfit += profit;
    equityCurveData.push({ x: index + 1, y: totalProfit + initialCapital });

    maxConsecutiveWins = Math.max(maxConsecutiveWins, consecutiveWins);
    maxConsecutiveLosses = Math.max(maxConsecutiveLosses, consecutiveLosses);

    if (totalProfit > currentPeak) {
      currentPeak = totalProfit;
    }

    let drawdownDollar = currentPeak - totalProfit;
    let drawdownPercent = (drawdownDollar / currentPeak) * 100;

    if (drawdownDollar > maxDrawdownDollar) {
      maxDrawdownDollar = drawdownDollar;
    }

    if (drawdownPercent > maxDrawdownPercent) {
      maxDrawdownPercent = drawdownPercent;
    }

    if (previousEntryDate) {
      totalDays += Math.ceil(
        (entryDate - previousEntryDate) / (1000 * 60 * 60 * 24)
      );
    }
    previousEntryDate = entryDate;

    const month = entryDate.getMonth();
    if (previousMonth === null) {
      previousMonth = month;
    }
    if (month !== previousMonth) {
      monthlyReturns.push(currentMonthProfit);
      if (currentMonthProfit > 0) {
        totalProfitableMonths++;
      }
      currentMonthProfit = profit;
    } else {
      currentMonthProfit += profit;
    }
    previousMonth = month;

    lastProfit = profit;

    longestFlatPeriod = Math.max(longestFlatPeriod, currentFlatPeriod);
    maxShares = Math.max(maxShares, size);
  }

  monthlyReturns.push(currentMonthProfit);
  if (currentMonthProfit > 0) {
    totalProfitableMonths++;
  }

  const profitFactor =
    grossLoss !== 0 ? Math.abs(grossProfit / grossLoss) : Infinity;
  const percentProfitable = (winningTrades / totalTrades) * 100;
  const avgTradeNetProfit = totalProfit / totalTrades;
  const avgWinningTrade = grossProfit / winningTrades;
  const avgLosingTrade = grossLoss / losingTrades;
  const ratioAvgWinLoss =
    avgLosingTrade !== 0
      ? avgWinningTrade / Math.abs(avgLosingTrade)
      : Infinity;
  const totalMonths = monthlyReturns.length;
  const averageMonthlyReturn = mean(monthlyReturns);
  const stdDevMonthlyReturn = std(monthlyReturns);
  const annualRateOfReturn =
    (totalProfit / initialCapital / totalMonths) * 12 * 100;
  const returnOnInitialCapital = (totalProfit / initialCapital) * 100;
  const percentProfitableMonths = (totalProfitableMonths / totalMonths) * 100;
  const sharpeRatio = averageMonthlyReturn / stdDevMonthlyReturn;
  const sortinoRatio = "Requires calculation";
  const sterlingRatio = "Requires calculation";
  const marRatio = "Requires calculation";
  const recoveryFactor = totalProfit / maxDrawdownDollar;

  const metrics = {
    "Total Net Profit": totalProfit,
    "Gross Profit": grossProfit,
    "Gross Loss": grossLoss,
    "Profit Factor": profitFactor,
    "Total Trades": totalTrades,
    "Winning Trades": winningTrades,
    "Losing Trades": losingTrades,
    "Even Trades": evenTrades,
    "% Profitable": percentProfitable,
    "Avg. Trade Net Profit": avgTradeNetProfit,
    "Avg. Winning Trade": avgWinningTrade,
    "Avg. Losing Trade": avgLosingTrade,
    "Ratio Avg Win:Avg Loss": ratioAvgWinLoss,
    "Largest Win": largestWin,
    "Largest Loss": largestLoss,
    "Max Consecutive Wins": maxConsecutiveWins,
    "Max Consecutive Losses": maxConsecutiveLosses,
    "Max Drawdown $": maxDrawdownDollar * -1,
    "Max Drawdown %": maxDrawdownPercent,
    "Initial Capital": initialCapital,
    "Total Trading Days": totalDays,
    "Return on Initial Capital": returnOnInitialCapital,
    "Annual Rate of Return": annualRateOfReturn,
    "Avg. Monthly Return": averageMonthlyReturn,
    "Std. Deviation of Monthly Return": stdDevMonthlyReturn,
    "% Profitable Months": percentProfitableMonths,
    "Sharpe Ratio": sharpeRatio,
    "Sortino Ratio": sortinoRatio,
    "Sterling Ratio": sterlingRatio,
    "MAR Ratio": marRatio,
    "Total Commission": 0,
    "Total Slippage": 0,
    "Longest Flat Period": longestFlatPeriod,
    "Max Shares": maxShares,
    "Max Futures Contracts": maxFuturesContracts,
    "Max Forex Contracts": maxForexContracts,
    "Longest Drawdown": longestDrawdown,
    "Max Runup": maxRunup,
    "Longest Runup": longestRunup,
    "Recovery Factor": recoveryFactor,
  };

  return { equityCurveData, metrics };
};

export const processData2 = (content, initialEquity, period) => {
  const columns = Object.values(columnLabels);
  const rows = data;

  if (!rows.length) {
    console.error("No data found in the CSV file.");
    return;
  }

  // Sort rows by entry date in ascending order
  rows.sort((a, b) => {
    const dateA = new Date(a[columns.indexOf("Entry Date")]);
    const dateB = new Date(b[columns.indexOf("Entry Date")]);

    return dateA - dateB;
  });

  let tradesByPeriod = new Map();
  let currentEquity = new Decimal(initialEquity);

  for (let index = 0; index < rows.length - 1; index++) {
    const row = rows[index];
    const entryPrice = new Decimal(row[columns.indexOf("Entry Price")]);
    const exitPrice = new Decimal(row[columns.indexOf("Exit Price")]);
    // Check if 'Size' column exists
    const sizeIndex = columns.indexOf("Size");
    const size = sizeIndex !== -1 ? parseInt(row[sizeIndex]) : 1;
    const profit = exitPrice.minus(entryPrice).times(size);

    currentEquity = currentEquity.plus(profit);

    const entryDate = new Date(row[columns.indexOf("Entry Date")]);
    const year = entryDate.getFullYear();
    const month = entryDate.getMonth() + 1; // because JavaScript month index is 0-based
    const week = Math.floor(entryDate.getDate() / 7) + 1;
    const day = entryDate.getDate();

    let periodKey;
    switch (period) {
      case "year":
        periodKey = `${year}`;
        break;
      case "month":
        periodKey = `${month}/${year}`;
        break;
      case "week":
        periodKey = `Week ${week}, ${month}/${year}`;
        break;
      case "day":
        periodKey = `${day}/${month}/${year}`;
        break;
    }

    if (!tradesByPeriod.has(periodKey)) {
      tradesByPeriod.set(periodKey, []);
    }

    tradesByPeriod.get(periodKey).push({
      entryPrice: entryPrice,
      exitPrice: exitPrice,
      size: size,
      profit: profit,
      totalEquity: currentEquity,
    });
  }

  let report = [];

  for (let [periodKey, trades] of tradesByPeriod) {
    let totalProfit = new Decimal(0);
    let totalLoss = new Decimal(0);
    let totalTrades = trades.length;
    let winningTrades = 0;
    let returnOnIE = new Decimal(0);
    let returnOnTE = new Decimal(0);

    for (let trade of trades) {
      totalProfit = totalProfit.plus(trade.profit);
      if (trade.profit.isNegative()) {
        totalLoss = totalLoss.plus(trade.profit.abs());
      } else {
        winningTrades += 1;
      }
      returnOnIE = returnOnIE.plus(
        trade.profit.dividedBy(initialEquity).times(100)
      );
      returnOnTE = returnOnTE.plus(
        trade.profit.dividedBy(trade.totalEquity).times(100)
      );
    }

    let profitFactor = totalProfit.dividedBy(totalLoss.abs()).toNumber();
    let percentProfitable = (winningTrades / totalTrades) * 100;

    report.push({
      period: periodKey,
      netProfit: totalProfit.toFixed(2),
      returnOnIE: returnOnIE.dividedBy(totalTrades).toFixed(2),
      returnOnTE: returnOnTE.dividedBy(totalTrades).toFixed(2),
      numberOfTrades: totalTrades,
      profitFactor: profitFactor.toFixed(2),
      percentProfitable: percentProfitable.toFixed(2) + "%",
    });
  }

  return report;
};
