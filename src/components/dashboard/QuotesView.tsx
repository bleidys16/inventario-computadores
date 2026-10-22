import React, { useState } from 'react';
import { useInventoryStore } from '../../store/useInventoryStore';
import { 
  Search, 
  Building2, 
  TrendingDown, 
  Truck 
} from 'lucide-react';

export const QuotesView: React.FC = () => {
  const { quotes } = useInventoryStore();
  const [componentSearch, setComponentSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');

  const filteredQuotes = quotes.filter((item) => {
    if (categoryFilter !== 'Todas' && item.category !== categoryFilter) {
      return false;
    }

    if (componentSearch.trim()) {
      const q = componentSearch.toLowerCase().trim();
      return (
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.specs.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-4">
      {/* Search and Category Filter Header */}
      <div className="bg-[#2B124C] border border-[#522B5B] rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <span className="font-mono text-[11px] text-[#DFB6B2] uppercase mr-1">
            Categoría:
          </span>
          {['Todas', 'RAM DDR5', 'SSD NVMe', 'Fuentes de Poder'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 text-xs font-mono uppercase rounded border transition-colors ${
                categoryFilter === cat
                  ? 'bg-[#854F6C] text-[#FBE4D8] border-[#DFB6B2]'
                  : 'bg-[#190019] text-[#DFB6B2] border-[#522B5B] hover:bg-[#522B5B]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Component Search Input */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#DFB6B2]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={componentSearch}
            onChange={(e) => setComponentSearch(e.target.value)}
            placeholder="Buscar componente o SKU..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#190019] text-[#FBE4D8] placeholder-[#DFB6B2]/50 text-xs rounded border border-[#522B5B] focus:border-[#DFB6B2] outline-none font-sans"
          />
        </div>
      </div>

      {/* Suppliers Comparison Table */}
      <div className="bg-[#2B124C] border border-[#522B5B] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#190019] text-[#DFB6B2] font-mono text-[11px] uppercase tracking-wider border-b border-[#522B5B]">
                <th className="py-3 px-4 w-1/3">Componente de Hardware & Especificaciones</th>
                <th className="py-3 px-4">
                  <div className="flex flex-col">
                    <span className="text-[#FBE4D8] font-semibold">Proveedor Alfa</span>
                    <span className="text-[10px] text-[#DFB6B2]/70 font-normal">Mayorista Alfa Tech</span>
                  </div>
                </th>
                <th className="py-3 px-4">
                  <div className="flex flex-col">
                    <span className="text-[#FBE4D8] font-semibold">Proveedor Beta</span>
                    <span className="text-[10px] text-[#DFB6B2]/70 font-normal">Suministros IT Beta</span>
                  </div>
                </th>
                <th className="py-3 px-4">
                  <div className="flex flex-col">
                    <span className="text-[#FBE4D8] font-semibold">Proveedor Gamma</span>
                    <span className="text-[10px] text-[#DFB6B2]/70 font-normal">Hardware Global Gamma</span>
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Comparativa & Ahorro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#522B5B]">
              {filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#DFB6B2] font-mono">
                    No se encontraron componentes que coincidan con los criterios de búsqueda.
                  </td>
                </tr>
              ) : (
                filteredQuotes.map((item) => {
                  const pAlfa = item.prices.alfa;
                  const pBeta = item.prices.beta;
                  const pGamma = item.prices.gamma;

                  const minPrice = Math.min(pAlfa, pBeta, pGamma);
                  const maxPrice = Math.max(pAlfa, pBeta, pGamma);
                  const maxSavings = maxPrice - minPrice;
                  const savingsPct = ((maxSavings / maxPrice) * 100).toFixed(1);

                  return (
                    <tr key={item.id} className="hover:bg-[#522B5B]/20 transition-colors">
                      {/* Component info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] uppercase bg-[#190019] text-[#DFB6B2] px-1.5 py-0.5 rounded border border-[#522B5B]">
                            {item.category}
                          </span>
                          <span className="font-mono text-[11px] text-[#DFB6B2]">
                            SKU: {item.sku}
                          </span>
                        </div>
                        <h4 className="font-medium text-[#FBE4D8] text-xs mt-1">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-[#DFB6B2]/80 mt-0.5 font-mono">
                          {item.specs}
                        </p>
                      </td>

                      {/* Proveedor Alfa */}
                      <td className={`py-3.5 px-4 font-mono ${pAlfa === minPrice ? 'bg-emerald-950/20' : ''}`}>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-semibold ${pAlfa === minPrice ? 'text-emerald-300' : 'text-[#FBE4D8]'}`}>
                            {formatCOP(pAlfa)}
                          </span>
                          {pAlfa === minPrice && (
                            <span className="text-[9px] bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 px-1 py-0.2 rounded font-mono">
                              MEJOR
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-[#DFB6B2] mt-0.5">
                          Stock: {item.stock.alfa} unids.
                        </div>
                        <div className="text-[10px] text-[#DFB6B2]/70 flex items-center gap-1">
                          <Truck className="w-2.5 h-2.5" /> 24-48 hrs
                        </div>
                      </td>

                      {/* Proveedor Beta */}
                      <td className={`py-3.5 px-4 font-mono ${pBeta === minPrice ? 'bg-emerald-950/20' : ''}`}>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-semibold ${pBeta === minPrice ? 'text-emerald-300' : 'text-[#FBE4D8]'}`}>
                            {formatCOP(pBeta)}
                          </span>
                          {pBeta === minPrice && (
                            <span className="text-[9px] bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 px-1 py-0.2 rounded font-mono">
                              MEJOR
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-[#DFB6B2] mt-0.5">
                          Stock: {item.stock.beta} unids.
                        </div>
                        <div className="text-[10px] text-[#DFB6B2]/70 flex items-center gap-1">
                          <Truck className="w-2.5 h-2.5" /> 3-5 Días
                        </div>
                      </td>

                      {/* Proveedor Gamma */}
                      <td className={`py-3.5 px-4 font-mono ${pGamma === minPrice ? 'bg-emerald-950/20' : ''}`}>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-semibold ${pGamma === minPrice ? 'text-emerald-300' : 'text-[#FBE4D8]'}`}>
                            {formatCOP(pGamma)}
                          </span>
                          {pGamma === minPrice && (
                            <span className="text-[9px] bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 px-1 py-0.2 rounded font-mono">
                              MEJOR
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-[#DFB6B2] mt-0.5">
                          Stock: {item.stock.gamma} unids.
                        </div>
                        <div className="text-[10px] text-[#DFB6B2]/70 flex items-center gap-1">
                          <Truck className="w-2.5 h-2.5" /> Mismo Día
                        </div>
                      </td>

                      {/* Delta de Ahorro */}
                      <td className="py-3.5 px-4 text-right font-mono">
                        <div className="inline-flex flex-col items-end">
                          <span className="text-emerald-400 font-semibold text-xs flex items-center gap-1">
                            <TrendingDown className="w-3 h-3" />
                            Ahorro: {formatCOP(maxSavings)}
                          </span>
                          <span className="text-[10px] text-[#DFB6B2] mt-0.5">
                            Diferencial: {savingsPct}% vs máx
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Notice */}
        <div className="bg-[#190019] px-4 py-2.5 border-t border-[#522B5B] flex flex-wrap items-center justify-between text-[11px] font-mono text-[#DFB6B2]">
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-[#DFB6B2]" />
            <span>Precios simulados B2B basados en cotizaciones mayoristas 2026.</span>
          </div>
          <div className="text-[#DFB6B2]/80">
            Valores en pesos colombianos (COP) antes de IVA corporativo.
          </div>
        </div>
      </div>
    </div>
  );
};
