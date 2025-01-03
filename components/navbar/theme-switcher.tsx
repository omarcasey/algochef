"use client";

import * as React from "react";
import { Computer, ComputerIcon, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaCheckCircle } from "react-icons/fa";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="px-2">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="flex justify-between items-center"
          onClick={() => setTheme("light")}
        >
          <div className="flex flex-row items-center">
            <Sun className="w-3.5 h-3.5 mr-2" />
            <p>Light</p>
          </div>
          {theme === "light" && <FaCheckCircle className="ml-4 h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex justify-between items-center"
          onClick={() => setTheme("dark")}
        >
          <div className="flex flex-row items-center">
            <Moon className="w-3.5 h-3.5 mr-2" />
            <p>Dark</p>
          </div>
          {theme === "dark" && <FaCheckCircle className="ml-4 h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex justify-between items-center"
          onClick={() => setTheme("system")}
        >
          <div className="flex flex-row items-center">
            <ComputerIcon className="w-3.5 h-3.5 mr-2" />
            <p>System</p>
          </div>
          {theme === "system" && <FaCheckCircle className="ml-4 h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
