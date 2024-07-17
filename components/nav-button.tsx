import { NavButtonProps } from "@/types/botton";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const NavButton = ({ href, label, icon, isActive }: NavButtonProps) => {
  return (
    <Button
      size="sm"
      variant="outline"
      className={cn(
        "w-full lg:w-auto gap-2 justify-between font-normal hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition",
        isActive ? "bg-white/10 text-white" : "bg-transparent" 
      )}
    >
      <span className='size-4'>{icon}</span>
      <Link href={href}>{label}</Link>
    </Button>
  );
};

export default NavButton;
