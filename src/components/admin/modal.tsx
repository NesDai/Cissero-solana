"use client";

import { ReactNode } from "react";

export interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

export function Modal({ children, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />
      {/* content */}
      <div className="relative bg-gray-800 rounded-lg p-6 max-w-md w-full z-10">
        {children}
        {/* simple close "×" in top-right */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-gray-400"
        >
          ×
        </button>
      </div>
    </div>
  );
}
