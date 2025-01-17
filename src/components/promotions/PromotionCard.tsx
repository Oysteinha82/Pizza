"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import SnowEffect from "../effects/SnowEffect";
import PartyEffect from "../effects/PartyEffect";
import HotEffect from "../effects/HotEffect";
import Image from "next/image";

export default function PromotionCard({
  title,
  description,
  discount,
  image,
  price,
  originalPrice,
  onClick,
  translationKey,
}) {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const currency = t("productModal.currency");

  // Konverterer prisene fra NOK til USD med en mer realistisk kurs (1 USD = ca. 10.5 NOK)
  const adjustedPrice = currency === "$" ? Math.round(price / 10.5) : price;
  const adjustedOriginalPrice =
    currency === "$" ? Math.round(originalPrice / 10.5) : originalPrice;

  const isChristmasSpecial = translationKey === "christmas_special";
  const isTriplePizza = translationKey === "triple_pizza";
  const isQuattroSpecial = translationKey === "quattro_special";

  return (
    <div className="relative group h-[500px] overflow-hidden">
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
          />
        </div>
        {/* Enkel gradient for tekstområdet */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        {isChristmasSpecial && <SnowEffect />}
        {isTriplePizza && <PartyEffect />}
        {isQuattroSpecial && <HotEffect />}
      </div>

      {/* Discount badge */}
      <div className="absolute top-8 left-10 z-20">
        <div
          className="bg-red-600 text-white px-4 py-2 rounded-full font-bold 
                      shadow-lg transform -rotate-2 group-hover:rotate-0 transition-transform duration-300"
        >
          {t("promotions.saveToday").replace("{discount}", discount.toString())}
        </div>
      </div>

      {/* Content Container */}
      <div className="absolute inset-x-0 bottom-0 z-20">
        <div className="p-10 max-w-xl">
          {/* Title and Description */}
          <h3 className="text-3xl font-bold text-white mb-3">{title}</h3>
          <p className="text-lg text-white/90 leading-relaxed mb-4 line-clamp-2">
            {description}
          </p>

          {/* Price Section */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-[#FFD700] drop-shadow-[0_0_3px_rgba(255,215,0,0.3)]">
              {currency === "$" ? "$" : ""}
              {adjustedPrice}
              {currency === "kr" ? " kr" : ""}
            </span>
            <span className="text-lg text-red-400 line-through font-medium">
              {currency === "$" ? "$" : ""}
              {adjustedOriginalPrice}
              {currency === "kr" ? " kr" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Velg Button - høyre hjørne */}
      <div className="absolute bottom-10 right-10 z-20">
        <button
          onClick={onClick}
          className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-full 
                        text-lg font-medium transition-all duration-300 flex items-center gap-2
                        hover:gap-3 shadow-lg hover:shadow-xl"
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
