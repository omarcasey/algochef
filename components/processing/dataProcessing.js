import Decimal from "decimal.js";
import { Timestamp } from "firebase/firestore";
import { mean, std } from "mathjs";

export const processTradeData = (columnLabels, data, positionTypes) => {
  const columns = Object.values(columnLabels);
  const rows = data;

  if (!rows.length) {
    console.error("No data found.");
    return [];
  }

  const combineDateAndTime = (dateStr, timeStr) => {
    if (!dateStr) return null;
    const [month, day, year] = dateStr.split('/').map(num => parseInt(num, 10));
    let hours = 0, minutes = 0;
    if (timeStr) {
      let [time, period] = timeStr.split(' ');
      [hours, minutes] = time.split(':').map(num => parseInt(num, 10));
      if (period.toLowerCase() === 'pm' && hours !== 12) hours += 12;
      if (period.toLowerCase() === 'am' && hours === 12) hours = 0;
    }
    return new Date(year, month - 1, day, hours, minutes);
  };

  const processedTrades = rows.map(row => {
    const entryDateStr = row[columns.indexOf("Entry Date")];
    const exitDateStr = row[columns.indexOf("Exit Date")];
    const entryTimeStr = columns.includes("Entry Time") ? row[columns.indexOf("Entry Time")] : null;
    const exitTimeStr = columns.includes("Exit Time") ? row[columns.indexOf("Exit Time")] : null;

    const entryDate = combineDateAndTime(entryDateStr, entryTimeStr);
    const exitDate = combineDateAndTime(exitDateStr, exitTimeStr);

    if (!entryDate || !exitDate) {
      console.error("Invalid date format", { entryDateStr, exitDateStr, entryTimeStr, exitTimeStr });
      return null;
    }

    const entryPrice = parseFloat(row[columns.indexOf("Entry Price")]);
    const exitPrice = parseFloat(row[columns.indexOf("Exit Price")]);
    const size = parseInt(row[columns.indexOf("Size")]) || 1;

    let positionType;
    let netProfit;

    if (positionTypes === "long") {
      positionType = "long";
      netProfit = (exitPrice - entryPrice) * size;
    } else if (positionTypes === "short") {
      positionType = "short";
      netProfit = (entryPrice - exitPrice) * size;
    } else if (positionTypes === "both") {
      const longShortIndex = columns.indexOf("Long/Short");
      if (longShortIndex === -1) {
        console.error("Long/Short column not found when positionTypes is 'both'");
        return null;
      }
      positionType = row[longShortIndex].toLowerCase();
      if (positionType === "long") {
        netProfit = (exitPrice - entryPrice) * size;
      } else if (positionType === "short") {
        netProfit = (entryPrice - exitPrice) * size;
      } else {
        console.warn(`Unknown position type '${positionType}'`);
        return null;
      }
    } else {
      console.error(`Invalid positionTypes value '${positionTypes}'`);
      return null;
    }

    return {
      entryDate: Timestamp.fromDate(entryDate),
      entryTime: entryTimeStr,
      entryPrice,
      exitDate: Timestamp.fromDate(exitDate),
      exitTime: exitTimeStr,
      exitPrice,
      exitYear: exitDate.getFullYear(),
      exitMonth: exitDate.getMonth() + 1,
      exitDay: exitDate.getDate(),
      size,
      positionType,
      netProfit,
      timestamp: Timestamp.fromDate(exitDate)
    };
  }).filter(trade => trade !== null);

  // Sort the processed trades by exit date (oldest to newest)
  return processedTrades.sort((a, b) => a.exitDate.toDate() - b.exitDate.toDate());
};

