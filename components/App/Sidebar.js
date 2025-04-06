"use client";
import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { GoSidebarCollapse } from "react-icons/go";
import { FiPieChart } from "react-icons/fi";
import { MdNotificationsActive } from "react-icons/md";
import { IoIosPeople } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import { GoPerson } from "react-icons/go";
import { AiOutlineTool } from "react-icons/ai";
import { CiCreditCard1 } from "react-icons/ci";
import { HiEllipsisVertical } from "react-icons/hi2";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "reactfire";
import { SlLogout } from "react-icons/sl";
import { getAuth, signOut } from "firebase/auth";
import { toast } from "../ui/use-toast";
import { useTheme } from "next-themes";
import { FaPaintBrush } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { Computer, Moon, Sun } from "lucide-react";
import { IoIosConstruct } from "react-icons/io";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(() => {
    // Try to load saved preference from localStorage
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('sidebarExpanded');
      return savedState !== null ? JSON.parse(savedState) : true;
    }
    return true;
  });
  const router = useRouter();
  const pathname = usePathname();
  const { data } = useUser();
  const { theme, setTheme } = useTheme();

  // Save preference to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebarExpanded', JSON.stringify(isExpanded));
    }
  }, [isExpanded]);

  const doLogout = async () => {
    await signOut(getAuth());
    toast({
      title: "Logged out",
      description: "You have been logged out.",
    });
    router.replace("/");
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const isActive = (path) => {
    return pathname && pathname.startsWith(path);
  };

  return (
    <div
      className={`dark:bg-black/70 backdrop-blur-sm py-6 bg-white/95 shadow-md dark:shadow-gray-950/10 border-r border-gray-100 dark:border-gray-800/90 lg:flex flex-col ${
        isExpanded ? "w-[17.5rem] px-5" : "w-16 px-2"
      } hidden transition-all duration-300 ease-in-out h-full relative z-10`}
    >
      <div className="flex flex-col h-full">
        <div className={`flex items-center ${isExpanded ? "justify-between" : "justify-center"} mb-6 flex-shrink-0`}>
          {isExpanded && (
            <Link
              href="/"
              className="ml-1 flex items-center group"
            >
              <div className="relative">
                <Image
                  src={"/tradetrackr logo.jpg"}
                  alt="logo"
                  height={32}
                  width={32}
                  className="w-8 h-8 rounded-lg mr-3 inline shadow-sm transition-transform group-hover:scale-110 duration-300"
                />
                <div className="absolute inset-0 bg-blue-500/20 rounded-lg group-hover:bg-transparent transition-colors duration-300"></div>
              </div>
              <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">AlgoChef</p>
            </Link>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleSidebar} 
            className="rounded-full w-8 h-8 p-0 flex-shrink-0 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <GoSidebarCollapse
              className={`transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </Button>
        </div>
        
        <div className="flex flex-col flex-grow overflow-y-auto">
          {isExpanded && (
            <p className="mb-3 text-xs text-gray-400 font-medium uppercase tracking-wider px-3">
              Menu
            </p>
          )}
          
          <div className="space-y-1">
            <NavItem 
              icon={<MdDashboard className="h-4.5 w-4.5" />} 
              text="Dashboard" 
              path="/app/dashboard" 
              isActive={isActive('/app/dashboard')} 
              isExpanded={isExpanded}
              onClick={() => router.push("/app/dashboard")}
            />
            <NavItem 
              icon={<FiPieChart className="h-4.5 w-4.5" />} 
              text="Strategies" 
              path="/app/strategies" 
              isActive={isActive('/app/strategies')} 
              isExpanded={isExpanded}
              onClick={() => router.push("/app/strategies")}
            />
            <NavItem 
              icon={<FiPieChart className="h-4.5 w-4.5" />} 
              text="Portfolios" 
              path="/app/portfolios" 
              isActive={isActive('/app/portfolios')} 
              isExpanded={isExpanded}
              onClick={() => router.push("/app/portfolios")}
            />
            <NavItem 
              icon={<MdNotificationsActive className="h-4.5 w-4.5" />} 
              text="Trading Signals" 
              path="/app/signals" 
              isActive={isActive('/app/signals')} 
              isExpanded={isExpanded}
              onClick={() => router.push("/app/signals")}
            />
            <NavItem 
              icon={<IoIosConstruct className="h-4.5 w-4.5" />} 
              text="Portfolio Builder" 
              path="/app/builder" 
              isActive={isActive('/app/builder')} 
              isExpanded={isExpanded}
              onClick={() => router.push("/app/builder")}
            />
          </div>
          
          <div className="mt-8 space-y-1">
            {isExpanded && (
              <p className="mb-3 text-xs text-gray-400 font-medium uppercase tracking-wider px-3">
                Settings
              </p>
            )}
            
            <NavItem 
              icon={<GoPerson className="h-4.5 w-4.5" />} 
              text="Profile" 
              path="/app/settings/profile" 
              isActive={isActive('/app/settings/profile')} 
              isExpanded={isExpanded}
              onClick={() => router.push("/app/settings/profile")}
            />
            <NavItem 
              icon={<AiOutlineTool className="h-4.5 w-4.5" />} 
              text="Financial" 
              path="/app/settings/financial" 
              isActive={isActive('/app/settings/financial')} 
              isExpanded={isExpanded}
              onClick={() => router.push("/app/settings/financial/instruments")}
            />
            <NavItem 
              icon={<CiCreditCard1 className="h-4.5 w-4.5" />} 
              text="Subscription" 
              path="/app/settings/subscription" 
              isActive={isActive('/app/settings/subscription')} 
              isExpanded={isExpanded}
              onClick={() => router.push("/app/settings/subscription")}
            />
          </div>
        </div>
      </div>
      
      {/* User Profile Section */}
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full focus:outline-none mt-auto flex-shrink-0">
          <div
            className={`mt-2 transition-all overflow-hidden ${
              isExpanded
                ? "rounded-xl border border-gray-100 dark:border-gray-800/50 hover:border-gray-300 dark:hover:border-gray-700 px-3 py-2 w-full"
                : "p-1 rounded-full"
            } group`}
          >
            <div className="flex flex-row items-center w-full">
              <div className="relative">
                <Image
                  src={data?.photoURL || "/avatars/01.png"}
                  width={36}
                  height={36}
                  alt="Profile"
                  className={`rounded-full object-cover shadow ring-2 ring-white dark:ring-gray-800 ${isExpanded ? "w-9 h-9 mr-3" : "w-9 h-9"} group-hover:ring-blue-500/50 transition-all`}
                />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              </div>
              {isExpanded && (
                <>
                  <div className="flex flex-col items-start flex-1">
                    <p className="font-medium text-sm">
                      {data?.displayName ||
                        data?.email?.split("@")[0] ||
                        "User"}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs truncate w-32">
                      {data?.email || "No email"}
                    </p>
                  </div>
                  <div className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <HiEllipsisVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </div>
                </>
              )}
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-64 my-2 shadow-xl shadow-gray-200/50 dark:shadow-black/20 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden"
          align="start"
        >
          <div className="px-4 py-3 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20 border-b border-gray-100 dark:border-gray-800">
            <p className="font-medium">{data?.displayName || data?.email?.split("@")[0] || "User"}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{data?.email || "No email"}</p>
          </div>
          <DropdownMenuGroup className="p-1">
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href={"/app/dashboard"} className="flex items-center rounded-md py-1.5">
                <MdDashboard className="mr-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <p>Dashboard</p>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href={"/app/strategies"} className="flex items-center rounded-md py-1.5">
                <FiPieChart className="mr-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <p>Strategies</p>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href={"/app/signals"} className="flex items-center rounded-md py-1.5">
                <MdNotificationsActive className="mr-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <p>Trading Signals</p>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href={"/app/settings/profile"} className="flex items-center rounded-md py-1.5">
                <GoPerson className="mr-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <p>Profile</p>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer">
              <FaPaintBrush className="mr-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <p>Theme</p>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="min-w-[12rem] ml-1 border border-gray-100 dark:border-gray-800">
                <DropdownMenuItem
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setTheme("light")}
                >
                  <div className="flex items-center">
                    <Sun className="w-4 h-4 mr-2.5 text-amber-500" />
                    <p>Light</p>
                  </div>
                  {theme === "light" && (
                    <FaCheckCircle className="h-4 w-4 text-blue-500" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setTheme("dark")}
                >
                  <div className="flex items-center">
                    <Moon className="w-4 h-4 mr-2.5 text-blue-500" />
                    <p>Dark</p>
                  </div>
                  {theme === "dark" && (
                    <FaCheckCircle className="h-4 w-4 text-blue-500" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setTheme("system")}
                >
                  <div className="flex items-center">
                    <Computer className="w-4 h-4 mr-2.5 text-gray-600 dark:text-gray-400" />
                    <p>System</p>
                  </div>
                  {theme === "system" && (
                    <FaCheckCircle className="h-4 w-4 text-blue-500" />
                  )}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <div className="p-1">
            <DropdownMenuItem 
              className="cursor-pointer rounded-md py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-700 dark:hover:text-red-300" 
              onClick={doLogout}
            >
              <SlLogout className="mr-2.5 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

// NavItem component for sidebar links
const NavItem = ({ icon, text, path, isActive, isExpanded, onClick }) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={`w-full justify-start my-1 ${
        isActive 
          ? "bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-950/40 dark:to-blue-900/20 text-blue-600 dark:text-blue-400 font-medium border-l-2 border-blue-500"
          : "hover:bg-gray-100 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300"
      } rounded-lg transition-all duration-200 group overflow-hidden ${isExpanded ? 'pl-3' : 'px-2'}`}
      onClick={onClick}
    >
      <span className={`${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"} mr-3 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors`}>
        {icon}
      </span>
      {isExpanded && (
        <span className="font-normal truncate">{text}</span>
      )}
      {!isExpanded && (
        <span className="absolute left-full ml-2 bg-gray-900/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {text}
        </span>
      )}
    </Button>
  );
};

export default Sidebar;
