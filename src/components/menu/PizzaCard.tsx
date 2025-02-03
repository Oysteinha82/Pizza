"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ProductType } from "@/types/product";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";

// Dynamically import ProductModal with no SSR
const DynamicProductModal = dynamic(
  () => import("@/components/modals/ProductModal"),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    ),
  }
);

interface PizzaCardProps {
  name: string;
  ingredients: string[];
  price: number;
  image: string;
  type: ProductType;
  description?: string;
  allergener?: string[];
  spicyLevel?: number;
  originalPrice?: number;
  translationKey?: string;
  sizes?: { [key: string]: number };
}

export default function PizzaCard({
  name,
  ingredients,
  price,
  image,
  type,
  description,
  allergener,
  spicyLevel,
  originalPrice,
  translationKey,
  sizes,
}: PizzaCardProps) {
  const [showModal, setShowModal] = useState(false);
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const { addItem } = useCart();
  const currency = t("productModal.currency");
  const imagePath = image.startsWith("/") ? image : `/${image}`;

  // Function to normalize ingredient name for translation
  const normalizeIngredient = (ingredient: string) => {
    return ingredient
      .toLowerCase()
      .replace(/ & /g, "_")
      .replace(/ /g, "_")
      .replace(/\./g, "");
  };

  const handleAddToCart = (options: any) => {
    addItem({
      id: Math.random().toString(36).substr(2, 9),
      productId: translationKey || name,
      name: translationKey ? t(`products.${translationKey}.name`) : name,
      price: price,
      image: imagePath,
      type,
      quantity: 1,
      currency: language === "no" ? "NOK" : "USD",
      options,
      translationKey: translationKey || name,
    });
    setShowModal(false);
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300 group h-full flex flex-col"
      >
        <div className="relative h-[200px] sm:h-[224px] overflow-hidden flex-shrink-0">
          <Image
            src={imagePath}
            alt={name}
            fill
            style={{ objectFit: "cover" }}
            className="transform transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        <div className="pt-3 pb-3.5 px-3 sm:pt-3.5 sm:pb-4 sm:px-4 flex flex-col flex-grow">
          <div className="flex flex-col mb-auto">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-red-600 transition-colors font-playfair tracking-wide">
              {translationKey ? t(`products.${translationKey}.name`) : name}
            </h3>
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
              {translationKey
                ? t(`products.${translationKey}.description`)
                : description}
            </p>
            <div className="mt-2 sm:mt-2.5 flex flex-wrap gap-1 sm:gap-1.5">
              {ingredients.map((ingredient, index) => (
                <motion.span
                  key={index}
                  whileHover={{ scale: 1.05, backgroundColor: "#fee2e2" }}
                  className="px-2 sm:px-2.5 py-0.5 bg-red-50 text-gray-600 rounded-lg text-xs sm:text-[13px] font-medium transition-all duration-300"
                >
                  {t(`ingredients.${normalizeIngredient(ingredient)}`)}
                </motion.span>
              ))}
            </div>
          </div>
          <div className="mt-3 sm:mt-3.5 flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 uppercase tracking-wider">
                {t("productModal.from")}
              </span>
              <div className="flex items-center">
                {currency === "kr" ? (
                  <span className="text-xl sm:text-2xl font-bold text-gray-800 font-oswald tracking-tight">
                    {price}
                    <span className="text-base sm:text-lg font-medium ml-0.5">
                      {currency}
                    </span>
                  </span>
                ) : (
                  <span className="text-xl sm:text-2xl font-bold text-gray-800 font-oswald tracking-tight">
                    <span className="text-base sm:text-lg font-medium mr-0.5">
                      {currency}
                    </span>
                    {price}
                  </span>
                )}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#dc2626" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="px-3 sm:px-5 py-1.5 sm:py-2 bg-red-600 text-white rounded-full transition-all font-medium tracking-wide shadow-md hover:shadow-xl flex items-center gap-1 sm:gap-1.5 text-sm sm:text-base"
            >
              <span className="relative z-10">{t("productModal.select")}</span>
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.div>
      {showModal && (
        <DynamicProductModal
          onClose={() => setShowModal(false)}
          onAddToCart={handleAddToCart}
          product={{
            name: translationKey ? t(`products.${translationKey}.name`) : name,
            description: translationKey
              ? t(`products.${translationKey}.description`)
              : description || "",
            price: price,
            image: imagePath,
            type,
            ingredients,
            allergener,
            spicyLevel,
            sizes,
          }}
        />
      )}
    </>
  );
}
