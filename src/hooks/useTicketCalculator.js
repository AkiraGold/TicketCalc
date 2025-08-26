import { useState, useEffect, useRef, useMemo } from 'react';
import { getInitialState, saveToLocalStorage } from '../utils/localStorage';

// Generate unique ID for new ticket types
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Migrate existing ticket types to have IDs
const migrateTicketTypes = (ticketTypes) => {
  return ticketTypes.map(ticket => {
    if (ticket.id) return ticket; // Already has ID
    return { ...ticket, id: generateId() }; // Add ID
  });
};

// Migrate existing tickets object to use IDs instead of names
const migrateTickets = (tickets, ticketTypes) => {
  const migratedTickets = {};
  
  // Create a mapping from old names to new IDs
  const nameToIdMap = {};
  ticketTypes.forEach(ticket => {
    nameToIdMap[ticket.type] = ticket.id;
  });
  
  // Migrate existing ticket counts
  Object.entries(tickets).forEach(([name, count]) => {
    const id = nameToIdMap[name];
    if (id) {
      migratedTickets[id] = count;
    }
  });
  
  return migratedTickets;
};

export const useTicketCalculator = () => {
  const [currency, setCurrency] = useState(() =>
    getInitialState("currency", "CZK", false)
  );
  
  const [ticketTypes, setTicketTypes] = useState(() => {
    const savedTicketTypes = getInitialState('ticketTypes', []);
    if (savedTicketTypes.length) {
      // Migrate existing data to have IDs
      return migrateTicketTypes(savedTicketTypes);
    }
    return [
      { id: generateId(), type: "Adult", priceCZK: 200, priceEUR: 8 },
      { id: generateId(), type: "Wheelchair", priceCZK: 150, priceEUR: 6 },
    ];
  });
  
  const [tickets, setTickets] = useState(() => getInitialState("tickets", {}));
  const [amountReceived, setAmountReceived] = useState(() =>
    getInitialState("amountReceived", "", false)
  );

  // Ref to track pending ticket changes to prevent rapid successive calls
  const pendingChanges = useRef(new Map());

  // Migrate existing tickets to use IDs after ticketTypes are loaded
  useEffect(() => {
    if (ticketTypes.length > 0 && Object.keys(tickets).length > 0) {
      // Check if tickets need migration (if they use names instead of IDs)
      const needsMigration = Object.keys(tickets).some(key => 
        !ticketTypes.find(ticket => ticket.id === key)
      );
      
      if (needsMigration) {
        const migratedTickets = migrateTickets(tickets, ticketTypes);
        setTickets(migratedTickets);
      }
    }
  }, [ticketTypes]); // Only run when ticketTypes change

  // Save data to localStorage
  useEffect(() => {
    const results = {
      ticketTypes: saveToLocalStorage("ticketTypes", ticketTypes),
      tickets: saveToLocalStorage("tickets", tickets),
      currency: saveToLocalStorage("currency", currency),
      amountReceived: saveToLocalStorage("amountReceived", amountReceived),
    };

    // Log storage status for debugging
    const hasFailures = Object.values(results).some(result => !result.success);
    if (hasFailures) {
      console.warn("Some data failed to save to localStorage:", results);
    }
  }, [ticketTypes, tickets, currency, amountReceived]);

  const handleTicketChange = (ticketId, delta) => {
    // Check if there's already a pending change for this ticket
    const pendingKey = `${ticketId}-${delta > 0 ? 'increment' : 'decrement'}`;
    if (pendingChanges.current.has(pendingKey)) {
      return;
    }

    // Mark this change as pending
    pendingChanges.current.set(pendingKey, true);
    
    setTickets((prev) => {
      const currentCount = prev[ticketId] || 0;
      const newCount = Math.max(0, currentCount + delta);
      
      // Remove the pending flag after state update
      setTimeout(() => {
        pendingChanges.current.delete(pendingKey);
      }, 100);
      
      return {
        ...prev,
        [ticketId]: newCount,
      };
    });
  };

  const handleAddTicketType = (newTicket) => {
    // Ensure prices are numbers, default to 0 if empty, and add unique ID
    const validatedTicket = {
      id: generateId(),
      ...newTicket,
      priceCZK: newTicket.priceCZK || 0,
      priceEUR: newTicket.priceEUR || 0,
    };
    setTicketTypes([...ticketTypes, validatedTicket]);
  };

  const handleEditTicketType = (originalTicket, updatedTicket) => {
    // Ensure prices are numbers, default to 0 if empty, and preserve ID
    const validatedTicket = {
      ...updatedTicket,
      id: originalTicket.id, // Preserve the original ID
      priceCZK: updatedTicket.priceCZK || 0,
      priceEUR: updatedTicket.priceEUR || 0,
    };

    setTicketTypes(
      ticketTypes.map((ticket) =>
        ticket.id === originalTicket.id ? validatedTicket : ticket
      )
    );

    // If the ticket type name changed, update the tickets object
    if (originalTicket.type !== validatedTicket.type) {
      setTickets((prev) => {
        const newTickets = { ...prev };
        if (newTickets[originalTicket.id] !== undefined) {
          newTickets[validatedTicket.id] = newTickets[originalTicket.id];
          delete newTickets[originalTicket.id];
        }
        return newTickets;
      });
    }
  };

  const handleDeleteTicketType = (ticketId) => {
    setTicketTypes(ticketTypes.filter((ticket) => ticket.id !== ticketId));
    // Also remove tickets of this type
    setTickets((prev) => {
      const newTickets = { ...prev };
      delete newTickets[ticketId];
      return newTickets;
    });
  };

  const clearTickets = () => {
    setTickets({});
  };

  // Memoize calculations for better performance
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
    // State
    currency,
    setCurrency,
    ticketTypes,
    tickets,
    amountReceived,
    setAmountReceived,
    
    // Computed values
    total,
    amountToGiveBack,
    
    // Actions
    handleTicketChange,
    handleAddTicketType,
    handleEditTicketType,
    handleDeleteTicketType,
    clearTickets,
  };
};
