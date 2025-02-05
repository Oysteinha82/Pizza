"use client";

import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import { useEffect, useState } from "react";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TechStackItem {
  name: string;
  icon: React.ReactNode;
}

type MotionDivProps = HTMLMotionProps<"div"> & {
  onClick?: () => void;
  className?: string;
};

type MotionSpanProps = HTMLMotionProps<"span"> & {
  className?: string;
};

const container = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const techStack = [
  {
    name: "HTML",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6">
        <path
          fill="currentColor"
          d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"
        />
      </svg>
    ),
  },
  {
    name: "Tailwind CSS",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6">
        <path
          fill="currentColor"
          d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"
        />
      </svg>
    ),
  },
  {
    name: "Next.js",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6">
        <path
          fill="currentColor"
          d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z"
        />
      </svg>
    ),
  },
  {
    name: "Swiper",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6">
        <circle cx="12" cy="12" r="11" fill="#0080FF" />
        <text
          x="12"
          y="14"
          fill="white"
          fontSize="12"
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          S
        </text>
      </svg>
    ),
  },
  {
    name: "React",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6">
        <path
          fill="currentColor"
          d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.035 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.635-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z"
        />
      </svg>
    ),
  },
  {
    name: "JavaScript",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6">
        <rect width="24" height="24" fill="#F7DF1E" />
        <text
          x="12"
          y="16"
          fill="#000000"
          fontSize="12"
          fontWeight="bold"
          fontFamily="system-ui, -apple-system, sans-serif"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          JS
        </text>
      </svg>
    ),
  },
  {
    name: "TypeScript",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6">
        <path
          fill="currentColor"
          d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"
        />
      </svg>
    ),
  },
  {
    name: "Framer Motion",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6">
        <rect width="24" height="24" fill="url(#framerGradient)" />
        <text
          x="12"
          y="14"
          fill="#111827"
          fontSize="17"
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          M
        </text>
        <defs>
          <linearGradient
            id="framerGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#FF1B88" />
            <stop offset="100%" stopColor="#9C1CFF" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
];

