import React, { useState } from 'react';

const Summary = ({ total, currency, amountReceived, amountToGiveBack, onClear }) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearClick = () => {
    setShowClearConfirm(true);
  };

  const confirmClear = () => {
    onClear();
    setShowClearConfirm(false);
  };

  const cancelClear = () => {
    setShowClearConfirm(false);
  };

  return (
    <>
      <div className="md:grid md:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold">
            Total: {total.toFixed(2)} {currency}
          </h2>
          <h2 className="text-lg">
            {amountReceived &&
              `Amount to give back: ${amountToGiveBack.toFixed(2)} ${currency}`}
          </h2>
        </div>
        <button
          className="btn btn-error mt-4 w-full md:justify-self-end md:w-64 md:mt-0"
          onClick={handleClearClick}
          aria-label="Clear all tickets"
        >
          Clear
        </button>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-warning">Confirm Clear</h3>
            <p className="py-4">
              Are you sure you want to clear all tickets? This action cannot be undone.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-error"
                onClick={confirmClear}
                aria-label="Confirm clear all tickets"
              >
                Clear All
              </button>
              <button
                className="btn btn-neutral"
                onClick={cancelClear}
                aria-label="Cancel clear action"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Summary;
