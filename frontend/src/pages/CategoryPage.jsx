import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsApi, categoriesApi } from '../api';
import ProductGrid from '../components/products/ProductGrid';
import FilterSidebar from '../components/products/FilterSidebar';
import Pagination from '../components/ui/Pagination';
import Loader from '../components/ui/Loader';
import { ArrowUpDown, ChevronRight } from 'lucide-react';

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [activeFilters, setActiveFilters] = useState({});
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState('newest');

  // Load category info and filters
  useEffect(() => {
    async function loadCategory() {
      try {
        const [catData, filterData] = await Promise.all([
          categoriesApi.getBySlug(slug),
          categoriesApi.getFilters(slug),
        ]);
        setCategory(catData.category);
        setFilters(filterData.filters || {});
      } catch (err) {
        console.error('Failed to load category:', err);
      }
    }
    setActiveFilters({});
    setPriceRange({ min: '', max: '' });
    setPage(1);
    loadCategory();
  }, [slug]);

  // Load products when filters change
  // Calls get_filtered_products STORED PROCEDURE via API
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        per_page: 12,
        sort_by: sortBy,
      };
      if (priceRange.min) params.min_price = priceRange.min;
      if (priceRange.max) params.max_price = priceRange.max;

      // Pass active filters as JSON string
      // The stored procedure uses JSON_EXTRACT to filter
      if (Object.keys(activeFilters).length > 0) {
        params.filters = JSON.stringify(activeFilters);
      }

      const data = await productsApi.getByCategory(slug, params);
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  }, [slug, page, sortBy, activeFilters, priceRange]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleFilterChange = (key, value) => {
    setActiveFilters((prev) => {
      const next = { ...prev };
      if (value === null) {
        delete next[key];
      } else {
        next[key] = value;
      }
      return next;
    });
    setPage(1);
  };

  const handlePriceChange = (type, value) => {
    setPriceRange((prev) => ({ ...prev, [type]: value }));
    // Debounce the actual filter
    setTimeout(() => setPage(1), 500);
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    setPriceRange({ min: '', max: '' });
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/products" className="hover:text-brand-600">Products</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-700 font-medium">{category?.name || slug}</span>
      </nav>

      {/* Category Header */}
      {category && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">{category.name}</h1>
          <p className="text-slate-500 mt-1">{category.description}</p>
          <p className="text-sm text-slate-400 mt-2">
            {totalCount} products found • Filters powered by MySQL JSON functions
          </p>
        </div>
      )}

      {/* Sort Controls */}
      <div className="flex items-center gap-3 mb-6">
        <ArrowUpDown className="w-4 h-4 text-slate-400" />
        <select
          value={sortBy}
          onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
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

      {/* Layout: Sidebar + Grid */}
      <div className="flex gap-8">
        {/* Dynamic JSON-based Filter Sidebar */}
        <FilterSidebar
          filters={filters}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          priceRange={priceRange}
          onPriceChange={handlePriceChange}
          onClearFilters={handleClearFilters}
        />

        {/* Products */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <Loader text="Filtering products..." />
          ) : (
            <>
              <ProductGrid
                products={products}
                emptyMessage="No products match the selected filters. Try removing some filters."
              />
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
