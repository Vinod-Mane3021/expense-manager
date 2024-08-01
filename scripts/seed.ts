// import { db } from "@/db";
import { PrismaClient } from "@prisma/client";
import { subDays, format, eachDayOfInterval } from "date-fns";
import { config } from "dotenv";

export const convertAmountToMiliunit = (amount: number) => {
  return Math.round(amount * 1000);
};

config({ path: ".env.local" });

const db = new PrismaClient();

const SEED_USER_ID = "user_2j3beyckb50Rm9Q36Rj2lXTYHl4";

const SEED_CATEGORIES = [
  { id: "category_1", name: "Food", userId: SEED_USER_ID, plaidId: null },
  { id: "category_2", name: "Rent", userId: SEED_USER_ID, plaidId: null },
  { id: "category_3", name: "Utilities", userId: SEED_USER_ID, plaidId: null },
  { id: "category_4", name: "Clothing", userId: SEED_USER_ID, plaidId: null },
];

const SEED_ACCOUNTS = [
  { id: "account_1", name: "Checking", userId: SEED_USER_ID, plaidId: null },
  { id: "account_2", name: "Saving", userId: SEED_USER_ID, plaidId: null },
];

const defaultTo = new Date();
const defaultFrom = subDays(defaultTo, 90);

type TransactionType = {
  id: string;
  date: Date;
  amount: number;
  payee: string;
  notes: string | null;
  accountId: string;
  categoryId: string | null;
};

type CategoryType = {
  id: string;
  name: string;
  userId: string;
  plaidId?: string | null | undefined;
};

const SEED_TRANSACTIONS: TransactionType[] = [];

const generateRadomAmount = (category: CategoryType) => {
  switch (category.name) {
    case "Rent":
      return Math.random() * 400 + 90;
    case "Utilities":
      return Math.random() * 200 + 50;
    case "Food":
      return Math.random() * 30 + 10;
    case "Transportation":
    case "Health":
      return Math.random() * 50 + 15;
    case "Entertainment":
    case "Clothing":
    case "Miscellaneous":
      return Math.random() * 100 + 20;
    default:
      return Math.random() * 50 + 10;
  }
};

const generateTransactionsForDay = (day: Date) => {
  const numTransactions = Math.floor(Math.random() * 4) + 1;
  for (let i = 0; i < numTransactions; i++) {
    const category = SEED_CATEGORIES[Math.floor(Math.random() * SEED_CATEGORIES.length)];

    const isExpense = Math.random() > 0.6;
    const amount = generateRadomAmount(category);
    const formattedAmount = convertAmountToMiliunit(
      isExpense ? -amount : amount
    )

    SEED_TRANSACTIONS.push({
      id: `transaction_${format(day, "yyyy-MM-dd")}_${i}`,
      accountId: SEED_ACCOUNTS[0].id,
      categoryId: category.id,
      date: day,
      amount: formattedAmount,
      payee: "Merchant",
      notes: "Radom transaction",
    });
  }
};

const generateTransactions = () => {
  const days = eachDayOfInterval({ start: defaultFrom, end: defaultTo });
  days.forEach((day) => generateTransactionsForDay(day));
};

generateTransactions();

const main = async () => {
  try {
    console.log("deleting data...")
    await db.transactions.deleteMany();
    await db.accounts.deleteMany();
    await db.categories.deleteMany();

    console.log("adding data...")
    await db.categories.createMany({ data: SEED_CATEGORIES });
    await db.accounts.createMany({ data: SEED_ACCOUNTS });
    await db.transactions.createMany({ data: SEED_TRANSACTIONS });
    console.log("completed ✔️")
  } catch (error) {
    console.error("Error during seed:", error);
    process.exit(1);
  }
};

main();
