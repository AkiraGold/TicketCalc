import { formatMoney } from "../utils/formatMoney";

const TicketCounter = ({ ticket, currency, count, onTicketChange }) => {
  const unitPrice = currency === "CZK" ? ticket.priceCZK : ticket.priceEUR;
  const lineTotal = count * unitPrice;
  const active = count > 0;

  return (
    <div className={`ticket-row ${active ? "is-active" : ""}`}>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-semibold tracking-tight">
          {ticket.type}
        </h3>
        <p className="mt-0.5 text-sm text-base-content/55">
          <span className="money">{formatMoney(unitPrice, currency)}</span>
          {active && (
            <>
              <span className="mx-1.5 text-base-content/30">·</span>
              <span className="money text-base-content/80">
                {formatMoney(lineTotal, currency)}
              </span>
            </>
          )}
        </p>
      </div>

      <div className="counter-group" role="group" aria-label={`${ticket.type} count`}>
        <button
          type="button"
          className="counter-btn"
          onClick={() => onTicketChange(ticket.id, -1)}
          disabled={count === 0}
          aria-label={`Decrease ${ticket.type} ticket count`}
          aria-describedby={`ticket-count-${ticket.id}`}
        >
          −
        </button>
        <span
          id={`ticket-count-${ticket.id}`}
          className="counter-value"
          aria-live="polite"
          aria-label={`Current count of ${ticket.type} tickets`}
        >
          {count}
        </span>
        <button
          type="button"
          className="counter-btn"
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
