"use client";

import { SignInForm } from "@/components/auth/sign-in-form";
import { SignUpForm } from "@/components/auth/sign-up-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "reactfire";
import { motion } from "framer-motion";

export const AuthCard = () => {
  const [isShowingSignUp, setIsShowingSignUp] = useState<boolean>(false);
  const { data: user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/app/dashboard");
    }
  }, [user]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full"
    >
      <Card className="border-0 shadow-xl bg-gray-900/80 backdrop-blur-sm relative overflow-hidden">
        {/* Decorative gradient elements */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
        
        <CardHeader className="relative z-10">
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            {isShowingSignUp ? "Create Your Account" : "Welcome Back"}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {isShowingSignUp 
              ? "Join the community of algorithmic traders" 
              : "Sign in to continue your algorithmic trading journey"}
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          {isShowingSignUp ? (
            <SignUpForm onShowLogin={() => setIsShowingSignUp(false)} />
          ) : (
            <SignInForm onShowSignUp={() => setIsShowingSignUp(true)} />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
