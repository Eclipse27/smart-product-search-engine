import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsApi, categoriesApi } from '../api';
import ProductGrid from '../components/products/ProductGrid';
import FilterSidebar from '../components/products/FilterSidebar';
import Pagination from '../components/ui/Pagination';
import Loader from '../components/ui/Loader';
import { ArrowUpDown, ChevronRight, Layers, Database } from 'lucide-react';

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

  // Load products when filters change via get_filtered_products STORED PROCEDURE
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

      // Pass active filters as JSON string for MySQL JSON_EXTRACT / JSON_CONTAINS
      if (Object.keys(activeFilters).length > 0) {
        params.filters = JSON.stringify(activeFilters);
      }

      const data = await productsApi.getByCategory(slug, params);
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      console.error('Failed to load category products:', err);
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
    setPage(1);
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    setPriceRange({ min: '', max: '' });
    setPage(1);
  };

  return (
    <div className="space-y-8 pb-16 animate-fade-in">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-[#765344]">
        <Link to="/" className="hover:text-[#C77B61] transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#A89080]" />
        <Link to="/products" className="hover:text-[#C77B61] transition-colors">Categories</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#A89080]" />
        <span className="font-semibold text-[#49352D]">{category?.name || slug}</span>
      </nav>

      {/* Category Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FCE9DE] via-[#FAD8C8] to-[#EAD5C5] border border-[#EAD5C5] p-6 sm:p-10 shadow-sm">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 text-[#C77B61] text-xs font-semibold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Dynamic JSON Attribute Filtering (Module 2)</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#49352D]">
            {category?.name || 'Category Collection'}
          </h1>
          <p className="text-sm text-[#765344] font-light leading-relaxed max-w-xl">
            {category?.description || 'Explore our handpicked boutique items with database-level JSON filtering.'}
          </p>
          <div className="pt-2 text-xs text-[#765344] font-mono">
            <span>Query: </span>
            <code className="bg-[#FFFCF7] px-2 py-0.5 rounded border border-[#EAD5C5] text-[#49352D]">
              CALL get_filtered_products(&apos;{slug}&apos;, ...)
            </code>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Sidebar + Grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Dynamic JSON Filter Sidebar */}
        <FilterSidebar
          filters={filters}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          priceRange={priceRange}
          onPriceChange={handlePriceChange}
          onClearFilters={handleClearFilters}
        />

        {/* Product Listing Area */}
        <div className="flex-1 space-y-6">
          {/* Header Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#FFFCF7] rounded-2xl border border-[#EAD5C5] shadow-xs">
            <span className="text-xs text-[#765344]">
              Found <strong className="text-[#49352D]">{totalCount}</strong> products in this category
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#765344] flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#C77B61]" /> Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-1.5 rounded-xl border border-[#EAD5C5] bg-white text-xs text-[#49352D] focus:outline-none focus:ring-1 focus:ring-[#C77B61] cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="popularity">Most Popular</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <ProductGrid
            products={products}
            loading={loading}
            emptyMessage="No products match these attributes in this category."
            onReset={handleClearFilters}
          />

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={(p) => {
                setPage(p);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
