"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(
    "New York - Manhattan"
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation(language);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);

  // Lukk dropdowns når man klikker utenfor
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
      if (
        locationRef.current &&
        !locationRef.current.contains(event.target as Node)
      ) {
        setIsLocationOpen(false);
      }
      if (
        languageRef.current &&
        !languageRef.current.contains(event.target as Node)
      ) {
        setIsLanguageOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const locations = [
    {
      name: "New York - Manhattan",
      address: "123 Broadway St",
      phone: "+1 (212) 555-1234",
      key: "manhattan",
    },
    {
      name: "New York - Brooklyn",
      address: "456 Atlantic Ave",
      phone: "+1 (718) 555-5678",
      key: "brooklyn",
    },
    {
      name: "Los Angeles",
      address: "789 Sunset Blvd",
      phone: "+1 (310) 555-9012",
      key: "la",
    },
    {
      name: "Oslo - Sentrum",
      address: "Karl Johans gate 10",
      phone: "+47 22 33 44 55",
      key: "oslo",
    },
  ];

  // Finn gjeldende lokasjon og telefonnummer
  const currentLocation = locations.find(
    (loc) => loc.name === selectedLocation
  );
  const phoneNumber = currentLocation?.phone || locations[0].phone;
  const locationKey = currentLocation?.key || "manhattan";

  const languages = [
    { code: "en" as const, flag: "🇺🇸", name: "English" },
    { code: "no" as const, flag: "🇳🇴", name: "Norsk" },
  ];

  const menuItems = [
    {
      name: t("header.menuItems.promotion.name"),
      href: "/#promotion",
      icon: "🔥",
      description: t("header.menuItems.promotion.description"),
    },
    {
      name: t("header.menuItems.pizza.name"),
      href: "/#pizza",
      icon: "🍕",
      description: t("header.menuItems.pizza.description"),
    },
    {
      name: t("header.menuItems.pasta.name"),
      href: "/#pasta",
      icon: "🍝",
      description: t("header.menuItems.pasta.description"),
    },
    {
      name: t("header.menuItems.salad.name"),
      href: "/#salad",
      icon: "🥗",
      description: t("header.menuItems.salad.description"),
    },
    {
      name: t("header.menuItems.dessert.name"),
      href: "/#dessert",
      icon: "🍰",
      description: t("header.menuItems.dessert.description"),
    },
    {
      name: t("header.menuItems.drinks.name"),
      href: "/#drinks",
      icon: "🥤",
      description: t("header.menuItems.drinks.description"),
    },
    {
      name: t("header.menuItems.dips.name"),
      href: "/#dips",
      icon: "🥣",
      description: t("header.menuItems.dips.description"),
    },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center h-full">
            <Link href="/" className="h-full">
              <Image
                src="/PizzaLogo.jpg"
                alt="Pizza Express Logo"
                width={100}
                height={30}
                className="h-[95%] w-auto object-contain"
                style={{ width: "auto" }}
                priority
              />
            </Link>
          </div>

          {/* Menu Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="group flex items-center space-x-1 text-gray-700 hover:text-gray-900 font-medium px-4 py-2 rounded-md focus:outline-none transition-all duration-200 ease-in-out"
            >
              <span>{t("header.menu")}</span>
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${
                  isMenuOpen ? "transform rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <div
              className={`absolute top-full left-0 mt-1 w-72 bg-white rounded-lg shadow-xl py-2 transition-all duration-200 ease-in-out transform origin-top ${
                isMenuOpen
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              } z-50`}
            >
              <div className="py-1">
                {menuItems.map((item, index) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group flex flex-col px-4 py-3 hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium text-gray-900 group-hover:text-gray-900">
                        {item.name}
                      </span>
                    </div>
                    <span className="ml-8 text-sm text-gray-500 group-hover:text-gray-700">
                      {item.description}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Contact and Location Section */}
          <div className="flex flex-col items-end">
            {/* Phone */}
            <div className="flex items-center text-gray-700 mb-1">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span className="text-sm font-medium transition-all duration-200">
                {phoneNumber}
              </span>
            </div>

            {/* Opening Hours */}
            <div className="text-xs text-gray-500 mb-1">
              {t(`header.openHours.${locationKey}`)}
            </div>

            {/* Location Selector */}
            <div className="relative" ref={locationRef}>
              <button
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="flex items-center text-xs text-gray-700 hover:text-gray-900 transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="truncate max-w-[150px]">
                  {selectedLocation}
                </span>
                <svg
                  className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                    isLocationOpen ? "transform rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Location Dropdown */}
              <div
                className={`absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-xl py-1 transition-all duration-200 ease-in-out transform origin-top ${
                  isLocationOpen
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                } z-50`}
              >
                {locations.map((location) => (
                  <button
                    key={location.name}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => {
                      setSelectedLocation(location.name);
                      setIsLocationOpen(false);
                    }}
                  >
                    <div className="font-medium">{location.name}</div>
                    <div className="text-xs text-gray-500">
                      {location.address}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Language Selector */}
          <div className="relative ml-6" ref={languageRef}>
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="flex items-center space-x-1 text-gray-700 hover:text-gray-900"
            >
              <span className="text-xl">
                {languages.find((lang) => lang.code === language)?.flag}
              </span>
            </button>

            {/* Language Dropdown */}
            <div
              className={`absolute top-full right-0 mt-1 w-32 bg-white rounded-lg shadow-xl py-1 transition-all duration-200 ease-in-out transform origin-top ${
                isLanguageOpen
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              } z-50`}
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsLanguageOpen(false);
                  }}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Høyre side - Login og Cart */}
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className={`p-2 transition-colors duration-200 rounded-full relative group ${
                isLoggedIn
                  ? "text-green-600 hover:text-green-700 hover:bg-green-50"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              }`}
              aria-label={
                isLoggedIn ? t("header.myProfile") : t("header.login")
              }
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              {isLoggedIn && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
              )}
              <span className="absolute left-1/2 -translate-x-1/2 -bottom-8 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {isLoggedIn ? t("header.myProfile") : t("header.login")}
              </span>
            </Link>
            <Link
              href="/cart"
              className="p-2 text-gray-700 hover:text-gray-900 transition-colors duration-200 rounded-full hover:bg-gray-100 relative group"
              aria-label={t("header.cart")}
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                0
              </span>
              <span className="absolute left-1/2 -translate-x-1/2 -bottom-8 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {t("header.cart")}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
