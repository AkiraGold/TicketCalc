import { useEffect, useState } from "react";

function EditIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

const TicketTypeManager = ({ ticketTypes, onEdit, onDelete, onAdd }) => {
  const [open, setOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    if (!deleteConfirm) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setDeleteConfirm(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [deleteConfirm]);

  return (
    <section className="mb-4" aria-labelledby="types-heading">
      <button
        type="button"
        className="desk-panel flex w-full items-center justify-between px-4 py-3 text-left"
        aria-expanded={open}
        aria-controls="ticket-types-panel"
        onClick={() => setOpen((value) => !value)}
      >
        <div>
          <h2 id="types-heading" className="text-base font-semibold tracking-tight">
            Ticket types
          </h2>
          <p className="text-sm text-base-content/55">
            {ticketTypes.length} configured · setup, not checkout
          </p>
        </div>
        <span className="font-mono text-sm tabular-nums text-base-content/45">
          {open ? "−" : "+"}
        </span>
      </button>

      {open && (
        <div
          id="ticket-types-panel"
          className="mt-3 space-y-3 border-2 border-[color:var(--ink)] bg-white p-3"
        >
          {ticketTypes.map((ticket) => (
            <div
              key={ticket.id}
              className="flex flex-col gap-3 border-b border-[color:var(--rule)] pb-3 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold">{ticket.type}</p>
                <p className="font-mono text-sm tabular-nums text-base-content/55">
                  {ticket.priceCZK} CZK / {ticket.priceEUR} EUR
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="desk-btn-ghost"
                  onClick={() => onEdit(ticket)}
                  aria-label={`Edit ${ticket.type} ticket type`}
                >
                  <EditIcon />
                  Edit
                </button>
                <button
                  type="button"
                  className="desk-btn-danger"
                  onClick={() => setDeleteConfirm(ticket)}
                  aria-label={`Delete ${ticket.type} ticket type`}
                >
                  <DeleteIcon />
                  Delete
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="desk-btn-primary w-full"
            onClick={onAdd}
            aria-label="Add new ticket type"
          >
            Add ticket type
          </button>
        </div>
      )}

      {deleteConfirm && (
        <div
          className="modal-layer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-title"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="modal-sheet"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="delete-title" className="text-lg font-semibold tracking-tight text-[color:var(--danger)]">
              Delete “{deleteConfirm.type}”?
            </h3>
            <p className="mt-2 text-sm text-base-content/65">
              This removes the type and any counted tickets of this kind.
            </p>
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="desk-btn-ghost"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="desk-btn-danger"
                onClick={() => {
                  onDelete(deleteConfirm.id);
                  setDeleteConfirm(null);
                }}
              >
                Delete type
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TicketTypeManager;
