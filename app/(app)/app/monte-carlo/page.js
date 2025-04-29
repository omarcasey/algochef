"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFirestore, useFirestoreCollection, useFirestoreDocData } from "reactfire";
import { collection, query, orderBy, doc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MonteCarloAnalysis from "@/components/strategyPage/MonteCarloAnalysis";
import { useUser } from "reactfire";

const MonteCarloPage = () => {
  const { data: user, status } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [selectedStrategyId, setSelectedStrategyId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set up the query at the top level
  const strategiesRef = collection(firestore, "strategies");
  const q = query(strategiesRef, orderBy("createdAt", "desc"));
  const { data: strategiesData } = useFirestoreCollection(q);

  // Get selected strategy data
  const strategyRef = selectedStrategyId ? doc(firestore, "strategies", selectedStrategyId) : null;
  const { data: selectedStrategy } = useFirestoreDocData(strategyRef || doc(firestore, "strategies", "dummy-id"));

  // Get trades for selected strategy
  const tradesRef = selectedStrategyId ? collection(firestore, `strategies/${selectedStrategyId}/trades`) : null;
  const tradesQuery = tradesRef ? query(tradesRef, orderBy("order")) : null;
  const { data: tradesData } = useFirestoreCollection(tradesQuery || query(collection(firestore, "strategies/dummy-id/trades")));

  // Process the data when it's available
  useEffect(() => {
    if (strategiesData) {
      setLoading(false);
    }
  }, [strategiesData]);

  if (status === "loading" || loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <LoadingSpinner size={45} />
      </div>
    );
  }

  if (!user) {
    return <div>Please sign in to view Monte Carlo analysis.</div>;
  }

  const strategies = strategiesData ? strategiesData.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) : [];

  const trades = tradesData ? tradesData.docs.map((doc) => doc.data()) : [];

  return (
    <div className="flex flex-col items-center w-full min-h-[calc(100vh-60px)] py-10 px-2">
      <div className="w-full max-w-7xl space-y-8">
        {/* Select Strategy Card - full width */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Monte Carlo Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="font-semibold mb-2">Select Strategy</div>
              <Select
                value={selectedStrategyId}
                onValueChange={setSelectedStrategyId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a strategy" />
                </SelectTrigger>
                <SelectContent>
                  {strategies.map((strategy) => (
                    <SelectItem key={strategy.id} value={strategy.id}>
                      {strategy.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedStrategyId && (
              <div className="pt-2 border-t border-muted-foreground/10">
                <div className="text-sm text-muted-foreground mb-2">
                  Set your simulation parameters below and run the analysis.
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        {/* Monte Carlo Analysis - full width below */}
        {selectedStrategy && selectedStrategyId && trades.length > 0 ? (
          <MonteCarloAnalysis strategy={selectedStrategy} trades={trades} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-white rounded-xl border border-dashed border-muted-foreground/20 p-12 text-center">
            <div className="text-3xl mb-2 font-semibold text-muted-foreground/80">No Strategy Selected</div>
            <div className="text-md text-muted-foreground/70 max-w-md">
              Please select a strategy above to begin your Monte Carlo analysis. You can adjust simulation parameters and view results here.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonteCarloPage; 