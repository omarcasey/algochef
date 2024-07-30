import AppShell from "@/components/App/AppShell";
import { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
