import Decimal from "decimal.js";
import { Timestamp } from "firebase/firestore";
import { mean, std } from "mathjs";

export const processTradeData = (
  columnLabels,
  data,
  positionTypes,
  instrument,
  subtractCommissionSlippage
) => {
  const columns = Object.values(columnLabels);
  const rows = data;

  if (!rows.length) {
    console.error("No data found.");
    return [];
  }

  const combineDateAndTime = (dateStr, timeStr) => {
    if (!dateStr) return null;
    const [month, day, year] = dateStr
      .split("/")
      .map((num) => parseInt(num, 10));
    let hours = 0,
      minutes = 0;
    if (timeStr) {
      let [time, period] = timeStr.split(" ");
      [hours, minutes] = time.split(":").map((num) => parseInt(num, 10));
      if (period.toLowerCase() === "pm" && hours !== 12) hours += 12;
      if (period.toLowerCase() === "am" && hours === 12) hours = 0;
    }
    return new Date(year, month - 1, day, hours, minutes);
  };

  const processedTrades = rows
    .map((row) => {
      const entryDateStr = row[columns.indexOf("Entry Date")];
      const exitDateStr = row[columns.indexOf("Exit Date")];
      const entryTimeStr = columns.includes("Entry Time")
        ? row[columns.indexOf("Entry Time")]
        : null;
      const exitTimeStr = columns.includes("Exit Time")
        ? row[columns.indexOf("Exit Time")]
        : null;

      const entryDate = combineDateAndTime(entryDateStr, entryTimeStr);
      const exitDate = combineDateAndTime(exitDateStr, exitTimeStr);

      if (!entryDate || !exitDate) {
        console.error("Invalid date format", {
          entryDateStr,
          exitDateStr,
          entryTimeStr,
          exitTimeStr,
        });
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
          console.error(
            "Long/Short column not found when positionTypes is 'both'"
          );
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
    })
    .filter((trade) => trade !== null);

  // Sort the processed trades by exit date (oldest to newest)
  return processedTrades.sort(
    (a, b) => a.exitDate.toDate() - b.exitDate.toDate()
  );
};

export const calculateTradingMetrics = (
  trades,
  initialCapital,
  capitalAllocation = 1
) => {
  // Check if trades array is empty
  if (trades.length === 0) {
    return {
      netProfit: 0,
      annualizedReturn: 0,
      sharpeRatio: 0,
      maxDrawdownPct: 0,
      // ... add other metrics with default values
    };
  }

  // Adjust initial capital based on allocation
  initialCapital = initialCapital * capitalAllocation;

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
  const tradingPeriod =
    lastTrade.exitDate.toDate() - firstTrade.exitDate.toDate();
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
        return: currentMonthProfit / currentMonthStartBalance,
      });
      currentMonthProfit = trade.netProfit;
      currentMonthStartBalance = balance - trade.netProfit;

      if (tradeYear !== currentYear) {
        yearlyReturns.push({
          year: currentYear,
          return: currentYearProfit / currentYearStartBalance,
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
    return: currentMonthProfit / currentMonthStartBalance,
  });
  yearlyReturns.push({
    year: currentYear,
    return: currentYearProfit / currentYearStartBalance,
  });

  const totalTrades = trades.length;
  const profitFactor = grossProfit / grossLoss;
  const percentProfitable = (winningTrades / totalTrades) * 100;
  const avgTradeNetProfit = totalNetProfit / totalTrades;
  const medianTradeNetProfit = calculateMedian(allTradeNetProfits);
  const avgWinningTrade = grossProfit / winningTrades;
  const avgLosingTrade = grossLoss / losingTrades;
  const medianWinningTrade = calculateMedian(
    allTradeNetProfits.filter((profit) => profit > 0)
  );
  const medianLosingTrade = calculateMedian(
    allTradeNetProfits.filter((profit) => profit < 0)
  );
  const ratioAvgWinAvgLoss = Math.abs(avgWinningTrade / avgLosingTrade);

  const cagr =
    (Math.pow(balance / initialCapital, 1 / totalTradingYears) - 1) * 100;
  const returnOnInitialCapital = (totalNetProfit / initialCapital) * 100;

  // Calculate return to drawdown ratio
  const maxDrawdownPercentage = (maxDrawdown / peakBalance) * 100;
  const returnToDrawdownRatio = cagr / maxDrawdownPercentage;

  // Calculate average monthly return and standard deviation
  const avgMonthlyReturn =
    monthlyReturns.length > 0
      ? monthlyReturns.reduce((sum, month) => sum + month.return, 0) /
        monthlyReturns.length
      : 0;
  const stdDevMonthly = calculateStandardDeviation(
    monthlyReturns.map((month) => month.return)
  );
  const stdDevAnnualized = stdDevMonthly * Math.sqrt(12);

  // Calculate downside deviation
  const downsideReturns = monthlyReturns.filter((month) => month.return < 0);
  const downsideDeviation = calculateStandardDeviation(
    downsideReturns.map((month) => month.return)
  );

  // Calculate best and worst years
  const bestYear = Math.max(...yearlyReturns.map((year) => year.return)) * 100;
  const worstYear = Math.min(...yearlyReturns.map((year) => year.return)) * 100;

  // Calculate Sharpe Ratio and Sortino Ratio
  const riskFreeRate = 0.02; // Assuming 2% risk-free rate
  const excessReturn = cagr / 100 - riskFreeRate;
  const sharpeRatio = excessReturn / stdDevAnnualized;
  const sortinoRatio = excessReturn / (downsideDeviation * Math.sqrt(12));

  // Calculate skewness and kurtosis
  const skewness = calculateSkewness(
    monthlyReturns.map((month) => month.return)
  );
  const kurtosis = calculateKurtosis(
    monthlyReturns.map((month) => month.return)
  );

  // Calculate Value at Risk (VaR) and Conditional VaR (CVaR)
  // const historicalVaR = calculateHistoricalVaR(monthlyReturns.map(month => month.return), 0.05);
  // const analyticalVaR = calculateAnalyticalVaR(avgMonthlyReturn, stdDevMonthly, 0.05);
  // const cVaR = calculateConditionalVaR(monthlyReturns.map(month => month.return), 0.05);

  // Calculate positive periods
  const positivePeriods = monthlyReturns.filter(
    (month) => month.return > 0
  ).length;
  const positivePeriodsPct = (positivePeriods / monthlyReturns.length) * 100;

  // Calculate gain/loss ratio
  const gainLossRatio = Math.abs(avgWinningTrade / avgLosingTrade);

  return {
    initialCapital: initialCapital,
    endBalance: balance,
    netProfit: totalNetProfit,
    annualizedReturn: cagr,
    returnToDrawdownRatio: returnToDrawdownRatio,
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
    positivePeriods: `${positivePeriods} out of ${
      monthlyReturns.length
    } months (${positivePeriodsPct.toFixed(2)}%)`,
    gainLossRatio,
  };
};

