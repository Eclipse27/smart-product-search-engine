import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Sparkles, ArrowRight, Clock } from 'lucide-react';
import { searchApi } from '../../api';

export default function SearchBar({ className = '' }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [history, setHistory] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  // Fetch search history on mount
  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await searchApi.getHistory();
        if (res.history) setHistory(res.history);
      } catch (e) {}
    }
    loadHistory();
  }, []);

  // Debounced Autocomplete (250ms)
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await searchApi.getSuggestions(query.trim());
        setSuggestions(res.suggestions || []);
      } catch (err) {
        console.error('Autocomplete error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleSelectSuggestion = (slug) => {
    setIsOpen(false);
    navigate(`/product/${slug}`);
  };

  const handleSelectHistory = (historyItem) => {
    setQuery(historyItem);
    setIsOpen(false);
    navigate(`/search?q=${encodeURIComponent(historyItem)}`);
  };

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleSearch} className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Try 'samsng moble', 'lapotp', 'wireles earbuds'..."
          className="w-full bg-[#FFFDF9] text-coffee placeholder-cocoa/50 text-sm pl-11 pr-24 py-2.5 rounded-full border border-peach-200 focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-peach-200 shadow-sm transition"
        />

        <Search className="w-4 h-4 text-cocoa/60 absolute left-4 pointer-events-none" />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
            }}
            className="absolute right-16 p-1 text-cocoa/50 hover:text-terracotta transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          type="submit"
          className="absolute right-1.5 bg-terracotta hover:bg-terracotta-600 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm transition"
        >
          Search
        </button>
      </form>

      {/* Autocomplete & History Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#FFFDF9] border border-peach-200 rounded-2xl shadow-xl overflow-hidden z-50 animate-scale-in">
          {/* Recent Searches */}
          {!query && history.length > 0 && (
            <div className="p-4 border-b border-peach-100">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-cocoa/60 mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-terracotta" /> Recent Searches
              </p>
              <div className="flex flex-wrap gap-1.5">
                {history.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectHistory(item)}
                    className="text-xs bg-peach-50 hover:bg-peach-100 text-coffee border border-peach-200 px-3 py-1 rounded-full transition"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Product Suggestions */}
          {suggestions.length > 0 ? (
            <div className="py-2 divide-y divide-peach-100/50">
              <div className="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-cocoa/60 flex items-center justify-between">
                <span>Matching Products</span>
                <span className="text-terracotta lowercase font-normal">MySQL Boolean Mode</span>
              </div>
              {suggestions.map((item) => (
                <div
                  key={item.product_id}
                  onClick={() => handleSelectSuggestion(item.slug)}
                  className="px-4 py-2.5 hover:bg-peach-50 cursor-pointer flex items-center justify-between gap-3 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded-lg border border-peach-200 bg-white flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-coffee truncate">{item.name}</p>
                      <p className="text-[10px] text-terracotta font-semibold">{item.category_name}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-coffee flex-shrink-0">
                    ${parseFloat(item.price).toFixed(2)}
                  </span>
                </div>
              ))}

              <div
                onClick={handleSearch}
                className="px-4 py-3 bg-[#FFF8F0] hover:bg-peach-100 cursor-pointer text-xs font-semibold text-terracotta flex items-center justify-center gap-1.5 transition"
              >
                <span>View all search results for "{query}"</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ) : query && !loading ? (
            <div className="p-4 text-center text-xs text-cocoa/70">
              <p>Press <span className="font-semibold text-coffee">Enter</span> to run typo-tolerant search for <span className="text-terracotta font-semibold">"{query}"</span></p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
