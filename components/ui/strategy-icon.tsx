import React from 'react';
import { cn } from '@/lib/utils';
import { BrainCircuit, LineChart, Zap, PieChart, BarChart, TrendingUp } from 'lucide-react';

type StrategyIconName = 
  | 'trend-following'
  | 'mean-reversion'
  | 'breakout'
  | 'ai-adaptive'
  | 'index-investing';

type StrategyIconProps = {
  name: StrategyIconName;
  className?: string;
  size?: number;
  color?: string;
};

export const StrategyIcon = ({ name, className, size = 24, color }: StrategyIconProps) => {
  const IconComponent = getIconByName(name);
  
  return (
    <IconComponent 
      className={cn(className)} 
      size={size} 
      color={color} 
    />
  );
};

function getIconByName(name: StrategyIconName) {
  switch (name) {
    case 'trend-following':
      return BrainCircuit;
    case 'mean-reversion':
      return LineChart;
    case 'breakout':
      return Zap;
    case 'ai-adaptive':
      return BrainCircuit;
    case 'index-investing':
      return PieChart;
    default:
      return TrendingUp;
  }
} 