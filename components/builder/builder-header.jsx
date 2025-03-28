import { Lightbulb, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BuilderHeader() {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Portfolio Builder</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Create optimized strategy portfolios using cloud computing. Select your strategies, 
          configure parameters, and our system will find the best combinations.
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button size="sm" variant="outline">
          <Lightbulb className="h-4 w-4 mr-2" />
          Tips
        </Button>
      </div>
    </div>
  );
} 