import React from 'react';
import TicketCounter from './TicketCounter';

const TicketList = ({ ticketTypes, tickets, currency, onTicketChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {ticketTypes.map((ticket) => (
        <TicketCounter
          key={ticket.id}
          ticket={ticket}
          currency={currency}
          count={tickets[ticket.id] || 0}
          onTicketChange={onTicketChange}
        />
      ))}
    </div>
  );
};

export default TicketList;
