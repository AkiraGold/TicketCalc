import { useState } from "react";
import { formatMoney } from "../utils/formatMoney";
import { hasAmountReceived } from "../utils/amount";
import { useDialogA11y } from "../hooks/useDialogA11y";

const Summary = ({
  total,
  currency,
  amountReceived,
  amountToGiveBack,
  ticketCount,
  onClear,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const closeClearConfirm = () => setShowClearConfirm(false);
  const dialogRef = useDialogA11y(showClearConfirm, closeClearConfirm);
  const hasReceived = hasAmountReceived(amountReceived);
  const shortfall = hasReceived && amountToGiveBack < 0;
  const change = hasReceived ? Math.max(0, amountToGiveBack) : null;

  return (
    <>
      <div className="checkout-bar" role="region" aria-label="Checkout summary">
        <div className="checkout-inner">
          <div className="grid grid-cols-2 gap-4 sm:flex sm:gap-8">
            <div>
              <p className="desk-label mb-1">Total</p>
              <p className="money text-xl leading-none">
                {formatMoney(total, currency)}
              </p>
            </div>
            <div>
              <p className="desk-label mb-1">
                {shortfall ? "Still due" : "Change"}
              </p>
              <p
                className={`money text-xl leading-none ${
                  shortfall
                    ? "text-[color:var(--danger)]"
                    : change !== null
                      ? "text-[color:var(--teal)]"
                      : "text-base-content/35"
                }`}
                aria-live="polite"
              >
                {hasReceived
                  ? formatMoney(
                      shortfall ? Math.abs(amountToGiveBack) : change,
                      currency
                    )
                  : "—"}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="desk-btn-danger w-full sm:w-auto"
            onClick={() => setShowClearConfirm(true)}
            disabled={ticketCount === 0}
            aria-label="Clear all tickets"
          >
            Clear counts
          </button>
        </div>
      </div>

      {showClearConfirm && (
        <div
          className="modal-layer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-title"
          onClick={closeClearConfirm}
        >
          <div
            ref={dialogRef}
            className="modal-sheet"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="clear-title" className="text-lg font-semibold tracking-tight">
              Clear all counts?
            </h3>
            <p className="mt-2 text-sm text-base-content/65">
              Ticket types stay. Only the quantities reset.
            </p>
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="desk-btn-ghost"
                onClick={closeClearConfirm}
              >
                Cancel
              </button>
              <button
                type="button"
                className="desk-btn-danger"
                onClick={() => {
                  onClear();
                  closeClearConfirm();
                }}
              >
                Clear counts
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Summary;
