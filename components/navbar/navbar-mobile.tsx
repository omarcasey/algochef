"use client";

import { NavbarUserLinks } from "@/components/navbar/navbar-user-links";
import { buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { MenuIcon } from "lucide-react";

export const NavbarMobile = () => {
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
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="-mr-4">
              <MenuIcon />
            </NavigationMenuTrigger>
            <NavigationMenuContent className="flex flex-col p-1">
              <button
                onClick={() => scrollToSection('features')}
                className={buttonVariants({ variant: "link" })}
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('testimonials')}
                className={buttonVariants({ variant: "link" })}
              >
                Testimonials
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className={buttonVariants({ variant: "link" })}
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className={buttonVariants({ variant: "link" })}
              >
                FAQ
              </button>
              <div className="flex flex-col mb-0.5">
                <NavbarUserLinks />
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
};
