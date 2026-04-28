import React from "react";
import { ChevronLeft, ShoppingBag } from "lucide-react";

export default function Loading() {
  return (
    <div style={{ backgroundColor: '#FFF', color: '#000', minHeight: '100vh' }}>
      
      {/* 🚀 HUD MINIMALISTA */}
      <nav className="titanium-glass" style={{ padding: '20px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 2500 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <ChevronLeft className="w-5 h-5" /> <div style={{ width: '80px', height: '14px', backgroundColor: '#EEE', borderRadius: '4px' }} className="animate-pulse" />
          </div>
          <div style={{ width: '120px', height: '40px', backgroundColor: '#EEE', borderRadius: '100px' }} className="animate-pulse" />
      </nav>

      <main style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', minHeight: 'calc(100vh - 100px)' }}>
          
          {/* 🖼️ SECCIÓN VISUAL SKELETON */}
          <div style={{ position: 'relative', backgroundColor: '#F8F8F8' }}>
             <div style={{ position: 'sticky', top: '100px', width: '100%', height: 'calc(100vh - 100px)', padding: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <div style={{ width: '80%', height: '80%', backgroundColor: '#EEE', borderRadius: '8px' }} className="animate-pulse gold-shimmer" />
             </div>
          </div>

          {/* 📝 SECCIÓN INFO SKELETON */}
          <div style={{ padding: '100px 10%', display: 'flex', flexDirection: 'column', gap: '30px' }}>
             <div style={{ width: '150px', height: '15px', backgroundColor: '#EEE', borderRadius: '4px' }} className="animate-pulse" />
             <div style={{ width: '100%', height: '60px', backgroundColor: '#EEE', borderRadius: '4px' }} className="animate-pulse" />
             <div style={{ width: '200px', height: '80px', backgroundColor: '#EEE', borderRadius: '4px' }} className="animate-pulse" />
             <div style={{ width: '100%', height: '200px', backgroundColor: '#EEE', borderRadius: '4px' }} className="animate-pulse" />
          </div>
        </div>
      </main>
    </div>
  );
}
