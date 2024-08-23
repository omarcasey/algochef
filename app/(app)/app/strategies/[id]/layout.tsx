"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFirestore, useFirestoreDocData, useUser } from "reactfire";
import { doc } from "firebase/firestore";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { AiOutlineTool } from "react-icons/ai";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

export default function StrategyLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
