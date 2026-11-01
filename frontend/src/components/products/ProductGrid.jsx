import ProductCard from './ProductCard';
import EmptyState from '../ui/EmptyState';
import { Search } from 'lucide-react';

export default function ProductGrid({ products, loading = false, emptyMessage, onReset }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-[#FFFCF7] border border-[#EAD5C5]/60 rounded-2xl overflow-hidden p-4 shadow-sm animate-pulse"
          >
            <div className="aspect-square bg-[#FCE9DE]/40 rounded-xl mb-4" />
            <div className="h-4 bg-[#FAD8C8]/60 rounded w-1/3 mb-2" />
            <div className="h-5 bg-[#EAD5C5]/60 rounded w-4/5 mb-3" />
            <div className="h-4 bg-[#FCE9DE]/40 rounded w-1/2 mb-4" />
            <div className="flex items-center justify-between pt-2 border-t border-[#EAD5C5]/40">
              <div className="h-6 bg-[#C77B61]/20 rounded w-20" />
              <div className="h-9 w-9 bg-[#C77B61]/20 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title="No treasures discovered"
        description={emptyMessage || "We couldn't find any products matching your specific selection. Try loosening your filters or search keywords."}
        action={
          onReset ? (
            <button
              onClick={onReset}
              className="px-5 py-2.5 rounded-xl bg-[#C77B61] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#B3684F] transition-all"
            >
              Reset Filters
            </button>
          ) : null
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.product_id} product={product} />
      ))}
    </div>
  );
}