export const calculateTradingMetrics = (trades, initialCapital) => {
  // Initialize metrics
  let totalNetProfit = 0;
  let grossProfit = 0;
  let grossLoss = 0;
  let winningTrades = 0;
  let losingTrades = 0;
  let evenTrades = 0;
  let largestWin = 0;
  let largestLoss = 0;
  let consecutiveWins = 0;
  let consecutiveLosses = 0;
  let maxConsecutiveWins = 0;
  let maxConsecutiveLosses = 0;
  let maxDrawdown = 0;
  let maxRunup = 0;
  let currentDrawdown = 0;
  let currentRunup = 0;
  let peakBalance = 0;
  let troughBalance = Infinity;
  let longestDrawdownDuration = 0;
  let longestRunupDuration = 0;
  let currentDrawdownDuration = 0;
  let currentRunupDuration = 0;
  let maxDrawdownDate = null;
  let maxRunupDate = null;
  let longestFlatPeriod = 0;
  let currentFlatPeriod = 0;

  // Sort trades by date
  trades.sort((a, b) => a.exitDate.toDate() - b.exitDate.toDate());

  const firstTrade = trades[0];
  const lastTrade = trades[trades.length - 1];
  const tradingPeriod = lastTrade.exitDate.toDate() - firstTrade.exitDate.toDate();
  const totalTradingDays = Math.ceil(tradingPeriod / (1000 * 60 * 60 * 24));

  // const initialCapital = 100000; // Initial capital
  let balance = initialCapital;
  let maxShares = 0;
  let monthlyReturns = [];
  let currentMonthProfit = 0;
  let currentMonthStartBalance = initialCapital;
  let currentMonth = firstTrade.exitDate.toDate().getMonth();
  let currentYear = firstTrade.exitDate.toDate().getFullYear();

  trades.forEach((trade, index) => {
    totalNetProfit += trade.netProfit;
    balance += trade.netProfit;

    if (trade.netProfit > 0) {
      grossProfit += trade.netProfit;
      winningTrades++;
      consecutiveWins++;
      consecutiveLosses = 0;
      maxConsecutiveWins = Math.max(maxConsecutiveWins, consecutiveWins);
      largestWin = Math.max(largestWin, trade.netProfit);
      currentFlatPeriod = 0;
    } else if (trade.netProfit < 0) {
      grossLoss += Math.abs(trade.netProfit);
      losingTrades++;
      consecutiveLosses++;
      consecutiveWins = 0;
      maxConsecutiveLosses = Math.max(maxConsecutiveLosses, consecutiveLosses);
      largestLoss = Math.min(largestLoss, trade.netProfit);
      currentFlatPeriod = 0;
    } else {
      evenTrades++;
      consecutiveWins = 0;
      consecutiveLosses = 0;
      currentFlatPeriod++;
      longestFlatPeriod = Math.max(longestFlatPeriod, currentFlatPeriod);
    }

    maxShares = Math.max(maxShares, trade.size);

    // Update drawdown and runup
    if (balance > peakBalance) {
      peakBalance = balance;
      currentDrawdown = 0;
      currentDrawdownDuration = 0;
      currentRunup = peakBalance - troughBalance;
      currentRunupDuration++;
      if (currentRunup > maxRunup) {
        maxRunup = currentRunup;
        maxRunupDate = trade.exitDate.toDate();
      }
      longestRunupDuration = Math.max(longestRunupDuration, currentRunupDuration);
    } else if (balance < troughBalance) {
      troughBalance = balance;
      currentRunup = 0;
      currentRunupDuration = 0;
      currentDrawdown = peakBalance - balance;
      currentDrawdownDuration++;
      if (currentDrawdown > maxDrawdown) {
        maxDrawdown = currentDrawdown;
        maxDrawdownDate = trade.exitDate.toDate();
      }
      longestDrawdownDuration = Math.max(longestDrawdownDuration, currentDrawdownDuration);
    } else {
      currentDrawdownDuration++;
      currentRunupDuration++;
    }

    // Calculate monthly returns
    const tradeMonth = trade.exitDate.toDate().getMonth();
    const tradeYear = trade.exitDate.toDate().getFullYear();

    if (tradeMonth !== currentMonth || tradeYear !== currentYear) {
      monthlyReturns.push({
        date: new Date(currentYear, currentMonth),
        return: currentMonthProfit / currentMonthStartBalance
      });
      currentMonthProfit = trade.netProfit;
      currentMonthStartBalance = balance - trade.netProfit;
      currentMonth = tradeMonth;
      currentYear = tradeYear;
    } else {
      currentMonthProfit += trade.netProfit;
    }
  });

  // Add the last month's return
  monthlyReturns.push({
    date: new Date(currentYear, currentMonth),
    return: currentMonthProfit / currentMonthStartBalance
  });

  const totalTrades = trades.length;
  const profitFactor = grossProfit / grossLoss;
  const percentProfitable = (winningTrades / totalTrades) * 100;
  const avgTradeNetProfit = totalNetProfit / totalTrades;
  const avgWinningTrade = grossProfit / winningTrades;
  const avgLosingTrade = grossLoss / losingTrades;
  const ratioAvgWinAvgLoss = Math.abs(avgWinningTrade / avgLosingTrade);

  const annualReturnRate = (Math.pow((balance / initialCapital), (365 / totalTradingDays)) - 1) * 100;
  const returnOnInitialCapital = (totalNetProfit / initialCapital) * 100;

  // Calculate average monthly return and standard deviation
  const avgMonthlyReturn = monthlyReturns.reduce((sum, month) => sum + month.return, 0) / monthlyReturns.length;
  const stdDevMonthlyReturn = Math.sqrt(
    monthlyReturns.reduce((sum, month) => sum + Math.pow(month.return - avgMonthlyReturn, 2), 0) / monthlyReturns.length
  );

  // Calculate percentage of profitable months
  const profitableMonths = monthlyReturns.filter(month => month.return > 0).length;
  const percentProfitableMonths = (profitableMonths / monthlyReturns.length) * 100;

  // Assuming risk-free rate of 2% for Sharpe and Sortino ratios
  const riskFreeRate = 0.02;
  const excessReturn = annualReturnRate / 100 - riskFreeRate;

  // Sharpe Ratio
  const sharpeRatio = excessReturn / (stdDevMonthlyReturn * Math.sqrt(12));

  // Sortino Ratio (using downside deviation)
  const downsideReturns = monthlyReturns.filter(month => month.return < 0);
  const downsideDeviation = Math.sqrt(
    downsideReturns.reduce((sum, month) => sum + Math.pow(month.return, 2), 0) / downsideReturns.length
  ) * Math.sqrt(12);
  const sortinoRatio = excessReturn / downsideDeviation;

  // Sterling Ratio
  const sterlingRatio = annualReturnRate / 100 / (maxDrawdown / initialCapital);

  // MAR Ratio
  const marRatio = annualReturnRate / 100 / (maxDrawdown / initialCapital);

  return {
    totalNetProfit,
    grossProfit,
    grossLoss,
    profitFactor,
    totalTrades,
    winningTrades,
    losingTrades,
    evenTrades,
    percentProfitable,
    avgTradeNetProfit,
    avgWinningTrade,
    avgLosingTrade,
    ratioAvgWinAvgLoss,
    largestWin,
    largestLoss,
    maxConsecutiveWins,
    maxConsecutiveLosses,
    tradingPeriod: totalTradingDays,
    longestFlatPeriod,
    maxShares,
    maxDrawdown,
    maxDrawdownDate,
    maxDrawdownPercentage: (maxDrawdown / peakBalance) * 100,
    longestDrawdownDuration,
    recoveryFactor: Math.abs(totalNetProfit / maxDrawdown),
    maxRunup,
    maxRunupDate,
    maxRunupPercentage: (maxRunup / troughBalance) * 100,
    longestRunupDuration,
    initialCapital,
    finalCapital: balance,
    returnOnInitialCapital,
    annualReturnRate,
    avgMonthlyReturn: avgMonthlyReturn * 100,
    stdDevMonthlyReturn: stdDevMonthlyReturn * 100,
    percentProfitableMonths,
    sharpeRatio,
    sortinoRatio,
    sterlingRatio,
    marRatio,
  };
};

