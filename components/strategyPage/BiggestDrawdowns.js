import React from "react";

const BiggestDrawdowns = ({ strategy }) => {
  return (
    <div className="rounded-xl shadow-2xl dark:border w-full bg-white dark:bg-black py-6 px-10">
      <h1 className="text-xl text-blue-900 dark:text-white saturate-200 font-medium mb-6">
        10 Biggest Drawdowns
      </h1>
    </div>
  );
};

export default BiggestDrawdowns;