const featureIcons = {
  responsive: (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
    </svg>
  ),
  cart: (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  ),
  profile: (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
  language: (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
      />
    </svg>
  ),
};

const VISIBLE_TECHNOLOGIES = 3;

const ANIMATION_DURATION = 20; // sekunder for en full rotasjon

const styles = `
@keyframes slideLeft {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}

.tech-scroll {
  animation: slideLeft 15s linear infinite;
  display: flex;
  gap: 4rem;
  padding: 0 2rem;
}

.tech-scroll > div {
  flex: 0 0 auto;
}

@keyframes countdown {
  from {
    stroke-dashoffset: 0;
  }
  to {
    stroke-dashoffset: 157;
  }
}

.countdown-ring {
  transform-origin: center;
  transform: rotate(-90deg);
}
`;

const TechStackCarousel = () => {
  const duplicatedTechStack = [...techStack, ...techStack].map(
    (tech, index) => ({
      ...tech,
      uniqueId: `${tech.name}-${index}`,
    })
  );

  return (
    <div className="relative h-24 bg-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden">
      <style>{styles}</style>
      <div className="absolute inset-0 flex items-center">
        <div className="tech-scroll">
          {duplicatedTechStack.map((tech) => (
            <div
              key={tech.uniqueId}
              className="flex flex-col items-center gap-2 w-24"
            >
              <div
                className={`w-12 h-12 rounded-lg bg-gray-900/40
                           flex items-center justify-center
                           group hover:bg-gray-800/40 
                           transition-all duration-500
                           border border-gray-700/40
                           hover:scale-110 hover:border-opacity-50`}
              >
                <div
                  className={`${
                    tech.name === "React"
                      ? "text-[#61DAFB]"
                      : tech.name === "JavaScript"
                      ? "text-[#F7DF1E]"
                      : tech.name === "TypeScript"
                      ? "text-[#3178C6]"
                      : tech.name === "Next.js"
                      ? "text-white"
                      : tech.name === "Tailwind CSS"
                      ? "text-[#38BDF8]"
                      : tech.name === "Framer Motion"
                      ? "text-[#BB47FF]"
                      : tech.name === "HTML"
                      ? "text-[#E34F26]"
                      : tech.name === "Swiper"
                      ? "text-[#6332F6]"
                      : "text-gray-100"
                  } transform transition-transform duration-300 group-hover:scale-110`}
                >
                  {tech.icon}
                </div>
              </div>
              <span className="text-gray-100 font-medium text-xs text-center">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MotionDiv = motion.div as React.FC<MotionDivProps>;

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const [timeLeft, setTimeLeft] = useState(120);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeLeft(120);
      setMounted(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, onClose]);

  const handleAnimationComplete = () => {
    if (!isOpen) {
      setMounted(false);
    }
  };

  if (!mounted) return null;

  return (
    <AnimatePresence mode="wait" onExitComplete={() => setMounted(false)}>
      {isOpen && (
        <>
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <MotionDiv
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onAnimationComplete={handleAnimationComplete}
              className="bg-gray-900 rounded-2xl w-full max-w-[600px] max-h-[90vh] shadow-2xl border border-gray-800 flex flex-col"
            >
              <div className="flex-1 overflow-y-auto overflow-x-hidden">
                <div className="p-6 space-y-6">
                  <div className="flex justify-between items-start">
                    <MotionDiv
                      key="welcome-header"
                      variants={item}
                      className="text-center space-y-3 flex-1"
                    >
                      <h1 className="text-4xl sm:text-5xl font-bold text-white">
                        Welcome
                      </h1>
                    </MotionDiv>
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14">
                      <svg
                        className="w-12 h-12 sm:w-14 sm:h-14 -rotate-90"
                        viewBox="0 0 56 56"
                      >
                        <circle
                          className="text-gray-700/20"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="none"
                          r="25"
                          cx="28"
                          cy="28"
                        />
                        <circle
                          className="countdown-ring"
                          style={{
                            animation: `countdown ${120}s linear forwards`,
                            stroke: "url(#gradient)",
                            strokeDasharray: "157",
                            strokeDashoffset: "0",
                          }}
                          strokeWidth="3"
                          strokeLinecap="round"
                          fill="none"
                          r="25"
                          cx="28"
                          cy="28"
                        />
                        <defs>
                          <linearGradient
                            id="gradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                          >
                            <stop offset="0%" stopColor="#4B5563" />
                            <stop offset="100%" stopColor="#374151" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-gray-300 font-mono text-sm sm:text-base font-medium">
                          {timeLeft}
                        </div>
                      </div>
                    </div>
                  </div>

                  <MotionDiv key="info-notice" variants={item}>
                    <div className="relative bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-blue-400/10 border border-emerald-500/20 rounded-lg p-3 backdrop-blur-sm overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 group-hover:translate-x-full duration-1000 transition-transform ease-in-out" />
                      <div className="flex items-start gap-2.5">
                        <div className="bg-emerald-500/10 rounded-lg p-2 backdrop-blur-sm border border-emerald-500/20">
                          <svg
                            className="w-5 h-5 text-emerald-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div className="space-y-1 flex-1">
                          <h4 className="text-blue-300 font-medium text-sm">
                            Important Notice
                          </h4>
                          <p className="text-blue-300/90 text-xs leading-relaxed">
                            This is a demonstration website. All products,
                            prices, and features are for demonstration purposes
                            only. No actual orders will be processed, and no
                            data will be stored.
                          </p>
                        </div>
                      </div>
                    </div>
                  </MotionDiv>

                  <MotionDiv
                    key="features-container"
                    variants={container}
                    initial="hidden"
                    animate="show"
                  >
                    <MotionDiv
                      key="features-header"
                      variants={item}
                      className="mt-6"
                    >
                      <div className="flex items-center gap-2 mb-2 sm:mb-3">
                        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-1 sm:p-1.5 rounded-lg border border-blue-500/20 backdrop-blur-sm">
                          <svg
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                              strokeWidth={1.5}
                            />
                          </svg>
                        </div>
                        <h3 className="text-white font-medium text-sm sm:text-base">
                          Key Features
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                        {[
                          {
                            icon: featureIcons.responsive,
                            title: "Responsive Design",
                            desc: "Adaptive layout",
                            color: "gray",
                            bg: "bg-gradient-to-br from-gray-500/5 to-gray-400/10",
                            border: "border-gray-500/20",
                            iconBg:
                              "bg-gradient-to-br from-gray-500/10 to-gray-400/20",
                            hover:
                              "hover:border-gray-400/40 hover:shadow-[0_0_20px_rgba(75,85,99,0.3)] hover:from-gray-500/10 hover:to-gray-400/20",
                          },
                          {
                            icon: featureIcons.cart,
                            title: "Shopping Cart",
                            desc: "Real-time updates",
                            color: "gray",
                            bg: "bg-gradient-to-br from-gray-500/5 to-gray-400/10",
                            border: "border-gray-500/20",
                            iconBg:
                              "bg-gradient-to-br from-gray-500/10 to-gray-400/20",
                            hover:
                              "hover:border-gray-400/40 hover:shadow-[0_0_20px_rgba(75,85,99,0.3)] hover:from-gray-500/10 hover:to-gray-400/20",
                          },
                          {
                            icon: featureIcons.profile,
                            title: "User Profiles",
                            desc: "Account management",
                            color: "gray",
                            bg: "bg-gradient-to-br from-gray-500/5 to-gray-400/10",
                            border: "border-gray-500/20",
                            iconBg:
                              "bg-gradient-to-br from-gray-500/10 to-gray-400/20",
                            hover:
                              "hover:border-gray-400/40 hover:shadow-[0_0_20px_rgba(75,85,99,0.3)] hover:from-gray-500/10 hover:to-gray-400/20",
                          },
                          {
                            icon: featureIcons.language,
                            title: "Multi-language",
                            desc: "NO/EN support",
                            color: "gray",
                            bg: "bg-gradient-to-br from-gray-500/5 to-gray-400/10",
                            border: "border-gray-500/20",
                            iconBg:
                              "bg-gradient-to-br from-gray-500/10 to-gray-400/20",
                            hover:
                              "hover:border-gray-400/40 hover:shadow-[0_0_20px_rgba(75,85,99,0.3)] hover:from-gray-500/10 hover:to-gray-400/20",
                          },
                        ].map((feature, index) => (
                          <MotionDiv
                            key={`feature-${index}`}
                            variants={item}
                            className={`group relative p-2 sm:p-3 rounded-lg ${feature.bg}
                                     border ${feature.border} backdrop-blur-sm
                                     transition-all duration-300
                                     hover:scale-[1.02] hover:-translate-y-0.5
                                     shadow-lg shadow-black/5
                                     ${feature.hover}`}
                          >
                            <div
                              className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg ${feature.iconBg}
                                         border ${feature.border} backdrop-blur-sm
                                         flex items-center justify-center mb-2
                                         group-hover:scale-110 group-hover:rotate-3
                                         transition-all duration-300
                                         shadow-lg shadow-black/5`}
                            >
                              <div
                                className={`${
                                  feature.color === "blue"
                                    ? "text-blue-400"
                                    : feature.color === "violet"
                                    ? "text-violet-400"
                                    : feature.color === "sky"
                                    ? "text-sky-400"
                                    : "text-indigo-400"
                                } transition-transform duration-300 group-hover:scale-110`}
                              >
                                {feature.icon}
                              </div>
                            </div>
                            <h4 className="text-white/90 font-medium text-xs sm:text-sm mb-0.5 group-hover:text-white transition-colors duration-300">
                              {feature.title}
                            </h4>
                            <p className="text-gray-400/90 text-[10px] sm:text-xs group-hover:text-gray-300 transition-colors duration-300">
                              {feature.desc}
                            </p>
                          </MotionDiv>
                        ))}
                      </div>
                    </MotionDiv>

                    <MotionDiv
                      key="tech-stack"
                      variants={item}
                      className="mt-8"
                    >
                      <TechStackCarousel />
                    </MotionDiv>
                  </MotionDiv>
                </div>
              </div>

              <div className="p-4 border-t border-gray-800 bg-gray-900/80 backdrop-blur-sm">
                <MotionDiv key="close-button" variants={item} className="mt-6">
                  <button
                    onClick={onClose}
                    className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white px-4 py-3 rounded-xl 
                             hover:from-gray-600 hover:to-gray-700 
                             transition-all duration-300 
                             flex items-center justify-center gap-2 text-sm font-medium group
                             border border-gray-700/50 hover:border-gray-500
                             shadow-[0_0_15px_rgba(0,0,0,0.2)] 
                             hover:shadow-[0_0_25px_rgba(75,85,99,0.4)]
                             relative overflow-hidden
                             before:absolute before:inset-0 
                             before:bg-gradient-to-r before:from-gray-500/0 before:via-gray-500/10 before:to-gray-500/0
                             before:translate-x-[-100%] hover:before:translate-x-[100%]
                             before:transition-transform before:duration-700
                             before:ease-out"
                  >
                    <span>Start Exploring</span>
                    <svg
                      className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1"
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
                </MotionDiv>
              </div>
            </MotionDiv>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