export const processData = (
  columnLabels,
  data,
  initialCapital,
  positionTypes
) => {
  const columns = Object.values(columnLabels);
  const rows = data;

  if (!rows.length) {
    console.error("No data found.");
    return;
  }

  rows.sort((a, b) => {
    const exitDateA = new Date(a[columns.indexOf("Exit Date")]);
    const exitDateB = new Date(b[columns.indexOf("Exit Date")]);
    return exitDateA - exitDateB;
  });

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
  // const initialCapital = 10000;
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
    const exitDate = new Date(row[columns.indexOf("Exit Date")]);
    const exitPrice = parseFloat(row[columns.indexOf("Exit Price")]);

    // Check if 'Size' column exists
    const sizeIndex = columns.indexOf("Size");
    const size = sizeIndex !== -1 ? parseInt(row[sizeIndex]) : 1;

    let profit;

    if (positionTypes === "long") {
      // Long trades: Profit = exitPrice - entryPrice
      profit = (exitPrice - entryPrice) * size;
    } else if (positionTypes === "short") {
      // Short trades: Profit = entryPrice - exitPrice
      profit = (entryPrice - exitPrice) * size;
    } else if (positionTypes === "both") {
      // Determine profit based on individual trade's position type
      const positionType = row[columns.indexOf("Long/Short")].toLowerCase(); // Convert to lowercase
      if (positionType === "long") {
        profit = (exitPrice - entryPrice) * size;
      } else if (positionType === "short") {
        profit = (entryPrice - exitPrice) * size;
      } else {
        console.warn(
          `Unknown position type '${positionType}' in row ${index + 1}`
        );
        continue; // Skip this row if position type is unknown
      }
    } else {
      console.error(`Invalid positionTypes value '${positionTypes}'`);
      return;
    }

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

    // Check if there is already a point for this exitDate
    const existingPoint = equityCurveData.find(
      (point) => point.x.getTime() === exitDate.getTime()
    );

    if (existingPoint) {
      // Update the existing y value
      existingPoint.y += profit;
    } else {
      // Add a new point for this date
      equityCurveData.push({ x: exitDate, y: totalProfit + initialCapital });
    }

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
  const endCapital = initialCapital + totalProfit;

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
    "Ending Capital": endCapital,
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

export const processData2 = (
  columnLabels,
  data,
  initialEquity,
  period,
  positionTypes
) => {
  const columns = Object.values(columnLabels);
  const rows = data;

  if (!rows.length) {
    console.error("No data found in the CSV file.");
    return;
  }

  // Sort rows by entry date in ascending order
  rows.sort((a, b) => {
    const dateA = new Date(a[columns.indexOf("Exit Date")]);
    const dateB = new Date(b[columns.indexOf("Exit Date")]);
    return dateA - dateB;
  });

  let tradesByPeriod = new Map();
  let currentEquity = new Decimal(initialEquity);
  let periodStartEquity = currentEquity;

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    const entryPrice = new Decimal(row[columns.indexOf("Entry Price")]);
    const exitPrice = new Decimal(row[columns.indexOf("Exit Price")]);
    const sizeIndex = columns.indexOf("Size");
    const size = sizeIndex !== -1 ? parseInt(row[sizeIndex]) : 1;

    let profit;

    if (positionTypes === "long") {
      // Long trades: Profit = exitPrice - entryPrice
      profit = exitPrice.minus(entryPrice).times(size);
    } else if (positionTypes === "short") {
      // Short trades: Profit = entryPrice - exitPrice
      profit = entryPrice.minus(exitPrice).times(size);
    } else if (positionTypes === "both") {
      // Determine profit based on individual trade's position type
      const positionType = row[columns.indexOf("Long/Short")].toLowerCase(); // Convert to lowercase
      if (positionType === "long") {
        profit = exitPrice.minus(entryPrice).times(size);
      } else if (positionType === "short") {
        profit = entryPrice.minus(exitPrice).times(size);
      } else {
        console.warn(
          `Unknown position type '${positionType}' in row ${index + 1}`
        );
        continue; // Skip this row if position type is unknown
      }
    } else {
      console.error(`Invalid positionTypes value '${positionTypes}'`);
      return;
    }

    currentEquity = currentEquity.plus(profit);

    const entryDate = new Date(row[columns.indexOf("Entry Date")]);
    const exitDate = new Date(row[columns.indexOf("Exit Date")]);
    const year = exitDate.getFullYear();
    const month = exitDate.getMonth() + 1;
    const week = Math.floor(exitDate.getDate() / 7) + 1;
    const day = exitDate.getDate();

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
      tradesByPeriod.set(periodKey, {
        trades: [],
        startEquity: periodStartEquity,
        endEquity: periodStartEquity, // Set initial end equity to start equity
        maxEquity: periodStartEquity, // Initial max equity
        minEquity: periodStartEquity, // Initial min equity
        year: year,
        month: period === "month" || period === "day" ? month : null,
        day: period === "day" ? day : null,
      });
    }

    const periodData = tradesByPeriod.get(periodKey);
    periodData.trades.push({
      entryPrice: entryPrice,
      exitPrice: exitPrice,
      size: size,
      profit: profit,
      totalEquity: currentEquity,
    });
    periodData.endEquity = currentEquity; // Update the end equity for the period
    // Track the max and min equity within the period
    if (currentEquity.greaterThan(periodData.maxEquity)) {
      periodData.maxEquity = currentEquity;
    }
    if (currentEquity.lessThan(periodData.minEquity)) {
      periodData.minEquity = currentEquity;
    }

    periodStartEquity = currentEquity; // Update the start equity for the next period
  }

  let report = [];

  for (let [periodKey, periodData] of tradesByPeriod) {
    const trades = periodData.trades;
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

    // Calculate max runup and max drawdown
    const maxRunup = periodData.maxEquity.minus(periodData.startEquity);
    const maxDrawdown = periodData.startEquity.minus(periodData.minEquity);

    report.push({
      period: periodKey,
      netProfit: totalProfit.toFixed(2),
      returnOnIE: returnOnIE.dividedBy(totalTrades).toFixed(2),
      returnOnTE: returnOnTE.dividedBy(totalTrades).toFixed(2),
      numberOfTrades: totalTrades,
      profitFactor: profitFactor.toFixed(2),
      percentProfitable: percentProfitable.toFixed(2) + "%",
      startEquity: periodData.startEquity.toFixed(2),
      endEquity: periodData.endEquity.toFixed(2),
      maxRunup: maxRunup.toFixed(2), // Added max runup
      maxDrawdown: maxDrawdown.toFixed(2), // Added max drawdown
      year: periodData.year,
      month: periodData.month,
      day: periodData.day,
    });
  }

  return report;
};

