"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export function Modal({ children, onClose }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Close when clicking outside the modal
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Prevent scrolling of the background
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div
        ref={modalRef}
        className="relative max-w-lg w-full max-h-[90vh] overflow-auto rounded-lg"
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        {children}
      </div>
    </div>
  );
}
