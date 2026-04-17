import React, { useState } from 'react';
import { materials } from '@/engineering/data/materials';
import MaterialCard from '@/engineering/components/MaterialCard';
import { Search, Filter, LayoutGrid } from 'lucide-react';

interface MaterialSelectorProps {
  selectedMaterialId: string | null;
  onMaterialSelect: (materialId: string) => void;
}

type FilterCategory = 'all' | 'cement' | 'aggregates' | 'ceramics' | 'flooring' | 'roofing' | 'drywall' | 'dormitorios';

const MaterialSelector: React.FC<MaterialSelectorProps> = ({
  selectedMaterialId,
  onMaterialSelect
}) => {
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMaterials = materials.filter(material => {
    const matchesCategory = filter === 'all' || material.category === filter;
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all' as FilterCategory, name: 'TODOS' },
    { id: 'cement' as FilterCategory, name: 'CEMENTOS' },
    { id: 'aggregates' as FilterCategory, name: 'ÁRIDOS' },
    { id: 'ceramics' as FilterCategory, name: 'CERÁMICAS' },
    { id: 'flooring' as FilterCategory, name: 'REVESTIMIENTOS' },
    { id: 'drywall' as FilterCategory, name: 'TABIQUERÍA' },
    { id: 'roofing' as FilterCategory, name: 'TECHUMBRES' },
    { id: 'dormitorios' as FilterCategory, name: 'DORMITORIOS' }
  ];

  return (
    <div style={{ padding: '60px 0' }}>
      {/* 🧭 BARRA DE NAVEGACIÓN TÉCNICA */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '40px', 
        marginBottom: '60px',
        borderBottom: '1px solid rgba(14, 31, 51, 0.05)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ width: '100%' }}>
                <h2 style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', color: 'var(--brand-blue)', marginBottom: '15px' }}>
                    Catálogo de Ingeniería
                </h2>
                <div className="eng-category-scroll">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setFilter(category.id)}
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: '0 0 10px 0',
                                fontSize: '12px',
                                fontWeight: 900,
                                color: filter === category.id ? 'var(--brand-navy)' : 'rgba(14, 31, 51, 0.3)',
                                cursor: 'pointer',
                                transition: 'all 0.4s',
                                letterSpacing: '0.1em',
                                position: 'relative',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {category.name}
                            {filter === category.id && (
                                <div style={{ position: 'absolute', bottom: '0', left: 0, width: '100%', height: '2px', backgroundColor: 'var(--brand-navy)' }} />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ position: 'relative', width: '100%', maxWidth: '400px', marginBottom: '30px' }}>
                <Search style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} size={16} />
                <input
                    type="text"
                    placeholder="BUSCAR MATERIAL..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '15px 0 15px 30px',
                        border: 'none',
                        borderBottom: '1px solid rgba(0,0,0,0.1)',
                        fontSize: '11px',
                        fontWeight: 900,
                        letterSpacing: '0.2em',
                        background: 'transparent',
                        outline: 'none'
                    }}
                />
            </div>
        </div>
      </div>

      {/* 🏁 GRID DE EXPOSICIÓN */}
      <div className="eng-selector-grid">
        {filteredMaterials.map((material) => (
          <MaterialCard
            key={material.id}
            material={material}
            isSelected={selectedMaterialId === material.id}
            onSelect={onMaterialSelect}
          />
        ))}
      </div>

      {filteredMaterials.length === 0 && (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <LayoutGrid size={48} style={{ opacity: 0.1, marginBottom: '20px' }} />
          <p style={{ fontSize: '12px', fontWeight: 900, opacity: 0.3, letterSpacing: '0.2em' }}>
            NO SE ENCONTRARON MATERIALES EN ESTA CATEGORÍA
          </p>
        </div>
      )}
    </div>
  );
};

export default MaterialSelector;