export const processData3 = (
  columnLabels,
  data,
  initialEquity,
  period,
  positionTypes
) => {
  const columns = Object.values(columnLabels);
  const rows = data;

  if (!rows.length) {
    console.error("No data found in the CSV file.");
    return [];
  }

  // Sort rows by exit date in ascending order
  rows.sort((a, b) => {
    const dateA = new Date(a[columns.indexOf("Exit Date")]);
    const dateB = new Date(b[columns.indexOf("Exit Date")]);
    return dateA - dateB;
  });

  let tradesByMonth = new Map();
  let currentEquity = new Decimal(initialEquity);

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    const entryPrice = new Decimal(row[columns.indexOf("Entry Price")]);
    const exitPrice = new Decimal(row[columns.indexOf("Exit Price")]);
    const sizeIndex = columns.indexOf("Size");
    const size = sizeIndex !== -1 ? parseInt(row[sizeIndex]) : 1;

    let profit;

    if (positionTypes === "long") {
      profit = exitPrice.minus(entryPrice).times(size);
    } else if (positionTypes === "short") {
      profit = entryPrice.minus(exitPrice).times(size);
    } else if (positionTypes === "both") {
      const positionType = row[columns.indexOf("Long/Short")].toLowerCase();
      if (positionType === "long") {
        profit = exitPrice.minus(entryPrice).times(size);
      } else if (positionType === "short") {
        profit = entryPrice.minus(exitPrice).times(size);
      } else {
        console.warn(
          `Unknown position type '${positionType}' in row ${index + 1}`
        );
        continue;
      }
    } else {
      console.error(`Invalid positionTypes value '${positionTypes}'`);
      return [];
    }

    currentEquity = currentEquity.plus(profit);

    const exitDate = new Date(row[columns.indexOf("Exit Date")]);
    const monthName = exitDate.toLocaleString("default", { month: "long" }); // Extract only the month name

    if (!tradesByMonth.has(monthName)) {
      tradesByMonth.set(monthName, {
        trades: [],
        totalProfit: new Decimal(0),
        totalLoss: new Decimal(0),
        totalTrades: 0,
        winningTrades: 0,
      });
    }

    const monthData = tradesByMonth.get(monthName);
    monthData.trades.push(profit);
    monthData.totalTrades += 1;

    if (profit.isNegative()) {
      monthData.totalLoss = monthData.totalLoss.plus(profit.abs());
    } else {
      monthData.totalProfit = monthData.totalProfit.plus(profit);
      monthData.winningTrades += 1;
    }
  }

  let report = [];

  for (let [monthName, monthData] of tradesByMonth) {
    const averageProfit = monthData.totalProfit
      .minus(monthData.totalLoss)
      .dividedBy(monthData.totalTrades)
      .toFixed(2);
    const netProfit = monthData.totalProfit
      .minus(monthData.totalLoss)
      .toFixed(2);
    const profitFactor = monthData.totalLoss.isZero()
      ? "Infinity"
      : monthData.totalProfit.dividedBy(monthData.totalLoss).toFixed(2);
    const percentProfitable = (
      (monthData.winningTrades / monthData.totalTrades) *
      100
    ).toFixed(1);

    report.push({
      period: monthName,
      averageProfit: `$${averageProfit}`,
      grossProfit: `$${monthData.totalProfit.toFixed(2)}`,
      grossLoss: `($${monthData.totalLoss.toFixed(2)})`,
      netProfit: `$${netProfit}`,
      profitFactor: profitFactor,
      averageTrades: monthData.totalTrades.toFixed(1),
      percentProfitable: `${percentProfitable}%`,
    });
  }

  // Ensure report has all months in order from January to December
  const orderedMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return orderedMonths.map(
    (month) =>
      report.find((r) => r.period === month) || {
        period: month,
        averageProfit: "$0.00",
        grossProfit: "$0.00",
        grossLoss: "($0.00)",
        netProfit: "$0.00",
        profitFactor: "0.00",
        averageTrades: "0.0",
        percentProfitable: "0.0%",
      }
  );
};

