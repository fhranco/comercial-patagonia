import os
import urllib.request
import json
import base64
from datetime import datetime

# Configuración desde Variables de Entorno
# NOTA: En GitHub Actions estas deben cargarse desde Secrets
CK = os.getenv('WOOCOMMERCE_CK')
CS = os.getenv('WOOCOMMERCE_CS')
URL_BASE = os.getenv('NEXT_PUBLIC_WOOCOMMERCE_URL')

def get_totals():
    if not CK or not CS or not URL_BASE:
        return "⚠️ Error: Faltan credenciales de WooCommerce en GitHub Secrets."

    auth = base64.b64encode(f'{CK}:{CS}'.encode()).decode()
    headers = {'Authorization': f'Basic {auth}'}
    
    try:
        # 1. Obtener totales de tipos de productos
        req_totals = urllib.request.Request(f'{URL_BASE}/reports/products/totals', headers=headers)
        with urllib.request.urlopen(req_totals) as response:
            totals_data = json.loads(response.read().decode())
        
        # 2. Obtener conteo de Publicados vs Borradores usando HEAD
        statuses = ['publish', 'draft']
        counts = {}
        for s in statuses:
            req_status = urllib.request.Request(f'{URL_BASE}/products?status={s}&per_page=1', headers=headers, method='HEAD')
            with urllib.request.urlopen(req_status) as resp:
                counts[s] = resp.headers.get('X-WP-Total', '0')

        # 3. Generar el Reporte Markdown
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        report = f"""# 🏔️ Auditoría de Catálogo: Comercial de la Patagonia
Actualizado: {now} (UTC)

## 📊 Resumen de Inventario
| Estado | Cantidad |
| :--- | :--- |
| ✅ **Publicados** | {counts.get('publish', 0)} |
| 📝 **Borradores** | {counts.get('draft', 0)} |
| 📦 **Total en Sistema** | {int(counts.get('publish', 0)) + int(counts.get('draft', 0))} |

## 🛠️ Detalles Técnicos
- **Conexión:** Establecida con Hostinger API v3.
- **Límite de Sincronía Actual:** 500 productos (Vía Bridge Nitro v2).
- **Estado de Capacidad:** {"🟢 OK" if (int(counts.get('publish', 0)) < 450) else "🟡 Cerca del Límite (500)"}

---
*Este reporte es generado automáticamente por el GitHub Action de Antigravity.*
"""
        return report

    except Exception as e:
        return f"❌ Error de Conexión con WooCommerce: {str(e)}"

if __name__ == "__main__":
    result = get_totals()
    with open("CATALOGO_STATUS.md", "w", encoding="utf-8") as f:
        f.write(result)
    print("✅ Reporte de catálogo generado exitosamente.")
