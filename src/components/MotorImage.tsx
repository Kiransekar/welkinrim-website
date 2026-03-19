"use client";

import React from "react";

interface MotorImageProps {
  series: "Haemng" | "Maelard";
  className?: string;
}

export function MotorImage({ series, className = "" }: MotorImageProps) {
  if (series === "Haemng") {
    // Haemng series - UAV/eVTOL compact design
    return (
      <svg viewBox="0 0 400 300" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="haemng-body" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2A3B4F" />
            <stop offset="50%" stopColor="#1A2B3F" />
            <stop offset="100%" stopColor="#0A1B2F" />
          </linearGradient>
          <linearGradient id="haemng-coil" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C67622" />
            <stop offset="50%" stopColor="#D68632" />
            <stop offset="100%" stopColor="#C67622" />
          </linearGradient>
          <radialGradient id="haemng-glow">
            <stop offset="0%" stopColor="#3B8FEF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3B8FEF" stopOpacity="0" />
          </radialGradient>
          <filter id="metal-shine">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>
        
        {/* Background glow */}
        <circle cx="200" cy="150" r="120" fill="url(#haemng-glow)" />
        
        {/* Motor body - cylindrical */}
        <ellipse cx="200" cy="120" rx="70" ry="20" fill="#3A4B5F" opacity="0.3" />
        <rect x="130" y="120" width="140" height="100" fill="url(#haemng-body)" />
        <ellipse cx="200" cy="220" rx="70" ry="20" fill="#0A1B2F" />
        
        {/* Ventilation slots */}
        {Array.from({ length: 8 }, (_, i) => (
          <rect
            key={`vent-${i}`}
            x="140"
            y={130 + i * 11}
            width="120"
            height="3"
            fill="#1A3B5F"
            opacity="0.6"
          />
        ))}
        
        {/* Winding coils visible */}
        <ellipse cx="200" cy="140" rx="50" ry="12" fill="url(#haemng-coil)" opacity="0.8" />
        <ellipse cx="200" cy="160" rx="50" ry="12" fill="url(#haemng-coil)" opacity="0.7" />
        <ellipse cx="200" cy="180" rx="50" ry="12" fill="url(#haemng-coil)" opacity="0.8" />
        <ellipse cx="200" cy="200" rx="50" ry="12" fill="url(#haemng-coil)" opacity="0.7" />
        
        {/* Shaft - titanium */}
        <ellipse cx="200" cy="120" rx="15" ry="8" fill="#8A92A0" />
        <rect x="185" y="80" width="30" height="40" fill="#7A8290" />
        <ellipse cx="200" cy="80" rx="15" ry="8" fill="#9AA2B0" />
        
        {/* Mounting holes */}
        {[0, 90, 180, 270].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x = 200 + Math.cos(rad) * 60;
          const y = 170 + Math.sin(rad) * 25;
          return (
            <circle
              key={`mount-${i}`}
              cx={x}
              cy={y}
              r="4"
              fill="#0A0A0F"
              stroke="#3B8FEF"
              strokeWidth="0.5"
            />
          );
        })}
        
        {/* Product label */}
        <rect x="150" y="235" width="100" height="20" fill="#1A2B3F" opacity="0.9" rx="2" />
        <text x="200" y="249" textAnchor="middle" fill="#3B8FEF" fontSize="11" fontFamily="Space Mono" fontWeight="bold">
          HAEMNG
        </text>
        
        {/* Accent line */}
        <line x1="130" y1="170" x2="270" y2="170" stroke="#3B8FEF" strokeWidth="1" opacity="0.4" />
      </svg>
    );
  } else {
    // Maelard series - Heavy-lift industrial design
    return (
      <svg viewBox="0 0 400 300" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="maelard-body" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3A2B4F" />
            <stop offset="50%" stopColor="#2A1B3F" />
            <stop offset="100%" stopColor="#1A0B2F" />
          </linearGradient>
          <linearGradient id="maelard-coil" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B86622" />
            <stop offset="50%" stopColor="#C87632" />
            <stop offset="100%" stopColor="#B86622" />
          </linearGradient>
          <radialGradient id="maelard-glow">
            <stop offset="0%" stopColor="#8866CC" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8866CC" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Background glow */}
        <circle cx="200" cy="150" r="130" fill="url(#maelard-glow)" />
        
        {/* Motor body - larger industrial */}
        <ellipse cx="200" cy="110" rx="85" ry="25" fill="#4A3B5F" opacity="0.3" />
        <rect x="115" y="110" width="170" height="120" fill="url(#maelard-body)" />
        <ellipse cx="200" cy="230" rx="85" ry="25" fill="#1A0B2F" />
        
        {/* Cooling fins - industrial grade */}
        {Array.from({ length: 12 }, (_, i) => (
          <rect
            key={`fin-${i}`}
            x="120"
            y={115 + i * 9.5}
            width="160"
            height="2"
            fill="#2A3B5F"
            opacity="0.7"
          />
        ))}
        
        {/* Heavy-duty winding coils */}
        <ellipse cx="200" cy="135" rx="60" ry="14" fill="url(#maelard-coil)" opacity="0.85" />
        <ellipse cx="200" cy="155" rx="60" ry="14" fill="url(#maelard-coil)" opacity="0.75" />
        <ellipse cx="200" cy="175" rx="60" ry="14" fill="url(#maelard-coil)" opacity="0.85" />
        <ellipse cx="200" cy="195" rx="60" ry="14" fill="url(#maelard-coil)" opacity="0.75" />
        <ellipse cx="200" cy="215" rx="60" ry="14" fill="url(#maelard-coil)" opacity="0.85" />
        
        {/* Reinforced shaft */}
        <ellipse cx="200" cy="110" rx="18" ry="10" fill="#7A7290" />
        <rect x="182" y="70" width="36" height="40" fill="#6A6280" />
        <ellipse cx="200" cy="70" rx="18" ry="10" fill="#8A82A0" />
        
        {/* Heavy mounting bolts */}
        {[0, 72, 144, 216, 288].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x = 200 + Math.cos(rad) * 75;
          const y = 170 + Math.sin(rad) * 30;
          return (
            <g key={`bolt-${i}`}>
              <circle cx={x} cy={y} r="6" fill="#1A1A2F" stroke="#8866CC" strokeWidth="1" />
              <circle cx={x} cy={y} r="3" fill="#0A0A1F" />
            </g>
          );
        })}
        
        {/* Product label */}
        <rect x="140" y="245" width="120" height="22" fill="#2A1B3F" opacity="0.9" rx="3" />
        <text x="200" y="260" textAnchor="middle" fill="#8866CC" fontSize="12" fontFamily="Space Mono" fontWeight="bold">
          MAELARD
        </text>
        
        {/* Industrial accent lines */}
        <line x1="115" y1="170" x2="285" y2="170" stroke="#8866CC" strokeWidth="1.5" opacity="0.5" />
        <line x1="115" y1="175" x2="285" y2="175" stroke="#8866CC" strokeWidth="0.5" opacity="0.3" />
      </svg>
    );
  }
}
