import zipfile
import xml.etree.ElementTree as ET
import os
import json

def parse_xlsx(file_path, output_path):
    print(f"Opening {file_path}...")
    if not os.path.exists(file_path):
        print("File not found!")
        return

    with zipfile.ZipFile(file_path, 'r') as zip_ref:
        # 1. Load shared strings
        shared_strings = []
        if 'xl/sharedStrings.xml' in zip_ref.namelist():
            content = zip_ref.read('xl/sharedStrings.xml')
            root = ET.fromstring(content)
            ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
            for si in root.findall('.//ns:si', ns):
                t_elem = si.find('ns:t', ns)
                if t_elem is not None:
                    shared_strings.append(t_elem.text)
                else:
                    r_text = "".join([t.text for t in si.findall('.//ns:t', ns) if t.text])
                    shared_strings.append(r_text)

        # 2. Load worksheet data
        if 'xl/worksheets/sheet1.xml' in zip_ref.namelist():
            content = zip_ref.read('xl/worksheets/sheet1.xml')
            root = ET.fromstring(content)
            ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
            
            cyber_products = []
            seen_skus = set()
            for r in root.findall('.//ns:row', ns):
                row_idx = int(r.get('r'))
                if row_idx < 4:  # Skip headers
                    continue
                
                row_data = {}
                for c in r.findall('ns:c', ns):
                    cell_ref = c.get('r')
                    col_letter = ''.join([char for char in cell_ref if not char.isdigit()])
                    t = c.get('t')
                    v_elem = c.find('ns:v', ns)
                    val = None
                    if v_elem is not None:
                        val = v_elem.text
                        if t == 's':
                            val = shared_strings[int(val)]
                    row_data[col_letter] = val
                
                sku = row_data.get('A')
                name = row_data.get('B')
                regular_val = row_data.get('D')
                offer_val = row_data.get('F')
                desc_val = row_data.get('E')

                if sku and offer_val:
                    sku_str = str(sku).strip().replace('.0', '') # clean SKU float representations
                    if not sku_str or sku_str in seen_skus:
                        continue
                    try:
                        regular_price = int(float(regular_val)) if regular_val else 0
                        sale_price = int(float(offer_val)) if offer_val else 0
                        discount_pct = int(float(desc_val) * 100) if desc_val else 0
                        
                        seen_skus.add(sku_str)
                        cyber_products.append({
                            "sku": sku_str,
                            "name": name.strip() if name else "",
                            "regular_price": regular_price,
                            "sale_price": sale_price,
                            "discount_pct": discount_pct
                        })
                    except Exception as ex:
                        # Skip if conversion fails (headers, text footer)
                        continue

            print(f"Extracted {len(cyber_products)} cyber products.")
            
            # Ensure output folder exists
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(cyber_products, f, indent=2, ensure_ascii=False)
            
            print(f"Saved JSON output to {output_path} successfully.")

parse_xlsx('public/CYBERDAY_JUNIO2026.xlsx', 'src/data/cyber-products.json')
