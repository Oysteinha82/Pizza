"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import { useOrders } from "@/contexts/OrderContext";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LOCATIONS = ["Manhattan", "Brooklyn", "Oslo", "Los Angeles"];

const ESTIMATED_COOKING_TIME = 20; // minutes
const ESTIMATED_DELIVERY_TIME = 30; // minutes

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, totalPrice, clearCart, setIsCartOpen } = useCart();
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const { user, isAuthenticated } = useAuth();
  const { addOrder } = useOrders();
  const [step, setStep] = useState<"delivery" | "payment" | "confirmation">(
    "delivery"
  );
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">(
    "delivery"
  );
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    email: "",
    location: LOCATIONS[0],
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });
  const [orderNumber, setOrderNumber] = useState("");
  const [estimatedTime, setEstimatedTime] = useState<Date | null>(null);
  const [orderItems, setOrderItems] = useState<CartItem[]>([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderCurrency, setOrderCurrency] = useState<"NOK" | "USD">("USD");

  useEffect(() => {
    if (isOpen && user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        address: user.address || "",
        email: user.email || "",
        cardholderName: `${user.firstName} ${user.lastName}` || "",
      }));
    }
  }, [isOpen, user]);

  // Reset state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setStep("delivery");
      setDeliveryMethod("delivery");
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        email: "",
        location: LOCATIONS[0],
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardholderName: "",
      });
      setOrderNumber("");
      setEstimatedTime(null);
      setOrderItems([]);
      setOrderTotal(0);
      setOrderCurrency("USD");
    }
  }, [isOpen]);

  useEffect(() => {
    if (items.length > 0) {
      const currency = language === "no" ? "NOK" : "USD";
      setOrderCurrency(currency);
    }
  }, [items, language]);

  const generateOrderNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `PE-${timestamp}-${random}`;
  };

  const calculateEstimatedTime = () => {
    const now = new Date();
    const estimatedMinutes =
      deliveryMethod === "delivery"
        ? ESTIMATED_COOKING_TIME + ESTIMATED_DELIVERY_TIME
        : ESTIMATED_COOKING_TIME;
    now.setMinutes(now.getMinutes() + estimatedMinutes);
    return now;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "delivery") {
      setStep("payment");
    } else if (step === "payment") {
      const newOrderNumber = generateOrderNumber();
      const estimatedTime = calculateEstimatedTime();
      setOrderNumber(newOrderNumber);
      setEstimatedTime(estimatedTime);
      // Store order items with their original currency
      setOrderItems(
        items.map((item) => ({
          ...item,
          currency: item.currency, // Behold original currency
        }))
      );
      setOrderTotal(totalPrice);
      setOrderCurrency(items[0]?.currency || "USD"); // Behold original currency

      // Add order to OrderContext with original currency
      addOrder({
        date: new Date(),
        items: items.map((item) => ({
          ...item,
          currency: item.currency, // Behold original currency
        })),
        totalPrice,
        deliveryMethod,
        address: formData.address,
        location: formData.location,
        estimatedTime,
        currency: items[0]?.currency || "USD", // Behold original currency
      });

      setTimeout(() => {
        setStep("confirmation");
        clearCart();
      }, 1500);
    }
  };

  const formatPrice = (price: number, itemCurrency?: string) => {
    // Use the item's original currency if provided, otherwise use order currency
    const currency = itemCurrency || orderCurrency;
    return currency === "NOK" ? `${price} kr` : `$${price}`;
  };

  const formatEstimatedTime = (date: Date | null) => {
    if (!date) return "";

    const now = new Date();
    const diffMinutes = Math.round(
      (date.getTime() - now.getTime()) / (1000 * 60)
    );

    const timeString = date.toLocaleTimeString(
      language === "no" ? "nb-NO" : "en-US",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );

    const translationParams = {
      minutes: diffMinutes.toString(),
      time: timeString,
    };

    return t("checkout.readyIn")
      .replace("{minutes}", translationParams.minutes)
      .replace("{time}", translationParams.time);
  };

  const handleClose = () => {
    onClose();
    // Reset state when closing
    setStep("delivery");
    setDeliveryMethod("delivery");
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      email: "",
      location: LOCATIONS[0],
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
    });
    setOrderNumber("");
    setEstimatedTime(null);
    setOrderItems([]);
    setOrderTotal(0);
    setOrderCurrency("USD");
  };

  if (!isOpen) return null;

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
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    {step === "delivery" ? (
                      <button
                        onClick={() => {
                          onClose();
                          requestAnimationFrame(() => {
                            setIsCartOpen(true);
                          });
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-full transition-colors group"
                        aria-label="Back to cart"
                      >
                        <svg
                          className="w-5 h-5 text-gray-500 group-hover:text-gray-700"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                          />
                        </svg>
                        {t("cart.title")}
                      </button>
                    ) : (
                      step === "payment" && (
                        <button
                          onClick={() => setStep("delivery")}
                          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors group"
                          aria-label="Go back"
                        >
                          <svg
                            className="w-5 h-5 text-gray-500 group-hover:text-gray-700"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                          </svg>
                        </button>
                      )
                    )}
                    <div className="flex items-center gap-4">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {step === "delivery" && t("checkout.title")}
                        {step === "payment" && t("checkout.payment")}
                        {step === "confirmation" &&
                          t("checkout.orderConfirmed")}
                      </h2>
                      {/* Step indicators */}
                      <div className="flex gap-1.5">
                        <div
                          className={`w-1.5 h-1.5 rounded-full transition-colors ${
                            step === "delivery" ? "bg-red-600" : "bg-gray-300"
                          }`}
                          aria-label="Delivery step"
                        />
                        <div
                          className={`w-1.5 h-1.5 rounded-full transition-colors ${
                            step === "payment" ? "bg-red-600" : "bg-gray-300"
                          }`}
                          aria-label="Payment step"
                        />
                        <div
                          className={`w-1.5 h-1.5 rounded-full transition-colors ${
                            step === "confirmation"
                              ? "bg-red-600"
                              : "bg-gray-300"
                          }`}
                          aria-label="Confirmation step"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Close modal"
                  >
                    <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                  </button>
                </div>

                {step === "delivery" && (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Delivery Method Selection */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {t("checkout.deliveryMethod.title")}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setDeliveryMethod("delivery")}
                          className={`p-4 border rounded-xl text-left transition-all duration-200 ${
                            deliveryMethod === "delivery"
                              ? "border-red-500 bg-red-50"
                              : "border-gray-200 hover:border-red-500"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">
                              {t("checkout.deliveryMethod.delivery.title")}
                            </span>
                            <div
                              className={`w-4 h-4 rounded-full border-2 ${
                                deliveryMethod === "delivery"
                                  ? "border-red-500 bg-red-500"
                                  : "border-gray-300"
                              }`}
                            />
                          </div>
                          <p className="text-sm text-gray-500">
                            {t("checkout.deliveryMethod.delivery.time")}
                          </p>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeliveryMethod("pickup")}
                          className={`p-4 border rounded-xl text-left transition-all duration-200 ${
                            deliveryMethod === "pickup"
                              ? "border-red-500 bg-red-50"
                              : "border-gray-200 hover:border-red-500"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">
                              {t("checkout.deliveryMethod.pickup.title")}
                            </span>
                            <div
                              className={`w-4 h-4 rounded-full border-2 ${
                                deliveryMethod === "pickup"
                                  ? "border-red-500 bg-red-500"
                                  : "border-gray-300"
                              }`}
                            />
                          </div>
                          <p className="text-sm text-gray-500">
                            {t("checkout.deliveryMethod.pickup.time")}
                          </p>
                        </button>
                      </div>
                    </div>

                    {/* Location Selection */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {deliveryMethod === "delivery"
                          ? t("checkout.selectLocation.delivery")
                          : t("checkout.selectLocation.pickup")}
                      </label>
                      <div className="relative">
                        <select
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-white"
                          value={formData.location}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              location: e.target.value,
                            })
                          }
                        >
                          {LOCATIONS.map((loc) => (
                            <option key={loc} value={loc}>
                              {loc}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg
                            className="w-5 h-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 gap-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t("profile.firstName")}
                          </label>
                          <input
                            type="text"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            value={formData.firstName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                firstName: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t("profile.lastName")}
                          </label>
                          <input
                            type="text"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            value={formData.lastName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lastName: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("checkout.phone")}
                        </label>
                        <input
                          type="tel"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    {/* Delivery Address (only for delivery) */}
                    {deliveryMethod === "delivery" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("checkout.deliveryAddress")}
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={t("checkout.addressPlaceholder")}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          value={formData.address}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: e.target.value,
                            })
                          }
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("checkout.email")}
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>

                    <motion.button
                      type="submit"
                      className="w-full bg-red-600 text-white py-4 rounded-xl font-medium hover:bg-red-700 
                                transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      {t("checkout.continue")}
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
                    </motion.button>
                  </form>
                )}

                {step === "payment" && (
                  <div className="space-y-6">
                    {/* Order Summary */}
                    <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">
                          {t("checkout.orderDetails")}
                        </h3>
                      </div>
                      <div className="p-4 space-y-3">
                        {items.map((item) => (
                          <div className="flex justify-between items-start">
                            <div className="flex items-start gap-2">
                              <span className="text-gray-600 mt-1">
                                {item.quantity}x
                              </span>
                              <div className="flex flex-col">
                                <span className="text-gray-900">
                                  {t(`products.${item.translationKey}.name`)}
                                </span>
                                <div className="flex items-center gap-1.5 flex-wrap mt-1">
                                  {(item.options?.size ||
                                    item.options?.drinkSize) && (
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
                                          {t(
                                            `productModal.extraCheese.${item.options.cheeseOption}Name`
                                          )}
                                        </span>
                                      </div>
                                    )}
                                  {item.options?.extras?.map(
                                    (extra: string, index: number) => (
                                      <div
                                        key={index}
                                        className="inline-flex items-center gap-1 bg-yellow-50/80 px-1.5 py-0.5 rounded-lg border border-yellow-100"
                                      >
                                        <span
                                          className="text-sm"
                                          role="img"
                                          aria-label="extra"
                                        >
                                          🧀
                                        </span>
                                        <span className="text-xs font-medium text-yellow-700">
                                          {t(`extras.${extra}`)}
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                            <span className="text-gray-900">
                              {formatPrice(item.price, item.currency)}
                            </span>
                          </div>
                        ))}
                        <div className="pt-3 border-t border-gray-200">
                          <div className="flex justify-between font-medium">
                            <span>{t("checkout.totalToPay")}</span>
                            <span className="text-lg">
                              {formatPrice(totalPrice)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {t("checkout.demo")}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {t("checkout.demoDescription")}
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("checkout.cardholderName")}
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          value={formData.cardholderName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              cardholderName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("checkout.cardNumber")}
                        </label>
                        <div className="absolute right-4 top-[60%] -translate-y-1/2">
                          <Image
                            src="/cards.png"
                            alt="Accepted Cards"
                            width={80}
                            height={24}
                            className="opacity-80"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          required
                          autoComplete="off"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          value={formData.cardNumber}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, "");
                            value = value.match(/.{1,4}/g)?.join(" ") || value;
                            setFormData({ ...formData, cardNumber: value });
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t("checkout.expiryDate")}
                          </label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            maxLength={5}
                            required
                            autoComplete="cc-exp"
                            className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            value={formData.expiryDate}
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, "");
                              if (value.length >= 2) {
                                value =
                                  value.slice(0, 2) + "/" + value.slice(2);
                              }
                              setFormData({ ...formData, expiryDate: value });
                            }}
                          />
                          <div className="absolute right-3 top-[60%] -translate-y-1/2">
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t("checkout.cvv")}
                          </label>
                          <input
                            type="text"
                            placeholder="123"
                            maxLength={3}
                            required
                            autoComplete="cc-csc"
                            className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            value={formData.cvv}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              setFormData({ ...formData, cvv: value });
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <motion.button
                      onClick={handleSubmit}
                      className="w-full bg-red-600 text-white py-4 rounded-xl font-medium hover:bg-red-700 
                                transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      {t("checkout.simulatePayment")} ({formatPrice(totalPrice)}
                      )
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
                    </motion.button>
                  </div>
                )}

                {step === "confirmation" && (
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <svg
                        className="w-10 h-10 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {t("checkout.thankYou")}
                    </h3>

                    {/* Order Details */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-left space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          {t("checkout.orderNumber")}
                        </p>
                        <p className="text-xl font-mono font-bold text-gray-900">
                          {orderNumber}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          {t("checkout.orderDetails")}
                        </p>
                        <div className="space-y-2">
                          {orderItems.map((item) => (
                            <div className="flex justify-between items-start">
                              <div className="flex items-start gap-2">
                                <span className="text-gray-600 mt-1">
                                  {item.quantity}x
                                </span>
                                <div className="flex flex-col">
                                  <span className="text-gray-900">
                                    {t(`products.${item.translationKey}.name`)}
                                  </span>
                                  <div className="flex items-center gap-1.5 flex-wrap mt-1">
                                    {(item.options?.size ||
                                      item.options?.drinkSize) && (
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
                                      item.options.cheeseOption !==
                                        "normal" && (
                                        <div className="inline-flex items-center gap-1 bg-yellow-50/80 px-1.5 py-0.5 rounded-lg border border-yellow-100">
                                          <span
                                            className="text-sm"
                                            role="img"
                                            aria-label="cheese"
                                          >
                                            🧀
                                          </span>
                                          <span className="text-xs font-medium text-yellow-700">
                                            {t(
                                              `productModal.extraCheese.${item.options.cheeseOption}Name`
                                            )}
                                          </span>
                                        </div>
                                      )}
                                    {item.options?.extras?.map(
                                      (extra: string, index: number) => (
                                        <div
                                          key={index}
                                          className="inline-flex items-center gap-1 bg-yellow-50/80 px-1.5 py-0.5 rounded-lg border border-yellow-100"
                                        >
                                          <span
                                            className="text-sm"
                                            role="img"
                                            aria-label="extra"
                                          >
                                            🧀
                                          </span>
                                          <span className="text-xs font-medium text-yellow-700">
                                            {t(`extras.${extra}`)}
                                          </span>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                              <span className="text-gray-900">
                                {formatPrice(item.price, item.currency)}
                              </span>
                            </div>
                          ))}
                          <div className="pt-2 border-t border-gray-200">
                            <div className="flex justify-between font-medium">
                              <span>{t("checkout.total")}</span>
                              <span>{formatPrice(orderTotal)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          {deliveryMethod === "delivery"
                            ? t("checkout.deliveryAddress")
                            : t("checkout.pickupFrom")}
                        </p>
                        <p className="text-base text-gray-900">
                          {deliveryMethod === "delivery"
                            ? formData.address
                            : formData.location}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          {deliveryMethod === "delivery"
                            ? t("checkout.estimatedDeliveryTime")
                            : t("checkout.readyForPickup")}
                        </p>
                        <p className="text-base text-gray-900">
                          {estimatedTime && formatEstimatedTime(estimatedTime)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {deliveryMethod === "delivery"
                            ? t("checkout.deliveryNote")
                            : t("checkout.pickupNote")}
                        </p>
                      </div>
                    </div>

                    <div className="text-sm text-gray-500">
                      <p>{t("checkout.viewInProfile")}</p>
                      <button
                        onClick={() =>
                          (window.location.href = "/profile/orders")
                        }
                        className="text-red-600 hover:text-red-700 font-medium mt-2"
                      >
                        {t("checkout.goToOrders")}
                      </button>
                    </div>

                    <motion.button
                      onClick={handleClose}
                      className="w-full bg-red-600 text-white py-4 rounded-xl font-medium hover:bg-red-700 
                                transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      {t("checkout.close")}
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
