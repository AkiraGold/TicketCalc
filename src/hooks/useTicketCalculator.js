import { useState, useEffect, useMemo } from 'react';
import {
  getInitialState,
  saveToLocalStorage,
  clearLocalStorage,
} from '../utils/localStorage';

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const defaultTicketTypes = () => [
  { id: generateId(), type: "Adult", priceCZK: 200, priceEUR: 8 },
  { id: generateId(), type: "Wheelchair", priceCZK: 150, priceEUR: 6 },
];

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

  return savedTicketTypes.length
    ? savedTicketTypes
    : defaultTicketTypes();
};

const loadTickets = (ticketTypes) => {
  const savedTickets = getInitialState("tickets", {});
  const validIds = new Set(ticketTypes.map((ticket) => ticket.id));
  const hasLegacyKeys = Object.keys(savedTickets).some(
    (key) => !validIds.has(key)
  );

  if (hasLegacyKeys) {
    clearLocalStorage("tickets");
    return {};
  }

  return savedTickets;
};

export const useTicketCalculator = () => {
  const [currency, setCurrency] = useState(() =>
    getInitialState("currency", "CZK", false)
  );

  const [ticketTypes, setTicketTypes] = useState(loadTicketTypes);
  const [tickets, setTickets] = useState(() => loadTickets(ticketTypes));
  const [amountReceived, setAmountReceived] = useState(() =>
    getInitialState("amountReceived", "", false)
  );

  useEffect(() => {
    const results = {
      ticketTypes: saveToLocalStorage("ticketTypes", ticketTypes),
      tickets: saveToLocalStorage("tickets", tickets),
      currency: saveToLocalStorage("currency", currency),
      amountReceived: saveToLocalStorage("amountReceived", amountReceived),
    };

    const hasFailures = Object.values(results).some((result) => !result.success);
    if (hasFailures) {
      console.warn("Some data failed to save to localStorage:", results);
    }
  }, [ticketTypes, tickets, currency, amountReceived]);

  const handleTicketChange = (ticketId, delta) => {
    setTickets((prev) => {
      const currentCount = prev[ticketId] || 0;
      const newCount = Math.max(0, currentCount + delta);
      return {
        ...prev,
        [ticketId]: newCount,
      };
    });
  };

  const handleAddTicketType = (newTicket) => {
    const validatedTicket = {
      id: generateId(),
      ...newTicket,
      priceCZK: newTicket.priceCZK || 0,
      priceEUR: newTicket.priceEUR || 0,
    };
    setTicketTypes([...ticketTypes, validatedTicket]);
  };

  const handleEditTicketType = (originalTicket, updatedTicket) => {
    const validatedTicket = {
      ...updatedTicket,
      id: originalTicket.id,
      priceCZK: updatedTicket.priceCZK || 0,
      priceEUR: updatedTicket.priceEUR || 0,
    };

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
    return ticketTypes.reduce((sum, ticket) => {
      const count = tickets[ticket.id] || 0;
      const price = currency === "CZK" ? ticket.priceCZK : ticket.priceEUR;
      return sum + count * price;
    }, 0);
  }, [ticketTypes, tickets, currency]);

  const amountToGiveBack = useMemo(() => {
    return amountReceived ? amountReceived - total : 0;
  }, [amountReceived, total]);

  return {
    currency,
    setCurrency,
    ticketTypes,
    tickets,
    amountReceived,
    setAmountReceived,
    total,
    amountToGiveBack,
    handleTicketChange,
    handleAddTicketType,
    handleEditTicketType,
    handleDeleteTicketType,
    clearTickets,
  };
};
