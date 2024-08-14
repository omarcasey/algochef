"use client"
import React from 'react'
import { useStrategy } from "../layout";
import PeriodicalReturns from "@/components/App/PeriodicalReturns";

const Daily = () => {
  const { strategy } = useStrategy();

  return (
    <div className=''>
      <PeriodicalReturns data={strategy} period="daily" />
    </div>
  )
}

export default Daily