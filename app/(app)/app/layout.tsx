import AppShell from "@/components/App/AppShell";
import { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen animate-in fade-in dark bg-black">
      <AppShell>{children}</AppShell>
    </div>
  );
}
