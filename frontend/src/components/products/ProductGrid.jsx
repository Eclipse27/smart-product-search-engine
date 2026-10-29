import ProductCard from './ProductCard';
import EmptyState from '../ui/EmptyState';
import { Search } from 'lucide-react';

export default function ProductGrid({ products, emptyMessage }) {
  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={Search}
        title="No products found"
        description={emptyMessage || 'Try adjusting your search or filters to find what you\'re looking for.'}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {products.map((product) => (
        <ProductCard key={product.product_id} product={product} />
      ))}
    </div>
  );
}
