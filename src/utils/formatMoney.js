import { clampMoney, toFiniteNumber } from "./money";

export const formatMoney = (value, currency) => {
  const amount = clampMoney(toFiniteNumber(value, 0));
  return `${amount.toFixed(2)} ${currency}`;
};
