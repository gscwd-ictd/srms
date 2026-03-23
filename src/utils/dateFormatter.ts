import dayjs from "dayjs";
import { isEmpty } from "./isEmpty";

export const DateFormatter = (assignedDate: string | null, format?: string, invalidFormat?: string) => {
  if (isEmpty(format)) {
    format = "MM-DD-YYYY hh:mm A";
  }

  if (assignedDate) {
    const convertedDate = dayjs(assignedDate).format(format);
    return convertedDate;
  } else {
    return invalidFormat;
  }
};
