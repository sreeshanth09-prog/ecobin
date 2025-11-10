import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Modal({ open, title, children, onClose, onConfirm, confirmText = "Confirm" }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <motion.div
            className="modal-card"
            initial={{ scale: 0.95, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
          >
            <h4>{title}</h4>
            <p>{children}</p>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn-green" onClick={onConfirm}>
                {confirmText}
              </button>
              <button className="btn-outline" onClick={onClose}>
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}