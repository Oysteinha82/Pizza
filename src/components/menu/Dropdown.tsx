"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface DropdownProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export default function Dropdown({
  label,
  children,
  className = "",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-stone-100 
                   transition-all duration-300 ${className}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="font-medium">{label}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDownIcon className="w-4 h-4" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-48 mt-2 origin-top-right bg-white rounded-xl shadow-lg 
                     ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <motion.div
              className="py-2 px-1"
              initial="closed"
              animate="open"
              variants={{
                open: {
                  transition: { staggerChildren: 0.05 },
                },
                closed: {
                  transition: { staggerChildren: 0.05, staggerDirection: -1 },
                },
              }}
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// MenuItem komponent for konsistent styling
export function MenuItem({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <motion.button
      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-stone-50 
                rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 
                focus:ring-red-500 focus:ring-opacity-50"
      onClick={onClick}
      variants={{
        open: {
          opacity: 1,
          y: 0,
          transition: { type: "spring", stiffness: 300, damping: 24 },
        },
        closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
      }}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
}
