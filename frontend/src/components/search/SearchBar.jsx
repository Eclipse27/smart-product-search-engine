import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, X, TrendingUp } from 'lucide-react';
import { searchApi } from '../../api';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced autocomplete — calls MySQL stored procedure via API
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await searchApi.getSuggestions(query.trim());
        setSuggestions(data.suggestions || []);
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const clearQuery = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Search products, brands, categories..."
          className="w-full pl-12 pr-12 py-3 rounded-2xl border border-slate-200 bg-white/90
                     text-slate-800 placeholder:text-slate-400 text-sm
                     focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400
                     shadow-sm hover:shadow transition-all duration-200"
          id="search-input"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={clearQuery}
            className="absolute right-14 top-1/2 -translate-y-1/2 p-1 text-slate-400
                       hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-xl
                     bg-brand-600 text-white text-sm font-medium
                     hover:bg-brand-700 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Autocomplete suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-slate-100
                        z-50 overflow-hidden animate-slide-down">
          <div className="px-4 py-2 border-b border-slate-100">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              {isLoading ? 'Searching...' : 'Suggestions'}
            </span>
          </div>
          <ul className="py-1 max-h-80 overflow-y-auto">
            {suggestions.map((item) => (
              <li key={item.product_id}>
                <Link
                  to={`/product/${item.slug}`}
                  onClick={() => { setShowSuggestions(false); setQuery(''); }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-brand-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                    <img
                      src={item.image_url}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{item.name}</p>
                    <p className="text-xs text-slate-400">{item.category_name}</p>
                  </div>
                  <span className="text-sm font-semibold text-brand-600">
                    ${parseFloat(item.price).toFixed(2)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="px-4 py-2 border-t border-slate-100">
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700
                         font-medium transition-colors w-full"
            >
              <TrendingUp className="w-4 h-4" />
              View all results for "{query}"
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
