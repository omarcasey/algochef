"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { getAuth, signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdDashboard, MdNotificationsActive } from "react-icons/md";
import { useUser } from "reactfire";
import { IoIosSettings } from "react-icons/io";
import { SlLogout } from "react-icons/sl";
import { FiPieChart } from "react-icons/fi";
import { FaCheckCircle, FaPaintBrush } from "react-icons/fa";
import { useTheme } from "next-themes";

export function UserNav() {
  const { data } = useUser();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const doLogout = async () => {
    await signOut(getAuth());
    toast({
      title: "Logged out",
      description: "You have been logged out.",
    });
    router.replace("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={data?.photoURL || "/avatars/04.png"}
              alt="@shadcn"
            />
            <AvatarFallback>
              {data?.displayName?.slice(0, 2) || data?.email?.slice(0, 2) || ""}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 my-4 shadow-2xl shadow-blue-900"
        align="center"
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-xs text-muted-foreground leading-none font-sans">
              {/* {data?.displayName ||
                data?.email?.slice(0, data?.email?.indexOf("@")) ||
                "Anonymous"} */}
              Signed in as
            </p>
            <p className="text-xs leading-none">{data?.email || "No email"}</p>
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
                  onClick={() => setTheme("light")}
                  className="flex justify-between"
                >
                  Light
                  {theme === "light" && (
                    <FaCheckCircle className="ml-4 h-4 w-4 text-green-500" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("dark")}
                  className="flex justify-between"
                >
                  Dark
                  {theme === "dark" && (
                    <FaCheckCircle className="ml-4 h-4 w-4 text-green-500" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("system")}
                  className="flex justify-between"
                >
                  System
                  {theme === "system" && (
                    <FaCheckCircle className="ml-4 h-4 w-4 text-green-500" />
                  )}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
        <DropdownMenuItem onClick={doLogout}>
          <SlLogout className={`mr-2 h-3 w-3 shrink-0`} />
          <p>Log out</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
