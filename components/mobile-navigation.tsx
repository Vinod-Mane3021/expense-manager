import React from 'react'
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { usePathname, useRouter } from 'next/navigation';
import { navRoutes } from '@/constants/nav-routes';

const MobileNavigation = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const onClickNavButton = (href: string) => {
    console.log("onClickNavButton " + href)
    router.push(href);
    setIsDrawerOpen(false);
  };

  return (
    <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetTrigger>
          <Button
            variant="outline"
            size="sm"
            className="font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition"
          >
            <Menu className="size-4"/>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="px-2">
          <nav className="flex flex-col gap-y-2 pt-6">
            {navRoutes.map(route => (
                <Button
                  key={route.id}
                  variant={route.href === pathname ? "secondary" : "ghost"}
                  onClick={() => onClickNavButton(route.href)}
                  className="w-full h-full justify-start gap-4"
                >
                  <span className='size-4'>{route.icon}</span>
                  {route.label} 

                </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
  )
}

export default MobileNavigation