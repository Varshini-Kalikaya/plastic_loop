import React from 'react';
import { Link } from 'react-router-dom';

/**
 * PlasticLoop Brand Logo Component
 * Concept: "Circular Loop + Leaf" — A continuous circular recycling loop
 * that organically blooms into a sustainability leaf mark.
 *
 * Variants:
 * - 'full': Symbol + 'PlasticLoop' wordmark + 'Circular Economy' subtitle
 * - 'compact': Symbol + 'PlasticLoop' wordmark (single line)
 * - 'icon': Symbol mark only
 * - 'wordmark': Text only
 *
 * Color themes:
 * - 'default' (light backgrounds): #1b4332 / #2d6a4f / #14231b
 * - 'inverted' (dark backgrounds like login hero): #ffffff / #a3d2af
 */
export const LogoMark = ({ size = 36, className = '', inverted = false }) => {
  const primaryColor = inverted ? '#a3d2af' : '#1b4332';
  const accentColor = inverted ? '#ffffff' : '#2d6a4f';
  const leafColor = inverted ? '#74c69d' : '#40916c';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform group-hover:scale-105 ${className}`}
      aria-label="PlasticLoop Logo Mark"
    >
      {/* Background soft pill/circle for container contrast if needed */}
      <rect
        x="2"
        y="2"
        width="40"
        height="40"
        rx="12"
        fill={inverted ? 'rgba(255, 255, 255, 0.12)' : '#e8f0ea'}
        stroke={inverted ? 'rgba(255, 255, 255, 0.2)' : '#d2e2d5'}
        strokeWidth="1.2"
      />

      {/* 
        The PlasticLoop Mark:
        Two continuous ribbons forming a circular recycling loop that culminates in a flourishing leaf apex.
      */}
      {/* Loop Arc 1: Left & Top circular motion arrow/ribbon */}
      <path
        d="M13 24C12.4 18 16.5 12.5 22.5 12C26.5 11.6 30 13.5 32 16.5"
        stroke={primaryColor}
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      {/* Arrowhead / directional flow indicator on upper ribbon */}
      <path
        d="M30 12L33 16.5L28.5 18"
        stroke={primaryColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Loop Arc 2: Right & Bottom returning ribbon blossoming into an organic leaf */}
      <path
        d="M31 20C31.6 26 27.5 31.5 21.5 32C17.5 32.4 14 30.5 12 27.5"
        stroke={accentColor}
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      {/* Reverse directional flow arrowhead */}
      <path
        d="M14 32L11 27.5L15.5 26"
        stroke={accentColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Centerpiece: Symmetrical Floating Eco Leaf with Vein */}
      <path
        d="M22 17C26 19 27 24 23 27C19 25 18 20 22 17Z"
        fill={leafColor}
        opacity={inverted ? '0.95' : '0.9'}
      />
      {/* Inner Leaf Vein Line */}
      <path
        d="M20.5 25C22 23 23.5 21 24.5 18.5"
        stroke={inverted ? '#1b4332' : '#ffffff'}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
};

const Logo = ({
  variant = 'full',
  size = 'md',
  inverted = false,
  to = '/',
  showSubtitle = true,
  className = '',
}) => {
  // Dimensions scale
  const sizeMap = {
    xs: { mark: 26, text: 'text-base', sub: 'text-[8px]' },
    sm: { mark: 32, text: 'text-lg', sub: 'text-[9px]' },
    md: { mark: 38, text: 'text-xl', sub: 'text-[9px]' },
    lg: { mark: 46, text: 'text-2xl', sub: 'text-[10px]' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {variant !== 'wordmark' && (
        <LogoMark size={currentSize.mark} inverted={inverted} />
      )}

      {variant !== 'icon' && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-black tracking-tight ${currentSize.text} ${
              inverted ? 'text-white' : 'text-[#14231b]'
            }`}
          >
            Plastic
            <span className={inverted ? 'text-[#a3d2af]' : 'text-[#2d6a4f]'}>
              Loop
            </span>
          </span>

          {variant === 'full' && showSubtitle && (
            <span
              className={`uppercase font-bold tracking-widest ${currentSize.sub} mt-0.5 ${
                inverted ? 'text-[#a3d2af]/90' : 'text-[#5c6e62]'
              }`}
            >
              Circular Economy
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b4332] rounded-xl">
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
