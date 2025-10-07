export const getCurrentMonth = (): string => {
  const date = new Date();
  return date.toLocaleString("default", { month: "long" });
};