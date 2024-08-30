"use client";
import React, { useState } from "react";
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
import { IoIosPeople, IoIosSettings } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import { GoPerson } from "react-icons/go";
import { AiOutlineTool } from "react-icons/ai";
import { CiCreditCard1 } from "react-icons/ci";
import { HiEllipsisVertical } from "react-icons/hi2";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "reactfire";
import { SlLogout } from "react-icons/sl";
import { getAuth, signOut } from "firebase/auth";
import { toast } from "../ui/use-toast";
import { useTheme } from "next-themes";
import { FaPaintBrush } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { Computer, Moon, Sun } from "lucide-react";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const router = useRouter();
  const { data } = useUser();
  const { theme, setTheme } = useTheme();

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

  return (
    <div
      className={`dark:bg-neutral-900 py-6 bg-white border-r border-foreground-200 lg:flex flex-col ${
        isExpanded ? "w-[17.5rem] p-5" : "w-16 p-2"
      } hidden transition-width duration-300 justify-between items-center`}
    >
      <div className="w-full">
        <div className="flex flex-row justify-between items-center mb-10">
          <Link
            href="/"
            className={`ml-4 flex items-center ${isExpanded ? "" : "hidden"}`}
          >
            <Image
              src={"/tradetrackr logo.jpg"}
              alt="logo"
              height={1920}
              width={1920}
              className="w-8 h-8 rounded-lg mr-2 inline"
            />
            <p className="text-xl font-bold">TradeTrackr</p>
          </Link>
          <Button variant="ghost" onClick={toggleSidebar}>
            <GoSidebarCollapse
              className={` transition-transform ${
                isExpanded ? " rotate-180" : ""
              }`}
            />
          </Button>
        </div>
        <p
          className={`ml-7 mb-4 text-gray-400 text-xs uppercase ${
            isExpanded ? "" : "hidden"
          }`}
        >
          Menu
        </p>
        <div className="flex flex-col space-y-1 mb-6">
          <Button
            variant={"ghost"}
            className="w-full flex items-center justify-start"
            onClick={() => router.push("/app/dashboard")}
          >
            <MdDashboard className={`mr-2 h-4 w-4 shrink-0`} />
            <p className={`${isExpanded ? "" : "hidden"} font-normal`}>
              Dashboard
            </p>
          </Button>
          <Button
            variant={"ghost"}
            className="w-full flex items-center justify-start"
            onClick={() => router.push("/app/strategies")}
          >
            <FiPieChart className={`mr-2 h-4 w-4 shrink-0`} />
            <p className={`${isExpanded ? "" : "hidden"} font-normal`}>
              Strategies
            </p>
          </Button>
          <Button
            variant={"ghost"}
            className="w-full flex items-center justify-start"
            onClick={() => router.push("/app/signals")}
          >
            <MdNotificationsActive className={`mr-2 h-4 w-4 shrink-0`} />
            <p className={`${isExpanded ? "" : "hidden"} font-normal`}>
              Signals
            </p>
          </Button>
          <Button
            variant={"ghost"}
            className="w-full flex items-center justify-start"
            onClick={() => router.push("/app/community")}
          >
            <IoIosPeople className={`mr-2 h-4 w-4 shrink-0`} />
            <p className={`${isExpanded ? "" : "hidden"} font-normal`}>
              Community
            </p>
          </Button>
        </div>
        <p
          className={`ml-7 mb-4 text-gray-400 text-xs uppercase ${
            isExpanded ? "" : "hidden"
          }`}
        >
          Settings
        </p>
        <div className="flex flex-col space-y-1 mb-6">
          <Button
            variant={"ghost"}
            className="w-full flex items-center justify-start"
            onClick={() => router.push("/app/settings/profile")}
          >
            <GoPerson className={`mr-2 h-4 w-4 shrink-0`} />
            <p className={`${isExpanded ? "" : "hidden"} font-normal`}>
              Profile
            </p>
          </Button>
          <Button
            variant={"ghost"}
            className="w-full flex items-center justify-start"
            onClick={() => router.push("/app/settings/financial/instruments")}
          >
            <AiOutlineTool className={`mr-2 h-4 w-4 shrink-0`} />
            <p className={`${isExpanded ? "" : "hidden"} font-normal`}>
              Financial
            </p>
          </Button>
          <Button
            variant={"ghost"}
            className="w-full flex items-center justify-start"
            onClick={() => router.push("/app/settings/subscription")}
          >
            <CiCreditCard1 className={`mr-2 h-4 w-4 shrink-0`} />
            <p className={`${isExpanded ? "" : "hidden"} font-normal`}>
              Subscription
            </p>
          </Button>
        </div>
      </div>
      <DropdownMenu className="">
        <DropdownMenuTrigger className="w-full">
          <Button
            variant="ghost"
            className={` overflow-hidden ${
              isExpanded
                ? "border rounded-lg px-3 py-7 w-full"
                : "p-1 rounded-full"
            }`}
          >
            <div className="flex flex-row items-center w-full">
              <Image
                src={data?.photoURL || "/avatars/01.png"}
                width={100}
                height={100}
                className={`w-9 h-9 rounded-full ${isExpanded && "mr-3"}`}
              />
              {isExpanded && (
                <>
                  <div className="flex flex-row items-center w-full flex-1">
                    <div className="flex flex-col items-start flex-1">
                      <p>
                        {data?.displayName ||
                          data?.email?.split("@")[0] ||
                          "User"}
                      </p>
                      <p className="text-gray-400 text-xs truncate">
                        {data?.email || "No email"}
                      </p>
                    </div>
                    <HiEllipsisVertical className="w-5 h-5 shrink-0 ml-2" />
                  </div>
                </>
              )}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-64 my-4 shadow-2xl shadow-blue-900"
          align="start"
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-xs text-muted-foreground leading-none font-sans">
                Signed in as
              </p>
              <p className="text-xs leading-none">
                {data?.email || "No email"}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href={"/app/dashboard"}>
                <MdDashboard className={`mr-2 h-4 w-4 shrink-0`} />
                <p>Dashboard</p>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={"/app/strategies"}>
                <FiPieChart className={`mr-2 h-4 w-4 shrink-0`} />
                <p>Strategies</p>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={"/app/signals"}>
                <MdNotificationsActive className={`mr-2 h-4 w-4 shrink-0`} />
                <p>Signals</p>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={"/app/settings/profile"}>
                <IoIosSettings className={`mr-2 h-4 w-4 shrink-0`} />
                <p>Settings</p>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <FaPaintBrush className={`mr-2.5 h-3.5 w-3.5 shrink-0`} />
              <p>Theme</p>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="w-full ml-2">
                <DropdownMenuItem
                  className="flex justify-between items-center"
                  onClick={() => setTheme("light")}
                >
                  <div className="flex flex-row items-center">
                    <Sun className="w-3.5 h-3.5 mr-2" />
                    <p>Light</p>
                  </div>
                  {theme === "light" && (
                    <FaCheckCircle className="ml-4 h-4 w-4" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex justify-between items-center"
                  onClick={() => setTheme("dark")}
                >
                  <div className="flex flex-row items-center">
                    <Moon className="w-3.5 h-3.5 mr-2" />
                    <p>Dark</p>
                  </div>
                  {theme === "dark" && (
                    <FaCheckCircle className="ml-4 h-4 w-4" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex justify-between items-center"
                  onClick={() => setTheme("system")}
                >
                  <div className="flex flex-row items-center">
                    <Computer className="w-3.5 h-3.5 mr-2" />
                    <p>System</p>
                  </div>
                  {theme === "system" && (
                    <FaCheckCircle className="ml-4 h-4 w-4" />
                  )}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="hover:cursor-pointer" onClick={doLogout}>
            <SlLogout className={`mr-2 h-4 w-4 shrink-0`} />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Sidebar;
