"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const DataCardLoading = () => {
    return (
      <Card className="border-none drop-shadow-sm h-[192px]">
        <CardHeader className="flex flex-row items-center justify-between gap-x-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-10" />
          </div>
          <Skeleton className="size-12" />
        </CardHeader>
        <CardContent>
          <Skeleton className="shrink-0 h-10 w-24 mb-2" />
          <Skeleton className="shrink-0 h-4 w-40" />
        </CardContent>
      </Card>
    );
  };
  