export const calculateBenchmarkMetrics = (benchmarkPrices, trades, initialCapital) => {
  // Early return if no data
  if (!benchmarkPrices?.length || !trades?.length) {
    return null;
  }

  // Get strategy date range
  const strategyStartDate = trades[0].exitDate.toDate();
  const strategyEndDate = trades[trades.length - 1].exitDate.toDate();

  // Filter benchmark prices to match strategy period
  const relevantBenchmarkPrices = benchmarkPrices.filter(price => {
    const priceDate = price.date.toDate();
    return priceDate >= strategyStartDate && priceDate <= strategyEndDate;
  });

  if (relevantBenchmarkPrices.length === 0) {
    return null;
  }

  // Initialize metrics
  let balance = initialCapital;
  let peakBalance = initialCapital;
  let maxDrawdown = 0;
  let maxDrawdownAmount = 0;
  let maxDrawdownDate = null;
  let monthlyReturns = [];
  let yearlyReturns = [];
  let currentMonthProfit = 0;
  let currentYearProfit = 0;
  let currentMonthStartBalance = initialCapital;
  let currentYearStartBalance = initialCapital;
  let currentMonth = strategyStartDate.getMonth();
  let currentYear = strategyStartDate.getFullYear();

  // Calculate trading period
  const tradingPeriod = strategyEndDate - strategyStartDate;
  const totalTradingDays = Math.ceil(tradingPeriod / (1000 * 60 * 60 * 24));
  const totalTradingYears = totalTradingDays / 365;

  // Calculate metrics for each price point
  relevantBenchmarkPrices.forEach((price, index) => {
    const priceDate = price.date.toDate();
    const dailyReturn = price.return;
    const profit = balance * dailyReturn;
    
    balance += profit;

    // Update drawdown
    if (balance > peakBalance) {
      peakBalance = balance;
    } else {
      const currentDrawdown = peakBalance - balance;
      if (currentDrawdown > maxDrawdown) {
        maxDrawdown = currentDrawdown;
        maxDrawdownAmount = currentDrawdown;
        maxDrawdownDate = priceDate;
      }
    }

    // Calculate monthly and yearly returns
    const priceMonth = priceDate.getMonth();
    const priceYear = priceDate.getFullYear();

    if (priceMonth !== currentMonth || priceYear !== currentYear) {
      // Add monthly return
      monthlyReturns.push({
        date: new Date(currentYear, currentMonth),
        return: currentMonthProfit / currentMonthStartBalance,
      });
      currentMonthProfit = profit;
      currentMonthStartBalance = balance - profit;

      // Add yearly return if year changes
      if (priceYear !== currentYear) {
        yearlyReturns.push({
          year: currentYear,
          return: currentYearProfit / currentYearStartBalance,
        });
        currentYearProfit = profit;
        currentYearStartBalance = balance - profit;
        currentYear = priceYear;
      }

      currentMonth = priceMonth;
    } else {
      currentMonthProfit += profit;
      currentYearProfit += profit;
    }
  });

  // Add final month and year returns
  monthlyReturns.push({
    date: new Date(currentYear, currentMonth),
    return: currentMonthProfit / currentMonthStartBalance,
  });
  yearlyReturns.push({
    year: currentYear,
    return: currentYearProfit / currentYearStartBalance,
  });

  // Calculate return metrics
  const totalReturn = ((balance - initialCapital) / initialCapital) * 100;
  const cagr = (Math.pow(balance / initialCapital, 1 / totalTradingYears) - 1) * 100;
  
  // Calculate standard deviation
  const monthlyReturnValues = monthlyReturns.map(month => month.return);
  const stdDevMonthly = calculateStandardDeviation2(monthlyReturnValues);
  const stdDevAnnualized = stdDevMonthly * Math.sqrt(12);

  // Calculate downside deviation
  const downsideReturns = monthlyReturns.filter(month => month.return < 0);
  const downsideDeviation = calculateStandardDeviation2(downsideReturns.map(month => month.return));

  // Calculate Sharpe and Sortino ratios
  const riskFreeRate = 0.02; // Assuming 2% risk-free rate
  const excessReturn = cagr / 100 - riskFreeRate;
  const sharpeRatio = excessReturn / stdDevAnnualized;
  const sortinoRatio = excessReturn / (downsideDeviation * Math.sqrt(12));

  // Calculate positive periods
  const positivePeriods = monthlyReturns.filter(month => month.return > 0).length;
  const positivePeriodsPct = (positivePeriods / monthlyReturns.length) * 100;

  return {
    initialCapital,
    endBalance: balance,
    totalReturn,
    annualizedReturn: cagr,
    maxDrawdownPct: (maxDrawdown / peakBalance) * 100,
    maxDrawdownAmount,
    maxDrawdownDate,
    standardDeviation: stdDevAnnualized,
    sharpeRatio,
    sortinoRatio,
    bestYear: Math.max(...yearlyReturns.map(year => year.return)) * 100,
    worstYear: Math.min(...yearlyReturns.map(year => year.return)) * 100,
    positivePeriods: `${positivePeriods} out of ${monthlyReturns.length} months (${positivePeriodsPct.toFixed(2)}%)`,
    monthlyReturns,
    yearlyReturns,
  };
};

