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
  doc,
  getDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/spinner";
import { MiniEquityCurve } from "@/components/charts/mini-equity-curve";
import { BuilderConfiguration } from "@/components/builder/builder-configuration";
import { BuilderResults } from "@/components/builder/builder-results";
import { BuilderHeader } from "@/components/builder/builder-header";
import { StrategySelector } from "@/components/builder/strategy-selector";
import { Button } from "@/components/ui/button";
import { PlusCircle, ListFilter, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Alert,
  AlertTitle,
  AlertDescription 
} from "@/components/ui/alert";

const PortfolioBuilder = () => {
  const { data: user, status } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  // State for UI management
  const [activeTab, setActiveTab] = useState("configure");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobStatus, setJobStatus] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [selectedStrategies, setSelectedStrategies] = useState([]);
  const [portfolioResults, setPortfolioResults] = useState([]);
  const [configValues, setConfigValues] = useState({
    minStrategies: 3,
    maxStrategies: 5,
    rankingFunction: "sharpeRatio",
    searchMethod: "genetic",
    totalCapital: 100000,
    maxStoredPortfolios: 20,
    populationSize: 50,
    generations: 20
  });

  // Query to fetch user's strategies
  const strategiesQuery = query(
    collection(firestore, "strategies"),
    where("userId", "==", user ? user.uid : ""),
    orderBy("createdAt", "desc")
  );

  // Fetch strategies using Reactfire
  const { data: strategies, status: strategiesStatus } =
    useFirestoreCollectionData(strategiesQuery, { idField: "id" });

  // Initialize selected strategies when strategies are loaded
  useEffect(() => {
    if (strategies && strategies.length > 0) {
      setSelectedStrategies(strategies.slice(0, 5).map((strategy) => strategy.id));
    }
  }, [strategies]);

  // Poll for job status when jobId exists
  useEffect(() => {
    if (!jobId) return;
    
    const checkJobStatus = async () => {
      try {
        const jobRef = doc(firestore, "portfolioJobs", jobId);
        const jobDoc = await getDoc(jobRef);
        
        if (jobDoc.exists()) {
          const jobData = jobDoc.data();
          setJobStatus(jobData.status);
          
          if (jobData.status === "completed") {
            setPortfolioResults(jobData.results || []);
            setActiveTab("results");
            setIsSubmitting(false);
          } else if (jobData.status === "failed") {
            setIsSubmitting(false);
          }
        }
      } catch (error) {
        console.error("Error checking job status:", error);
      }
    };
    
    const interval = setInterval(checkJobStatus, 3000);
    return () => clearInterval(interval);
  }, [jobId, firestore]);

  // Handle configuration changes
  const handleConfigChange = (name, value) => {
    setConfigValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit job to cloud processing
  const submitJob = async () => {
    setIsSubmitting(true);
    setActiveTab("results");
    
    try {
      // Create a new job document in Firestore
      const jobData = {
        userId: user.uid,
        status: "pending",
        config: {
          ...configValues,
          strategies: selectedStrategies,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        results: []
      };
      
      const jobRef = await addDoc(collection(firestore, "portfolioJobs"), jobData);
      setJobId(jobRef.id);
      setJobStatus("processing");
      
      // In a real implementation, this would trigger a cloud function
      // that processes the portfolio combinations
    } catch (error) {
      console.error("Error submitting job:", error);
      setIsSubmitting(false);
      setJobStatus("failed");
    }
  };

  // Clear job and results
  const clearJob = () => {
    setJobId(null);
    setJobStatus(null);
    setPortfolioResults([]);
    setActiveTab("configure");
  };

  // Function to view a specific portfolio
  const viewPortfolio = (portfolioId) => {
    router.push(`/app/portfolios/${portfolioId}`);
  };

  // Save a portfolio to user's collection
  const savePortfolio = async (portfolio) => {
    try {
      const portfolioData = {
        ...portfolio,
        userId: user.uid,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(firestore, "portfolios"), portfolioData);
      return docRef.id;
    } catch (error) {
      console.error("Error saving portfolio:", error);
      return null;
    }
  };

  if (status === "loading" || strategiesStatus === "loading") {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <LoadingSpinner size={45} />
      </div>
    );
  }

  // Calculate total combinations
  const calculateCombinations = () => {
    const n = selectedStrategies.length;
    const { minStrategies, maxStrategies } = configValues;
    
    let total = 0;
    for (let r = minStrategies; r <= Math.min(maxStrategies, n); r++) {
      total += combination(n, r);
    }
    return Math.round(total);
  };

  // Helper function for combination calculation
  const combination = (n, r) => {
    if (r > n) return 0;
    if (r === 0 || r === n) return 1;
    return factorial(n) / (factorial(r) * factorial(n - r));
  };

  // Helper function for factorial calculation
  const factorial = (num) => {
    let result = 1;
    for (let i = 2; i <= num; i++) {
      result *= i;
    }
    return result;
  };

  return (
    <div className="container py-6 max-w-7xl mx-auto space-y-8">
      <BuilderHeader />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="configure">Configure</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="configure" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Strategy Selection */}
            <Card className="lg:col-span-1 p-6 shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold tracking-tight">Strategies</h3>
                  <span className="text-sm text-muted-foreground">
                    Selected: {selectedStrategies.length}
                  </span>
                </div>
                
                <StrategySelector
          strategies={strategies || []}
          selectedStrategies={selectedStrategies}
          onSelectionChange={setSelectedStrategies}
        />
                
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-muted-foreground">
                    {calculateCombinations()} Combinations
                  </span>
                  <Button variant="ghost" size="sm">
                    <ListFilter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
          </div>
              </div>
            </Card>
            
            {/* Configuration */}
            <Card className="lg:col-span-2 p-6 shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold tracking-tight">Builder Configuration</h3>
                
                <BuilderConfiguration
                  values={configValues}
                  onChange={handleConfigChange}
                  strategies={selectedStrategies}
                />
                
                <div className="flex justify-end pt-4">
        <Button
                    onClick={submitJob}
                    disabled={selectedStrategies.length < configValues.minStrategies || isSubmitting}
                    className="w-full md:w-auto"
                  >
                    {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
            </>
          ) : (
                      <>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Generate Portfolios
                      </>
          )}
        </Button>
          </div>
      </div>
            </Card>
          </div>
          
          {selectedStrategies.length < configValues.minStrategies && (
            <Alert variant="warning" className="mt-4">
              <AlertTitle>Insufficient Strategies</AlertTitle>
              <AlertDescription>
                Please select at least {configValues.minStrategies} strategies to continue.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
        
        <TabsContent value="results" className="space-y-6 mt-6">
          <Card className="p-6 shadow-sm border border-gray-200 dark:border-gray-800">
            <BuilderResults
              results={portfolioResults}
              status={jobStatus}
              isProcessing={isSubmitting}
              onViewPortfolio={viewPortfolio}
              onSavePortfolio={savePortfolio}
              onClear={clearJob}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortfolioBuilder;
