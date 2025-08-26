import React from 'react';

const TicketCounter = ({ ticket, currency, count, onTicketChange }) => {
  return (
    <div className="card bg-neutral shadow-lg p-4 flex flex-row justify-between items-center md:mb-2">
      <div className="flex-1">
        <div className="flex flex-col md:flex-row md:items-end">
          <h2 className="card-title">{ticket.type}</h2>
          <p className="md:ml-4">
            Price:{" "}
            {currency === "CZK" ? ticket.priceCZK : ticket.priceEUR}{" "}
            {currency}
          </p>
        </div>
      </div>
      <div className="flex flex-row items-center">
        <button
          className="btn btn-sm btn-primary"
          onClick={() => onTicketChange(ticket.id, -1)}
          aria-label={`Decrease ${ticket.type} ticket count`}
          aria-describedby={`ticket-count-${ticket.id}`}
        >
          -
        </button>
        <span 
          id={`ticket-count-${ticket.id}`}
          className="mx-2"
          aria-live="polite"
          aria-label={`Current count of ${ticket.type} tickets`}
        >
          {count}
        </span>
        <button
          className="btn btn-sm btn-primary"
          onClick={() => onTicketChange(ticket.id, 1)}
          aria-label={`Increase ${ticket.type} ticket count`}
          aria-describedby={`ticket-count-${ticket.id}`}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default TicketCounter;
