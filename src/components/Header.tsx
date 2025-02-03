"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import Image from "next/image";
import LoginModal from "./modals/LoginModal";
import RegisterModal from "./modals/RegisterModal";
import { motion as m, AnimatePresence, HTMLMotionProps } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

// Legg til type-definisjoner øverst i filen, rett etter imports
type MotionDivProps = HTMLMotionProps<"div">;
type MotionButtonProps = HTMLMotionProps<"button">;
type MotionSpanProps = HTMLMotionProps<"span">;

interface HeaderProps {
  onLoginClick: () => void;
  onCartClick: () => void;
}

const menuItems = [
  { href: "#promotion", emoji: "🔥", label: "header.menuItems.promotion.name" },
  { href: "#pizza", emoji: "🍕", label: "header.menuItems.pizza.name" },
  { href: "#pasta", emoji: "🍝", label: "header.menuItems.pasta.name" },
  { href: "#salad", emoji: "🥗", label: "header.menuItems.salad.name" },
  { href: "#dessert", emoji: "🍰", label: "header.menuItems.dessert.name" },
  { href: "#drinks", emoji: "🥤", label: "header.menuItems.drinks.name" },
  { href: "#dips", emoji: "🥣", label: "header.menuItems.dips.name" },
];

// Erstatt motion.div, motion.button, og motion.span med de nye typene
const MotionDiv = m.div as any;
const MotionButton = m.button as any;
const MotionSpan = m.span as any;

const motion = {
  div: m.div as any,
  button: m.button as any,
  span: m.span as any,
  svg: m.svg as any,
};

