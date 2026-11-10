/** Practical desk limits so count × price stays finite and readable. */
export const MAX_UNIT_PRICE = 1_000_000;
export const MAX_TICKET_COUNT = 999;
export const MAX_MONEY = 1_000_000_000;

export const toFiniteNumber = (value, fallback = 0) => {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : fallback;
};

export const clampMoney = (value, max = MAX_MONEY) => {
  const number = toFiniteNumber(value, 0);
  if (number < 0) return 0;
  return Math.min(number, max);
};

export const clampUnitPrice = (value) => clampMoney(value, MAX_UNIT_PRICE);

export const clampTicketCount = (value) => {
  const number = Math.trunc(toFiniteNumber(value, 0));
  if (number < 0) return 0;
  return Math.min(number, MAX_TICKET_COUNT);
};

export const lineTotal = (count, unitPrice) =>
  clampMoney(clampTicketCount(count) * clampUnitPrice(unitPrice));
