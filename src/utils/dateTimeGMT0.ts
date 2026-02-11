import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { isEmpty } from "lodash";

export const getDateTimeGMT0 = (date?: string) => {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const tz = "Greenwich";

  if (isEmpty(date)) {
    const dateTimeGMT0 = dayjs().tz(tz).format("YYYY-MM-DD HH:mm:ss");

    return dateTimeGMT0;
  } else {
    const dateTimeGMT0 = dayjs(date).tz(tz).format("YYYY-MM-DD HH:mm:ss");

    return dateTimeGMT0;
  }
};
