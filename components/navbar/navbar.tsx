"use client";

import { NavbarMobile } from "@/components/navbar/navbar-mobile";
import { NavbarUserLinks } from "@/components/navbar/navbar-user-links";
import { buttonVariants } from "@/components/ui/button";
import { FishIcon, ScanTextIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

export const NavBar: FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Offset for fixed navbar height
      const navbarOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <>
      <div className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/80 border-b border-gray-800">
        <nav className="container px-6 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg filter blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-center relative">
                <div className="relative w-10 h-10 overflow-hidden rounded-lg transition-all duration-300 bg-gradient-to-r from-cyan-500 to-purple-500 p-0.5 group-hover:shadow-lg group-hover:shadow-cyan-500/20">
                  <div className="absolute inset-0.5 bg-black rounded-md"></div>
                  <Image
                    src="/tradetrackr logo.jpg"
                    alt="logo"
                    height={1920}
                    width={1920}
                    className="w-full h-full rounded-md relative z-10"
                  />
                </div>
                <span className="ml-3 text-2xl font-semibold tracking-tighter text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-purple-500 transition-all duration-300">
                  AlgoChef
                </span>
              </div>
            </Link>
            
            <div className="hidden md:flex justify-between items-center">
              <div className="text-lg text-gray-300 space-x-12">
                <button 
                  onClick={() => scrollToSection('features')} 
                  className="relative group transition-all cursor-pointer"
                >
                  <span className="relative z-10 transition-colors group-hover:text-white">Features</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                </button>
                <button 
                  onClick={() => scrollToSection('testimonials')} 
                  className="relative group transition-all cursor-pointer"
                >
                  <span className="relative z-10 transition-colors group-hover:text-white">Testimonials</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                </button>
                <button 
                  onClick={() => scrollToSection('pricing')} 
                  className="relative group transition-all cursor-pointer"
                >
                  <span className="relative z-10 transition-colors group-hover:text-white">Pricing</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                </button>
                <button 
                  onClick={() => scrollToSection('faq')} 
                  className="relative group transition-all cursor-pointer"
                >
                  <span className="relative z-10 transition-colors group-hover:text-white">FAQ</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                </button>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex space-x-3">
                <Link 
                  href="/login" 
                  className="px-5 py-2 rounded-lg text-white hover:text-white border border-gray-700 hover:border-gray-600 transition-all duration-300"
                >
                  Sign In
                </Link>
                <Link 
                  href="/signup" 
                  className="px-5 py-2 rounded-lg text-white bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 hover:shadow-lg hover:shadow-cyan-500/20 transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  Get Started
                </Link>
              </div>
            </div>
            
            <div className="grow md:hidden flex justify-end">
              <NavbarMobile />
            </div>
          </div>
        </nav>
      </div>
      <div className="h-[72px]"></div>
    </>
  );
};
