"use client"
import React from 'react'
import { useStrategy } from "../layout";
import PeriodicalReturns from "@/components/App/PeriodicalReturns";

const Annual = () => {
  const { strategy } = useStrategy();

  return (
    <div>
      <PeriodicalReturns data={strategy} period="annual" />
    </div>
  )
}

export default Annual