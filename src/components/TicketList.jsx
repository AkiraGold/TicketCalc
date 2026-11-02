import TicketCounter from "./TicketCounter";

const TicketList = ({ ticketTypes, tickets, currency, onTicketChange }) => {
  if (!ticketTypes.length) {
    return (
      <div className="desk-panel px-4 py-8 text-center text-sm text-base-content/60">
        No ticket types yet. Add one under Ticket types below.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3">
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
