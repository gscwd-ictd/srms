export const sortObjectByKey = (object: object) => {
  const ordered: { [key: string]: unknown } = {};

  Object.keys(object)
    .sort()
    .forEach((key) => {
      ordered[key] = object[key as keyof object];
    });
  return ordered;
};
