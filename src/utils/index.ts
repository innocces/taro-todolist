export const isEmpty = (target: TRecord | unknown[]): boolean => {
  return (
    (Array.isArray(target) ? target.length : Object.entries(target).length) ===
    0
  );
};
