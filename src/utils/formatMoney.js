export const formatMoney = (value, currency) => {
  const amount = Number.isFinite(Number(value)) ? Number(value) : 0;
  return `${amount.toFixed(2)} ${currency}`;
};
