"use client";
import React from "react";
import ReactApexChart from "react-apexcharts";
import { LoadingSpinner } from "@/components/ui/spinner";

const EquityGraphs = () => {
  const { strategy } = null;
  // const strategy = data;
  const equityCurveData = strategy.equityCurveData.map((point, index) => ({
    x: index,
    y: point.y - 100000, // Subtract 100000 from each y point
  }));
  const equityCurveDataforDrawDown = strategy.equityCurveData.map(
    (point, index) => ({
      x: index,
      y: point.y,
    })
  );

  const monthlyReturns = strategy.monthlyReturns;
  // Prepare data for monthly net profit bar chart
  const monthlyNetProfitData = {
    name: "Monthly Net Profit",
    data: monthlyReturns.map((item) => parseFloat(item.netProfit)),
  };

  const calculateMonthlyNetProfit = (monthlyReturns) => {
    // An array with 12 entries for the 12 months
    const monthlyNetProfit = Array(12).fill(0);

    monthlyReturns.forEach((item) => {
      const month = parseInt(item.period.split("/")[0]) - 1; // Get month and convert it to 0-based index
      monthlyNetProfit[month] += parseFloat(item.netProfit); // Add net profit to respective month
    });

    return monthlyNetProfit;
  };

  const calculateDailyNetProfit = (dailyReturns) => {
    // An array with 5 entries for the 5 weekdays
    const dailyNetProfit = Array(5).fill(0);

    dailyReturns.forEach((item) => {
      // Replace '-' with '/' in date string to avoid issues with different date formats
      const date = new Date(item.period.replace(/-/g, "/"));
      const day = date.getDay() - 1; // getDay() returns 0 (Sunday) to 6 (Saturday), adjust to 0 (Monday) to 4 (Friday)
      if (day >= 0 && day < 5) {
        // Exclude weekends
        dailyNetProfit[day] += parseFloat(item.netProfit); // Add net profit to respective day
      }
    });

    return dailyNetProfit;
  };

  const calculateMonthlyWinPercentage = (monthlyReturns) => {
    // An array with 12 entries for the 12 months
    const monthlyWinPercentage = Array(12).fill(0);
    const monthlyTradeCounts = Array(12).fill(0);

    monthlyReturns.forEach((item) => {
      const month = parseInt(item.period.split("/")[0]) - 1; // Get the month from the period and subtract 1 to make it 0-based
      const percentProfitable = parseFloat(
        item.percentProfitable.replace("%", "")
      ); // Remove "%" and convert to a number
      monthlyWinPercentage[month] += percentProfitable * item.numberOfTrades;
      monthlyTradeCounts[month] += item.numberOfTrades;
    });

    // Calculate the average win percentage for each month
    for (let i = 0; i < 12; i++) {
      if (monthlyTradeCounts[i] !== 0) {
        monthlyWinPercentage[i] /= monthlyTradeCounts[i];
      }
    }

    return monthlyWinPercentage;
  };

  const calculateMonthlyTradeCounts = (monthlyReturns) => {
    // An array with 12 entries for the 12 months
    const monthlyTradeCounts = Array(12).fill(0);

    monthlyReturns.forEach((item) => {
      const month = parseInt(item.period.split("/")[0]) - 1; // Get the month from the period and subtract 1 to make it 0-based
      monthlyTradeCounts[month] += parseInt(item.numberOfTrades);
    });

    return monthlyTradeCounts;
  };

  const annualReturns = strategy.annualReturns;
  // Prepare data for monthly net profit bar chart
  const annualNetProfitData = {
    name: "Annual Net Profit",
    data: annualReturns.map((item) => parseFloat(item.netProfit)),
  };

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

  const equityOptions = {
    chart: {
      type: "area",
      height: 350,
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    series: [
      {
        name: "Equity",
        data: equityCurveData,
      },
    ],
    stroke: {
      width: 2,
    },
    fill: {
      opacity: 0.7,
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.9,
        opacityTo: 0.3,
        stops: [0, 100],
      },
    },
    title: {
      text: "Equity Curve",
      align: "left",
      style: {
        fontWeight: 500,
      },
    },
    xaxis: {
      type: "numeric",
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return (val + 100000).toFixed(2);
        },
      },
    },
    grid: {
      borderColor: "#2E3033",
      clipMarkers: false,
    },
    tooltip: {
      theme: "dark",
    },
    dataLabels: {
      enabled: false, // Disable data labels on the graph
    },
    colors: ["#00C851"], // Set the color of equity graph to green
  };

  const drawdownOptions = {
    chart: {
      type: "area",
      height: 200,
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    series: [
      {
        name: "Drawdown",
        data: drawdownData,
      },
    ],
    stroke: {
      width: 2,
    },
    fill: {
      opacity: 0.7,
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.9,
        opacityTo: 0.3,
        stops: [0, 100],
      },
    },
    xaxis: {
      axisBorder: {
        show: false, // Hide x-axis line
      },
      labels: {
        show: false, // Hide x-axis labels
      },
      axisTicks: {
        show: false, // Hide x-axis ticks
      },
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val.toFixed(2) + "%"; // Format drawdown labels as percentages
        },
      },
    },
    grid: {
      borderColor: "#2E3033",
      clipMarkers: false,
    },
    tooltip: {
      theme: "dark",
    },
    dataLabels: {
      enabled: false, // Disable data labels on the graph
    },
    colors: ["#FF4444"], // Set the color of drawdown graph to red
  };

  const monthlyReturnsOptions = {
    chart: {
      type: "bar",
      height: 550,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "80%",
        colors: {
          ranges: [
            {
              from: -Infinity,
              to: 0,
              color: "#FF4444", // Red for negative values
            },
            {
              from: 0,
              to: Infinity,
              color: "#00C851", // Green for positive values
            },
          ],
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: "category", // Use a categorical x-axis
      categories: monthlyReturns.map((item) => item.period), // Use the period as categories
      labels: {
        rotate: -90,
      },
      tickAmount: 70, // Only display 10 labels on the x-axis
    },
    yaxis: {
      title: {
        text: "Monthly Net Profit",
      },
    },
    grid: {
      borderColor: "#2E3033",
      clipMarkers: false,
    },
    tooltip: {
      theme: "dark",
    },
  };

  const annualReturnsOptions = {
    chart: {
      type: "bar",
      height: 550,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "80%",
        colors: {
          ranges: [
            {
              from: -Infinity,
              to: 0,
              color: "#FF4444", // Red for negative values
            },
            {
              from: 0,
              to: Infinity,
              color: "#00C851", // Green for positive values
            },
          ],
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: "category", // Use a categorical x-axis
      categories: annualReturns.map((item) => item.period), // Use the period as categories
      labels: {
        rotate: -90,
      },
      tickAmount: 70, // Only display 10 labels on the x-axis
    },
    yaxis: {
      title: {
        text: "Annual Net Profit",
      },
    },
    grid: {
      borderColor: "#2E3033",
      clipMarkers: false,
    },
    tooltip: {
      theme: "dark",
    },
  };

  const monthlyTotalNetProfitData = calculateMonthlyNetProfit(monthlyReturns);

  const monthlyTotalNetProfitOptions = {
    chart: {
      type: "bar",
      height: 550,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "80%",
        colors: {
          ranges: [
            {
              from: -Infinity,
              to: 0,
              color: "#FF4444", // Red for negative values
            },
            {
              from: 0,
              to: Infinity,
              color: "#00C851", // Green for positive values
            },
          ],
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: "category", // Use a categorical x-axis
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ], // Months
      labels: {
        rotate: -90,
      },
    },
    yaxis: {
      title: {
        text: "Monthly Total Net Profit",
      },
    },
    grid: {
      borderColor: "#2E3033",
      clipMarkers: false,
    },
    tooltip: {
      theme: "dark",
    },
  };

  const dailyReturns = strategy.dailyReturns;
  const dailyNetProfitData = calculateDailyNetProfit(dailyReturns);

  const dailyReturnsOptions = {
    chart: {
      type: "bar",
      height: 550,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "80%",
        colors: {
          ranges: [
            {
              from: -Infinity,
              to: 0,
              color: "#FF4444", // Red for negative values
            },
            {
              from: 0,
              to: Infinity,
              color: "#00C851", // Green for positive values
            },
          ],
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: "category", // Use a categorical x-axis
      categories: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], // Use the days of the week as categories
      labels: {
        rotate: -90,
      },
      tickAmount: 5, // Only display 5 labels on the x-axis
    },
    yaxis: {
      title: {
        text: "Daily Net Profit",
      },
    },
    grid: {
      borderColor: "#2E3033",
      clipMarkers: false,
    },
    tooltip: {
      theme: "dark",
    },
  };

  const monthlyWinPercentageData =
    calculateMonthlyWinPercentage(monthlyReturns);

  const monthlyWinPercentageOptions = {
    chart: {
      type: "bar",
      height: 550,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "80%",
        colors: {
          ranges: [
            {
              from: 0,
              to: 50,
              color: "#FF4444", // red for values below 50
            },
            {
              from: 50,
              to: Infinity,
              color: "#00C851", // Green for values 50 and above
            },
          ],
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toFixed(2) + "%"; // Format labels as percentages
      },
    },
    xaxis: {
      type: "category", // Use a categorical x-axis
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ], // Use the months as categories
      labels: {
        rotate: -90,
      },
      tickAmount: 12, // Only display 12 labels on the x-axis
    },
    yaxis: {
      title: {
        text: "Monthly Win Percentage",
      },
      labels: {
        formatter: function (val) {
          return val.toFixed(2) + "%"; // Format y-axis labels as percentages
        },
      },
    },
    grid: {
      borderColor: "#2E3033",
      clipMarkers: false,
    },
    tooltip: {
      theme: "dark",
    },
  };

  const monthlyTotalTradesData = calculateMonthlyTradeCounts(monthlyReturns);
  const monthlyTotalTradesOptions = {
    chart: {
      type: "bar",
      height: 550,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: "80%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: "category", // Use a categorical x-axis
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ], // Use the months as categories
      labels: {
        rotate: -90,
      },
      tickAmount: 12, // Only display 12 labels on the x-axis
    },
    yaxis: {
      title: {
        text: "Total Number of Trades",
      },
    },
    grid: {
      borderColor: "#2E3033",
      clipMarkers: false,
    },
    tooltip: {
      theme: "dark",
    },
    colors: ["#e8bc52"], // Specify the color of the bars
  };

  if (
    !equityCurveData ||
    !drawdownData ||
    !monthlyNetProfitData ||
    !monthlyTotalNetProfitData ||
    !dailyNetProfitData
  ) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <LoadingSpinner size={45} />
      </div>
    );
  }

  return (
    <div>
      <ReactApexChart
        options={equityOptions}
        series={equityOptions.series}
        type="area"
        height={350}
      />
      <ReactApexChart
        style={{
          marginTop: "-2rem",
          marginLeft: "0.5rem",
          marginRight: "0.6rem",
        }}
        options={drawdownOptions}
        series={drawdownOptions.series}
        type="area"
        height={200}
      />
      <ReactApexChart
        style={{ marginTop: "2rem", marginLeft: "0.2rem" }}
        options={monthlyReturnsOptions}
        series={[monthlyNetProfitData]}
        type="bar"
        height={550}
      />
      <ReactApexChart
        style={{ marginTop: "2rem", marginLeft: "0.2rem" }}
        options={annualReturnsOptions}
        series={[annualNetProfitData]}
        type="bar"
        height={550}
      />

      <ReactApexChart
        style={{ marginTop: "2rem", marginLeft: "0.2rem" }}
        options={monthlyTotalNetProfitOptions}
        series={[
          { name: "Monthly Total Net Profit", data: monthlyTotalNetProfitData },
        ]}
        type="bar"
        height={550}
      />

      <ReactApexChart
        style={{ marginTop: "2rem", marginLeft: "0.2rem" }}
        options={dailyReturnsOptions}
        series={[{ name: "Daily Net Profit", data: dailyNetProfitData }]}
        type="bar"
        height={550}
      />

      <ReactApexChart
        style={{ marginTop: "2rem", marginLeft: "0.2rem" }}
        options={monthlyWinPercentageOptions}
        series={[{ name: "Win Percentage", data: monthlyWinPercentageData }]}
        type="bar"
        height={550}
      />

      <ReactApexChart
        style={{ marginTop: "2rem", marginLeft: "0.2rem" }}
        options={monthlyTotalTradesOptions}
        series={[{ name: "Total Trades", data: monthlyTotalTradesData }]}
        type="bar"
        height={550}
      />
    </div>
  );
};

export default EquityGraphs;
