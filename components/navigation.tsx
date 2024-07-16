"use client";

import { navRoutes } from "@/constants/nav-routes";
import { usePathname } from "next/navigation";
import NavButton from "./nav-button";
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { useMedia } from 'react-use'

const Navigation = () => {
  const pathname = usePathname();
  return (
    <nav className="hidden lg:flex items-center gap-x-2 overflow-x-auto">
      {navRoutes.map((route) => (
        <NavButton
          key={route.id}
          href={route.href}
          label={route.label}
          isActive={pathname === route.href}
        />
      ))}
    </nav>
  );
};

export default Navigation;
