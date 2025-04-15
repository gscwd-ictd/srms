import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

export const getDateTimeGMT0 = () => {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const tz = "Greenwich";

  const dateTimeGMT0 = dayjs().tz(tz).format("YYYY-MM-DD HH:mm:ss");

  return dateTimeGMT0;
};
