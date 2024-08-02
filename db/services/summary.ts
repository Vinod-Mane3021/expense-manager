import { convertAmountFromMiliunit } from "@/lib/converters";
import { db } from "..";
import { reduceDecimals } from "@/lib/calculation";
import { format } from 'date-fns'

type FetchDataInputType = {
  userId: string | undefined;
  accountId: string | undefined;
  startDate: Date;
  endDate: Date;
};

export const fetchFinancialData = async ({
  userId,
  accountId,
  startDate,
  endDate,
}: FetchDataInputType): Promise<{
  income: number;
  expenses: number;
  remaining: number;
}> => {
  if (!userId || !startDate || !endDate) {
    return {
      income: 0,
      expenses: 0,
      remaining: 0,
    };
  }

  const transactions = await db.transactions.findMany({
    where: {
      accountId: accountId ? accountId : undefined,
      account: {
        userId,
      },
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      amount: true,
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  const income = transactions.reduce((sum, transaction) => {
    return transaction.amount >= 0 ? sum + transaction.amount : sum;
  }, 0);

  const expenses = transactions.reduce((sum, transaction) => {
    return transaction.amount < 0 ? sum + transaction.amount : sum;
  }, 0);

  const remaining = transactions.reduce((sum, transaction) => {
    return sum + transaction.amount;
  }, 0);

  return {
    income: convertAmountFromMiliunit(income),
    expenses: convertAmountFromMiliunit(expenses),
    remaining: convertAmountFromMiliunit(remaining),
  };
};

type CategoryAggregation = {
  name: string;
  value: number;
};

export async function fetchCategoryData({
  userId,
  accountId,
  startDate,
  endDate,
}: FetchDataInputType): Promise<
  {
    name: string;
    value: number;
  }[]
> {
  if (!userId || !startDate || !endDate) {
    return [];
  }

  const transactions = await db.transactions.findMany({
    where: {
      account: {
        userId: userId,
      },
      date: {
        gte: startDate,
        lte: endDate,
      },
      amount: {
        lt: 0,
      },
      accountId: accountId ?? undefined,
    },
    include: {
      account: true,
      category: true,
    },
    orderBy: {
      amount: "asc"
    }
  });

  const categoryMap: Record<string, CategoryAggregation> = transactions.reduce(
    (acc, transaction) => {
      const categoryName = transaction.category
        ? transaction.category.name
        : "Uncategorized";
      const value = convertAmountFromMiliunit(Math.abs(transaction.amount));

      if (!acc[categoryName]) {
        acc[categoryName] = {
          name: categoryName,
          value: 0,
        };
      }

      acc[categoryName].value += value;

      return acc;
    },
    {} as Record<string, CategoryAggregation>
  );

  const categories = Object.values(categoryMap)

  const finalCategories = categories.map(category => ({
    name: category.name,
    value: reduceDecimals(category.value)
  }))

  return finalCategories;
}

interface TransactionData {
  date: Date;
  amount: number;
}

interface GroupedData {
  [date: string]: {
    date: string;
    income: number;
    expenses: number;
  };
}

interface ResultData {
  date: string;
  income: number;
  expenses: number;
}

export async function fetchActiveDays({
  userId,
  accountId,
  startDate,
  endDate,
}: FetchDataInputType): Promise<{
  date: string;
  income: number;
  expenses: number;
}[]> {
  const transactions: TransactionData[] = await db.transactions.findMany({
    where: {
      account: {
        userId: userId,
      },
      date: {
        gte: startDate,
        lte: endDate,
      },
      accountId: accountId ? accountId : undefined,
    },
    select: {
      date: true,
      amount: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  // Group by date and calculate income and expenses
  const groupedData: GroupedData = transactions.reduce((acc, transaction) => {
    const date = transaction.date.toISOString();
    if (!acc[date]) {
      acc[date] = { date: date, income: 0, expenses: 0 };
    }
    
    const transactionAmount = convertAmountFromMiliunit(transaction.amount);
    if (transaction.amount >= 0) {
      acc[date].income += transactionAmount;
    } else {
      acc[date].expenses += Math.abs(transactionAmount);
    }
    return acc;
  }, {} as GroupedData);

  // Convert grouped data object to array
  const result: ResultData[] = Object.values(groupedData);

  return result;
}
