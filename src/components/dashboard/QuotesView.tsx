import React, { useState } from 'react';
import { useInventoryStore } from '../../store/useInventoryStore';
import { 
  Search, 
  Building2, 
  TrendingDown, 
  Truck,
  Layers
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
    <div className="space-y-5">
      {/* Search and Category Filter Header */}
      <div className="bg-white rounded-2xl border border-brand-300/50 p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <span className="font-mono text-xs text-stone-500 uppercase mr-1">
            Categoría:
          </span>
          {['Todas', 'RAM DDR5', 'SSD NVMe', 'Fuentes de Poder'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-brand-600 text-white border-brand-600 shadow-sm font-semibold'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Component Search Input */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={componentSearch}
            onChange={(e) => setComponentSearch(e.target.value)}
            placeholder="Buscar por componente, marca o SKU..."
            className="w-full pl-9 pr-3 py-2 bg-stone-50/80 border border-brand-300/60 rounded-xl text-stone-800 placeholder-stone-400 text-xs focus:bg-white focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 transition"
          />
        </div>
      </div>

      {/* Suppliers Comparison Table */}
      <div className="bg-white rounded-2xl border border-brand-300/50 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-brand-300/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-100 border border-brand-300/60 flex items-center justify-center text-brand-600">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">
                Cotizaciones de Componentes & Repuestos TI
              </h3>
              <p className="text-xs text-stone-500">
                Comparativa de precios B2B en tiempo real entre 3 mayoristas autorizados
              </p>
            </div>
          </div>
          <span className="font-mono text-xs text-stone-500 font-semibold bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200">
            {filteredQuotes.length} repuestos
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 text-stone-500 font-mono text-[11px] uppercase tracking-wider border-b border-brand-300/40">
                <th className="py-3.5 px-4 sm:px-5 w-1/3">Componente & Especificaciones</th>
                <th className="py-3.5 px-4 sm:px-5">
                  <div className="flex flex-col">
                    <span className="text-stone-900 font-bold">Proveedor Alfa</span>
                    <span className="text-[10px] text-stone-500 font-normal">Mayorista Alfa Tech</span>
                  </div>
                </th>
                <th className="py-3.5 px-4 sm:px-5">
                  <div className="flex flex-col">
                    <span className="text-stone-900 font-bold">Proveedor Beta</span>
                    <span className="text-[10px] text-stone-500 font-normal">Suministros IT Beta</span>
                  </div>
                </th>
                <th className="py-3.5 px-4 sm:px-5">
                  <div className="flex flex-col">
                    <span className="text-stone-900 font-bold">Proveedor Gamma</span>
                    <span className="text-[10px] text-stone-500 font-normal">Hardware Global Gamma</span>
                  </div>
                </th>
                <th className="py-3.5 px-4 sm:px-5 text-right">Mejor Opción & Ahorro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-300/30 text-stone-800">
              {filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-stone-500">
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
                    <tr key={item.id} className="hover:bg-brand-100/20 transition-colors">
                      {/* Component info */}
                      <td className="py-3.5 px-4 sm:px-5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] uppercase bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-semibold border border-stone-200">
                            {item.category}
                          </span>
                          <span className="font-mono text-[11px] text-stone-500">
                            SKU: {item.sku}
                          </span>
                        </div>
                        <h4 className="font-semibold text-stone-900 text-xs mt-1">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-stone-500 mt-0.5 font-mono">
                          {item.specs}
                        </p>
                      </td>

                      {/* Proveedor Alfa */}
                      <td className={`py-3.5 px-4 sm:px-5 font-mono ${pAlfa === minPrice ? 'bg-emerald-50/50' : ''}`}>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-bold ${pAlfa === minPrice ? 'text-emerald-700' : 'text-stone-900'}`}>
                            {formatCOP(pAlfa)}
                          </span>
                          {pAlfa === minPrice && (
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.2 rounded font-bold font-mono">
                              MEJOR
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-stone-500 mt-0.5">
                          Stock: {item.stock.alfa} unids.
                        </div>
                        <div className="text-[10px] text-stone-400 flex items-center gap-1">
                          <Truck className="w-3 h-3" /> 24-48 hrs
                        </div>
                      </td>

                      {/* Proveedor Beta */}
                      <td className={`py-3.5 px-4 sm:px-5 font-mono ${pBeta === minPrice ? 'bg-emerald-50/50' : ''}`}>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-bold ${pBeta === minPrice ? 'text-emerald-700' : 'text-stone-900'}`}>
                            {formatCOP(pBeta)}
                          </span>
                          {pBeta === minPrice && (
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.2 rounded font-bold font-mono">
                              MEJOR
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-stone-500 mt-0.5">
                          Stock: {item.stock.beta} unids.
                        </div>
                        <div className="text-[10px] text-stone-400 flex items-center gap-1">
                          <Truck className="w-3 h-3" /> 3-5 Días
                        </div>
                      </td>

                      {/* Proveedor Gamma */}
                      <td className={`py-3.5 px-4 sm:px-5 font-mono ${pGamma === minPrice ? 'bg-emerald-50/50' : ''}`}>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-bold ${pGamma === minPrice ? 'text-emerald-700' : 'text-stone-900'}`}>
                            {formatCOP(pGamma)}
                          </span>
                          {pGamma === minPrice && (
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.2 rounded font-bold font-mono">
                              MEJOR
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-stone-500 mt-0.5">
                          Stock: {item.stock.gamma} unids.
                        </div>
                        <div className="text-[10px] text-stone-400 flex items-center gap-1">
                          <Truck className="w-3 h-3" /> Mismo Día
                        </div>
                      </td>

                      {/* Delta de Ahorro */}
                      <td className="py-3.5 px-4 sm:px-5 text-right font-mono">
                        <div className="inline-flex flex-col items-end">
                          <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                            <TrendingDown className="w-3.5 h-3.5" />
                            Ahorro: {formatCOP(maxSavings)}
                          </span>
                          <span className="text-[10px] text-stone-500 mt-0.5">
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
        <div className="bg-stone-50 px-4 sm:px-5 py-3 border-t border-brand-300/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-brand-600" />
            <span>Precios B2B sincronizados con convenios mayoristas vigentes 2026.</span>
          </div>
          <div className="text-stone-400 font-mono text-[11px]">
            Valores en pesos colombianos (COP) antes de IVA.
          </div>
        </div>
      </div>
    </div>
  );
};
