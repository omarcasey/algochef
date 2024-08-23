"use client";

import { UserNav } from "@/components/navbar/user-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { FC } from "react";
import { useUser } from "reactfire";
import { ThemeSwitcher } from "./theme-switcher";

export const NavbarUserLinks: FC = () => {
  const { data, hasEmitted } = useUser();

  return (
    <>
      <ThemeSwitcher />
      {hasEmitted && data ? (
        <>
          <Link href="/app/dashboard" className={buttonVariants()}>
            Dashboard
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
