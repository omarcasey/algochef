import React from 'react'
import { Check, X, Zap, CreditCard, FileText, Calendar, AlertTriangle, Receipt } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"

interface Feature {
  text: string;
  included: boolean;
}

interface PricingTierProps {
  name: string;
  description: string;
  price: number;
  features: Feature[];
  buttonText?: string;
  popular?: boolean;
  disabled?: boolean;
  current?: boolean;
}

const PricingTier: React.FC<PricingTierProps> = ({ 
  name, 
  description, 
  price, 
  features, 
  buttonText = "Get Started",
  popular = false,
  disabled = false,
  current = false
}) => {
  return (
    <Card className={`w-full transition-all ${popular ? 'border-blue-500 shadow-lg shadow-blue-100/50 dark:shadow-blue-900/20 scale-105 relative' : ''}`}>
      {popular && (
        <Badge className="absolute -top-2 right-0 mr-6 bg-blue-500 hover:bg-blue-600">Most Popular</Badge>
      )}
      {current && (
        <Badge className="absolute -top-2 right-0 mr-6 bg-green-500 hover:bg-green-600">Current Plan</Badge>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold">${price}</span>
          {price > 0 && <span className="text-muted-foreground ml-1">/month</span>}
        </div>
        
        <div className="space-y-2">
          {features.map((feature: Feature, i: number) => (
            <div key={i} className="flex items-start">
              <div className="mr-2 mt-0.5">
                {feature.included ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <X className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <span className={`text-sm ${!feature.included ? "text-muted-foreground" : ""}`}>{feature.text}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className={`w-full ${popular ? 'bg-blue-500 hover:bg-blue-600' : ''}`} 
          variant={popular ? 'default' : 'outline'}
          disabled={disabled}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}

type PlanType = 'free' | 'basic' | 'premium';

// Helper function to safely compare plan types
const isPlanEqual = (a: PlanType, b: string): boolean => a === b as PlanType;

// Mock billing data - would come from API in real app
const billingHistory = [
  { id: "INV-001", date: "2023-05-01", amount: "$19.99", status: "Paid" },
  { id: "INV-002", date: "2023-06-01", amount: "$19.99", status: "Paid" },
  { id: "INV-003", date: "2023-07-01", amount: "$19.99", status: "Paid" },
];

const Subscription: React.FC = () => {
  // This would be fetched from your API in a real application
  const currentPlan: PlanType = "basic";
  const nextBillingDate = "August 1, 2023";
  const autoRenew = true;
  
  const features = {
    dataAccess: { text: "Market Data Access", included: true },
    basicCharts: { text: "Basic Charts & Analysis", included: true },
    strategyCreation: { text: "Custom Strategy Creation", included: true },
    backtesting: { text: "Basic Backtesting", included: true },
    
    portfolioBuilder: { text: "Portfolio Builder", included: false },
    monteCarlo: { text: "Monte Carlo Analysis", included: false },
    advancedBacktesting: { text: "Advanced Backtesting Tools", included: false },
    alertSystem: { text: "Advanced Alert System", included: false },
    
    tradingSignals: { text: "Trading Signals", included: false },
    premiumStrategies: { text: "Premium Strategy Templates", included: false },
    apiAccess: { text: "API Access", included: false },
    prioritySupport: { text: "Priority Support", included: false },
  };
  
  const plans: PricingTierProps[] = [
    {
      name: "Free",
      description: "Essential trading tools to get started",
      price: 0,
      current: isPlanEqual(currentPlan, "free"),
      buttonText: isPlanEqual(currentPlan, "free") ? "Current Plan" : "Get Started",
      disabled: isPlanEqual(currentPlan, "free"),
      features: [
        features.dataAccess,
        features.basicCharts,
        features.strategyCreation,
        features.backtesting,
        { ...features.portfolioBuilder, included: false },
        { ...features.monteCarlo, included: false },
        { ...features.tradingSignals, included: false },
        { ...features.premiumStrategies, included: false },
      ],
    },
    {
      name: "Basic",
      description: "Advanced analysis and portfolio tools",
      price: 19.99,
      popular: true,
      current: isPlanEqual(currentPlan, "basic"),
      buttonText: isPlanEqual(currentPlan, "basic") ? "Current Plan" : "Upgrade",
      disabled: isPlanEqual(currentPlan, "basic"),
      features: [
        features.dataAccess,
        features.basicCharts,
        features.strategyCreation,
        features.backtesting,
        { ...features.portfolioBuilder, included: true },
        { ...features.monteCarlo, included: true },
        { ...features.advancedBacktesting, included: true },
        { ...features.alertSystem, included: true },
        { ...features.tradingSignals, included: false },
        { ...features.premiumStrategies, included: false },
      ],
    },
    {
      name: "Premium",
      description: "Professional trading signals and analysis",
      price: 49.99,
      current: isPlanEqual(currentPlan, "premium"),
      buttonText: isPlanEqual(currentPlan, "premium") ? "Current Plan" : "Upgrade",
      disabled: isPlanEqual(currentPlan, "premium"),
      features: [
        features.dataAccess,
        features.basicCharts,
        features.strategyCreation,
        features.backtesting,
        { ...features.portfolioBuilder, included: true },
        { ...features.monteCarlo, included: true },
        { ...features.advancedBacktesting, included: true },
        { ...features.alertSystem, included: true },
        { ...features.tradingSignals, included: true },
        { ...features.premiumStrategies, included: true },
        { ...features.apiAccess, included: true },
        { ...features.prioritySupport, included: true },
      ],
    },
  ];

  return (
    <div className="w-full space-y-6 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Subscription</h2>
        <p className="text-muted-foreground">
          Manage your subscription plan and billing
        </p>
      </div>
      
      <Separator className="my-6" />
      
      {/* Current Subscription Status */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-500" />
              Current Subscription
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-lg">{plans.find(p => p.current)?.name || "Free"} Plan</p>
                <p className="text-sm text-muted-foreground">${plans.find(p => p.current)?.price || 0}/month</p>
              </div>
              <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
            </div>
            
            <div className="grid gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Next billing date</span>
                <span>{nextBillingDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment method</span>
                <span className="flex items-center">
                  <CreditCard className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  •••• 4242
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start pt-0 gap-3">
            <div className="flex justify-between w-full">
              <span className="text-sm">Auto-renew</span>
              <Switch checked={autoRenew} />
            </div>
            <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10">
              Cancel Subscription
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-blue-500" />
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between bg-secondary/50 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/10 rounded-md p-2">
                  <CreditCard className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">Visa ending in 4242</p>
                  <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                </div>
              </div>
              <Badge>Default</Badge>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="outline" size="sm">
              Manage Payment Methods
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Billing History */}
      <div>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Receipt className="h-5 w-5 mr-2 text-blue-500" />
              Billing History
            </CardTitle>
            <CardDescription>
              View your past invoices and receipts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingHistory.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.amount}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-8 flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5" />
                        <span>View</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      {/* Available Plans */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold tracking-tight">Available Plans</h3>
        <p className="text-sm text-muted-foreground">
          Choose the plan that works best for you and your trading needs
        </p>
      </div>
      
      <div className="flex flex-col space-y-4">
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <PricingTier key={index} {...plan} />
          ))}
        </div>
        
        <div className="bg-secondary/50 rounded-lg p-4 mt-8">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <h3 className="font-medium">Looking for custom enterprise features?</h3>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Contact us at <span className="text-blue-500">enterprise@algochef.com</span> for custom plans tailored to your organization.
          </p>
        </div>
        
        <div className="mt-8 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h3 className="font-medium">Subscription FAQ</h3>
          </div>
          <div className="space-y-2 pl-7">
            <div className="space-y-1">
              <p className="text-sm font-medium">How do upgrades work?</p>
              <p className="text-sm text-muted-foreground">
                When you upgrade, you'll be charged the prorated amount for the current billing cycle. 
                You'll have immediate access to all features in your new plan.
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">How do I cancel my subscription?</p>
              <p className="text-sm text-muted-foreground">
                You can cancel at any time from your account settings. When you cancel, 
                you'll have access until the end of your current billing period.
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Is there a refund policy?</p>
              <p className="text-sm text-muted-foreground">
                We offer a 14-day money-back guarantee. If you're not satisfied with your purchase, 
                contact our support team within 14 days of the purchase date.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Subscription