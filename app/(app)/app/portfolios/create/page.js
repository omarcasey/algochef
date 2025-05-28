"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "reactfire";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import {
  query,
  collection,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { Plus, Search } from "lucide-react";

const CreatePortfolio = () => {
  const { data: user, status } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [portfolioName, setPortfolioName] = useState("");
  const [selectedStrategies, setSelectedStrategies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Query to fetch user's strategies
  const strategiesQuery = query(
    collection(firestore, "strategies"),
    where("userId", "==", user ? user.uid : ""),
    orderBy("createdAt", "desc")
  );

  // Fetch strategies using Reactfire
  const { data: strategies, status: strategiesStatus } =
    useFirestoreCollectionData(strategiesQuery, { idField: "id" });

  const handleStrategySelect = (strategyId) => {
    setSelectedStrategies((prev) => {
      if (prev.includes(strategyId)) {
        return prev.filter((id) => id !== strategyId);
      }
      return [...prev, strategyId];
    });
  };

  const handleCreatePortfolio = async () => {
    if (!portfolioName.trim()) {
      toast({
        variant: "destructive",
        title: "Portfolio name required",
        description: "Please enter a name for your portfolio.",
      });
      return;
    }

    if (selectedStrategies.length === 0) {
      toast({
        variant: "destructive",
        title: "No strategies selected",
        description: "Please select at least one strategy for your portfolio.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const portfolioData = {
        name: portfolioName,
        userId: user.uid,
        strategies: selectedStrategies,
        createdAt: serverTimestamp(),
        metrics: {
          netProfit: 0,
          maxDrawdown: 0,
          sharpeRatio: 0,
          noOfStrategies: selectedStrategies.length,
        },
      };

      const docRef = await addDoc(collection(firestore, "portfolios"), portfolioData);
      
      toast({
        title: "Portfolio created successfully",
        description: "Your portfolio has been created.",
      });

      router.push(`/app/portfolios/${docRef.id}`);
    } catch (error) {
      console.error("Error creating portfolio:", error);
      toast({
        variant: "destructive",
        title: "Error creating portfolio",
        description: "There was an error creating your portfolio. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStrategies = strategies?.filter((strategy) =>
    strategy.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (status === "loading" || strategiesStatus === "loading") {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <LoadingSpinner size={45} />
      </div>
    );
  }

  if (!user) {
    return <div>Please sign in to create portfolios.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Portfolio</h1>
      
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="portfolioName">Portfolio Name</Label>
                <Input
                  id="portfolioName"
                  value={portfolioName}
                  onChange={(e) => setPortfolioName(e.target.value)}
                  placeholder="Enter portfolio name"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Select Strategies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search strategies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>

              <ScrollArea className="h-[400px] rounded-md border p-4">
                <div className="space-y-4">
                  {filteredStrategies?.map((strategy) => (
                    <div
                      key={strategy.id}
                      className="flex items-center space-x-4 rounded-lg border p-4"
                    >
                      <Checkbox
                        id={strategy.id}
                        checked={selectedStrategies.includes(strategy.id)}
                        onCheckedChange={() => handleStrategySelect(strategy.id)}
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor={strategy.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {strategy.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {strategy.metrics?.netProfit
                            ? `Net Profit: $${strategy.metrics.netProfit.toLocaleString()}`
                            : "No metrics available"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={handleCreatePortfolio}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size={20} className="mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Portfolio
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePortfolio; 