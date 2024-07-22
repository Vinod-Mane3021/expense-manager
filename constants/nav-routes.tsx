
import { SquareGanttChart, ArrowRightLeft, UserRound, Settings, LayoutTemplate, UserRoundPen } from 'lucide-react';

export const navRoutes = [
  {
    id: 1,
    href: "/",
    label: "Overview",
    icon: <SquareGanttChart className='h-full w-full'/>
  },
  {
    id: 2,
    href: "/transactions",
    label: "Transactions",
    icon: <ArrowRightLeft className='h-full w-full'/>
  },
  {
    id: 3,
    href: "/accounts",
    label: "Accounts",
    icon: <UserRoundPen className='h-full w-full'/>
  },
  {
    id: 4,
    href: "/categories",
    label: "Categories",
    icon: <LayoutTemplate className='h-full w-full'/>
  },
  {
    id: 5,
    href: "/settings",
    label: "Settings",
    icon: <Settings className='h-full w-full'/>
  },
];



