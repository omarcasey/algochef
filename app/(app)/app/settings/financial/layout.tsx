"use client"
// app/financial/layout.tsx
import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FinancialLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="w-full">
      <h2 className="text-3xl leading-5 font-bold tracking-tight mb-6 w-full">
        Financial Settings
      </h2>

      <Tabs value={pathname?.split("/").pop()} className="w-full max-w-7xl">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="instruments" onClick={() => router.push("/app/settings/financial/instruments")}>
            Instruments
          </TabsTrigger>
          <TabsTrigger value="timeframes" onClick={() => router.push("/app/settings/financial/timeframes")}>
            Timeframes
          </TabsTrigger>
        </TabsList>
        <>{children}</>
      </Tabs>
    </div>
  );
}
