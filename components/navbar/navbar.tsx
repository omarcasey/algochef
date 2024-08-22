import { NavbarMobile } from "@/components/navbar/navbar-mobile";
import { NavbarUserLinks } from "@/components/navbar/navbar-user-links";
import { buttonVariants } from "@/components/ui/button";
import { FishIcon, ScanTextIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

export const NavBar: FC = () => {
  return (
    <>
      <div className="animate-in fade-in w-full dark:bg-black border-b border-gray-600">
        <nav className="container px-6 md:px-8 py-4">
          <div className="flex items-center">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <div className="flex items-center">
                <Image src={"/tradetrackr logo.jpg"} alt="logo" height={1920} width={1920} className="w-8 h-8 rounded-lg mr-3 inline" />{" "}
                <span className="text-xl font-semibold tracking-tighter text-foreground mr-6">
                  TradeTrackr
                </span>
              </div>
            </Link>
            <div className="hidden md:flex justify-between grow">
              <div>
                <Link href="#1" className={buttonVariants({ variant: "link" })}>
                  About
                </Link>
                <Link href="#2" className={buttonVariants({ variant: "link" })}>
                  Pricing
                </Link>
                <Link href="#3" className={buttonVariants({ variant: "link" })}>
                  FAQ
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <NavbarUserLinks />
              </div>
            </div>
            <div className="grow md:hidden flex justify-end">
              <NavbarMobile />
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};
