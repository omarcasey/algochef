'use client';

import * as React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FC, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "reactfire";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ModalForgotPassword } from "@/components/auth/modal-forgot-password";
import { motion } from "framer-motion";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

interface SignInFormProps {
  onShowSignUp: () => void;
}

export const SignInForm: FC<SignInFormProps> = ({ onShowSignUp }) => {
  const auth = useAuth();
  const [isResetOpen, setIsResetOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const login = async ({ email, password }: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Success!",
        description: "You have been signed in.",
      });
    } catch (error) {
      toast({ title: "Error Signing In", description: `${error}` });
    } finally {
      setIsLoading(false);
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(login)} className="space-y-5">
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Email Address</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      {...field} 
                      className="bg-gray-800/50 border-gray-700 focus:border-cyan-500 text-white placeholder:text-gray-500"
                      placeholder="you@example.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      {...field} 
                      className="bg-gray-800/50 border-gray-700 focus:border-cyan-500 text-white placeholder:text-gray-500"
                      placeholder="••••••••"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-medium py-2 shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </motion.div>
        </form>
      </Form>
      
      <div className="mt-6 space-y-3">
        <motion.p 
          variants={itemVariants}
          className="text-sm text-gray-400 text-center"
        >
          Forgot password?{" "}
          <Button variant="link" onClick={() => setIsResetOpen(true)} className="text-cyan-500 hover:text-cyan-400 p-0">
            Reset
          </Button>
        </motion.p>
        
        <motion.p 
          variants={itemVariants}
          className="text-sm text-gray-400 text-center"
        >
          Not a member?{" "}
          <Button variant="link" onClick={onShowSignUp} className="text-cyan-500 hover:text-cyan-400 p-0">
            Create an account
          </Button>
        </motion.p>
      </div>
      
      <ModalForgotPassword isOpen={isResetOpen} setIsOpen={setIsResetOpen} />
    </>
  );
};
