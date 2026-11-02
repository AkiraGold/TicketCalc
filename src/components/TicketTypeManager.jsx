import { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

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
                  <EditOutlined />
                  Edit
                </button>
                <button
                  type="button"
                  className="desk-btn-danger"
                  onClick={() => setDeleteConfirm(ticket)}
                  aria-label={`Delete ${ticket.type} ticket type`}
                >
                  <DeleteOutlined />
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