export default function Header({ onLoginClick, onCartClick }: HeaderProps) {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation(language);
  const { isAuthenticated, user, logout } = useAuth();
  const { items } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(
    "New York - Manhattan"
  );
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
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
    }

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

  const currentLocation =
    locations.find((loc) => loc.name === selectedLocation) || locations[0];

  const languages = [
    {
      code: "en" as const,
      flag: "🇺🇸",
      translationKey: "header.languages.english",
    },
    {
      code: "no" as const,
      flag: "🇳🇴",
      translationKey: "header.languages.norwegian",
    },
  ];

  const handleLoginClick = () => {
    onLoginClick();
  };

  const handleCartClick = () => {
    onCartClick();
  };

  const handleMenuItemClick = async (sectionId: string) => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);

    // For promotion, scroll alltid til toppen
    if (sectionId === "promotion") {
      if (pathname !== "/") {
        await router.push("/");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // For andre seksjoner, fortsett som før
    if (pathname !== "/") {
      await router.push(`/#${sectionId}`);
      // Vent litt for å la siden laste før vi scroller
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          // Sjekk om vi er på mobil (samme breakpoint som i Tailwind md:)
          const isMobile = window.innerWidth < 768;
          if (isMobile) {
            // På mobil: Scroll med offset for header og mobilmeny
            const headerOffset = 565; // Større offset for mobil for å ta hensyn til menyen
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition =
              elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          } else {
            // På desktop: Bruk scrollIntoView med smooth scrolling
            element.scrollIntoView({ behavior: "smooth" });
          }
        }
      }, 100);
    } else {
      // Hvis vi er på hovedsiden
      const element = document.getElementById(sectionId);
      if (element) {
        // Sjekk om vi er på mobil (samme breakpoint som i Tailwind md:)
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
          // På mobil: Scroll med offset for header og mobilmeny
          const headerOffset = 565; // Større offset for mobil for å ta hensyn til menyen
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        } else {
          // På desktop: Bruk scrollIntoView med smooth scrolling
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  return (
    <header className="sticky top-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - vises alltid */}
          <motion.div whileHover={{ scale: 1.02 }}>
            <Link
              href="/"
              className="flex items-center h-full"
              onClick={() => {
                setIsMenuOpen(false);
                setIsDropdownOpen(false);
                setIsLocationOpen(false);
                setIsLanguageOpen(false);
              }}
            >
              <Image
                src="/pizzalogo.png"
                alt="Pizza Express Logo"
                width={150}
                height={48}
                className="h-[70px] w-auto object-contain opacity-95 hover:opacity-80 transition-opacity"
                priority
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="relative" ref={dropdownRef}>
              {/* Desktop Menu Button */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center text-gray-700 hover:text-red-600 transition-colors group"
              >
                <span className="font-medium">{t("header.menu")}</span>
                <motion.svg
                  className="ml-1 w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </motion.svg>
              </button>

              {/* Desktop Dropdown Menu */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    style={{ background: "rgba(255, 255, 255, 0.98)" }}
                    className="absolute left-0 mt-2 w-56 rounded-xl shadow-xl py-2 border border-gray-100/50 backdrop-blur-sm overflow-hidden"
                  >
                    {menuItems.map((item, index) => (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: index * 0.03,
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                        }}
                        className="relative"
                      >
                        <motion.button
                          onClick={() =>
                            handleMenuItemClick(item.href.split("#")[1])
                          }
                          className="flex items-center w-full px-4 py-2.5 text-sm group relative"
                          whileHover={{ x: 1 }}
                          initial={false}
                          transition={{ duration: 0.1 }}
                        >
                          <div className="absolute inset-0 bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-100" />
                          <motion.span
                            className="relative flex items-center justify-center w-8 h-8 mr-3 rounded-lg bg-gradient-to-br from-red-50 to-orange-50 shadow-sm transition-all duration-100 border border-red-100/30"
                            whileHover={{ scale: 1.05 }}
                          >
                            <span className="text-xl relative z-10">
                              {item.emoji}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-t from-red-100/20 to-transparent opacity-60 rounded-lg" />
                          </motion.span>
                          <span className="font-medium relative text-gray-700 group-hover:text-red-600 transition-colors duration-100">
                            {t(item.label)}
                          </span>
                        </motion.button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Location & Contact */}
            <div className="flex items-center space-x-8">
              <div className="flex flex-col items-end">
                <div className="flex items-center text-gray-700">
                  <span className="w-4 h-4 mr-1 text-red-500">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </span>
                  <span className="text-sm font-medium">
                    {currentLocation.phone}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {t(`header.openHours.${currentLocation.key || "oslo"}`)}
                </div>
              </div>

              {/* Location Selector */}
              <div className="relative" ref={locationRef}>
                <button
                  onClick={() => setIsLocationOpen(!isLocationOpen)}
                  className="flex items-center text-gray-700 hover:text-red-600 transition-colors group"
                >
                  <span className="w-5 h-5 mr-2 text-red-500">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </span>
                  <span className="font-medium">{currentLocation.name}</span>
                  <motion.svg
                    className="ml-1 w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    animate={{ rotate: isLocationOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
                </button>

                <AnimatePresence>
                  {isLocationOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      style={{ background: "rgba(255, 255, 255, 0.98)" }}
                      className="absolute left-0 mt-2 w-56 rounded-xl shadow-xl py-2 border border-gray-100/50 backdrop-blur-sm overflow-hidden"
                    >
                      {locations.map((location, index) => (
                        <motion.div
                          key={location.key}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: index * 0.03,
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                          }}
                          className="relative"
                        >
                          <motion.button
                            onClick={() => {
                              setSelectedLocation(location.name);
                              setIsLocationOpen(false);
                            }}
                            className="flex items-center w-full px-4 py-2.5 text-sm group relative"
                            whileHover={{ x: 1 }}
                            initial={false}
                            transition={{ duration: 0.1 }}
                          >
                            <div className="absolute inset-0 bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-100" />
                            <motion.span
                              className="relative flex items-center justify-center w-6 h-6 mr-3 rounded-lg bg-gradient-to-br from-red-50 to-orange-50 shadow-sm transition-all duration-100 border border-red-100/30"
                              whileHover={{ scale: 1.05 }}
                            >
                              <span className="text-base relative z-10">
                                📍
                              </span>
                              <div className="absolute inset-0 bg-gradient-to-t from-red-100/20 to-transparent opacity-60 rounded-lg" />
                            </motion.span>
                            <span className="font-medium relative text-gray-700 group-hover:text-red-600 transition-colors duration-100">
                              {location.name}
                            </span>
                          </motion.button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </nav>

          {/* Right Side - Always visible */}
          <div className="flex items-center space-x-4">
            {/* Language Selector - Always visible */}
            <div className="relative" ref={languageRef}>
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center text-gray-700 hover:text-red-600 transition-colors group"
              >
                <span className="text-xl">
                  {languages.find((lang) => lang.code === language)?.flag}
                </span>
                <motion.svg
                  className="ml-1 w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  animate={{ rotate: isLanguageOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </motion.svg>
              </button>

              <AnimatePresence>
                {isLanguageOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    style={{ background: "rgba(255, 255, 255, 0.98)" }}
                    className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl py-2 border border-gray-100/50 backdrop-blur-sm overflow-hidden"
                  >
                    {languages.map((language, index) => (
                      <motion.div
                        key={language.code}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: index * 0.03,
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                        }}
                        className="relative"
                      >
                        <motion.button
                          onClick={() => {
                            setLanguage(language.code);
                            setIsLanguageOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-2.5 text-sm group relative"
                          whileHover={{ x: 1 }}
                          initial={false}
                          transition={{ duration: 0.1 }}
                        >
                          <div className="absolute inset-0 bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-100" />
                          <motion.span
                            className="relative flex items-center justify-center w-8 h-8 mr-3 rounded-lg bg-gradient-to-br from-red-50 to-orange-50 shadow-sm transition-all duration-100 border border-red-100/30"
                            whileHover={{ scale: 1.05 }}
                          >
                            <span className="text-xl relative z-10">
                              {language.flag}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-t from-red-100/20 to-transparent opacity-60 rounded-lg" />
                          </motion.span>
                          <span className="font-medium relative text-gray-700 group-hover:text-red-600 transition-colors duration-100">
                            {t(language.translationKey)}
                          </span>
                        </motion.button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth - Always visible */}
            {!isAuthenticated ? (
              <button
                onClick={handleLoginClick}
                className="text-gray-700 hover:text-red-600 transition-colors flex items-center gap-2"
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
                <span className="hidden md:block">{t("header.login")}</span>
              </button>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors group"
                >
                  <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-medium group-hover:bg-green-700 transition-colors">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </div>
                  <motion.svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
                </button>
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      style={{ background: "rgba(255, 255, 255, 0.98)" }}
                      className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl py-2 border border-gray-100/50 backdrop-blur-sm overflow-hidden"
                    >
                      <Link href="/profile" passHref>
                        <motion.button
                          className="flex items-center w-full px-4 py-2.5 text-sm group relative"
                          onClick={() => setIsUserMenuOpen(false)}
                          whileHover={{ x: 1 }}
                          initial={false}
                          transition={{ duration: 0.1 }}
                        >
                          <div className="absolute inset-0 bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-100" />
                          <motion.div
                            className="relative flex items-center justify-center w-8 h-8 mr-3 rounded-lg bg-gradient-to-br from-red-50 to-orange-50 shadow-sm transition-all duration-200 border border-red-100/30 group-hover:from-red-100 group-hover:to-orange-100 group-hover:shadow-md"
                            whileHover={{ scale: 1.05 }}
                          >
                            <svg
                              className="w-4 h-4 text-red-600"
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
                          </motion.div>
                          <span className="relative font-medium text-gray-700 group-hover:text-red-600 transition-colors duration-100">
                            {t("header.profile")}
                          </span>
                        </motion.button>
                      </Link>
                      <Link href="/profile/orders" passHref>
                        <motion.button
                          className="flex items-center w-full px-4 py-2.5 text-sm group relative"
                          onClick={() => setIsUserMenuOpen(false)}
                          whileHover={{ x: 1 }}
                          initial={false}
                          transition={{ duration: 0.1 }}
                        >
                          <div className="absolute inset-0 bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-100" />
                          <motion.div
                            className="relative flex items-center justify-center w-8 h-8 mr-3 rounded-lg bg-gradient-to-br from-red-50 to-orange-50 shadow-sm transition-all duration-200 border border-red-100/30 group-hover:from-red-100 group-hover:to-orange-100 group-hover:shadow-md"
                            whileHover={{ scale: 1.05 }}
                          >
                            <svg
                              className="w-4 h-4 text-red-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              />
                            </svg>
                          </motion.div>
                          <span className="relative font-medium text-gray-700 group-hover:text-red-600 transition-colors duration-100">
                            {t("header.orders")}
                          </span>
                        </motion.button>
                      </Link>
                      <motion.button
                        className="flex items-center w-full px-4 py-2.5 text-sm group relative"
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        whileHover={{ x: 1 }}
                        initial={false}
                        transition={{ duration: 0.1 }}
                      >
                        <div className="absolute inset-0 bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-100" />
                        <motion.div
                          className="relative flex items-center justify-center w-8 h-8 mr-3 rounded-lg bg-gradient-to-br from-red-50 to-orange-50 shadow-sm transition-all duration-200 border border-red-100/30 group-hover:from-red-100 group-hover:to-orange-100 group-hover:shadow-md"
                          whileHover={{ scale: 1.05 }}
                        >
                          <svg
                            className="w-4 h-4 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                        </motion.div>
                        <span className="relative font-medium text-gray-700 group-hover:text-red-600 transition-colors duration-100">
                          {t("header.logout")}
                        </span>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Cart - Always visible */}
            <motion.button
              onClick={handleCartClick}
              className="p-2 text-gray-700 hover:text-red-600 transition-colors duration-200 rounded-full hover:bg-red-50 relative"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
                {items.length}
              </span>
            </motion.button>

            {/* Mobile Menu Button - Always visible on mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-red-600 transition-colors md:hidden"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white border-t border-gray-100 max-h-[calc(100vh-64px)] overflow-y-auto"
          >
            {/* Contact Info */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center text-gray-700 mb-1">
                <span className="w-4 h-4 mr-2 text-red-500">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <span className="text-sm font-medium">
                  {currentLocation.phone}
                </span>
              </div>
              <div className="text-xs text-gray-500 ml-6">
                {t(`header.openHours.${currentLocation.key || "oslo"}`)}
              </div>
            </div>

            {/* Location */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center justify-between text-gray-700">
                <div className="flex items-center">
                  <span className="w-5 h-5 mr-2 text-red-500">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </span>
                  <button
                    onClick={() => setIsLocationOpen(!isLocationOpen)}
                    className="flex items-center"
                  >
                    <span className="font-medium">{currentLocation.name}</span>
                    <motion.svg
                      className="ml-1 w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      animate={{ rotate: isLocationOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </motion.svg>
                  </button>
                </div>
              </div>
              <AnimatePresence>
                {isLocationOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 overflow-hidden"
                  >
                    {locations.map((location) => (
                      <button
                        key={location.key}
                        onClick={() => {
                          setSelectedLocation(location.name);
                          setIsLocationOpen(false);
                        }}
                        className="flex items-center w-full px-7 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <span className="text-base mr-2">📍</span>
                        {location.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Menu Items */}
            <div className="px-2 py-3">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <button
                    onClick={() => {
                      handleMenuItemClick(item.href.split("#")[1]);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2.5 text-base text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 group"
                  >
                    <motion.span
                      className="relative flex items-center justify-center w-8 h-8 mr-3 rounded-lg bg-gradient-to-br from-red-50 to-orange-50 shadow-sm transition-all duration-100 border border-red-100/30"
                      whileHover={{ scale: 1.05 }}
                    >
                      <span className="text-xl relative z-10">
                        {item.emoji}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-t from-red-100/20 to-transparent opacity-60 rounded-lg" />
                    </motion.span>
                    <span className="font-medium">{t(item.label)}</span>
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
