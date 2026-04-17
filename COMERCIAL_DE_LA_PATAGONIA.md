# 🏔️ PROYECTO: "Comercial de la Patagonia" (Sistema Híbrido Pro)
**Estado:** Arquitectura Headless Pro (Sincronizada)
**Agencia:** Patagonia Coach

---

## 📅 31 DE MARZO, 2026: FUNDACIÓN Y REFACTORIZACIÓN ESTRUCTURAL

### 1. 🏗️ Decisión de Arquitectura: "Headless Hybrid" (V2)
*   **Decisión:** **Home Cinematográfica** en el dominio principal (`boostpatagonia.online`) con Next.js y **Tienda Full** en el subdominio (`tienda.boostpatagonia.online`) con WooCommerce.
*   **Razón:** Velocidad bruta para la marca y robustez total para el carrito y pagos sin fricción.

### 2. 🌓 Sistema de Diseño: "Duality Era"
*   **Decisión:** Implementar un **ThemeContext** que permite al usuario alternar entre fondos oscuros (Dark Brutalist) y claros (Light Clean) con transiciones suaves de 0.8s.
*   **Paleta de Marca:** Dorado Metalizado (`#D4AF37`) sobre escala de grises profundos y blancos níveos. Basado en el logo oficial.

### 3. 🧩 Refactorización Modular (Clean Code)
*   **Decisión:** Separar las vistas de **(marketing)** y **(shop)** para optimizar la carga.
*   **Componentes Extraídos:**
    *   `Navigation`: HUD dinámico adaptable.
    *   `Footer`: Cierre de marca global.
    *   `ProductCard`: Atómico y reactivo.
    *   `CartSheet`: Sistema de cotización en tiempo real.

### 4. 🧠 Estados Globales (Context)
*   **ThemeContext:** Persistencia de tema en LocalStorage.
*   **CartContext:** Carrito de cotización global que permite agregar productos en la tienda y verlos en cualquier parte del sitio (Incluso en el Home).

---

## 🗺️ MAPA DE CARPETAS (SALA DE MANDOS)
*   `src/app/(marketing)` -> Home Cinematográfica.
*   `src/app/(shop)` -> Tienda y Catálogo.
*   `src/components/` -> Bloques de construcción UI (Layout y eCommerce).
*   `src/lib/woocommerce.ts` -> Conector maestro con el WordPress de Hostinger.
*   `public/branding` -> Logos y activos de marca para recuperarlos fácilmente.

---

---

## 📅 8 DE ABRIL, 2026: OPTIMIZACIÓN B2B Y CONECTIVIDAD TOTAL

### 1. 💼 Implementación "Project Mode"
*   **Decisión:** Añadido campo de identificación de proyecto en el carrito.
*   **Razón:** Los clientes B2B ahora pueden separar sus cotizaciones por obra (ej: "Proyecto Casa Lagos"), lo cual se envía automáticamente por WhatsApp.

### 2. 🔗 Centralización de Marca
*   **Decisión:** Creación de `src/lib/constants.ts` para gestionar WhatsApp, Emails y nombres de marca globalmente.
*   **Resultado:** Eliminación de placeholders `569XXXXXXXXX`.

### 3. 🛡️ Estabilización de API
*   **Decisión:** El sistema de fetch ahora detecta bloqueos de Hostinger y muestra MOCK DATA solo como último recurso, priorizando siempre la data real del `.env.local`.

---

## 🗺️ MAPA DE CARPETAS (SALA DE MANDOS)
*   `src/app/(marketing)` -> Home Cinematográfica.
*   `src/app/(shop)` -> Tienda y Catálogo.
*   `src/components/` -> Bloques de construcción UI (Layout y eCommerce).
*   `src/lib/woocommerce.ts` -> Conector maestro con el WordPress de Hostinger.
*   `src/lib/constants.ts` -> Constantes de marca (WhatsApp, Redes, etc).
*   `public/branding` -> Logos y activos de marca.

---

## 📅 13 DE ABRIL, 2026: SISTEMA DE GESTIÓN B2B ELITE
 
 ### 1. 📂 Historial de Cotizaciones (Local Dashboard)
 *   **Decisión:** Implementación de `src/app/(shop)/historial` con persistencia en `localStorage`.
 *   **Razón:** Permite a los clientes B2B recuperar pedidos anteriores y gestionar múltiples obras sin base de datos centralizada, manteniendo la velocidad "Quiet Luxury".
 
 ### 2. 🖨️ Generación de Documentación Premium
 *   **Decisión:** Sistema `@media print` optimizado para PDF formal.
 *   **Resultado:** El botón "GENERAR PDF" en la pre-cotización ahora produce un documento de estándar corporativo, eliminando elementos de UI y optimizando tipografía.
 
 ### 3. 🧮 Ingeniería de Campo (Calculadora V2)
 *   **Decisión:** Habilitada la lógica para **Cerámicos** con cálculo de desperdicio.
 *   **Uso:** Cubicación instantánea de metros cuadrados con margen de error industrial.
 
 ---
 
 ## 🗺️ MAPA DE CARPETAS ACTUALIZADO
 *   `src/app/(shop)/historial` -> Dashboard de gestión local.
 *   `src/context/CartContext.tsx` -> Motor de persistencia y archivado.
 *   `src/components/shop/QuotePreview.tsx` -> Generador de PDF/Print.
 
 ---
 
 ## 🧗‍♂️ PRÓXIMOS HITOS (TO-DO LIST)
 - [x] **Sincronización API Keys:** Vincular las llaves de WordPress.
 - [x] **Ficha de Detalle Dinámica:** Crear la página `shop/[id]`.
 - [x] **Project Mode:** Agrupar cotizaciones por "Nombre de Proyecto".
 - [x] **Generación de PDF:** Opción para descargar la cotización en PDF con estética "Quiet Luxury".
 - [x] **Dashboard Cliente:** Área simple para ver historial de cotizaciones guardadas localmente.
 - [ ] **Integración de Techumbre:** Lógica de cubicación para techos en la calculadora.
 - [ ] **Notificaciones Push B2B:** Alertas de stock crítico para materiales pesados.

---
*Este documento es la brújula del proyecto. Actualizar tras cada hito importante.*
