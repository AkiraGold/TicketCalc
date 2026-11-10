import { useState } from "react";
import { isLocalStorageAvailable } from "../utils/localStorage";
import { normalizeAmountReceived } from "../utils/amount";
import { MAX_MONEY } from "../utils/money";
import SiteLinkButton from "./SiteLinkButton";

const Header = ({
  currency,
  setCurrency,
  amountReceived,
  setAmountReceived,
  usingMemoryFallback = false,
}) => {
  const [storageOk] = useState(() => isLocalStorageAvailable());
  const showStorageWarning = !storageOk || usingMemoryFallback;

  return (
    <header className="desk-brand">
      <div className="flex items-start justify-between gap-3">
        <h1>TicketCalc</h1>
        <SiteLinkButton />
      </div>

      {showStorageWarning && (
        <div className="alert-strip" role="alert" aria-live="polite">
          Session only. Data may reset on refresh.
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-[minmax(0,11rem)_1fr]">
        <div>
          <span className="desk-label" id="currency-label">
            Currency
          </span>
          <div
            className="segmented"
            role="group"
            aria-labelledby="currency-label"
          >
            {["CZK", "EUR"].map((code) => (
              <button
                key={code}
                type="button"
                aria-pressed={currency === code}
                onClick={() => setCurrency(code)}
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="amount-received" className="desk-label">
            Amount received
          </label>
          <input
            id="amount-received"
            type="number"
            inputMode="decimal"
            value={amountReceived}
            onChange={(e) =>
              setAmountReceived(normalizeAmountReceived(e.target.value))
            }
            className="desk-field desk-field-mono"
            placeholder="0.00"
            min="0"
            max={MAX_MONEY}
            step="0.01"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
