"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { GithubIcon } from "lucide-react";
import { FC, useState } from "react";
import { useAuth } from "reactfire";
import { motion } from "framer-motion";

interface Props {
  onSignIn?: () => void;
}

export const ProviderLoginButtons: FC<Props> = ({ onSignIn }) => {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const doProviderSignIn = async (provider: GoogleAuthProvider) => {
    try {
      setIsLoading(true);
      await signInWithPopup(auth, provider);
      // create user in your database here
      toast({ title: "Signed in!" });
      onSignIn?.();
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error signing in", description: `${err}` });
    } finally {
      setIsLoading(false);
    }
  };

  const buttonVariants = {
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
    <div className="space-y-3">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={buttonVariants}
      >
        <Button
          className="w-full bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 shadow-md hover:shadow-lg transition-all duration-200"
          disabled={isLoading}
          onClick={async () => {
            const provider = new GoogleAuthProvider();
            await doProviderSignIn(provider);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 488 512"
            fill="currentColor"
            className="mr-2"
          >
            <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
          </svg>
          Continue with Google
        </Button>
      </motion.div>

      {/* Uncomment and customize if you want to add GitHub login
      <motion.div
        initial="hidden"
        animate="visible"
        variants={buttonVariants}
        transition={{ delay: 0.1 }}
      >
        <Button
          className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 shadow-md hover:shadow-lg transition-all duration-200"
          disabled={isLoading}
          onClick={async () => {
            const provider = new GithubAuthProvider();
            toast({
              title: "Oops!",
              description: "Provider not configured, yet.",
            });
            // await doProviderSignIn(provider);
          }}
        >
          <GithubIcon className="w-4 h-4 mr-2" />
          Continue with Github
        </Button>
      </motion.div>
      */}
    </div>
  );
};
