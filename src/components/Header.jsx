import React, { useState, useEffect } from 'react';
import { isLocalStorageAvailable } from '../utils/localStorage';

const Header = ({ currency, setCurrency, amountReceived, setAmountReceived }) => {
  const [storageStatus, setStorageStatus] = useState(true);

  useEffect(() => {
    setStorageStatus(isLocalStorageAvailable());
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary">TicketCalc</h1>
        <p className="text-lg text-base-content/70 mt-2">Professional Ticket Calculator</p>
        
        {/* Storage Status Indicator */}
        {!storageStatus && (
          <div className="alert alert-warning mt-4 max-w-md mx-auto" role="alert" aria-live="polite">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span>Data will be stored in memory (localStorage unavailable)</span>
          </div>
        )}
      </div>
      
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between">
        <div className="">
          <label htmlFor="currency-select" className="label">
            <span className="label-text">Select Currency</span>
          </label>
          <select
            id="currency-select"
            className="select select-bordered w-full md:w-auto bg-neutral"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            aria-label="Select currency for ticket pricing"
          >
            <option value="CZK">CZK</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
        <div className="flex flex-col md:flex-col justify-between">
          <label htmlFor="amount-received" className="label">
            <span className="label-text">Amount Received</span>
          </label>
          <input
            id="amount-received"
            type="number"
            value={amountReceived}
            onChange={(e) => setAmountReceived(Number(e.target.value))}
            className="input input-bordered w-full md:w-auto bg-neutral"
            placeholder="Enter amount"
            aria-label="Enter amount received from customer"
            min="0"
            step="0.01"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
