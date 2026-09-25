import React from 'react';

/**
 * DashboardBackgroundAnimation
 * 
 * Concept: "Circular Eco Flow"
 * Extremely subtle, organic circular paths and gentle particles moving slowly
 * behind the dashboard content to evoke recycling, circularity, and sustainability.
 * 
 * - Opacity: 5% - 10% (ultra-subtle, non-intrusive)
 * - Motion: 14s - 24s smooth organic cycles
 * - Performance: 100% lightweight pure CSS + SVG transforms (zero JS loop)
 * - Accessibility: Automatically disabled when prefers-reduced-motion is active
 * - Pointer events: Completely non-blocking (pointer-events: none)
 */
const DashboardBackgroundAnimation = () => {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
      aria-hidden="true"
    >
      <style>{`
        @keyframes ecoRotateSlow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes ecoRotateReverse {
          0% {
            transform: rotate(360deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }

        @keyframes ecoFloatGentle1 {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          50% {
            transform: translate(12px, -18px) scale(1.04);
          }
        }

        @keyframes ecoFloatGentle2 {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          50% {
            transform: translate(-14px, 16px) scale(0.96);
          }
        }

        @keyframes ecoPulseSoft {
          0%, 100% {
            opacity: 0.05;
          }
          50% {
            opacity: 0.10;
          }
        }

        .eco-orbit-clockwise {
          animation: ecoRotateSlow 24s linear infinite;
          transform-origin: center;
        }

        .eco-orbit-counter {
          animation: ecoRotateReverse 32s linear infinite;
          transform-origin: center;
        }

        .eco-float-1 {
          animation: ecoFloatGentle1 16s ease-in-out infinite;
        }

        .eco-float-2 {
          animation: ecoFloatGentle2 18s ease-in-out infinite;
        }

        .eco-pulse {
          animation: ecoPulseSoft 10s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .eco-orbit-clockwise,
          .eco-orbit-counter,
          .eco-float-1,
          .eco-float-2,
          .eco-pulse {
            animation: none !important;
          }
        }
      `}</style>

      {/* 1. TOP-RIGHT: Circular Eco Loop Orbital (Edge Placement) */}
      <div className="absolute -top-16 -right-16 sm:-top-10 sm:-right-10 w-80 sm:w-96 h-80 sm:h-96 opacity-60 sm:opacity-80">
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full eco-orbit-clockwise"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Faint Outer Circular Guide Path */}
          <circle
            cx="200"
            cy="200"
            r="160"
            stroke="#2d6a4f"
            strokeWidth="1.2"
            strokeDasharray="8 14"
            opacity="0.08"
          />

          {/* Flow Arc with Directional Hint */}
          <path
            d="M200 40 A160 160 0 0 1 360 200"
            stroke="#1b4332"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.09"
          />
          {/* Subtle directional flow marker */}
          <circle cx="360" cy="200" r="3.5" fill="#40916c" opacity="0.12" />

          {/* Inner Counter-Loop Arc */}
          <circle
            cx="200"
            cy="200"
            r="115"
            stroke="#8fa895"
            strokeWidth="1"
            strokeDasharray="4 10"
            opacity="0.07"
            className="eco-orbit-counter"
          />

          {/* Minimalist Floating Leaf Emblem on Orbit */}
          <path
            d="M200 36 C206 32 214 36 212 44 C204 46 200 40 200 36Z"
            fill="#2d6a4f"
            opacity="0.10"
          />
        </svg>
      </div>

      {/* 2. BOTTOM-LEFT: Circular Lifecycle Flow & Stream Path */}
      <div className="absolute -bottom-24 -left-20 sm:-bottom-16 sm:-left-12 w-88 sm:w-104 h-88 sm:h-104 opacity-50 sm:opacity-75">
        <svg
          viewBox="0 0 440 440"
          className="w-full h-full eco-orbit-counter"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sweeping Circular Lifecycle Ring */}
          <circle
            cx="220"
            cy="220"
            r="175"
            stroke="#1b4332"
            strokeWidth="1.4"
            strokeDasharray="12 18"
            opacity="0.07"
          />

          {/* Segment Arc: Recovery to Transformation */}
          <path
            d="M220 395 A175 175 0 0 1 45 220"
            stroke="#2d6a4f"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.08"
          />

          {/* Lifecycle Node Points */}
          <circle cx="45" cy="220" r="4" fill="#1b4332" opacity="0.11" />
          <circle cx="220" cy="395" r="3" fill="#52b788" opacity="0.09" />

          {/* Soft Concentric Radial Accent */}
          <circle
            cx="220"
            cy="220"
            r="120"
            stroke="#8fa895"
            strokeWidth="0.8"
            opacity="0.05"
          />
        </svg>
      </div>

      {/* 3. PERIPHERAL FLOATING PARTICLES (Desktop & Tablet only to maximize mobile performance) */}
      <div className="hidden sm:block absolute inset-0">
        {/* Floating Spore 1 (Mid-Left edge) */}
        <div className="absolute top-1/3 left-6 sm:left-12 eco-float-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3.5" fill="#2d6a4f" opacity="0.08" />
            <circle cx="12" cy="12" r="7" stroke="#8fa895" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.06" />
          </svg>
        </div>

        {/* Floating Spore 2 (Mid-Right edge) */}
        <div className="absolute top-1/2 right-8 sm:right-16 eco-float-2">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            {/* Tiny botanical leaf silhouette */}
            <path
              d="M16 8C20 11 21 16 17 21C13 19 12 14 16 8Z"
              fill="#1b4332"
              opacity="0.07"
            />
          </svg>
        </div>

        {/* Floating Spore 3 (Top-Center margin) */}
        <div className="absolute top-10 left-1/3 eco-float-2 opacity-70">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="2.5" fill="#52b788" opacity="0.09" />
          </svg>
        </div>

        {/* Floating Spore 4 (Bottom-Right margin) */}
        <div className="absolute bottom-28 right-1/4 eco-float-1 opacity-60">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="2" fill="#2d6a4f" opacity="0.08" />
            <circle cx="10" cy="10" r="5" stroke="#2d6a4f" strokeWidth="0.6" opacity="0.05" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default DashboardBackgroundAnimation;
