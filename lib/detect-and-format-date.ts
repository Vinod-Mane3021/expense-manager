import { outputDateFormat, possibleDateFormats } from "@/constants/date";
import { format, parse } from "date-fns";
import { showToast } from "./toast";

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
