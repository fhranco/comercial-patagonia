"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Eye } from 'lucide-react';

export default function ViewCounter() {
  const pathname = usePathname();
  const [views, setViews] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function registerAndView() {
      try {
        // Enviar la petición POST con el pathname actual
        const res = await fetch('/api/views', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pathname }),
        });

        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setViews(data.views);
          }
        }
      } catch (error) {
        console.error('Error al registrar o consultar visitas:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    registerAndView();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  if (isLoading) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', opacity: 0.5, fontSize: '12px' }}>
        <Eye size={14} className="animate-pulse" />
        <span style={{ width: '20px', height: '12px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '2px' }} className="animate-pulse"></span>
      </div>
    );
  }

  if (views === null) return null;

  return (
    <div 
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '6px', 
        opacity: 0.6, 
        fontSize: '12px',
        color: 'inherit',
        justifyContent: 'center',
        transition: 'opacity 0.2s ease-in-out'
      }}
      className="hover:opacity-100"
    >
      <Eye size={14} style={{ opacity: 0.7 }} />
      <span>
        {views.toLocaleString()} {views === 1 ? 'visita' : 'visitas'}
      </span>
    </div>
  );
}
