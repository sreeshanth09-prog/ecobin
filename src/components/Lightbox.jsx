import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Lightbox({ src, alt, open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="lightbox-overlay"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.img
            src={src}
            alt={alt}
            className="lightbox-image"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}