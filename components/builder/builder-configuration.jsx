import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

export function BuilderConfiguration({ values, onChange, strategies }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange(name, Number(value));
  };

  const handleSelectChange = (name, value) => {
    onChange(name, value);
  };

  const handleSliderChange = (name, value) => {
    onChange(name, value[0]);
  };

  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="basic">Basic</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="minStrategies">Min Strategies</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 ml-2 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-56">Minimum number of strategies to include in each portfolio</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center space-x-2">
              <Slider 
                id="minStrategies"
                min={1} 
                max={Math.min(10, strategies.length)} 
                step={1}
                value={[values.minStrategies]}
                onValueChange={(value) => handleSliderChange("minStrategies", value)}
                className="flex-1"
              />
              <div className="w-12 text-center">{values.minStrategies}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="maxStrategies">Max Strategies</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 ml-2 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-56">Maximum number of strategies to include in each portfolio</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center space-x-2">
              <Slider 
                id="maxStrategies"
                min={values.minStrategies} 
                max={Math.min(10, strategies.length)} 
                step={1}
                value={[values.maxStrategies]}
                onValueChange={(value) => handleSliderChange("maxStrategies", value)}
                className="flex-1"
              />
              <div className="w-12 text-center">{values.maxStrategies}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="totalCapital">Initial Capital</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 ml-2 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-56">Initial capital to simulate in your portfolio</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="totalCapital"
              name="totalCapital"
              type="number"
              value={values.totalCapital}
              onChange={handleInputChange}
              min={1000}
              step={1000}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="rankingFunction">Ranking Method</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 ml-2 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-56">Method used to rank and compare portfolios</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select 
              value={values.rankingFunction} 
              onValueChange={(value) => handleSelectChange("rankingFunction", value)}
            >
              <SelectTrigger id="rankingFunction">
                <SelectValue placeholder="Select ranking method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="netProfit">Net Profit</SelectItem>
                <SelectItem value="annualizedReturn">Annualized Return</SelectItem>
                <SelectItem value="sharpeRatio">Sharpe Ratio</SelectItem>
                <SelectItem value="maxDrawdownPct">Max Drawdown %</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="advanced">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="searchMethod">Search Algorithm</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 ml-2 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-60">Method used to search for optimal portfolio combinations</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select 
              value={values.searchMethod} 
              onValueChange={(value) => handleSelectChange("searchMethod", value)}
            >
              <SelectTrigger id="searchMethod">
                <SelectValue placeholder="Select search method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bruteforce">Brute Force</SelectItem>
                <SelectItem value="genetic">Genetic Algorithm</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="maxStoredPortfolios">Results To Keep</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 ml-2 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-60">Number of top portfolios to keep in results</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center space-x-2">
              <Slider 
                id="maxStoredPortfolios"
                min={5} 
                max={100} 
                step={5}
                value={[values.maxStoredPortfolios]}
                onValueChange={(value) => handleSliderChange("maxStoredPortfolios", value)}
                className="flex-1"
              />
              <div className="w-12 text-center">{values.maxStoredPortfolios}</div>
            </div>
          </div>
          
          {values.searchMethod === "genetic" && (
            <>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="populationSize">Population Size</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-4 w-4 ml-2 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-60">Size of population in genetic algorithm</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center space-x-2">
                  <Slider 
                    id="populationSize"
                    min={10} 
                    max={200} 
                    step={10}
                    value={[values.populationSize]}
                    onValueChange={(value) => handleSliderChange("populationSize", value)}
                    className="flex-1"
                  />
                  <div className="w-12 text-center">{values.populationSize}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="generations">Generations</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-4 w-4 ml-2 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-60">Number of generations in genetic algorithm</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex items-center space-x-2">
                  <Slider 
                    id="generations"
                    min={5} 
                    max={100} 
                    step={5}
                    value={[values.generations]}
                    onValueChange={(value) => handleSliderChange("generations", value)}
                    className="flex-1"
                  />
                  <div className="w-12 text-center">{values.generations}</div>
                </div>
              </div>
            </>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
} 