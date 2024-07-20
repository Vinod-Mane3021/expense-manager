import React from 'react'
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { Button, buttonVariants } from "./ui/button";
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
        <SheetTrigger className='flex flex-col gap-5'>
          {/* <Button
            variant="outline"
            size="sm"
            className="font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition"
          >
            <span>
            <Menu className="size-4"/>

            </span>
          </Button> */}

          <div className="flex items-center justify-center rounded-md p-2 w-10 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition">
              <span>
                <Menu className="size-4"/>
              </span>
          </div>
        
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