"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface StoryItem {
  id: string;
  label: string;
  image: string;
  hasOffer?: boolean;
}

const STORIES: StoryItem[] = [
  { id: "Ofertas", label: "Ofertas", image: "/images/comodoro-nuevo.png", hasOffer: true },
  { id: "Construcción", label: "Obra", image: "/images/comodoro-2000.png" },
  { id: "Cerámicas", label: "Cerámicas", image: "/images/home-ceramicas.png" },
  { id: "Cocina", label: "Cocina", image: "/images/home-cocina.png" },
  { id: "Aislación", label: "Aislación", image: "/images/home-aislante.png" },
  { id: "Binelli", label: "Binelli", image: "/images/home-quincho.png" },
];

interface RetailStoriesProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function RetailStories({ activeCategory, onCategoryChange }: RetailStoriesProps) {
  return (
    <div style={{ padding: '20px 5%', overflowX: 'auto', display: 'flex', gap: '25px', backgroundColor: 'transparent', justifyContent: 'center' }} className="no-scrollbar">
      {STORIES.map((story) => {
        const isActive = activeCategory === story.id;
        
        return (
          <motion.button
            key={story.id}
            onClick={() => onCategoryChange(story.id)}
            whileTap={{ scale: 0.9 }}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '10px', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              minWidth: '80px'
            }}
          >
            <div style={{ 
                position: 'relative', 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                padding: '3px',
                background: story.hasOffer 
                    ? 'conic-gradient(from 0deg, #D4AF37, #FFD700, #D4AF37)' 
                    : isActive ? 'var(--brand-navy)' : '#EEE',
                animation: story.hasOffer ? 'spin 3s linear infinite' : 'none'
            }}>
                <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    borderRadius: '50%', 
                    backgroundColor: '#FFF', 
                    overflow: 'hidden', 
                    position: 'relative',
                    border: '2px solid #FFF'
                }}>
                    <Image 
                        src={story.image} 
                        alt={story.label} 
                        fill 
                        style={{ objectFit: 'cover' }} 
                    />
                </div>
                
                {story.hasOffer && (
                    <div style={{ 
                        position: 'absolute', 
                        bottom: '-5px', 
                        right: '-5px', 
                        backgroundColor: '#FF4B4B', 
                        color: '#FFF', 
                        fontSize: '8px', 
                        fontWeight: 900, 
                        padding: '2px 6px', 
                        borderRadius: '100px',
                        border: '2px solid #FFF'
                    }}>
                        SALE
                    </div>
                )}
            </div>
            
            <span style={{ 
                fontSize: '10px', 
                fontWeight: isActive ? 900 : 500, 
                textTransform: 'uppercase', 
                letterSpacing: '0.1em',
                color: isActive ? 'var(--brand-navy)' : '#666'
            }}>
                {story.label}
            </span>
          </motion.button>
        );
      })}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
