import React, { useState } from 'react';
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const TicketTypeManager = ({ ticketTypes, onEdit, onDelete, onAdd }) => {
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleDeleteClick = (ticket) => {
    setDeleteConfirm(ticket);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      onDelete(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  return (
    <div className="mt-2">
      <div className="collapse collapse-arrow border border-base-300 bg-neutral rounded-box">
        <input type="checkbox" />
        <div className="collapse-title text-lg font-medium">Ticket Types</div>
        <div className="collapse-content">
          {ticketTypes.map((ticket) => (
            <div
              key={ticket.id}
              className="flex flex-row justify-between items-start md:items-center mb-4 md:mb-2"
            >
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center">
                  <span className="font-bold">{ticket.type}</span>
                  <span className="md:ml-4">
                    {ticket.priceCZK} CZK / {ticket.priceEUR} EUR
                  </span>
                </div>
              </div>
              <div className="flex flex-row items-start md:items-center mt-2 md:mt-0">
                <button
                  className="btn btn-sm btn-secondary mr-2 mb-2 md:mb-0"
                  onClick={() => onEdit(ticket)}
                  aria-label={`Edit ${ticket.type} ticket type`}
                >
                  <EditOutlined />
                </button>
                <button
                  className="btn btn-sm btn-error mb-2 md:mb-0"
                  onClick={() => handleDeleteClick(ticket)}
                  aria-label={`Delete ${ticket.type} ticket type`}
                >
                  <DeleteOutlined />
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-center md:justify-center mt-4">
            <button
              className="btn btn-primary w-full md:w-auto"
              onClick={onAdd}
              aria-label="Add new ticket type"
            >
              Add New Ticket Type
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-error">Confirm Deletion</h3>
            <p className="py-4">
              Are you sure you want to delete the ticket type <strong>"{deleteConfirm.type}"</strong>?
            </p>
            <p className="text-sm text-warning mb-4">
              This will also remove any existing tickets of this type.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-error"
                onClick={confirmDelete}
                aria-label="Confirm delete ticket type"
              >
                Delete
              </button>
              <button
                className="btn btn-neutral"
                onClick={cancelDelete}
                aria-label="Cancel deletion"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketTypeManager;
