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
import { NavBar } from "@/components/navbar/navbar";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <NavBar />
      <div className="flex flex-col grow h-full overflow-hidden">
        <div className="grow flex flex-col items-center justify-evenly bg-black">
          <section className="space-y-6">
            <Hero />
            <Feature2 />
            <Feature />
            <Steps />
            <Pricing />
            {/* <Testimonial />
          <FAQ /> */}
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
