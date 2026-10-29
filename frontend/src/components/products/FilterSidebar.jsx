import { useState } from 'react';
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';

export default function FilterSidebar({
  filters = {},
  activeFilters = {},
  onFilterChange,
  priceRange = {},
  onPriceChange,
  onClearFilters,
}) {
  const [expandedSections, setExpandedSections] = useState({});
  const [isMobileOpen, setMobileOpen] = useState(false);

  const toggleSection = (key) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0 ||
    priceRange.min || priceRange.max;

  const filterContent = (
    <div className="space-y-5">
      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pb-4 border-b border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-700">Active Filters</span>
            <button
              onClick={onClearFilters}
              className="text-xs text-brand-600 hover:text-brand-700 font-medium"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([key, value]) => (
              <span
                key={key}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                           bg-brand-50 text-brand-700 text-xs font-medium border border-brand-200"
              >
                {value}
                <button
                  onClick={() => onFilterChange(key, null)}
                  className="hover:text-brand-900 ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="pb-4 border-b border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Price Range</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min || ''}
            onChange={(e) => onPriceChange('min', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm
                       focus:outline-none focus:ring-1 focus:ring-brand-400"
          />
          <span className="text-slate-400 text-sm">—</span>
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max || ''}
            onChange={(e) => onPriceChange('max', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm
                       focus:outline-none focus:ring-1 focus:ring-brand-400"
          />
        </div>
      </div>

      {/* Dynamic JSON-based attribute filters */}
      {Object.entries(filters).map(([key, filterData]) => {
        const isExpanded = expandedSections[key] !== false; // default open
        const values = filterData.values || [];

        if (values.length === 0) return null;

        return (
          <div key={key} className="pb-4 border-b border-slate-200 last:border-0">
            <button
              onClick={() => toggleSection(key)}
              className="flex items-center justify-between w-full text-sm font-semibold text-slate-700 mb-2"
            >
              {filterData.label || key}
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isExpanded && (
              <div className="space-y-1.5 mt-2 max-h-48 overflow-y-auto">
                {values.map((v) => (
                  <button
                    key={v.attribute_value}
                    onClick={() =>
                      onFilterChange(
                        key,
                        activeFilters[key] === v.attribute_value ? null : v.attribute_value
                      )
                    }
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm
                                transition-colors ${
                                  activeFilters[key] === v.attribute_value
                                    ? 'bg-brand-50 text-brand-700 font-medium border border-brand-200'
                                    : 'text-slate-600 hover:bg-slate-50'
                                }`}
                  >
                    <span className="truncate">{v.attribute_value}</span>
                    <span className="text-xs text-slate-400 ml-2">({v.product_count})</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Mobile filter toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200
                   text-sm font-medium text-slate-600 hover:bg-slate-50 mb-4"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
        {hasActiveFilters && (
          <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center">
            {Object.keys(activeFilters).length}
          </span>
        )}
      </button>

      {/* Mobile sidebar overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl p-6 overflow-y-auto animate-slide-down">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800">Filters</h2>
              <button onClick={() => setMobileOpen(false)} className="p-1 text-slate-500 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sticky top-24">
          <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-brand-500" />
            Filters
          </h2>
          {filterContent}
        </div>
      </aside>
    </>
  );
}
