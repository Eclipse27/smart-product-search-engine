import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchApi } from '../api';
import ProductGrid from '../components/products/ProductGrid';
import Pagination from '../components/ui/Pagination';
import Loader from '../components/ui/Loader';
import SearchBar from '../components/search/SearchBar';
import { Search, ArrowUpDown, Database, Zap, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawQuery = searchParams.get('q') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState('');
  const [searchMethod, setSearchMethod] = useState('');
  const [normalizedQuery, setNormalizedQuery] = useState('');
  const [isCorrected, setIsCorrected] = useState(false);

  useEffect(() => {
    async function executeSearch() {
      if (!rawQuery.trim()) {
        setProducts([]);
        setTotalCount(0);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const params = { q: rawQuery, page, per_page: 12 };
        if (sortBy) params.sort_by = sortBy;

        const data = await searchApi.search(params);
        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.totalCount || 0);
        setSearchMethod(data.searchMethod || 'fulltext');
        setNormalizedQuery(data.query || rawQuery);
        setIsCorrected(Boolean(data.isCorrected));
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    }

    executeSearch();
  }, [rawQuery, page, sortBy]);

  useEffect(() => {
    setPage(1);
    setSortBy('');
  }, [rawQuery]);

  const methodBadgeText = () => {
    switch (searchMethod) {
      case 'fulltext_exact':
        return 'MySQL FULLTEXT MATCH() AGAINST() [Exact Natural Language]';
      case 'fulltext_normalized':
        return 'Typo Auto-Corrected + MySQL FULLTEXT MATCH() AGAINST()';
      case 'phonetic_soundex':
        return 'Phonetic Soundex Match + Relevance Boost';
      case 'fuzzy_levenshtein':
        return 'MySQL fn_levenshtein() Stored Function Edit Distance Match';
      case 'like_fallback':
        return 'Pattern Match & Token Substring Fallback';
      default:
        return 'Advanced MySQL Search Intelligence Layer';
    }
  };

  return (
    <div className="space-y-8 pb-16 animate-fade-in">
      {/* Top Search Bar */}
      <div className="max-w-2xl mx-auto">
        <SearchBar initialQuery={rawQuery} />
      </div>

      {/* Header Results */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EAD5C5] pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C77B61]">
              Search Discovery (Module 1)
            </span>
            <h1 className="font-serif text-3xl font-normal text-[#49352D] mt-1">
              Results for &ldquo;{rawQuery}&rdquo;
            </h1>
            <p className="text-xs text-[#765344] mt-1">
              Discovered <strong className="text-[#49352D]">{totalCount}</strong> relevant items
            </p>
          </div>

          {/* Sort */}
          {products.length > 0 && (
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
                className="px-3 py-1.5 rounded-xl border border-[#EAD5C5] bg-[#FFFCF7] text-xs text-[#49352D] focus:outline-none focus:ring-1 focus:ring-[#C77B61] cursor-pointer"
              >
                <option value="">Relevance Score (SQL MATCH)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          )}
        </div>

        {/* Typo Correction Banner */}
        {isCorrected && (
          <div className="p-4 rounded-2xl bg-[#FCE9DE] border border-[#FAD8C8] flex items-start gap-3 shadow-xs">
            <Zap className="w-5 h-5 text-[#C77B61] flex-shrink-0 mt-0.5" />
            <div className="text-xs text-[#765344] space-y-1">
              <p className="font-semibold text-[#49352D] text-sm">
                Showing results for{' '}
                <span className="text-[#C77B61] font-bold">&ldquo;{normalizedQuery}&rdquo;</span>
              </p>
              <p>
                Spelling correction applied. Search query <span className="line-through">&ldquo;{rawQuery}&rdquo;</span> was automatically matched using SQL typo tolerance and phonetic analysis.
              </p>
            </div>
          </div>
        )}

        {/* SQL Intelligence Method Banner */}
        <div className="p-3.5 rounded-xl bg-[#FFFCF7] border border-[#EAD5C5] flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-[#765344]">
            <Database className="w-4 h-4 text-[#C77B61] flex-shrink-0" />
            <span>
              <strong>Execution Engine:</strong> {methodBadgeText()}
            </span>
          </div>
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#FCE9DE] text-[#C77B61] font-mono font-semibold text-[11px]">
            CALL search_products()
          </span>
        </div>
      </div>

      {/* Grid */}
      <ProductGrid
        products={products}
        loading={loading}
        emptyMessage={`No products found for "${rawQuery}". Try checking for spelling or searching for broader terms like "phone", "coffee", "wireless", "shoes".`}
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
  );
}
