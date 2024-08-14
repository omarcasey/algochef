"use client";
import React from "react";
import { useStrategy } from "../layout";
import PeriodicalReturns from "@/components/App/PeriodicalReturns";

const Weekly = () => {
  const { strategy } = useStrategy();

  return <PeriodicalReturns data={strategy} period="weekly" />;
};

export default Weekly;
