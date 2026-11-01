import { useState } from 'react';
import { SlidersHorizontal, X, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

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

  const hasActiveFilters =
    Object.keys(activeFilters).length > 0 ||
    Boolean(priceRange.min) ||
    Boolean(priceRange.max);

  const filterContent = (
    <div className="space-y-6">
      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pb-4 border-b border-[#EAD5C5]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#765344]">
              Active Filters
            </span>
            <button
              onClick={onClearFilters}
              className="inline-flex items-center gap-1 text-xs text-[#C77B61] hover:text-[#B3684F] font-medium transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {priceRange.min && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FCE9DE] text-[#765344] text-xs font-medium border border-[#FAD8C8]">
                Min: ${priceRange.min}
                <button
                  onClick={() => onPriceChange('min', '')}
                  className="hover:text-[#49352D] ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {priceRange.max && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FCE9DE] text-[#765344] text-xs font-medium border border-[#FAD8C8]">
                Max: ${priceRange.max}
                <button
                  onClick={() => onPriceChange('max', '')}
                  className="hover:text-[#49352D] ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {Object.entries(activeFilters).map(([key, value]) => (
              <span
                key={key}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FCE9DE] text-[#765344] text-xs font-medium border border-[#FAD8C8]"
              >
                <span className="capitalize">{key}:</span> {value}
                <button
                  onClick={() => onFilterChange(key, null)}
                  className="hover:text-[#49352D] ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="pb-5 border-b border-[#EAD5C5]">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#765344] mb-3">
          Price Range ($)
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] text-[#A89080] mb-1 block">Minimum</label>
            <input
              type="number"
              placeholder="$0"
              value={priceRange.min || ''}
              onChange={(e) => onPriceChange('min', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#EAD5C5] bg-[#FFFCF7] text-sm text-[#49352D] placeholder-[#CBBBB0] focus:outline-none focus:ring-1 focus:ring-[#C77B61]"
            />
          </div>
          <div>
            <label className="text-[11px] text-[#A89080] mb-1 block">Maximum</label>
            <input
              type="number"
              placeholder="$5000"
              value={priceRange.max || ''}
              onChange={(e) => onPriceChange('max', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#EAD5C5] bg-[#FFFCF7] text-sm text-[#49352D] placeholder-[#CBBBB0] focus:outline-none focus:ring-1 focus:ring-[#C77B61]"
            />
          </div>
        </div>
      </div>

      {/* Dynamic JSON-based attribute filters */}
      {Object.entries(filters).map(([key, filterData]) => {
        const isExpanded = expandedSections[key] !== false;
        const values = filterData.values || [];

        if (values.length === 0) return null;

        return (
          <div key={key} className="pb-5 border-b border-[#EAD5C5] last:border-0">
            <button
              onClick={() => toggleSection(key)}
              className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-wider text-[#765344] mb-2 hover:text-[#C77B61] transition-colors"
            >
              <span>{filterData.label || key.replace(/_/g, ' ')}</span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-[#A89080]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#A89080]" />
              )}
            </button>

            {isExpanded && (
              <div className="space-y-1.5 mt-2 max-h-52 overflow-y-auto pr-1">
                {values.map((v) => {
                  const valStr = typeof v === 'object' ? v.value || JSON.stringify(v) : String(v);
                  const isChecked = activeFilters[key] === valStr;

                  return (
                    <label
                      key={valStr}
                      className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm text-[#49352D] hover:bg-[#FCE9DE]/40 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onFilterChange(key, isChecked ? null : valStr)}
                        className="w-4 h-4 rounded border-[#EAD5C5] text-[#C77B61] focus:ring-[#C77B61] focus:ring-offset-0 cursor-pointer"
                      />
                      <span className={`text-xs ${isChecked ? 'font-semibold text-[#C77B61]' : ''}`}>
                        {valStr}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#FFFCF7] border border-[#EAD5C5] rounded-xl text-sm font-medium text-[#765344] shadow-sm hover:bg-[#FCE9DE]/30"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#C77B61]" />
          <span>Filters & Refinements</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-[#C77B61]" />
          )}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="bg-[#FFFCF7] border border-[#EAD5C5] rounded-2xl p-5 shadow-sm sticky top-24">
          <div className="flex items-center gap-2 pb-4 border-b border-[#EAD5C5] mb-5">
            <SlidersHorizontal className="w-4 h-4 text-[#C77B61]" />
            <h2 className="font-serif text-lg font-bold text-[#49352D]">Refine Catalog</h2>
          </div>
          {filterContent}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-[#49352D]/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-[#FFF8F0] shadow-xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAD5C5] mb-5">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#C77B61]" />
                <h2 className="font-serif text-lg font-bold text-[#49352D]">Filters</h2>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 rounded-lg text-[#765344] hover:bg-[#FCE9DE]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {filterContent}
            <div className="mt-8 pt-4 border-t border-[#EAD5C5]">
              <button
                onClick={() => setMobileOpen(false)}
                className="w-full py-3 bg-[#C77B61] text-white rounded-xl text-sm font-medium hover:bg-[#B3684F] shadow-sm transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
