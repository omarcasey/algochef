"use client"
import React from 'react'
import { useStrategy } from "../layout";
import PeriodicalReturns from "@/components/App/PeriodicalReturns";

const Monthly = () => {
  const { strategy } = useStrategy();

  return (
    <div>
      <PeriodicalReturns data={strategy} period="monthly" />
    </div>
  )
}

export default Monthly