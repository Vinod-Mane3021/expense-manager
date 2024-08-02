import { Hono } from "hono";
import { clerkMiddleware } from "@hono/clerk-auth";
import { authorizeUserMiddleware } from "@/middlewares/auth";
import { zValidator } from "@hono/zod-validator";
import { getSummarySchema } from "@/validations/schema/summary";
import { subDays, parse, differenceInDays } from "date-fns";
import { db } from "@/db/index";
import { convertAmountFromMiliunit } from "@/lib/converters";
import { calculatePercentageChange, reduceDecimals } from "@/lib/calculation";
import {
  fetchActiveDays,
  fetchCategoryData,
  fetchFinancialData,
} from "@/db/services/summary";
import { fillMissingDays } from "@/lib/fill-missing-days";

const app = new Hono().get(
  "/",
  clerkMiddleware(),
  authorizeUserMiddleware,
  zValidator("query", getSummarySchema),
  async (c) => {
    const { from, to, accountId } = c.req.valid("query");

    const defaultTo = new Date();
    const defaultFrom = subDays(defaultTo, 30);

    const startDate = from
      ? parse(from, "yyyy-MM-dd", new Date())
      : defaultFrom;
    const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

    const periodLength = differenceInDays(endDate, startDate) + 1;
    const lastPeriodStart = subDays(startDate, periodLength);
    const lastPeriodEnd = subDays(endDate, periodLength);

    const currentPeriod = await fetchFinancialData({
      userId: c.auth.userId,
      accountId: accountId,
      startDate: startDate,
      endDate: endDate,
    });
    const lastPeriod = await fetchFinancialData({
      userId: c.auth.userId,
      accountId: accountId,
      startDate: lastPeriodStart,
      endDate: lastPeriodEnd,
    });

    const incomeChange = calculatePercentageChange(
      currentPeriod.income,
      lastPeriod.income
    );

    const expensesChange = calculatePercentageChange(
      currentPeriod.expenses,
      lastPeriod.expenses
    );

    const remainingChange = calculatePercentageChange(
      currentPeriod.remaining,
      lastPeriod.remaining
    );

    const categoriesAmount = await fetchCategoryData({
      userId: c.auth.userId,
      accountId: accountId,
      startDate: startDate,
      endDate: endDate,
    });

    const topCategories = categoriesAmount.slice(0, 3);
    const otherCategories = categoriesAmount.slice(3);
    const otherSum = otherCategories.reduce((sum, current) => {
      return sum + current.value;
    }, 0);

    const finalCategories = topCategories;
    if (otherCategories.length > 0) {
      finalCategories.push({
        name: "Other",
        value: otherSum,
      });
    }

    const activeDays = await fetchActiveDays({
      userId: c.auth.userId,
      accountId: accountId,
      startDate: startDate,
      endDate: endDate,
    });

    const days = fillMissingDays(activeDays, startDate, endDate);

    return c.json({
      data: {
        incomeChange,
        expensesChange,
        remainingChange,

        incomeAmount: reduceDecimals(currentPeriod.income, 2),
        expenseAmount: reduceDecimals(currentPeriod.expenses, 2),
        remainingAmount: reduceDecimals(currentPeriod.remaining, 2),
        
        categories: finalCategories,
        days: activeDays,
      },
    });
  }
);

export default app;
