import { useState, useEffect } from 'react';
import { productsApi } from '../api';
import ProductGrid from '../components/products/ProductGrid';
import Pagination from '../components/ui/Pagination';
import Loader from '../components/ui/Loader';
import { ArrowUpDown } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params = { page, per_page: 12, sort_by: sortBy };
        if (minPrice) params.min_price = minPrice;
        if (maxPrice) params.max_price = maxPrice;

        const data = await productsApi.getAll(params);
        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.totalCount || 0);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page, sortBy, minPrice, maxPrice]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  const handlePriceFilter = () => {
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">All Products</h1>
        <p className="text-slate-500 mt-1">
          Browse our complete catalog • {totalCount} products
        </p>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-white rounded-2xl
                      shadow-sm border border-slate-100">
        {/* Sort */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400" />
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700
                       focus:outline-none focus:ring-2 focus:ring-brand-500/20 bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="popularity">Most Popular</option>
          </select>
        </div>

        {/* Price Range */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min $"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onBlur={handlePriceFilter}
            onKeyDown={(e) => e.key === 'Enter' && handlePriceFilter()}
            className="w-24 px-3 py-2 rounded-lg border border-slate-200 text-sm
                       focus:outline-none focus:ring-1 focus:ring-brand-400"
          />
          <span className="text-slate-400">—</span>
          <input
            type="number"
            placeholder="Max $"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onBlur={handlePriceFilter}
            onKeyDown={(e) => e.key === 'Enter' && handlePriceFilter()}
            className="w-24 px-3 py-2 rounded-lg border border-slate-200 text-sm
                       focus:outline-none focus:ring-1 focus:ring-brand-400"
          />
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <Loader text="Loading products..." />
      ) : (
        <>
          <ProductGrid products={products} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
