"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart, PRODUCT_PRICES } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import { useEffect } from "react";
import CheckoutModal from "./CheckoutModal";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { CartItem } from "@/contexts/CartContext";
import {
  XIcon,
  TrashIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/outline";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const {
    items,
    removeItem,
    updateQuantity,
    totalPrice,
    clearCart,
    setIsCartOpen,
  } = useCart();
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const { isAuthenticated } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showMixedCurrencyError, setShowMixedCurrencyError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  const handleClose = () => {
    document.body.style.overflow = "auto";
    setIsCartOpen(false);
    onClose();
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    handleClose();
    setShowCheckout(true);
  };

  const handleCheckout = () => {
    // Check for mixed currencies
    const currencies = new Set(items.map((item) => item.currency));
    if (currencies.size > 1) {
      setShowMixedCurrencyError(true);
      return;
    }

    if (!isAuthenticated) {
      setShowLogin(true);
    } else {
      handleClose();
      setShowCheckout(true);
    }
  };

  const getSizeText = (item: CartItem) => {
    if (!item.options?.size && !item.options?.drinkSize) return "";

    if (item.type === "drinks") {
      return item.options.drinkSize;
    }

    if (item.options.size === "large") {
      if (item.type === "pizza") {
        return t("productModal.size.large").split("+")[0].trim();
      } else if (item.type === "pasta") {
        return t("productModal.size.largePasta").split("+")[0].trim();
      } else if (item.type === "salad") {
        return t("productModal.size.largeSalad").split("+")[0].trim();
      }
    }

    return "";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-[500px] max-h-[85vh] overflow-y-auto shadow-xl"
            >
              <div className="p-4">
                {showMixedCurrencyError && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl relative">
                    <div className="flex items-start pr-8">
                      <div className="flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          {t("cart.mixedCurrencyError.title")}
                        </h3>
                        <p className="mt-1 text-sm text-red-700">
                          {t("cart.mixedCurrencyError.description")}
                        </p>
                      </div>
                      <button
                        onClick={() => setShowMixedCurrencyError(false)}
                        className="absolute top-4 right-4 text-red-500 hover:text-red-600 p-1 hover:bg-red-100 rounded-lg transition-all"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {t("cart.title")}
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 p-1 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {items.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {t("cart.emptyTitle")}
                    </h3>
                    <p className="text-gray-500 mb-8">
                      {t("cart.emptyDescription")}
                    </p>
                    <button
                      onClick={onClose}
                      className="inline-flex items-center px-6 py-3 border border-red-600 text-red-600 
                               rounded-xl hover:bg-red-50 transition-colors duration-200"
                    >
                      <span className="mr-2">{t("cart.continueShopping")}</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start space-x-3 p-3 bg-gray-50 hover:bg-gray-100 transition-all rounded-xl border border-gray-100"
                        >
                          <div className="relative w-16 h-16 flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={t(`products.${item.translationKey}.name`)}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col space-y-2">
                              <div className="flex items-start justify-between">
                                <h3 className="font-medium text-gray-900 truncate max-w-[200px]">
                                  {t(`products.${item.translationKey}.name`)}
                                </h3>
                                <div className="flex items-center space-x-2 flex-shrink-0">
                                  <p className="font-medium text-gray-900 whitespace-nowrap">
                                    {item.currency === "NOK"
                                      ? `${item.price} kr`
                                      : `$${item.price}`}
                                  </p>
                                  <button
                                    onClick={() => removeItem(item.id)}
                                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-600 transition-all"
                                    aria-label={t("cart.remove")}
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {(item.options?.size ||
                                    item.options?.drinkSize) &&
                                    (item.type === "pizza" ||
                                      item.type === "pasta" ||
                                      item.type === "salad" ||
                                      item.type === "drinks") && (
                                      <div className="inline-flex items-center gap-1 bg-red-50/80 px-1.5 py-0.5 rounded-lg border border-red-100">
                                        <span
                                          className="text-sm"
                                          role="img"
                                          aria-label="size"
                                        >
                                          {item.type === "drinks"
                                            ? "🥤"
                                            : item.type === "pizza"
                                            ? "🍕"
                                            : "🍽️"}
                                        </span>
                                        <span className="text-xs font-medium text-red-700">
                                          {item.type === "drinks"
                                            ? item.options.drinkSize
                                            : item.type === "pizza"
                                            ? item.options?.size === "large"
                                              ? '18" (45cm)'
                                              : '12" (30cm)'
                                            : item.options?.size === "large"
                                            ? "Stor"
                                            : "Normal"}
                                        </span>
                                      </div>
                                    )}
                                  {item.options?.cheeseOption &&
                                    item.options.cheeseOption !== "normal" && (
                                      <div className="inline-flex items-center gap-1 bg-yellow-50/80 px-1.5 py-0.5 rounded-lg border border-yellow-100">
                                        <span
                                          className="text-sm"
                                          role="img"
                                          aria-label="cheese"
                                        >
                                          🧀
                                        </span>
                                        <span className="text-xs font-medium text-yellow-700">
                                          {item.options.cheeseOption === "extra"
                                            ? "Extra"
                                            : "Double"}
                                        </span>
                                      </div>
                                    )}
                                  {item.isPromotion && (
                                    <div className="flex flex-col w-full mt-1">
                                      <div className="inline-flex items-center gap-1 bg-green-50/80 px-1.5 py-0.5 rounded-lg border border-green-100 self-start">
                                        <span
                                          className="text-sm"
                                          role="img"
                                          aria-label="included"
                                        >
                                          🎁
                                        </span>
                                        <div className="flex flex-col">
                                          <span className="text-xs font-medium text-green-700">
                                            {t("productModal.included")}
                                          </span>
                                          <span className="text-xs font-medium text-green-700">
                                            {item.productId ===
                                              "christmas_special" &&
                                              "1.5L Coca-Cola"}
                                            {item.productId ===
                                              "pepperoni_special" &&
                                              "1.5L Coca-Cola"}
                                            {item.productId ===
                                              "triple_pizza" &&
                                              "3x Small Pizza + 1.5L Coca-Cola"}
                                            {item.productId ===
                                              "quattro_special" &&
                                              "1.5L Coca-Cola"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {item.options?.isWellDone && (
                                    <div className="inline-flex items-center gap-1 bg-orange-50/80 px-1.5 py-0.5 rounded-lg border border-orange-100">
                                      <span
                                        className="text-sm"
                                        role="img"
                                        aria-label="well-done"
                                      >
                                        🔥
                                      </span>
                                      <span className="text-xs font-medium text-orange-700">
                                        Well Done
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200">
                                  <button
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity - 1)
                                    }
                                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 border-r border-gray-200 transition-all rounded-l-lg"
                                  >
                                    <svg
                                      className="w-3.5 h-3.5"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 12H4"
                                      />
                                    </svg>
                                  </button>
                                  <span className="text-sm font-medium text-gray-900 w-8 text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity + 1)
                                    }
                                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 border-l border-gray-200 transition-all rounded-r-lg"
                                  >
                                    <svg
                                      className="w-3.5 h-3.5"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 space-y-4">
                      <div className="flex justify-between text-lg font-medium text-gray-900">
                        <p>{t("cart.total")}</p>
                        <p>
                          {items.length > 0 && items[0].currency === "NOK"
                            ? `${totalPrice} kr`
                            : `$${totalPrice}`}
                        </p>
                      </div>

                      <div className="mt-6">
                        <button
                          onClick={handleCheckout}
                          className="w-full bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 
                                   transition-colors flex items-center justify-center space-x-2"
                        >
                          <span>{t("cart.checkout")}</span>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}

      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
      />
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onRegisterClick={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />
      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSuccess={() => {
          setShowRegister(false);
          setShowCheckout(true);
        }}
      />
    </AnimatePresence>
  );
}
