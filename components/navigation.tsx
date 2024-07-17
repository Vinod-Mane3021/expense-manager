"use client";

import { navRoutes } from "@/constants/nav-routes";
import { usePathname, useRouter } from "next/navigation";
import NavButton from "./nav-button";
import MobileNavigation from "./mobile-navigation";
import { useIsMobile } from "@/hooks/use-is-mobile";


const Navigation = () => {
  
  const pathname = usePathname();
  const isMobile = useIsMobile();

  // Mobile navigation
  if (isMobile) {
    return (
      <MobileNavigation/>
    );
  }

  // Web navigation
  return (
    <nav className="hidden lg:flex items-center gap-x-2 overflow-x-auto">
      {navRoutes.map(route => (
        <NavButton
          key={route.id}
          href={route.href}
          label={route.label}
          icon={route.icon}
          isActive={pathname === route.href}
        />
      ))}
    </nav>
  );
};

export default Navigation;


