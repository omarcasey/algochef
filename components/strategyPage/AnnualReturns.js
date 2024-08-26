import React from "react";
import PeriodicalReturns from "@/components/App/PeriodicalReturns";

const AnnualReturns = ({ strategy }) => {
  return (
    <div className="rounded-xl shadow-xl w-full bg-white dark:bg-slate-900 py-6 px-10">
      <h1 className="text-xl text-blue-900 dark:text-white saturate-200 font-medium mb-6">
        Annual Returns
      </h1>
      <PeriodicalReturns data={strategy} period="annual" />
    </div>
  );
};

export default AnnualReturns;
