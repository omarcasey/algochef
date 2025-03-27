import { Footer } from "@/components/footer";
import { NavBar } from "@/components/navbar/navbar";
import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider forcedTheme="dark" attribute="class">
      <div className="dark">
        <NavBar />
        {children}
        <Footer />
      </div>
    </ThemeProvider>
  );
}
