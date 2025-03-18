import React from "react";
import "./CustomModal.css"; // Import Custom Modal CSS

interface CustomModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  body: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  title,
  body,
}) => {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="modal-close-button">
            &times;
          </button>
        </div>
        <div className="modal-body">{body}</div>
        <div className="modal-footer">
          <button onClick={onClose} className="modal-cancel-button">
            Cancel
          </button>
          <button onClick={onConfirm} className="modal-confirm-button">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
