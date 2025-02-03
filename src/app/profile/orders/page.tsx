"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useOrders } from "@/contexts/OrderContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import Image from "next/image";

export default function OrdersPage() {
  const router = useRouter();
  const { orders, updateOrderStatus } = useOrders();
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: string }>({});
  const [expandedSections, setExpandedSections] = useState({
    active: true,
    previous: true,
  });

  // Sorter ordre etter status og dato
  const activeOrders = orders.filter((order) =>
    ["pending", "preparing", "ready"].includes(order.status)
  );
  const previousOrders = orders.filter((order) =>
    ["delivered", "completed"].includes(order.status)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeLeft: { [key: string]: string } = {};

      activeOrders.forEach((order) => {
        const now = new Date();
        const estimatedTime = new Date(order.estimatedTime);
        const diff = estimatedTime.getTime() - now.getTime();

        if (diff > 0) {
          const minutes = Math.floor(diff / (1000 * 60));
          newTimeLeft[order.id] = minutes.toString();
        } else {
          newTimeLeft[order.id] = "0";
          updateOrderStatus(order.id);
        }
      });

      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeOrders, updateOrderStatus]);

  const toggleGroup = (orderId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const toggleSection = (section: "active" | "previous") => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleBackClick = () => {
    router.push("/profile");
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language === "no" ? "nb-NO" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusText = (status: string) => {
    return t(`profile.orders.status.${status}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "delivered":
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {t("profile.orders.title")}
            </h1>
            <button
              onClick={handleBackClick}
              className="text-gray-600 hover:text-red-600 transition-colors duration-200"
            >
              {t("profile.backToProfile")}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">{t("profile.orders.noOrders")}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Active Orders */}
            {activeOrders.length > 0 && (
              <div>
                <div
                  className="flex items-center justify-between cursor-pointer mb-4"
                  onClick={() => toggleSection("active")}
                >
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                    {t("profile.orders.activeOrders").replace(
                      "{count}",
                      activeOrders.length.toString()
                    )}
                    <motion.svg
                      className="w-5 h-5 text-gray-500"
                      animate={{ rotate: expandedSections.active ? 0 : -90 }}
                      transition={{ duration: 0.2 }}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </motion.svg>
                  </h2>
                </div>
                <AnimatePresence>
                  {expandedSections.active && (
                    <motion.div
                      key="active-orders"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      {activeOrders.map((order) => (
                        <div
                          key={order.id}
                          className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
                        >
                          <div
                            className="p-6 cursor-pointer"
                            onClick={() => toggleGroup(order.id)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                  <span
                                    className={`px-2 py-1 text-xs rounded-full ${
                                      order.status === "completed"
                                        ? "bg-green-100 text-green-800"
                                        : order.status === "preparing"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : order.status === "ready"
                                        ? "bg-blue-100 text-blue-800"
                                        : order.status === "inDelivery"
                                        ? "bg-purple-100 text-purple-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {t(`profile.orders.status.${order.status}`)}
                                  </span>
                                  {timeLeft[order.id] && (
                                    <span className="text-sm text-gray-500">
                                      {timeLeft[order.id] === "0"
                                        ? t("profile.orders.status.ready")
                                        : t(
                                            "profile.orders.estimatedTime.readyIn"
                                          ).replace(
                                            "{minutes}",
                                            timeLeft[order.id]
                                          )}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500">
                                  {formatDate(order.date)}
                                </p>
                                <div className="mt-1">
                                  <span className="text-sm font-medium text-gray-900">
                                    {order.deliveryMethod === "delivery"
                                      ? t(
                                          "profile.orders.deliveryDetails.delivery"
                                        )
                                      : t(
                                          "profile.orders.deliveryDetails.pickup"
                                        )}
                                  </span>
                                  <span className="text-sm text-gray-500 ml-2">
                                    {order.deliveryMethod === "delivery"
                                      ? order.address
                                      : order.location}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-lg font-medium text-gray-900">
                                  {order.currency === "NOK"
                                    ? `${order.totalPrice} kr`
                                    : `$${order.totalPrice}`}
                                </span>
                                <motion.svg
                                  className="w-5 h-5 text-gray-500"
                                  animate={{
                                    rotate: expandedGroups.includes(order.id)
                                      ? 180
                                      : 0,
                                  }}
                                  transition={{ duration: 0.2 }}
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </motion.svg>
                              </div>
                            </div>
                          </div>

                          <AnimatePresence>
                            {expandedGroups.includes(order.id) && (
                              <motion.div
                                key={`${order.id}-active-orders`}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                                  <div className="space-y-4">
                                    {order.items.map((item, index) => (
                                      <div
                                        key={index}
                                        className="flex flex-col space-y-2 pb-4 border-b border-gray-100 last:border-0"
                                      >
                                        <div className="flex justify-between items-start">
                                          <div className="flex items-start gap-2">
                                            <span className="text-gray-600 mt-1">
                                              {item.quantity}x
                                            </span>
                                            <div className="flex flex-col">
                                              <span className="text-gray-900 font-medium">
                                                {item.translationKey
                                                  ? t(
                                                      `products.${item.translationKey}.name`
                                                    )
                                                  : item.name}
                                              </span>
                                              <div className="flex items-center gap-1.5 flex-wrap mt-1">
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
                                                          : item.type ===
                                                            "pizza"
                                                          ? "🍕"
                                                          : "🍽️"}
                                                      </span>
                                                      <span className="text-xs font-medium text-red-700">
                                                        {item.type === "drinks"
                                                          ? item.options
                                                              .drinkSize
                                                          : item.type ===
                                                            "pizza"
                                                          ? item.options
                                                              ?.size === "large"
                                                            ? t(
                                                                "productModal.size.largeName"
                                                              )
                                                            : t(
                                                                "productModal.size.normalName"
                                                              )
                                                          : item.type ===
                                                            "pasta"
                                                          ? item.options
                                                              ?.size === "large"
                                                            ? t(
                                                                "productModal.size.largePastaName"
                                                              )
                                                            : t(
                                                                "productModal.size.normalPastaName"
                                                              )
                                                          : item.type ===
                                                            "salad"
                                                          ? item.options
                                                              ?.size === "large"
                                                            ? t(
                                                                "productModal.size.largeSaladName"
                                                              )
                                                            : t(
                                                                "productModal.size.normalSaladName"
                                                              )
                                                          : item.options
                                                              ?.size === "large"
                                                          ? t(
                                                              "productModal.size.largeName"
                                                            )
                                                          : t(
                                                              "productModal.size.normalName"
                                                            )}
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
                                                  (
                                                    extra: string,
                                                    index: number
                                                  ) => (
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
                                                {item.type === "pizza" &&
                                                  item.options?.cooking && (
                                                    <div className="inline-flex items-center gap-1 bg-orange-50/80 px-1.5 py-0.5 rounded-lg border border-orange-100">
                                                      <span
                                                        className="text-sm"
                                                        role="img"
                                                        aria-label="cooking"
                                                      >
                                                        🔥
                                                      </span>
                                                      <span className="text-xs font-medium text-orange-700">
                                                        {t(
                                                          `productModal.cookingPreference.${item.options.cooking}`
                                                        )}
                                                      </span>
                                                    </div>
                                                  )}
                                              </div>
                                            </div>
                                          </div>
                                          <span className="text-gray-900 font-medium">
                                            {item.currency === "NOK"
                                              ? `${
                                                  item.price * item.quantity
                                                } kr`
                                              : `$${
                                                  item.price * item.quantity
                                                }`}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="mt-6 pt-4 border-t border-gray-100">
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium text-gray-900">
                                        {t("profile.orders.total")}
                                      </span>
                                      <span className="font-medium text-gray-900">
                                        {order.currency === "NOK"
                                          ? `${order.totalPrice} kr`
                                          : `$${order.totalPrice}`}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Previous Orders */}
            {previousOrders.length > 0 && (
              <div>
                <div
                  className="flex items-center justify-between cursor-pointer mb-4"
                  onClick={() => toggleSection("previous")}
                >
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                    {t("profile.orders.previousOrders").replace(
                      "{count}",
                      previousOrders.length.toString()
                    )}
                    <motion.svg
                      className="w-5 h-5 text-gray-500"
                      animate={{ rotate: expandedSections.previous ? 0 : -90 }}
                      transition={{ duration: 0.2 }}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </motion.svg>
                  </h2>
                </div>
                <AnimatePresence>
                  {expandedSections.previous && (
                    <motion.div
                      key="previous-orders"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      {previousOrders.map((order) => (
                        <div
                          key={order.id}
                          className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
                        >
                          <div
                            className="p-6 cursor-pointer"
                            onClick={() => toggleGroup(order.id)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusColor(
                                      order.status
                                    )}`}
                                  >
                                    {getStatusText(order.status)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                  {formatDate(order.date)}
                                </p>
                                <div className="mt-1">
                                  <span className="text-sm font-medium text-gray-900">
                                    {order.deliveryMethod === "delivery"
                                      ? t(
                                          "profile.orders.deliveryDetails.delivery"
                                        )
                                      : t(
                                          "profile.orders.deliveryDetails.pickup"
                                        )}
                                  </span>
                                  <span className="text-sm text-gray-500 ml-2">
                                    {order.deliveryMethod === "delivery"
                                      ? order.address
                                      : order.location}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="text-lg font-medium text-gray-900">
                                  {order.currency === "NOK"
                                    ? `${order.totalPrice} kr`
                                    : `$${order.totalPrice}`}
                                </span>
                                <motion.svg
                                  className="w-5 h-5 text-gray-500"
                                  animate={{
                                    rotate: expandedGroups.includes(order.id)
                                      ? 180
                                      : 0,
                                  }}
                                  transition={{ duration: 0.2 }}
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </motion.svg>
                              </div>
                            </div>
                          </div>

                          <AnimatePresence>
                            {expandedGroups.includes(order.id) && (
                              <motion.div
                                key={`${order.id}-previous-orders`}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                                  <div className="space-y-4">
                                    {order.items.map((item, index) => (
                                      <div
                                        key={index}
                                        className="flex flex-col space-y-2 pb-4 border-b border-gray-100 last:border-0"
                                      >
                                        <div className="flex justify-between items-start">
                                          <div className="flex items-start gap-2">
                                            <span className="text-gray-600 mt-1">
                                              {item.quantity}x
                                            </span>
                                            <div className="flex flex-col">
                                              <span className="text-gray-900 font-medium">
                                                {item.translationKey
                                                  ? t(
                                                      `products.${item.translationKey}.name`
                                                    )
                                                  : item.name}
                                              </span>
                                              <div className="flex items-center gap-1.5 flex-wrap mt-1">
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
                                                          : item.type ===
                                                            "pizza"
                                                          ? "🍕"
                                                          : "🍽️"}
                                                      </span>
                                                      <span className="text-xs font-medium text-red-700">
                                                        {item.type === "drinks"
                                                          ? item.options
                                                              .drinkSize
                                                          : item.type ===
                                                            "pizza"
                                                          ? item.options
                                                              ?.size === "large"
                                                            ? t(
                                                                "productModal.size.largeName"
                                                              )
                                                            : t(
                                                                "productModal.size.normalName"
                                                              )
                                                          : item.type ===
                                                            "pasta"
                                                          ? item.options
                                                              ?.size === "large"
                                                            ? t(
                                                                "productModal.size.largePastaName"
                                                              )
                                                            : t(
                                                                "productModal.size.normalPastaName"
                                                              )
                                                          : item.type ===
                                                            "salad"
                                                          ? item.options
                                                              ?.size === "large"
                                                            ? t(
                                                                "productModal.size.largeSaladName"
                                                              )
                                                            : t(
                                                                "productModal.size.normalSaladName"
                                                              )
                                                          : item.options
                                                              ?.size === "large"
                                                          ? t(
                                                              "productModal.size.largeName"
                                                            )
                                                          : t(
                                                              "productModal.size.normalName"
                                                            )}
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
                                                  (
                                                    extra: string,
                                                    index: number
                                                  ) => (
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
                                                {item.type === "pizza" &&
                                                  item.options?.cooking && (
                                                    <div className="inline-flex items-center gap-1 bg-orange-50/80 px-1.5 py-0.5 rounded-lg border border-orange-100">
                                                      <span
                                                        className="text-sm"
                                                        role="img"
                                                        aria-label="cooking"
                                                      >
                                                        🔥
                                                      </span>
                                                      <span className="text-xs font-medium text-orange-700">
                                                        {t(
                                                          `productModal.cookingPreference.${item.options.cooking}`
                                                        )}
                                                      </span>
                                                    </div>
                                                  )}
                                              </div>
                                            </div>
                                          </div>
                                          <span className="text-gray-900 font-medium">
                                            {item.currency === "NOK"
                                              ? `${
                                                  item.price * item.quantity
                                                } kr`
                                              : `$${
                                                  item.price * item.quantity
                                                }`}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="mt-6 pt-4 border-t border-gray-100">
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium text-gray-900">
                                        {t("profile.orders.total")}
                                      </span>
                                      <span className="font-medium text-gray-900">
                                        {order.currency === "NOK"
                                          ? `${order.totalPrice} kr`
                                          : `$${order.totalPrice}`}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
