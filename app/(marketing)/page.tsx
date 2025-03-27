import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import Hero from "@/components/marketing/Hero";
import Feature2 from "@/components/marketing/Feature2";
import Feature from "@/components/marketing/Feature";
import Steps from "@/components/marketing/Steps";
import Pricing from "@/components/marketing/Pricing";
import Testimonials from "@/components/marketing/Testimonials";
import FAQ from "@/components/marketing/FAQ";
import { NavBar } from "@/components/navbar/navbar";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section>
        <Hero />
      </section>

      {/* Features Section */}
      <section>
        <Feature2 />
        <Feature />
      </section>

      {/* Steps Section */}
      <section>
        <Steps />
      </section>

      {/* Testimonials Section */}
      <section>
        <Testimonials />
      </section>

      {/* Pricing Section */}
      <section>
        <Pricing />
      </section>

      {/* FAQ Section */}
      <section>
        <FAQ />
      </section>
    </div>
  );
}
