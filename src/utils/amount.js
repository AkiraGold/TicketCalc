import { MAX_MONEY, clampMoney, toFiniteNumber } from "./money";

export const hasAmountReceived = (amountReceived) =>
  amountReceived !== "" && amountReceived !== null && amountReceived !== undefined;

export const normalizeAmountReceived = (value) => {
  if (value === "" || value === null || value === undefined) return "";
  const number = toFiniteNumber(value, NaN);
  if (!Number.isFinite(number)) return "";
  return clampMoney(number, MAX_MONEY);
};
