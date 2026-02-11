import md5 from "md5";

export const signMd5 = (formData: string) => {
  const hashSignString = md5(formData).toUpperCase() as string;

  return hashSignString;
};
