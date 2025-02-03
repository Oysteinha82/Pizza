"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import { PRODUCT_PRICES } from "@/contexts/CartContext";
import SnowEffect from "../effects/SnowEffect";
import PartyEffect from "../effects/PartyEffect";
import HotEffect from "../effects/HotEffect";
import Image from "next/image";

interface PromotionCardProps {
  title: string;
  description: string;
  discount: number;
  image: string;
  price: number;
  originalPrice: number;
  onClick: () => void;
  translationKey: string;
}

export default function PromotionCard({
  title,
  description,
  discount,
  image,
  price,
  originalPrice,
  onClick,
  translationKey,
}: PromotionCardProps) {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const currency = t("productModal.currency");

  // Hent priser fra PRODUCT_PRICES
  const productPrices = PRODUCT_PRICES[translationKey];
  const currentPrice = productPrices?.prices[language]?.normal || price;
  const currentOriginalPrice =
    productPrices?.prices[language]?.large || originalPrice;

  const isChristmasSpecial = translationKey === "christmas_special";
  const isTriplePizza = translationKey === "triple_pizza";
  const isQuattroSpecial = translationKey === "quattro_special";

  return (
    <div className="relative group h-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div className="relative w-full h-full">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transform scale-[1.02] group-hover:scale-110 
                    transition-all duration-700 ease-in-out"
            priority
            sizes="(max-width: 640px) 100vw,
                   (max-width: 1024px) 90vw,
                   80vw"
          />
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        {isChristmasSpecial && <SnowEffect />}
        {isTriplePizza && <PartyEffect />}
        {isQuattroSpecial && <HotEffect />}
      </div>

      {/* Content Container */}
      <div className="absolute inset-x-0 bottom-0 z-20">
        <div className="p-6 sm:p-8">
          {/* Title and Description */}
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 font-playfair">
            {title}
          </h3>
          <p className="text-base sm:text-lg text-white/90 leading-relaxed mb-4 line-clamp-2 max-w-2xl">
            {description}
          </p>

          {/* Price Section */}
          <div className="flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#FFD700] drop-shadow-[0_0_3px_rgba(255,215,0,0.3)]">
              {currency === "$" ? "$" : ""}
              {currentPrice}
              {currency === "kr" ? " kr" : ""}
            </span>
            <span className="text-base sm:text-lg lg:text-xl text-red-400 line-through font-medium">
              {currency === "$" ? "$" : ""}
              {currentOriginalPrice}
              {currency === "kr" ? " kr" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Discount badge */}
      <div className="absolute top-6 left-6 z-20">
        <div
          className="bg-red-600 text-white px-4 py-2 rounded-full font-bold 
                    shadow-lg transform -rotate-2 group-hover:rotate-0 transition-transform duration-300
                    text-sm sm:text-base"
        >
          {t("promotions.saveToday").replace("{discount}", discount.toString())}
        </div>
      </div>

      {/* Velg Button */}
      <div className="absolute bottom-6 right-6 z-20">
        <button
          onClick={onClick}
          className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-full 
                    text-base sm:text-lg font-medium transition-all duration-300 flex items-center gap-2
                    hover:gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          {t("productModal.select")}
          <svg
            className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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
  );
}
