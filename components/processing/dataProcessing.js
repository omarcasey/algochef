import Decimal from "decimal.js";
import { Timestamp } from "firebase/firestore";
import { mean, std } from "mathjs";

export const processTradeData = (columnLabels, data, positionTypes, instrument, subtractCommissionSlippage) => {
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

    const entryPrice = new Decimal(row[columns.indexOf("Entry Price")]);
    const exitPrice = new Decimal(row[columns.indexOf("Exit Price")]);
    const size = new Decimal(row[columns.indexOf("Size")] || 1);

    let positionType;
    let rawProfit;

    if (positionTypes === "long") {
      positionType = "long";
      rawProfit = exitPrice.minus(entryPrice);
    } else if (positionTypes === "short") {
      positionType = "short";
      rawProfit = entryPrice.minus(exitPrice);
    } else if (positionTypes === "both") {
      const longShortIndex = columns.indexOf("Long/Short");
      if (longShortIndex === -1) {
        console.error("Long/Short column not found when positionTypes is 'both'");
        return null;
      }
      positionType = row[longShortIndex].toLowerCase();
      if (positionType === "long") {
        rawProfit = exitPrice.minus(entryPrice);
      } else if (positionType === "short") {
        rawProfit = entryPrice.minus(exitPrice);
      } else {
        console.warn(`Unknown position type '${positionType}'`);
        return null;
      }
    } else {
      console.error(`Invalid positionTypes value '${positionTypes}'`);
      return null;
    }

    // Calculate net profit
    let netProfit = rawProfit.times(instrument.bpv).times(size);

    // Subtract commission and slippage if the flag is true
    if (subtractCommissionSlippage) {
      const totalCommission = new Decimal(instrument.commission).times(size);
      const totalSlippage = new Decimal(instrument.slippage).times(size);
      netProfit = netProfit.minus(totalCommission).minus(totalSlippage);
    }

    return {
      entryDate: Timestamp.fromDate(entryDate),
      entryTime: entryTimeStr,
      entryPrice: entryPrice.toNumber(),
      exitDate: Timestamp.fromDate(exitDate),
      exitTime: exitTimeStr,
      exitPrice: exitPrice.toNumber(),
      exitYear: exitDate.getFullYear(),
      exitMonth: exitDate.getMonth() + 1,
      exitDay: exitDate.getDate(),
      size: size.toNumber(),
      positionType,
      netProfit: netProfit.toNumber(),
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
  let totalConsecutiveWins = 0;
  let totalConsecutiveLosses = 0;
  let winStreaks = 0;
  let lossStreaks = 0;
  let maxDrawdown = 0;
  let maxDrawdownAmount = 0;
  let currentDrawdown = 0;
  let peakBalance = initialCapital;
  let troughBalance = initialCapital;
  let maxDrawdownDate = null;
  let totalDrawdownAmount = 0;
  let totalDrawdownPeriod = 0;
  let drawdownCount = 0;

  // Sort trades by date
  trades.sort((a, b) => a.exitDate.toDate() - b.exitDate.toDate());

  const firstTrade = trades[0];
  const lastTrade = trades[trades.length - 1];
  const tradingPeriod = lastTrade.exitDate.toDate() - firstTrade.exitDate.toDate();
  const totalTradingDays = Math.ceil(tradingPeriod / (1000 * 60 * 60 * 24));
  const totalTradingYears = totalTradingDays / 365;

  let balance = initialCapital;
  let monthlyReturns = [];
  let yearlyReturns = [];
  let currentMonthProfit = 0;
  let currentYearProfit = 0;
  let currentMonthStartBalance = initialCapital;
  let currentYearStartBalance = initialCapital;
  let currentMonth = firstTrade.exitDate.toDate().getMonth();
  let currentYear = firstTrade.exitDate.toDate().getFullYear();

  let allTradeNetProfits = [];

  trades.forEach((trade, index) => {
    totalNetProfit += trade.netProfit;
    balance += trade.netProfit;
    allTradeNetProfits.push(trade.netProfit);

    if (trade.netProfit > 0) {
      grossProfit += trade.netProfit;
      winningTrades++;
      consecutiveWins++;
      if (consecutiveWins === 1) winStreaks++;
      consecutiveLosses = 0;
      maxConsecutiveWins = Math.max(maxConsecutiveWins, consecutiveWins);
      largestWin = Math.max(largestWin, trade.netProfit);
    } else if (trade.netProfit < 0) {
      grossLoss += Math.abs(trade.netProfit);
      losingTrades++;
      consecutiveLosses++;
      if (consecutiveLosses === 1) lossStreaks++;
      consecutiveWins = 0;
      maxConsecutiveLosses = Math.max(maxConsecutiveLosses, consecutiveLosses);
      largestLoss = Math.min(largestLoss, trade.netProfit);
    } else {
      evenTrades++;
      consecutiveWins = 0;
      consecutiveLosses = 0;
    }

    // Update drawdown
    if (balance > peakBalance) {
      peakBalance = balance;
      if (currentDrawdown > 0) {
        totalDrawdownAmount += currentDrawdown;
        totalDrawdownPeriod += index - drawdownCount;
        drawdownCount = index;
      }
      currentDrawdown = 0;
    } else {
      currentDrawdown = peakBalance - balance;
      if (currentDrawdown > maxDrawdown) {
        maxDrawdown = currentDrawdown;
        maxDrawdownAmount = currentDrawdown;
        maxDrawdownDate = trade.exitDate.toDate();
      }
    }

    if (balance < troughBalance) {
      troughBalance = balance;
    }

    // Calculate monthly and yearly returns
    const tradeMonth = trade.exitDate.toDate().getMonth();
    const tradeYear = trade.exitDate.toDate().getFullYear();

    if (tradeMonth !== currentMonth || tradeYear !== currentYear) {
      monthlyReturns.push({
        date: new Date(currentYear, currentMonth),
        return: currentMonthProfit / currentMonthStartBalance
      });
      currentMonthProfit = trade.netProfit;
      currentMonthStartBalance = balance - trade.netProfit;

      if (tradeYear !== currentYear) {
        yearlyReturns.push({
          year: currentYear,
          return: currentYearProfit / currentYearStartBalance
        });
        currentYearProfit = trade.netProfit;
        currentYearStartBalance = balance - trade.netProfit;
        currentYear = tradeYear;
      }

      currentMonth = tradeMonth;
    } else {
      currentMonthProfit += trade.netProfit;
      currentYearProfit += trade.netProfit;
    }
  });

  // Add the last month's and year's return
  monthlyReturns.push({
    date: new Date(currentYear, currentMonth),
    return: currentMonthProfit / currentMonthStartBalance
  });
  yearlyReturns.push({
    year: currentYear,
    return: currentYearProfit / currentYearStartBalance
  });

  const totalTrades = trades.length;
  const profitFactor = grossProfit / grossLoss;
  const percentProfitable = (winningTrades / totalTrades) * 100;
  const avgTradeNetProfit = totalNetProfit / totalTrades;
  const medianTradeNetProfit = calculateMedian(allTradeNetProfits);
  const avgWinningTrade = grossProfit / winningTrades;
  const avgLosingTrade = grossLoss / losingTrades;
  const medianWinningTrade = calculateMedian(allTradeNetProfits.filter(profit => profit > 0));
  const medianLosingTrade = calculateMedian(allTradeNetProfits.filter(profit => profit < 0));
  const ratioAvgWinAvgLoss = Math.abs(avgWinningTrade / avgLosingTrade);

  const cagr = (Math.pow((balance / initialCapital), (1 / totalTradingYears)) - 1) * 100;
  const returnOnInitialCapital = (totalNetProfit / initialCapital) * 100;

  // Calculate average monthly return and standard deviation
  const avgMonthlyReturn = monthlyReturns.reduce((sum, month) => sum + month.return, 0) / monthlyReturns.length;
  const stdDevMonthly = calculateStandardDeviation(monthlyReturns.map(month => month.return));
  const stdDevAnnualized = stdDevMonthly * Math.sqrt(12);

  // Calculate downside deviation
  const downsideReturns = monthlyReturns.filter(month => month.return < 0);
  const downsideDeviation = calculateStandardDeviation(downsideReturns.map(month => month.return));

  // Calculate best and worst years
  const bestYear = Math.max(...yearlyReturns.map(year => year.return)) * 100;
  const worstYear = Math.min(...yearlyReturns.map(year => year.return)) * 100;

  // Calculate Sharpe Ratio and Sortino Ratio
  const riskFreeRate = 0.02; // Assuming 2% risk-free rate
  const excessReturn = cagr / 100 - riskFreeRate;
  const sharpeRatio = excessReturn / stdDevAnnualized;
  const sortinoRatio = excessReturn / (downsideDeviation * Math.sqrt(12));

  // Calculate skewness and kurtosis
  const skewness = calculateSkewness(monthlyReturns.map(month => month.return));
  const kurtosis = calculateKurtosis(monthlyReturns.map(month => month.return));

  // Calculate Value at Risk (VaR) and Conditional VaR (CVaR)
  // const historicalVaR = calculateHistoricalVaR(monthlyReturns.map(month => month.return), 0.05);
  // const analyticalVaR = calculateAnalyticalVaR(avgMonthlyReturn, stdDevMonthly, 0.05);
  // const cVaR = calculateConditionalVaR(monthlyReturns.map(month => month.return), 0.05);

  // Calculate positive periods
  const positivePeriods = monthlyReturns.filter(month => month.return > 0).length;
  const positivePeriodsPct = (positivePeriods / monthlyReturns.length) * 100;

  // Calculate gain/loss ratio
  const gainLossRatio = Math.abs(avgWinningTrade / avgLosingTrade);

  return {
    initialCapital: initialCapital,
    endBalance: balance,
    netProfit: totalNetProfit,
    annualizedReturn: cagr,
    standardDeviation: stdDevAnnualized,
    bestYear,
    worstYear,
    maxDrawdownPct: (maxDrawdown / peakBalance) * 100,
    maxDrawdownAmount,
    maxDrawdownDate,
    avgDrawdownAmount: totalDrawdownAmount / drawdownCount,
    avgDrawdownPeriod: totalDrawdownPeriod / drawdownCount,
    avgTradeNetProfit,
    medianTradeNetProfit,
    maxConsecutiveWins,
    avgConsecutiveWins: totalConsecutiveWins / winStreaks,
    maxConsecutiveLosses,
    avgConsecutiveLosses: totalConsecutiveLosses / lossStreaks,
    totalTrades,
    winningTrades,
    losingTrades,
    winPct: percentProfitable,
    avgWinAmount: avgWinningTrade,
    medianWinAmount: medianWinningTrade,
    avgLossAmount: Math.abs(avgLosingTrade),
    medianLossAmount: Math.abs(medianLosingTrade),
    stdDevMonthly,
    stdDevAnnualized,
    downsideDeviation,
    sharpeRatio,
    sortinoRatio,
    skewness,
    kurtosis,
    // historicalVaR,
    // analyticalVaR,
    // cVaR,
    positivePeriods: `${positivePeriods} out of ${monthlyReturns.length} months (${positivePeriodsPct.toFixed(2)}%)`,
    gainLossRatio,
  };
};

// Helper functions (implement these separately)
function calculateMedian(arr) {
  const sorted = arr.slice().sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  return sorted[middle];
}

function calculateStandardDeviation(arr) {
  const n = arr.length;
  const mean = arr.reduce((a, b) => a + b) / n;
  return Math.sqrt(arr.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
}

function calculateSkewness(arr) {
  const n = arr.length;
  const mean = arr.reduce((a, b) => a + b) / n;
  const m3 = arr.map(x => Math.pow(x - mean, 3)).reduce((a, b) => a + b) / n;
  const m2 = arr.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n;
  return m3 / Math.pow(m2, 3/2);
}

function calculateKurtosis(arr) {
  const n = arr.length;
  const mean = arr.reduce((a, b) => a + b) / n;
  const m4 = arr.map(x => Math.pow(x - mean, 4)).reduce((a, b) => a + b) / n;
  const m2 = arr.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n;
  return m4 / Math.pow(m2, 2) - 3;
}

function calculateHistoricalVaR(returns, confidence) {
  const sorted = returns.slice().sort((a, b) => a - b);
  const index = Math.floor(confidence * sorted.length);
  return -sorted[index];
}

function calculateAnalyticalVaR(mean, stdDev, confidence) {
  const z = normalInverse(confidence);
  return -(mean + z * stdDev);
}

function calculateConditionalVaR(returns, confidence) {
  const sorted = returns.slice().sort((a, b) => a - b);
  const index = Math.floor(confidence * sorted.length);
  const cVaRValues = sorted.slice(0, index);
  return -cVaRValues.reduce((a, b) => a + b) / cVaRValues.length;
}

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

