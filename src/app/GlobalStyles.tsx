'use client';
import React from "react";

/**
 * GlobalStyles injects custom CSS variables, fonts, and base styles
 * ported from the original app design.
 */
export default function GlobalStyles() {
  return (
  
    <style>{`
      .animated-element {
  will-change: transform, opacity;
  transform: translate3d(0, 0, 0); /* Force hardware acceleration */
  backface-visibility: hidden;
  perspective: 1000px;
}

/* For your keyframe animations */
@keyframes optimized-fade-in {
  from {
    opacity: 0;
    transform: translate3d(0, 20px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
      @import url('https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&family=Moulpali&display=swap');
      :root {
        --imperial-gold: #a88c5a;
        --lotus-pink: #fbe9ea;
        --temple-stone: #5a4a3a;
        --silk-ivory: #fdfaf3;
        --quote-color: #7c6b50;
        --button-gradient-end: #c7b489;
        --success-green: #4CAF50;
        --error-red: #F44336;
      }
      html, body {
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
      }
        body {
            fontFamily: 'Noto Sans Khmer', 'Roboto', 'Arial', sans-serif;
            backgroundColor: 'brand.ivory';
            backgroundImage: 'url(https://www.transparenttextures.com/patterns/stucco.png)';
            backgroundRepeat: 'repeat';
            backgroundSize: 'auto';
            backgroundAttachment: 'fixed'; /* Add this to prevent background scrolling */
            color: 'brand.textPrimary';
            overflowX: 'hidden'; /* Prevent horizontal scroll on body */
        }

      /* Animation keyframes */
      @keyframes gold-sparkle-text {
        0%, 100% { text-shadow: 0 0 2px #fff, 0 0 5px var(--imperial-gold), 0 0 10px var(--imperial-gold); }
        50% { text-shadow: 0 0 5px #fff, 0 0 12px var(--lotus-pink), 0 0 25px var(--lotus-pink); }
      }
        
      @keyframes floating-petal {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(-120vh) rotate(720deg); opacity: 0; }
      }
      .gold-sparkle-text {
        animation: gold-sparkle-text 2s infinite alternate;
      }
      .font-moulpali { font-family: 'Moulpali', cursive; }
      .font-battambang { font-family: 'Battambang', serif; }
      @keyframes fade-in-slow { from { opacity: 0; } to { opacity: 1; } }
      @keyframes shimmer {
  0% {
  
    }
      100% {
        transform: translateX(100%);
      }
    }
          @keyframes lotusBloom {
      0% {
        transform: scaleX(-1) translateY(0);
      }
      100% {
        transform: scaleX(-1) translateY(-22px);
      }
    }
    
            @keyframes rootPulse {
                0%, 100% { 
                    filter: drop-shadow(0 0 8px rgba(196, 166, 106, 0.6)) drop-shadow(0 0 16px rgba(212, 175, 55, 0.4));
                }
                50% { 
                    filter: drop-shadow(0 0 20px rgba(196, 166, 106, 0.8)) drop-shadow(0 0 30px rgba(212, 175, 55, 0.6));
                }
            }
    
            @keyframes breathingGlow {
                0%, 100% {
                    filter: drop-shadow(0 0 8px #ffe08299) drop-shadow(0 0 12px #d4af3799);
                    stroke-width: 2;
                    opacity: 0.7;
                }
                50% {
                    filter: drop-shadow(0 0 28px #ffe082cc) drop-shadow(0 0 40px #fffde7aa);
                    stroke-width: 3.7;
                    opacity: 1;
                }
            }
    
            .breathing-glow {
                animation: breathingGlow 5s ease-in-out infinite;
            }
    
            .root-pulse {
                animation: rootPulse 4s ease-in-out infinite;
            }
                
                @keyframes breathing-glow {
                  0%, 100% {
                    filter: 
                      drop-shadow(0 0 3px rgba(196, 166, 106, 0.6)) 
                      drop-shadow(0 0 6px rgba(255, 215, 0, 0.4))
                      drop-shadow(0 0 12px rgba(212, 175, 55, 0.3));
                    opacity: 0.7;
                    transform: scale(1);
                  }
                  33% {
                    filter: 
                      drop-shadow(0 0 6px rgba(255, 215, 0, 0.8)) 
                      drop-shadow(0 0 12px rgba(196, 166, 106, 0.6))
                      drop-shadow(0 0 20px rgba(188, 166, 152, 0.4));
                    opacity: 0.9;
                    transform: scale(1.02);
                  }
                  66% {
                    filter: 
                      drop-shadow(0 0 8px rgba(212, 175, 55, 0.9)) 
                      drop-shadow(0 0 16px rgba(255, 215, 0, 0.7))
                      drop-shadow(0 0 24px rgba(92, 44, 44, 0.3));
                    opacity: 1;
                    transform: scale(1.01);
                  }
                }
                
                .breathing-glow {
                  animation: breathing-glow 10s ease-in-out infinite;
                }
                  
        `}</style>
  );
}
