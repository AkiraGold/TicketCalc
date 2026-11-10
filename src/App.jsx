import { useState } from "react";

import { useTicketCalculator } from "./hooks/useTicketCalculator";
import Header from "./components/Header";
import TicketList from "./components/TicketList";
import Summary from "./components/Summary";
import TicketTypeManager from "./components/TicketTypeManager";
import TicketTypeModal from "./components/TicketTypeModal";

function App() {
  const {
    currency,
    setCurrency,
    ticketTypes,
    tickets,
    amountReceived,
    setAmountReceived,
    usingMemoryFallback,
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
    setOriginalTicket(ticket);
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

  const ticketCount = Object.values(tickets).reduce(
    (sum, count) => sum + (Number(count) || 0),
    0
  );

  return (
    <div className="desk-shell" data-theme="ticketdesk">
      <Header
        currency={currency}
        setCurrency={setCurrency}
        amountReceived={amountReceived}
        setAmountReceived={setAmountReceived}
        usingMemoryFallback={usingMemoryFallback}
      />

      <main>
        <section className="mb-6" aria-labelledby="tickets-heading">
          <div className="mb-3 flex items-end justify-between gap-3">
            <h2 id="tickets-heading" className="text-lg font-semibold tracking-tight">
              Tickets
            </h2>
            <p className="font-mono text-sm tabular-nums text-base-content/55">
              {ticketCount} pcs
            </p>
          </div>

          <TicketList
            ticketTypes={ticketTypes}
            tickets={tickets}
            currency={currency}
            onTicketChange={handleTicketChange}
          />
        </section>

        <TicketTypeManager
          ticketTypes={ticketTypes}
          onEdit={(ticket) => openModal("edit", ticket)}
          onDelete={handleDeleteTicketType}
          onAdd={() => openModal("add")}
        />

        <Summary
          total={total}
          currency={currency}
          amountReceived={amountReceived}
          amountToGiveBack={amountToGiveBack}
          ticketCount={ticketCount}
          onClear={clearTickets}
        />

        <TicketTypeModal
          isOpen={modalType !== null}
          modalType={modalType}
          ticket={currentTicket}
          onSave={handleSaveTicket}
          onClose={closeModal}
        />
      </main>
    </div>
  );
}

export default App;
