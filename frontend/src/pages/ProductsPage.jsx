import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsApi, categoriesApi } from '../api';
import ProductGrid from '../components/products/ProductGrid';
import Pagination from '../components/ui/Pagination';
import Loader from '../components/ui/Loader';
import { ArrowUpDown, Filter, Sparkles, Check } from 'lucide-react';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Load Categories once
  useEffect(() => {
    async function loadCats() {
      try {
        const data = await categoriesApi.getAll();
        setCategories(data.categories || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    loadCats();
  }, []);

  // Fetch Products
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        let data;
        const params = {
          page,
          per_page: 12,
          sort_by: sortBy,
        };
        if (minPrice) params.min_price = minPrice;
        if (maxPrice) params.max_price = maxPrice;
        if (inStockOnly) params.in_stock = 1;

        if (selectedCategory) {
          data = await productsApi.getByCategory(selectedCategory, params);
        } else {
          data = await productsApi.getAll(params);
        }

        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.totalCount || 0);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [page, sortBy, selectedCategory, minPrice, maxPrice, inStockOnly]);

  const handleCategorySelect = (slug) => {
    setSelectedCategory(slug);
    setPage(1);
    if (slug) {
      setSearchParams({ category: slug });
    } else {
      setSearchParams({});
    }
  };

  const handleReset = () => {
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    setInStockOnly(false);
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="space-y-8 pb-16 animate-fade-in">
      {/* Page Header */}
      <div className="border-b border-[#EAD5C5] pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#C77B61] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Catalog Browser</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#49352D]">
              All Products
            </h1>
            <p className="text-sm text-[#765344] mt-1 font-light">
              Showing <span className="font-semibold text-[#49352D]">{totalCount}</span> items in the luxury boutique collection
            </p>
          </div>

          {/* Sort Controls */}
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
              className="px-3 py-2 rounded-xl border border-[#EAD5C5] bg-[#FFFCF7] text-sm text-[#49352D] focus:outline-none focus:ring-1 focus:ring-[#C77B61] cursor-pointer shadow-xs"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
              <option value="popularity">Most Popular (Views)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Ribbon & Category Pills */}
      <div className="bg-[#FFFCF7] border border-[#EAD5C5] rounded-2xl p-4 shadow-sm space-y-4">
        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => handleCategorySelect('')}
            className={`px-4 py-2 rounded-xl text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-all ${
              selectedCategory === ''
                ? 'bg-[#C77B61] text-white shadow-xs'
                : 'bg-[#FCE9DE]/50 text-[#765344] hover:bg-[#FCE9DE]'
            }`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c.category_id}
              onClick={() => handleCategorySelect(c.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-medium uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedCategory === c.slug
                  ? 'bg-[#C77B61] text-white shadow-xs'
                  : 'bg-[#FCE9DE]/50 text-[#765344] hover:bg-[#FCE9DE]'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Refinement Inputs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#EAD5C5]/60 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-[#765344] uppercase tracking-wider">Price:</span>
            <input
              type="number"
              placeholder="Min $"
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value);
                setPage(1);
              }}
              className="w-24 px-3 py-1.5 rounded-lg border border-[#EAD5C5] bg-white text-xs text-[#49352D] focus:outline-none focus:ring-1 focus:ring-[#C77B61]"
            />
            <span className="text-[#A89080]">—</span>
            <input
              type="number"
              placeholder="Max $"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value);
                setPage(1);
              }}
              className="w-24 px-3 py-1.5 rounded-lg border border-[#EAD5C5] bg-white text-xs text-[#49352D] focus:outline-none focus:ring-1 focus:ring-[#C77B61]"
            />

            <label className="flex items-center gap-2 ml-2 cursor-pointer text-[#765344]">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => {
                  setInStockOnly(e.target.checked);
                  setPage(1);
                }}
                className="w-4 h-4 rounded border-[#EAD5C5] text-[#C77B61] focus:ring-[#C77B61] cursor-pointer"
              />
              <span>In Stock Only</span>
            </label>
          </div>

          {(selectedCategory || minPrice || maxPrice || inStockOnly) && (
            <button
              onClick={handleReset}
              className="text-xs text-[#C77B61] hover:text-[#B3684F] font-semibold underline underline-offset-2"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <ProductGrid
        products={products}
        loading={loading}
        emptyMessage="No products match your selected parameters."
        onReset={handleReset}
      />

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={(newPage) => {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </div>
  );
}
