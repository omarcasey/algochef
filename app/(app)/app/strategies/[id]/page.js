"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  FaChartBar,
  FaChartLine,
  FaRegChartBar,
  FaChartPie,
  FaArrowLeft,
} from "react-icons/fa";
import Link from "next/link";
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
  useUser,
} from "reactfire";
import { collection, doc, query, where } from "firebase/firestore";
import { LoadingSpinner } from "@/components/ui/spinner";

const StrategyPage = () => {
  const { id: strategyId } = useParams();
  const { data: user, status } = useUser();
  const firestore = useFirestore();
  const [activeComponent, setActiveComponent] = useState("Summary");

  // Create a query to filter strategies by userId
  // Create a reference to the specific strategy document
  const strategyRef = doc(firestore, "strategies", strategyId);

  // Fetch strategy document using Reactfire
  const { data: strategy, status: strategyStatus } = useFirestoreDocData(strategyRef);

  console.log(strategyId);
  console.log(strategy);
  console.log(strategyStatus);

  //   const sidebarOptions = [
  //     {
  //       name: "Summary",
  //       icon: <FaChartBar />,
  //       component: <PerformanceSummaryReport data={strategy} />,
  //     },
  //     {
  //       name: "Equity Graphs",
  //       icon: <FaRegChartBar />,
  //       component: <EquityGraphs data={strategy} />,
  //     },
  //     {
  //       name: "Annual Returns",
  //       icon: <FaChartLine />,
  //       component: <AnnualReturns data={strategy} period="annual" />,
  //     },
  //     {
  //       name: "Monthly Returns",
  //       icon: <FaChartLine />,
  //       component: <AnnualReturns data={strategy} period="monthly" />,
  //     },
  //     {
  //       name: "Weekly Returns",
  //       icon: <FaChartLine />,
  //       component: <AnnualReturns data={strategy} period="weekly" />,
  //     },
  //     {
  //       name: "Daily Returns",
  //       icon: <FaChartLine />,
  //       component: <AnnualReturns data={strategy} period="daily" />,
  //     },
  //   ];

  //   const activeOption = sidebarOptions.find(
  //     (option) => option.name === activeComponent
  //   );

  if (status === "loading" || strategyStatus === "loading") {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <LoadingSpinner size={45} />
      </div>
    );
  }

  if (!user) {
    return <div>Please sign in to view strategies.</div>;
  }

  if (strategyStatus === "error") {
    return <div>Error fetching strategies.</div>;
  }

  return (
    <>
      <div className="h-9 border-b border-[#262626] flex items-center">
        <h5 className="pl-6 mb-0">Strategies - {strategy && strategy.name}</h5>
      </div>
      {/* <div className="flex m-5 rounded-xl border border-[#262626]">
        <div className="w-52 text-white fixed top-32 h-screen">
          <ul>
            <Link href="/strategies">
              <li className="flex items-center p-2 pl-4 mt-4 hover:bg-gray-800 rounded-lg cursor-pointer transition-all text-blue-600">
                <FaArrowLeft />{" "}
                <p className="pl-3 font-semibold">Back To Strategies</p>
              </li>
            </Link>
            <div className="h-20"></div>
            {sidebarOptions.map((option) => (
              <li
                key={option.name}
                className={`flex items-center p-2 pl-4 hover:bg-gray-800 rounded-lg cursor-pointer transition-all ${
                  activeComponent === option.name
                    ? "bg-gray-800 text-white"
                    : "text-gray-400"
                }`}
                onClick={() => setActiveComponent(option.name)}
              >
                {option.icon}{" "}
                <p className="pl-3 font-semibold">{option.name}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-grow p-4 ml-52 ">
          {activeOption && activeOption.component}
        </div>
      </div> */}
    </>
  );
};

export default StrategyPage;
