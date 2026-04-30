"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div style={{ backgroundColor: '#FFF', minHeight: '100vh', width: '100%' }}>
      {/* HUD Skeleton */}
      <nav style={{ padding: '20px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ width: '100px', height: '15px', backgroundColor: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '4px' }} className="animate-pulse" />
        <div style={{ width: '120px', height: '40px', backgroundColor: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '100px' }} className="animate-pulse" />
      </nav>

      <main style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', minHeight: 'calc(100vh - 100px)' }}>
          
          {/* Visual Skeleton */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid var(--border-color)' }}>
             <div style={{ width: '80%', height: '80%', backgroundColor: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '8px' }} className="animate-pulse" />
          </div>

          {/* Info Skeleton */}
          <div style={{ padding: '100px 10%', display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ width: '150px', height: '10px', backgroundColor: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '4px' }} className="animate-pulse" />
            <div style={{ width: '100%', height: '80px', backgroundColor: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '4px' }} className="animate-pulse" />
            <div style={{ width: '200px', height: '60px', backgroundColor: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '4px' }} className="animate-pulse" />
            <div style={{ width: '100%', height: '200px', backgroundColor: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '4px', marginTop: '40px' }} className="animate-pulse" />
            
            <div style={{ display: 'grid', gap: '20px', marginTop: 'auto' }}>
              <div style={{ width: '100%', height: '70px', backgroundColor: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '4px' }} className="animate-pulse" />
              <div style={{ width: '100%', height: '50px', backgroundColor: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '4px' }} className="animate-pulse" />
            </div>
          </div>

        </div>
      </main>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
