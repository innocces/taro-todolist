export const isEmpty = (target: TRecord | unknown[]): boolean => {
  return (
    (Array.isArray(target) ? target.length : Object.entries(target).length) ===
    0
  );
};

export const getDate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hour = now.getHours();
  const min = now.getMinutes();
  const second = now.getSeconds();
  return `${year}/${month}/${day} ${hour}:${min}:${second}`;
};
