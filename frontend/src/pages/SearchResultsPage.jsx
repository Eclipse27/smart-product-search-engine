import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchApi } from '../api';
import ProductGrid from '../components/products/ProductGrid';
import Pagination from '../components/ui/Pagination';
import Loader from '../components/ui/Loader';
import { Search, ArrowUpDown, Database, Zap, Info } from 'lucide-react';

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState('');
  const [searchMethod, setSearchMethod] = useState('');

  useEffect(() => {
    async function search() {
      if (!query.trim()) {
        setProducts([]);
        setTotalCount(0);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Calls search_products STORED PROCEDURE via API
        // This procedure uses MATCH() AGAINST() for FULLTEXT search
        const params = { q: query, page, per_page: 12 };
        if (sortBy) params.sort_by = sortBy;

        const data = await searchApi.search(params);
        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.totalCount || 0);
        setSearchMethod(data.searchMethod || '');
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    }
    search();
  }, [query, page, sortBy]);

  // Reset page when query changes
  useEffect(() => {
    setPage(1);
    setSortBy('');
  }, [query]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Search Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
            <Search className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Search Results for "<span className="gradient-text">{query}</span>"
            </h1>
            <p className="text-sm text-slate-500">
              {totalCount} product{totalCount !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>

        {/* Search Method Indicator */}
        {searchMethod && (
          <div className={`mt-4 flex items-start gap-3 p-4 rounded-xl border ${
            searchMethod === 'fulltext'
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-amber-50 border-amber-200'
          }`}>
            <div className="flex-shrink-0 mt-0.5">
              {searchMethod === 'fulltext' ? (
                <Database className="w-5 h-5 text-emerald-600" />
              ) : (
                <Info className="w-5 h-5 text-amber-600" />
              )}
            </div>
            <div>
              <p className={`text-sm font-semibold ${
                searchMethod === 'fulltext' ? 'text-emerald-800' : 'text-amber-800'
              }`}>
                {searchMethod === 'fulltext'
                  ? 'MySQL FULLTEXT Search — MATCH() AGAINST() in Natural Language Mode'
                  : 'LIKE Partial Match Fallback — Used for short queries or when FULLTEXT returns no results'
                }
              </p>
              <p className={`text-xs mt-1 ${
                searchMethod === 'fulltext' ? 'text-emerald-600' : 'text-amber-600'
              }`}>
                {searchMethod === 'fulltext'
                  ? 'Results are ranked by MySQL relevance score. Higher scores indicate stronger matches in product name and description.'
                  : 'Results are ranked by name-match proximity. FULLTEXT requires minimum 3 characters and yields no results for this query.'
                }
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Sort Controls */}
      {totalCount > 0 && (
        <div className="flex items-center gap-3 mb-6 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
          <ArrowUpDown className="w-4 h-4 text-slate-400" />
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700
                       focus:outline-none focus:ring-2 focus:ring-brand-500/20 bg-white"
          >
            <option value="">Relevance (Default)</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest First</option>
            <option value="popularity">Most Popular</option>
          </select>

          {/* Relevance score legend */}
          {searchMethod === 'fulltext' && (
            <div className="flex items-center gap-1 ml-auto text-xs text-slate-400">
              <Zap className="w-3 h-3 text-brand-500" />
              Relevance scores shown on cards
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <Loader text={`Searching for "${query}"...`} />
      ) : (
        <>
          <ProductGrid
            products={products}
            emptyMessage={`No products found for "${query}". Try different keywords or check your spelling.`}
          />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
