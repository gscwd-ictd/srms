import dayjs from "dayjs";

export const unixTimestamp = (date: string) => {
  return dayjs(date).unix();
};
