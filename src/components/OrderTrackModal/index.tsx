"use client";

import { useState, useEffect, useRef } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface TrackOrderModalProps {
  onClose: () => void;
  isOpen: boolean;
}

const TrackOrderModal = ({ onClose, isOpen }: TrackOrderModalProps) => {
  const [transactionId, setTransactionId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Focus input when modal opens
      inputRef.current?.focus();
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basic validation
    if (!transactionId.trim()) {
      setError("Please enter a transaction ID");
      setIsLoading(false);
      inputRef.current?.focus();
      return;
    }

    // Simulate API check (replace with actual validation)
    setTimeout(() => {
      router.push(`/OrderTrackingPage/${transactionId}`);
      onClose();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div 
  className="fixed inset-0 bg-black/80 z-[1000] flex items-center justify-center p-4"
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
  <div 
    ref={modalRef}
    className="bg-white rounded-lg w-full max-w-md relative mx-2"
    onClick={(e) => e.stopPropagation()} // Prevent clicks from closing modal
  >
    {/* Close Button */}
    <button
      onClick={onClose}
      className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
      aria-label="Close modal"
    >
      <FaTimes className="text-xl" />
    </button>

    {/* Modal Content */}
    <div className="p-6">
      <h2 id="modal-title" className="text-2xl font-bold text-[#1a1a1a] mb-2">
        Track Your Order
      </h2>
      <p className="text-gray-600 mb-6">
        Enter your transaction ID to view order status
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label 
            htmlFor="transactionId" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Transaction ID
          </label>
          <input
            ref={inputRef}
            type="text"
            id="transactionId"
            value={transactionId}
            onChange={(e) => {
              setTransactionId(e.target.value);
              setError("");
            }}
            placeholder="e.g. JMART_TXN1751184575268859"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#088178] focus:border-transparent"
            aria-invalid={!!error}
            aria-describedby={error ? "transaction-error" : undefined}
          />
          {error && (
            <p id="transaction-error" className="text-red-500 text-sm mt-1">
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#088178] hover:bg-[#077168]'
          } text-white py-3 px-4 rounded-md transition-colors duration-300 flex items-center justify-center gap-2`}
          aria-disabled={isLoading}
        >
          {isLoading ? 'Verifying...' : (
            <>
              <FaSearch />
              Track Order
            </>
          )}
        </button>
      </form>
    </div>
  </div>
</div>
  );
};

export default TrackOrderModal;