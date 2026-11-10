import { useEffect, useState } from "react";
import { useDialogA11y } from "../hooks/useDialogA11y";
import { MAX_UNIT_PRICE, clampUnitPrice, toFiniteNumber } from "../utils/money";

const emptyTicket = {
  type: "",
  priceCZK: "",
  priceEUR: "",
};

const TicketTypeModal = ({ isOpen, modalType, ticket, onSave, onClose }) => {
  const [currentTicket, setCurrentTicket] = useState(emptyTicket);
  const [errors, setErrors] = useState({});
  const dialogRef = useDialogA11y(isOpen, onClose);

  useEffect(() => {
    if (!isOpen) return;
    setCurrentTicket(
      ticket
        ? {
            type: ticket.type ?? "",
            priceCZK: ticket.priceCZK ?? "",
            priceEUR: ticket.priceEUR ?? "",
          }
        : emptyTicket
    );
    setErrors({});
  }, [isOpen, ticket]);

  const handlePriceChange = (field, value) => {
    if (value === "" || /^[\d,]*\.?\d*$/.test(value)) {
      const normalizedValue = value.replace(",", ".");
      setCurrentTicket({ ...currentTicket, [field]: normalizedValue });
      if (errors[field]) {
        setErrors({ ...errors, [field]: "" });
      }
    }
  };

  const parsePriceField = (value) => {
    if (value === "" || value == null) return 0;
    return toFiniteNumber(value, NaN);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!currentTicket.type.trim()) {
      newErrors.type = "Name is required";
    }

    const priceCZK = parsePriceField(currentTicket.priceCZK);
    const priceEUR = parsePriceField(currentTicket.priceEUR);

    if (currentTicket.priceCZK !== "" && !Number.isFinite(priceCZK)) {
      newErrors.priceCZK = "Enter a valid price";
    } else if (priceCZK > MAX_UNIT_PRICE) {
      newErrors.priceCZK = `Max ${MAX_UNIT_PRICE.toLocaleString("en-US")}`;
    }

    if (currentTicket.priceEUR !== "" && !Number.isFinite(priceEUR)) {
      newErrors.priceEUR = "Enter a valid price";
    } else if (priceEUR > MAX_UNIT_PRICE) {
      newErrors.priceEUR = `Max ${MAX_UNIT_PRICE.toLocaleString("en-US")}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    onSave({
      ...currentTicket,
      priceCZK: clampUnitPrice(parsePriceField(currentTicket.priceCZK)),
      priceEUR: clampUnitPrice(parsePriceField(currentTicket.priceEUR)),
    });
    setCurrentTicket(emptyTicket);
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-layer"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className="modal-sheet"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 id="modal-title" className="text-lg font-semibold tracking-tight">
          {modalType === "add" ? "Add ticket type" : "Edit ticket type"}
        </h3>

        <form
          className="mt-4 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            handleSave();
          }}
        >
          <div>
            <label htmlFor="ticket-type" className="desk-label">
              Name
            </label>
            <input
              id="ticket-type"
              type="text"
              placeholder="Adult, Student…"
              value={currentTicket.type}
              onChange={(event) => {
                setCurrentTicket({
                  ...currentTicket,
                  type: event.target.value,
                });
                if (errors.type) setErrors({ ...errors, type: "" });
              }}
              className={`desk-field ${errors.type ? "border-[color:var(--danger)]" : ""}`}
              aria-describedby={errors.type ? "type-error" : undefined}
              aria-invalid={!!errors.type}
            />
            {errors.type && (
              <p
                id="type-error"
                className="mt-1 text-sm text-[color:var(--danger)]"
                role="alert"
              >
                {errors.type}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="price-czk" className="desk-label">
              Price CZK
            </label>
            <div className="flex">
              <input
                id="price-czk"
                type="text"
                inputMode="decimal"
                placeholder="0"
                value={currentTicket.priceCZK}
                onChange={(event) =>
                  handlePriceChange("priceCZK", event.target.value)
                }
                className={`desk-field desk-field-mono rounded-none border-r-0 ${errors.priceCZK ? "border-[color:var(--danger)]" : ""}`}
                aria-label="Price in Czech Koruna"
                aria-invalid={!!errors.priceCZK}
                aria-describedby={errors.priceCZK ? "price-czk-error" : undefined}
              />
              <span className="flex h-12 items-center border-2 border-l-0 border-[color:var(--ink)] bg-[color:var(--paper)] px-3 font-mono text-sm font-semibold">
                CZK
              </span>
            </div>
            {errors.priceCZK && (
              <p
                id="price-czk-error"
                className="mt-1 text-sm text-[color:var(--danger)]"
                role="alert"
              >
                {errors.priceCZK}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="price-eur" className="desk-label">
              Price EUR
            </label>
            <div className="flex">
              <input
                id="price-eur"
                type="text"
                inputMode="decimal"
                placeholder="0"
                value={currentTicket.priceEUR}
                onChange={(event) =>
                  handlePriceChange("priceEUR", event.target.value)
                }
                className={`desk-field desk-field-mono rounded-none border-r-0 ${errors.priceEUR ? "border-[color:var(--danger)]" : ""}`}
                aria-label="Price in Euro"
                aria-invalid={!!errors.priceEUR}
                aria-describedby={errors.priceEUR ? "price-eur-error" : undefined}
              />
              <span className="flex h-12 items-center border-2 border-l-0 border-[color:var(--ink)] bg-[color:var(--paper)] px-3 font-mono text-sm font-semibold">
                EUR
              </span>
            </div>
            {errors.priceEUR && (
              <p
                id="price-eur-error"
                className="mt-1 text-sm text-[color:var(--danger)]"
                role="alert"
              >
                {errors.priceEUR}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <button type="button" className="desk-btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="desk-btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketTypeModal;
