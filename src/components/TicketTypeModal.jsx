import { useEffect, useState } from "react";

const emptyTicket = {
  type: "",
  priceCZK: "",
  priceEUR: "",
};

const TicketTypeModal = ({ isOpen, modalType, ticket, onSave, onClose }) => {
  const [currentTicket, setCurrentTicket] = useState(emptyTicket);
  const [errors, setErrors] = useState({});

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

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const handlePriceChange = (field, value) => {
    if (value === "" || /^[\d,]*\.?\d*$/.test(value)) {
      const normalizedValue = value.replace(",", ".");
      setCurrentTicket({ ...currentTicket, [field]: normalizedValue });
      if (errors[field]) {
        setErrors({ ...errors, [field]: "" });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!currentTicket.type.trim()) {
      newErrors.type = "Name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    onSave({
      ...currentTicket,
      priceCZK: currentTicket.priceCZK
        ? parseFloat(currentTicket.priceCZK)
        : 0,
      priceEUR: currentTicket.priceEUR
        ? parseFloat(currentTicket.priceEUR)
        : 0,
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
      <div className="modal-sheet" onClick={(event) => event.stopPropagation()}>
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
              autoFocus
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
                className="desk-field desk-field-mono rounded-none border-r-0"
                aria-label="Price in Czech Koruna"
              />
              <span className="flex h-12 items-center border-2 border-l-0 border-[color:var(--ink)] bg-[color:var(--paper)] px-3 font-mono text-sm font-semibold">
                CZK
              </span>
            </div>
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
                className="desk-field desk-field-mono rounded-none border-r-0"
                aria-label="Price in Euro"
              />
              <span className="flex h-12 items-center border-2 border-l-0 border-[color:var(--ink)] bg-[color:var(--paper)] px-3 font-mono text-sm font-semibold">
                EUR
              </span>
            </div>
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
