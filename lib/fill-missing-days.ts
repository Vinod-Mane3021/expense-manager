import { eachDayOfInterval, isSameDay } from "date-fns";
import { format } from 'date-fns'

export const fillMissingDays = (
  activeDays: {
    date: string;
    income: number;
    expenses: number;
  }[],
  startDate: Date,
  endDate: Date
) => {
  if (activeDays.length === 0) {
    return [];
  }

  const allDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const transactionByDay = allDays.map((day) => {
    const found = activeDays.find((d) => isSameDay(d.date, day));

    if (found) {
      return found;
    }

    return {
      date: format(day, "yyyy-MM-dd HH:mm:ss"),
      income: 0,
      expenses: 0,
    };
  });

  return transactionByDay;
};
