import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";

const PeriodicalReturns = ({ data, period }) => {
  let returnsData = data.annualReturns;

  if (period === "monthly") {
    returnsData = data.monthlyReturns;
  } else if (period === "weekly") {
    returnsData = data.weeklyReturns;
  } else if (period === "daily") {
    returnsData = data.dailyReturns;
  }

  // Reverse the returnsData array to show most recent data first
  returnsData = returnsData.slice().reverse();

  return (
    <div className="flex items-center justify-center pt-10 w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Period</TableHead>
              <TableHead>Net Profit</TableHead>
              <TableHead>Return on IE</TableHead>
              <TableHead>Return on TE</TableHead>
              <TableHead># of Trades</TableHead>
              <TableHead>Profit Factor</TableHead>
              <TableHead>% Profitable</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {returnsData &&
              returnsData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.period}</TableCell>
                  <TableCell>
                    <span
                      className={`${item.netProfit < 0 ? "text-red-500" : ""}`}
                    >
                      {item.netProfit < 0
                        ? `($${Math.abs(item.netProfit).toFixed(2)})`
                        : `$${item.netProfit}`}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`${item.returnOnIE < 0 ? "text-red-500" : ""}`}
                    >
                      {item.returnOnIE < 0
                        ? `(${Math.abs(item.returnOnIE)}%)`
                        : `${item.returnOnIE}%`}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`${item.returnOnTE < 0 ? "text-red-500" : ""}`}
                    >
                      {item.returnOnTE < 0
                        ? `(${Math.abs(item.returnOnTE)}%)`
                        : `${item.returnOnTE}%`}
                    </span>
                  </TableCell>
                  <TableCell>{item.numberOfTrades}</TableCell>
                  <TableCell>{item.profitFactor}</TableCell>
                  <TableCell>{item.percentProfitable}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PeriodicalReturns;
