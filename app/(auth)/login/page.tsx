import { AuthCard } from "@/components/auth-card";
import { ProviderLoginButtons } from "@/components/auth/provider-login-buttons";
import { OrSeparator } from "@/components/ui/or-separator";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gray-950">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] -top-40 -left-40 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute w-[500px] h-[500px] -bottom-40 -right-40 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>
      
      {/* Header */}
      <header className="relative z-10 w-full py-6 px-8">
        <Link href={"/"} className="flex items-center space-x-2 text-white">
          <span className="text-2xl font-bold bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            AlgoChef
          </span>
        </Link>
      </header>
      
      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 relative z-10">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Sign In to AlgoChef</h1>
            <p className="text-gray-400">Create, test, and optimize your trading algorithms</p>
          </div>
          
          <AuthCard />
          
          <div className="space-y-4">
            <OrSeparator />
            <ProviderLoginButtons />
          </div>
          
          <div className="text-center text-sm text-gray-500 mt-8">
            By signing in, you agree to our 
            <Link href="/terms" className="text-cyan-500 hover:text-cyan-400 mx-1">Terms of Service</Link>
            and
            <Link href="/privacy" className="text-cyan-500 hover:text-cyan-400 mx-1">Privacy Policy</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