// New function to combine trades from multiple strategies
export const combineStrategyTrades = (strategies, allocations) => {
  let combinedTrades = [];

  strategies.forEach((strategy, index) => {
    const allocation = allocations[index];
    const adjustedTrades = strategy.trades.map((trade) => ({
      ...trade,
      size: trade.size * allocation,
      netProfit: trade.netProfit * allocation,
    }));
    combinedTrades = combinedTrades.concat(adjustedTrades);
  });

  // Sort combined trades by exit date
  return combinedTrades.sort(
    (a, b) => a.exitDate.toDate() - b.exitDate.toDate()
  );
};

// New function to calculate portfolio metrics
export const calculatePortfolioMetrics = (
  strategies,
  allocations,
  totalCapital
) => {
  // Check if there are any strategies
  if (strategies.length === 0) {
    return {
      netProfit: 0,
      annualizedReturn: 0,
      sharpeRatio: 0,
      maxDrawdownPct: 0,
      strategyAllocations: [],
      strategyReturns: [],
      correlationMatrix: [],
    };
  }

  const combinedTrades = combineStrategyTrades(strategies, allocations);

  // Calculate total allocation (should sum to 1)
  const totalAllocation = allocations.reduce(
    (sum, allocation) => sum + allocation,
    0
  );

  // Calculate portfolio metrics
  const portfolioMetrics = calculateTradingMetrics(
    combinedTrades,
    totalCapital,
    totalAllocation
  );

  // Calculate additional portfolio-specific metrics
  const strategyReturns = strategies.map(
    (strategy) =>
      calculateTradingMetrics(strategy.trades, strategy.initialCapital)
        .annualizedReturn
  );

  // Calculate correlation matrix
  const correlationMatrix = calculateCorrelationMatrix(strategies);

  return {
    ...portfolioMetrics,
    strategyAllocations: allocations,
    strategyReturns,
    correlationMatrix,
  };
};

