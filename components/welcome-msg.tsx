"use client";

import { useUser } from "@clerk/nextjs";
import React from "react";

const WelcomeMsg = () => {
  const { user, isLoaded } = useUser();
  return (
    <div className="space-y-2 mb-7">
      <h2 className="text-2xl lg:text-4xl text-white font-medium">
        Welcome Back,
        {isLoaded && user && user.firstName && (
          <span> {user.firstName} 👋</span>
        )}
      </h2>
      <p className="text-sm lg:text-base text-[#89B6FD]">
        This is your Financial Overview Report
      </p>
    </div>
  );
};

export default WelcomeMsg;
