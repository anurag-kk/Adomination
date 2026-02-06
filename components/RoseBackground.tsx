import React, { useEffect, useState } from 'react';

export const RoseBackground: React.FC = () => {
  const [petals, setPetals] = useState<Array<{
    id: number;
    left: number;
    delay: number;
    duration: number;
    size: number;
    color: string;
  }>>([]);

  useEffect(() => {
    // Generate petals on mount
    const count = 40;
    const newPetals = [];
    for (let i = 0; i < count; i++) {
      newPetals.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 8 + Math.random() * 12,
        size: 8 + Math.random() * 12,
        color: Math.random() > 0.6 ? '#2563eb' : '#fb7185', // Blue vs Rose
      });
    }
    setPetals(newPetals);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#02020a]">
      {/* Dynamic Styles for Keyframes */}
      <style>{`
        @keyframes floatDown {
          0% {
            transform: translateY(-10vh) rotate(0deg) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(110vh) rotate(720deg) translateX(30px);
            opacity: 0;
          }
        }
        @keyframes spinSlow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }
      `}</style>

      {/* Deep Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0f0f2d_0%,#000000_100%)] opacity-90" />
      
      {/* Ambient Glow Orbs */}
      <div className="absolute top-0 left-0 w-[50vw] h-[50vw] bg-blue-900/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[60vw] h-[60vw] bg-rose-900/20 rounded-full blur-[120px] animate-pulse delay-1000" />

      {/* Central Wireframe Rose SVG */}
      <div className="absolute top-1/2 left-1/2 w-[90vmin] h-[90vmin] opacity-20 pointer-events-none mix-blend-screen">
        <svg 
          viewBox="0 0 200 200" 
          className="w-full h-full" 
          style={{ animation: 'spinSlow 60s linear infinite' }}
        >
          <defs>
            <linearGradient id="roseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#fb7185" />
            </linearGradient>
          </defs>
          <g transform="translate(100,100)">
            {/* Outer Petals */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
              <path
                key={`outer-${i}`}
                d="M0 0 Q 35 -65 70 0 T 0 0"
                fill="none"
                stroke="url(#roseGrad)"
                strokeWidth="0.5"
                transform={`rotate(${deg}) scale(1.2)`}
              />
            ))}
            {/* Inner Petals */}
            {[15, 75, 135, 195, 255, 315].map((deg, i) => (
              <path
                key={`inner-${i}`}
                d="M0 0 Q 20 -40 40 0 T 0 0"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="0.8"
                transform={`rotate(${deg}) scale(0.8)`}
              />
            ))}
          </g>
        </svg>
      </div>

      {/* Falling Petals Particle System */}
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute"
          style={{
            left: `${petal.left}%`,
            top: '-5%',
            width: `${petal.size}px`,
            height: `${petal.size}px`,
            backgroundColor: petal.color,
            borderRadius: '50% 0 50% 50%', // Petal shape
            boxShadow: `0 0 8px ${petal.color}`,
            opacity: 0,
            animation: `floatDown ${petal.duration}s linear infinite`,
            animationDelay: `-${petal.delay}s`,
            filter: 'blur(0.5px)',
          }}
        />
      ))}
    </div>
  );
};