// Helper function to calculate correlation matrix
const calculateCorrelationMatrix = (strategies) => {
  const returns = strategies.map((strategy) =>
    strategy.trades.map((trade) => trade.netProfit / trade.size)
  );

  const correlationMatrix = [];
  for (let i = 0; i < strategies.length; i++) {
    correlationMatrix[i] = [];
    for (let j = 0; j < strategies.length; j++) {
      correlationMatrix[i][j] = calculateCorrelation(returns[i], returns[j]);
    }
  }

  return correlationMatrix;
};

// Helper function to calculate correlation between two arrays
const calculateCorrelation = (array1, array2) => {
  const mean1 = mean(array1);
  const mean2 = mean(array2);
  const std1 = std(array1);
  const std2 = std(array2);

  const length = Math.min(array1.length, array2.length);
  let sum = 0;
  for (let i = 0; i < length; i++) {
    sum += (array1[i] - mean1) * (array2[i] - mean2);
  }

  return sum / (length * std1 * std2);
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

// Helper functions
function calculateStandardDeviation(arr) {
  if (arr.length === 0) return 0;
  const n = arr.length;
  const mean = arr.reduce((a, b) => a + b, 0) / n;
  return Math.sqrt(
    arr.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / n
  );
}

// Helper function for standard deviation
const calculateStandardDeviation2 = (values) => {
  const n = values.length;
  if (n < 2) return 0;

  const mean = values.reduce((sum, value) => sum + value, 0) / n;
  const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
  const variance = squaredDiffs.reduce((sum, value) => sum + value, 0) / (n - 1);
  
  return Math.sqrt(variance);
};

function calculateSkewness(arr) {
  if (arr.length === 0) return 0;
  const n = arr.length;
  const mean = arr.reduce((a, b) => a + b, 0) / n;
  const m3 =
    arr.map((x) => Math.pow(x - mean, 3)).reduce((a, b) => a + b, 0) / n;
  const m2 =
    arr.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / n;
  return m3 / Math.pow(m2, 3 / 2);
}

function calculateKurtosis(arr) {
  if (arr.length === 0) return 0;
  const n = arr.length;
  const mean = arr.reduce((a, b) => a + b, 0) / n;
  const m4 =
    arr.map((x) => Math.pow(x - mean, 4)).reduce((a, b) => a + b, 0) / n;
  const m2 =
    arr.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / n;
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
