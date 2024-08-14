import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "../ui/scroll-area";

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
    <div className="p-4">

        <Table wrapperClassName="overflow-clip rounded-md border">
          <TableHeader className="sticky top-0 bg-background z-10 rounded-md bg-neutral-800">
            <TableRow>
              <TableHead className="rounded-tl-md">Period</TableHead>
              <TableHead>Net Profit</TableHead>
              <TableHead>Return on IE</TableHead>
              <TableHead>Return on TE</TableHead>
              <TableHead># of Trades</TableHead>
              <TableHead>Profit Factor</TableHead>
              <TableHead className="rounded-tr-md">% Profitable</TableHead>
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
  );
};

export default PeriodicalReturns;
