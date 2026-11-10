import { useState, useEffect, useMemo } from 'react';
import {
  getInitialState,
  saveToLocalStorage,
  clearLocalStorage,
} from '../utils/localStorage';
import {
  hasAmountReceived,
  normalizeAmountReceived,
} from '../utils/amount';
import {
  clampMoney,
  clampTicketCount,
  clampUnitPrice,
  lineTotal,
} from '../utils/money';

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const defaultTicketTypes = () => [
  { id: generateId(), type: "Adult", priceCZK: 200, priceEUR: 8 },
  { id: generateId(), type: "Wheelchair", priceCZK: 150, priceEUR: 6 },
];

const sanitizeTicketType = (ticket) => ({
  ...ticket,
  type: typeof ticket?.type === "string" ? ticket.type : "",
  priceCZK: clampUnitPrice(ticket?.priceCZK),
  priceEUR: clampUnitPrice(ticket?.priceEUR),
});

const isLegacyTicketTypes = (ticketTypes) =>
  !Array.isArray(ticketTypes) ||
  ticketTypes.some((ticket) => !ticket?.id);

const loadTicketTypes = () => {
  const savedTicketTypes = getInitialState("ticketTypes", null);

  if (savedTicketTypes == null) {
    return defaultTicketTypes();
  }

  if (isLegacyTicketTypes(savedTicketTypes)) {
    clearLocalStorage("ticketTypes");
    clearLocalStorage("tickets");
    return defaultTicketTypes();
  }

  return savedTicketTypes.map(sanitizeTicketType);
};

const loadTickets = (ticketTypes) => {
  const savedTickets = getInitialState("tickets", {});
  const validIds = new Set(ticketTypes.map((ticket) => ticket.id));
  const pruned = {};
  let changed = false;

  Object.entries(savedTickets).forEach(([key, count]) => {
    if (!validIds.has(key)) {
      changed = true;
      return;
    }
    const nextCount = clampTicketCount(count);
    pruned[key] = nextCount;
    if (nextCount !== count) changed = true;
  });

  if (changed || Object.keys(pruned).length !== Object.keys(savedTickets).length) {
    saveToLocalStorage("tickets", pruned);
  }

  return pruned;
};

export const useTicketCalculator = () => {
  const [currency, setCurrencyState] = useState(() =>
    getInitialState("currency", "CZK", false)
  );

  const [ticketTypes, setTicketTypes] = useState(loadTicketTypes);
  const [tickets, setTickets] = useState(() => loadTickets(ticketTypes));
  const [amountReceived, setAmountReceived] = useState(() =>
    normalizeAmountReceived(getInitialState("amountReceived", "", false))
  );
  const [usingMemoryFallback, setUsingMemoryFallback] = useState(false);

  useEffect(() => {
    const results = {
      ticketTypes: saveToLocalStorage("ticketTypes", ticketTypes),
      tickets: saveToLocalStorage("tickets", tickets),
      currency: saveToLocalStorage("currency", currency),
      amountReceived: saveToLocalStorage("amountReceived", amountReceived),
    };

    const usedMemory = Object.values(results).some(
      (result) => result.method === "memory" || !result.success
    );
    setUsingMemoryFallback(usedMemory);

    const hasFailures = Object.values(results).some((result) => !result.success);
    if (hasFailures) {
      console.warn("Some data failed to save to localStorage:", results);
    }
  }, [ticketTypes, tickets, currency, amountReceived]);

  const setCurrency = (nextCurrency) => {
    setCurrencyState((prev) => {
      if (prev !== nextCurrency) {
        setAmountReceived("");
      }
      return nextCurrency;
    });
  };

  const handleTicketChange = (ticketId, delta) => {
    setTickets((prev) => {
      const currentCount = prev[ticketId] || 0;
      const newCount = clampTicketCount(currentCount + delta);
      return {
        ...prev,
        [ticketId]: newCount,
      };
    });
  };

  const handleAddTicketType = (newTicket) => {
    const validatedTicket = sanitizeTicketType({
      id: generateId(),
      ...newTicket,
    });
    setTicketTypes([...ticketTypes, validatedTicket]);
  };

  const handleEditTicketType = (originalTicket, updatedTicket) => {
    const validatedTicket = sanitizeTicketType({
      ...updatedTicket,
      id: originalTicket.id,
    });

    setTicketTypes(
      ticketTypes.map((ticket) =>
        ticket.id === originalTicket.id ? validatedTicket : ticket
      )
    );
  };

  const handleDeleteTicketType = (ticketId) => {
    setTicketTypes(ticketTypes.filter((ticket) => ticket.id !== ticketId));
    setTickets((prev) => {
      const newTickets = { ...prev };
      delete newTickets[ticketId];
      return newTickets;
    });
  };

  const clearTickets = () => {
    setTickets({});
  };

  const total = useMemo(() => {
    return clampMoney(
      ticketTypes.reduce((sum, ticket) => {
        const count = tickets[ticket.id] || 0;
        const price = currency === "CZK" ? ticket.priceCZK : ticket.priceEUR;
        return sum + lineTotal(count, price);
      }, 0)
    );
  }, [ticketTypes, tickets, currency]);

  const amountToGiveBack = useMemo(() => {
    if (!hasAmountReceived(amountReceived)) return 0;
    return clampMoney(amountReceived) - total;
  }, [amountReceived, total]);

  return {
    currency,
    setCurrency,
    ticketTypes,
    tickets,
    amountReceived,
    setAmountReceived,
    usingMemoryFallback,
    total,
    amountToGiveBack,
    handleTicketChange,
    handleAddTicketType,
    handleEditTicketType,
    handleDeleteTicketType,
    clearTickets,
  };
};
