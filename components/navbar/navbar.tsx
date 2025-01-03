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
      <div className="animate-in fade-in w-full dark:bg-black">
        <nav className="container px-6 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <div className="flex items-center">
                <Image
                  src={"/tradetrackr logo.jpg"}
                  alt="logo"
                  height={1920}
                  width={1920}
                  className="w-10 h-10 rounded-lg mr-3 inline"
                />{" "}
                <span className="text-2xl font-semibold tracking-tighter text-foreground mr-6">
                  AlgoChef
                </span>
              </div>
            </Link>
            <div className="hidden md:flex justify-between items-center">
              <div className="text-lg text-gray-300 space-x-10">
                <Link href="#1" className="transition-all hover:text-white">
                  About
                </Link>
                <Link href="#2" className="transition-all hover:text-white">
                  Pricing
                </Link>
                <Link href="#3" className="transition-all hover:text-white">
                  FAQ
                </Link>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <NavbarUserLinks />
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
