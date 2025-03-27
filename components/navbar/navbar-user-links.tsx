"use client";

import { UserNav } from "@/components/navbar/user-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { FC } from "react";
import { useUser } from "reactfire";

export const NavbarUserLinks: FC = () => {
  const { data, hasEmitted } = useUser();

  return (
    <>
      {hasEmitted && data ? (
        <>
          {/* <Link
            href="/app/dashboard"
            className="bg-black py-2 px-4 rounded-lg border border-purple-700"
          >
            Dashboard
          </Link> */}
          <Link href="/app/dashboard" className="w-full text-center">
            <div className="bg-gradient-to-br from-cyan-500 to-purple-500 p-[2px] rounded-lg">
              <p className="bg-black text-white rounded-lg px-4 py-2 tracking-wide">
                Dashboard
              </p>
            </div>
          </Link>
          <UserNav />
        </>
      ) : (
        <>
          <Link href="/login" className={buttonVariants()}>
            Login / Register &rarr;
          </Link>
        </>
      )}
    </>
  );
};
