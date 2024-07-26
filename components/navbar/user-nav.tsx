"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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

export function UserNav() {
  const { data } = useUser();
  const router = useRouter();
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
        <DropdownMenuItem onClick={doLogout}>
          <SlLogout className={`mr-2 h-3 w-3 shrink-0`} />
          <p>Log out</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
