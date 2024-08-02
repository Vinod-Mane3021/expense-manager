import { outputDateFormat, possibleDateFormats } from "@/constants/date";
import { format, parse, subDays } from "date-fns";

export const detectAndFormatDate = (dateString: string) => {
  for (const dateFormat of possibleDateFormats) {
    try {
      const parsedDate = parse(dateString, dateFormat, new Date());
      // Check if parsing was successful
      if (!isNaN(parsedDate.getTime())) {
        return format(parsedDate, outputDateFormat);
      }
    } catch (e) {
      // Ignore parsing errors and try the next format
    }
  }
  // Throw an error if no format matched
  throw new Error(`This date format not allowed`);
};

type Period = {
  from: string | Date | undefined;
  to: string | Date | undefined;
};

export const formatDateRange = (period?: Period) => {
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  if (!period?.from) {
    const formatFrom = format(defaultFrom, "LLL dd");
    const formatTo = format(defaultTo, "LLL dd, y");
    return `${formatFrom} - ${formatTo}`;
  }

  if (period.to) {
    const formatFrom = format(period.from, "LLL dd");
    const formatTo = format(period.to, "LLL dd, y");
    return `${formatFrom} - ${formatTo}`;
  }

  return format(period.from, "LLL dd, y")


};