export const calculateTradeDistribution = (columnLabels, data, positionTypes) => {
  const columns = Object.values(columnLabels);
  const rows = data;

  if (!rows.length) {
    console.error("No data found in the CSV file.");
    return [];
  }

  let trades = [];

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    const entryPrice = new Decimal(row[columns.indexOf("Entry Price")]);
    const exitPrice = new Decimal(row[columns.indexOf("Exit Price")]);
    const sizeIndex = columns.indexOf("Size");
    const size = sizeIndex !== -1 ? parseInt(row[sizeIndex]) : 1;

    let profit;

    if (positionTypes === "long") {
      profit = exitPrice.minus(entryPrice).times(size);
    } else if (positionTypes === "short") {
      profit = entryPrice.minus(exitPrice).times(size);
    } else if (positionTypes === "both") {
      const positionType = row[columns.indexOf("Long/Short")].toLowerCase();
      if (positionType === "long") {
        profit = exitPrice.minus(entryPrice).times(size);
      } else if (positionType === "short") {
        profit = entryPrice.minus(exitPrice).times(size);
      } else {
        console.warn(`Unknown position type '${positionType}' in row ${index + 1}`);
        continue;
      }
    } else {
      console.error(`Invalid positionTypes value '${positionTypes}'`);
      return [];
    }

    trades.push(profit.toNumber());
  }

  if (trades.length === 0) {
    return [];
  }

  // Calculate mean and standard deviation using mathjs
  const tradeMean = mean(trades);
  const tradeStdDev = std(trades);

  // Define automatic bin ranges based on mean and standard deviation
  const numBins = 10;
  const rangeWidth = 2 * tradeStdDev;
  const minRange = Math.min(...trades);
  const maxRange = Math.max(...trades);
  
  const bins = [];
  for (let i = 0; i < numBins; i++) {
    const min = tradeMean - rangeWidth + i * (rangeWidth / numBins);
    const max = min + rangeWidth / numBins;
    bins.push({ min, max });
  }

  // Calculate the frequency of trades in each bin
  const distribution = bins.map(bin => ({
    range: `$${Math.round(bin.min)} - $${Math.round(bin.max)}`,
    count: trades.filter(trade => trade >= bin.min && trade < bin.max).length,
  }));

  return {
    distribution,
    mean: tradeMean,
    stdDev: tradeStdDev,
  };
};

