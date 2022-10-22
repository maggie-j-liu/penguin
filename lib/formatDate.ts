export const formatDate = (date: Date) => {
  return date.toLocaleDateString(undefined, {
    dateStyle: "short",
  });
};
