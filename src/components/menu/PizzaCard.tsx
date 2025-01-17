"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import ProductModal from "@/components/modals/ProductModal";
import { ProductType } from "@/types/product";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";

// Dynamically import ProductModal with no SSR
const DynamicProductModal = dynamic(
  () => import("@/components/modals/ProductModal"),
  { ssr: false }
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
}: PizzaCardProps) {
  const [showModal, setShowModal] = useState(false);
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const currency = t("productModal.currency");
  const imagePath = image.startsWith("/") ? image : `/${image}`;

  // Convert price from NOK to USD (divide by 10.5)
  const adjustedPrice = currency === "$" ? Math.round(price / 10.5) : price;

  // Function to normalize ingredient name for translation
  const normalizeIngredient = (ingredient: string) => {
    return ingredient
      .toLowerCase()
      .replace(/ & /g, "_")
      .replace(/ /g, "_")
      .replace(/\./g, "");
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300 group h-full flex flex-col">
        <div className="relative h-56 overflow-hidden flex-shrink-0">
          <Image
            src={imagePath}
            alt={name}
            fill
            style={{ objectFit: "cover" }}
            className="transform transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        <div className="pt-3.5 pb-4 px-4 flex flex-col flex-grow">
          <div className="flex flex-col mb-auto">
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors font-playfair tracking-wide relative inline-block">
              {translationKey ? t(`products.${translationKey}.name`) : name}
              <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-red-600/30 group-hover:w-full transition-all duration-500"></div>
            </h3>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {ingredients.map((ingredient, index) => (
                <span
                  key={index}
                  className="px-2.5 py-0.5 bg-stone-50 text-stone-600 rounded-full text-[13px] font-medium border border-stone-200 hover:bg-stone-100 hover:text-stone-700 transition-all duration-300"
                >
                  {t(`ingredients.${normalizeIngredient(ingredient)}`)}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-3.5 flex items-center justify-between pt-4">
            <div className="flex items-baseline gap-1 group/price">
              <span className="text-sm font-medium text-stone-500">
                {t("productModal.from")} {currency === "$" ? "$" : ""}
              </span>
              <span className="text-2xl font-bold text-gray-800 font-oswald tracking-wider">
                {adjustedPrice}
                {currency === "kr" ? " kr" : ""}
              </span>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all transform hover:scale-105 font-medium tracking-wide shadow-md hover:shadow-lg group/btn flex items-center gap-1.5"
            >
              <span className="relative z-10">{t("productModal.select")}</span>
              <svg
                className="w-4 h-4 transform transition-transform duration-300 group-hover/btn:translate-x-1"
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
            </button>
          </div>
        </div>
      </div>
      {showModal && (
        <DynamicProductModal
          onClose={() => setShowModal(false)}
          product={{
            name: translationKey ? t(`products.${translationKey}.name`) : name,
            description: translationKey
              ? t(`products.${translationKey}.description`)
              : description || "",
            price: adjustedPrice,
            image: imagePath,
            type,
            ingredients,
            allergener,
            spicyLevel,
            originalPrice,
          }}
        />
      )}
    </>
  );
}
