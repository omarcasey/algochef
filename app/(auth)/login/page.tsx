import { AuthCard } from "@/components/auth-card";
import { ProviderLoginButtons } from "@/components/auth/provider-login-buttons";
import { OrSeparator } from "@/components/ui/or-separator";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <section className="w-[32rem] space-y-4">
        <Link href={"/"} className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          TradeTrackr
        </Link>
        <AuthCard />
        <OrSeparator />
        <ProviderLoginButtons />
      </section>
    </div>
  );
}
