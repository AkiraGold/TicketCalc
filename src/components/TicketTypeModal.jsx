import React, { useState, useEffect } from 'react';

const TicketTypeModal = ({ isOpen, modalType, ticket, onSave, onClose }) => {
  const [currentTicket, setCurrentTicket] = useState({
    type: "",
    priceCZK: "",
    priceEUR: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (ticket) {
      setCurrentTicket(ticket);
    } else {
      setCurrentTicket({ type: "", priceCZK: "", priceEUR: "" });
    }
    setErrors({});
  }, [ticket]);

  const handlePriceChange = (field, value) => {
    // Allow numbers, decimals, commas, and empty string
    // Convert comma to dot for display
    if (value === "" || /^[\d,]*\.?\d*$/.test(value)) {
      // Replace comma with dot for internal storage
      const normalizedValue = value.replace(',', '.');
      setCurrentTicket({ ...currentTicket, [field]: normalizedValue });
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors({ ...errors, [field]: "" });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!currentTicket.type.trim()) {
      newErrors.type = "Ticket type name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      // Convert prices to numbers, default to 0 if empty
      const ticketToSave = {
        ...currentTicket,
        priceCZK: currentTicket.priceCZK ? parseFloat(currentTicket.priceCZK) : 0,
        priceEUR: currentTicket.priceEUR ? parseFloat(currentTicket.priceEUR) : 0,
      };
      onSave(ticketToSave);
      setCurrentTicket({ type: "", priceCZK: "", priceEUR: "" });
      setErrors({});
    }
  };

  const handleClose = () => {
    setCurrentTicket({ type: "", priceCZK: "", priceEUR: "" });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-box">
        <h3 id="modal-title" className="font-bold text-lg">
          {modalType === "add" ? "Add New Ticket Type" : "Edit Ticket Type"}
        </h3>
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="mt-4">
            <label htmlFor="ticket-type" className="label">
              <span className="label-text">Ticket Type Name</span>
            </label>
            <input
              id="ticket-type"
              type="text"
              placeholder="Ticket Type (required)"
              value={currentTicket.type}
              onChange={(e) => {
                setCurrentTicket({ ...currentTicket, type: e.target.value });
                if (errors.type) setErrors({ ...errors, type: "" });
              }}
              className={`input input-bordered w-full mb-4 bg-neutral ${errors.type ? 'input-error' : ''}`}
              aria-describedby={errors.type ? "type-error" : undefined}
              aria-invalid={!!errors.type}
            />
            {errors.type && <p id="type-error" className="text-error text-sm mb-2" role="alert">{errors.type}</p>}
            
            <label htmlFor="price-czk" className="label">
              <span className="label-text">Price in CZK</span>
            </label>
            <div className="flex mb-4">
              <input
                id="price-czk"
                type="text"
                placeholder="Price in CZK (optional, defaults to 0)"
                value={currentTicket.priceCZK}
                onChange={(e) => handlePriceChange("priceCZK", e.target.value)}
                className="input input-bordered rounded-r-none flex-1 w-full bg-neutral"
                aria-label="Price in Czech Koruna"
              />
              <input
                type="text"
                value="CZK"
                className="input input-bordered rounded-l-none bg-gray-200 text-gray-600 w-16 flex-none"
                disabled
                aria-hidden="true"
              />
            </div>
            
            <label htmlFor="price-eur" className="label">
              <span className="label-text">Price in EUR</span>
            </label>
            <div className="flex mb-2">
              <input
                id="price-eur"
                type="text"
                placeholder="Price in EUR (optional, defaults to 0)"
                value={currentTicket.priceEUR}
                onChange={(e) => handlePriceChange("priceEUR", e.target.value)}
                className="input input-bordered rounded-r-none flex-1 w-full bg-neutral"
                aria-label="Price in Euro"
              />
              <input
                type="text"
                value="EUR"
                className="input input-bordered rounded-l-none bg-gray-200 text-gray-600 w-16 flex-none"
                disabled
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="modal-action">
            <button
              type="submit"
              className="btn btn-primary"
              aria-label="Save ticket type"
            >
              Save
            </button>
            <button
              type="button"
              className="btn btn-neutral"
              onClick={handleClose}
              aria-label="Cancel and close modal"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketTypeModal;
