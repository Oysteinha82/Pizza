"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name: string;
    image: string;
    ingredients: string[];
    basePrice: number;
    type: "pizza" | "pasta" | "salad" | "dessert" | "drinks" | "dips";
    isPromotion?: boolean;
  };
}

export default function ProductModal({
  isOpen,
  onClose,
  product,
}: ProductModalProps) {
  const [size, setSize] = useState<"small" | "large">("small");
  const [cooking, setCooking] = useState<"normal" | "well-done">("normal");
  const [extraCheese, setExtraCheese] = useState<"none" | "extra" | "double">(
    "none"
  );
  const [quantity, setQuantity] = useState(1);
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  if (!isOpen) return null;

  const extraCheesePrice =
    extraCheese === "extra" ? 20 : extraCheese === "double" ? 35 : 0;
  const basePrice =
    product.type === "pizza" && size === "large"
      ? product.basePrice + 60
      : product.basePrice;
  const totalPrice = basePrice + extraCheesePrice;
  const currency = t("productModal.currency");

  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div
        className="bg-white rounded-3xl max-w-5xl w-full max-h-[85vh] overflow-hidden relative shadow-2xl transform transition-all"
        style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
      >
        <div className="grid md:grid-cols-[1.2fr,1fr] h-full">
          {/* Image section */}
          <div className="relative h-80 md:h-[600px] overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            {product.isPromotion && (
              <div className="absolute top-6 left-6 bg-red-600 text-white px-4 py-2 rounded-full font-medium shadow-lg">
                {t("productModal.specialOffer")}
              </div>
            )}
          </div>

          {/* Content section */}
          <div className="p-8 overflow-y-auto">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all hover:scale-105"
            >
              <svg
                className="w-6 h-6"
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

            <h2 className="text-3xl font-bold font-playfair mb-4">
              {product.name}
            </h2>

            <div className="flex flex-wrap gap-2 mb-8">
              {product.ingredients.map((ingredient, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-stone-50 text-stone-600 rounded-full text-sm border border-stone-200"
                >
                  {ingredient}
                </span>
              ))}
            </div>

            {product.type === "pizza" && (
              <>
                {/* Size selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">
                    {t("productModal.size.title")}
                  </h3>
                  <div className="flex gap-4">
                    <button
                      className={`px-4 py-2.5 rounded-full border-2 transition-all ${
                        size === "small"
                          ? "border-red-600 bg-red-50 text-red-600"
                          : "border-gray-200 hover:border-red-600"
                      }`}
                      onClick={() => setSize("small")}
                    >
                      {t("productModal.size.small")}
                    </button>
                    <button
                      className={`px-4 py-2.5 rounded-full border-2 transition-all ${
                        size === "large"
                          ? "border-red-600 bg-red-50 text-red-600"
                          : "border-gray-200 hover:border-red-600"
                      }`}
                      onClick={() => setSize("large")}
                    >
                      {t("productModal.size.large")}
                    </button>
                  </div>
                </div>

                {/* Extra cheese selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">
                    {t("productModal.extraCheese.title")}
                  </h3>
                  <div className="flex gap-4">
                    <button
                      className={`px-4 py-2.5 rounded-full border-2 transition-all ${
                        extraCheese === "none"
                          ? "border-red-600 bg-red-50 text-red-600"
                          : "border-gray-200 hover:border-red-600"
                      }`}
                      onClick={() => setExtraCheese("none")}
                    >
                      {t("productModal.extraCheese.normal")}
                    </button>
                    <button
                      className={`px-4 py-2.5 rounded-full border-2 transition-all ${
                        extraCheese === "extra"
                          ? "border-red-600 bg-red-50 text-red-600"
                          : "border-gray-200 hover:border-red-600"
                      }`}
                      onClick={() => setExtraCheese("extra")}
                    >
                      {t("productModal.extraCheese.extra")}
                    </button>
                    <button
                      className={`px-4 py-2.5 rounded-full border-2 transition-all ${
                        extraCheese === "double"
                          ? "border-red-600 bg-red-50 text-red-600"
                          : "border-gray-200 hover:border-red-600"
                      }`}
                      onClick={() => setExtraCheese("double")}
                    >
                      {t("productModal.extraCheese.double")}
                    </button>
                  </div>
                </div>

                {/* Cooking preference */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">
                    {t("productModal.cookingPreference.title")}
                  </h3>
                  <div className="flex gap-4">
                    <button
                      className={`px-4 py-2.5 rounded-full border-2 transition-all ${
                        cooking === "normal"
                          ? "border-red-600 bg-red-50 text-red-600"
                          : "border-gray-200 hover:border-red-600"
                      }`}
                      onClick={() => setCooking("normal")}
                    >
                      {t("productModal.cookingPreference.normal")}
                    </button>
                    <button
                      className={`px-4 py-2.5 rounded-full border-2 transition-all ${
                        cooking === "well-done"
                          ? "border-red-600 bg-red-50 text-red-600"
                          : "border-gray-200 hover:border-red-600"
                      }`}
                      onClick={() => setCooking("well-done")}
                    >
                      {t("productModal.cookingPreference.wellDone")}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Quantity and price */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <button
                  className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-red-600 transition-colors text-lg"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="text-xl font-semibold w-8 text-center">
                  {quantity}
                </span>
                <button
                  className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-red-600 transition-colors text-lg"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  {t("productModal.total")}
                </div>
                <div className="text-3xl font-bold font-oswald">
                  {currency === "$" ? "$" : ""}
                  {totalPrice * quantity}
                  {currency === "kr" ? " kr" : ""}
                </div>
              </div>
            </div>

            {/* Add to cart button */}
            <button
              onClick={handleAddToCart}
              className="w-full py-4 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all transform hover:scale-[1.02] font-medium text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {t("productModal.addToCart")}
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
