import React, { useState } from "react";
import "./App.css";
import "daisyui/dist/full.css";

import { useTicketCalculator } from './hooks/useTicketCalculator';
import Header from './components/Header';
import TicketList from './components/TicketList';
import Summary from './components/Summary';
import TicketTypeManager from './components/TicketTypeManager';
import TicketTypeModal from './components/TicketTypeModal';

function App() {
  const {
    currency,
    setCurrency,
    ticketTypes,
    tickets,
    amountReceived,
    setAmountReceived,
    total,
    amountToGiveBack,
    handleTicketChange,
    handleAddTicketType,
    handleEditTicketType,
    handleDeleteTicketType,
    clearTickets,
  } = useTicketCalculator();

  const [modalType, setModalType] = useState(null);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [originalTicket, setOriginalTicket] = useState(null);

  const openModal = (type, ticket = null) => {
    setCurrentTicket(ticket);
    setOriginalTicket(ticket); // Store the original ticket for editing
    setModalType(type);
  };

  const closeModal = () => {
    setModalType(null);
    setCurrentTicket(null);
    setOriginalTicket(null);
  };

  const handleSaveTicket = (ticket) => {
    if (modalType === "add") {
      handleAddTicketType(ticket);
    } else {
      handleEditTicketType(originalTicket, ticket);
    }
    closeModal();
  };

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 gap-6">
      <Header
        currency={currency}
        setCurrency={setCurrency}
        amountReceived={amountReceived}
        setAmountReceived={setAmountReceived}
      />

      <TicketList
        ticketTypes={ticketTypes}
        tickets={tickets}
        currency={currency}
        onTicketChange={handleTicketChange}
      />

      <Summary
        total={total}
        currency={currency}
        amountReceived={amountReceived}
        amountToGiveBack={amountToGiveBack}
        onClear={clearTickets}
      />

      <TicketTypeManager
        ticketTypes={ticketTypes}
        onEdit={(ticket) => openModal("edit", ticket)}
        onDelete={handleDeleteTicketType}
        onAdd={() => openModal("add")}
      />

      <TicketTypeModal
        isOpen={modalType !== null}
        modalType={modalType}
        ticket={currentTicket}
        onSave={handleSaveTicket}
        onClose={closeModal}
      />
    </div>
  );
}

export default App;
