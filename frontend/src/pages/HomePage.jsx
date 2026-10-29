import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Database, Zap, Layers, ArrowRight, ChevronRight, Sparkles } from 'lucide-react';
import { categoriesApi, productsApi } from '../api';
import ProductCard from '../components/products/ProductCard';
import Loader from '../components/ui/Loader';
import SearchBar from '../components/search/SearchBar';

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [catData, prodData] = await Promise.all([
          categoriesApi.getAll(),
          productsApi.getAll({ per_page: 8, sort_by: 'rating' }),
        ]);
        setCategories(catData.categories || []);
        setFeaturedProducts(prodData.products || []);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Loader text="Loading homepage..." />;

  return (
    <div className="animate-fade-in">
      {/* ========== HERO SECTION ========== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-violet-900">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                            bg-white/10 backdrop-blur-sm border border-white/10 mb-6">
              <Database className="w-4 h-4 text-brand-300" />
              <span className="text-sm font-medium text-brand-200">
                Powered by Advanced MySQL Intelligence
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              Discover Products with{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-300 to-violet-300">
                Smart Search
              </span>
            </h1>

            <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Experience intelligent product search powered by MySQL FULLTEXT Search,
              relevance ranking, and dynamic JSON-based filtering — all processed at the database layer.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto mb-8">
              <SearchBar />
            </div>

            <p className="text-sm text-slate-400">
              Try: <Link to="/search?q=wireless" className="text-brand-300 hover:text-brand-200 font-medium">wireless</Link>
              {' · '}
              <Link to="/search?q=samsung" className="text-brand-300 hover:text-brand-200 font-medium">samsung</Link>
              {' · '}
              <Link to="/search?q=laptop" className="text-brand-300 hover:text-brand-200 font-medium">laptop</Link>
              {' · '}
              <Link to="/search?q=cotton" className="text-brand-300 hover:text-brand-200 font-medium">cotton</Link>
            </p>
          </div>
        </div>
      </section>

      {/* ========== FEATURES SECTION ========== */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: 'FULLTEXT Smart Search',
                desc: 'MySQL MATCH() AGAINST() with Natural Language Mode provides relevance-scored search results.',
                color: 'from-brand-500 to-brand-600',
              },
              {
                icon: Layers,
                title: 'Dynamic JSON Filters',
                desc: 'Category-specific attributes stored in MySQL JSON columns with dynamic extraction and filtering.',
                color: 'from-violet-500 to-violet-600',
              },
              {
                icon: Sparkles,
                title: 'Search Autocomplete',
                desc: 'Real-time suggestions using FULLTEXT Boolean Mode with wildcard prefix matching.',
                color: 'from-amber-500 to-orange-500',
              },
            ].map((feature, i) => (
              <div key={i} className="text-center p-6 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${feature.color}
                                flex items-center justify-center shadow-lg mb-4`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CATEGORIES SECTION ========== */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Browse Categories</h2>
              <p className="text-sm text-slate-500 mt-1">Explore products with dynamic JSON-based filters</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.category_id}
                to={`/category/${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl aspect-[4/3] bg-slate-900"
              >
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-60
                             group-hover:opacity-40 group-hover:scale-105 transition-all duration-500"
                  onError={(e) => { e.target.style.opacity = '0.2'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-base mb-1">{cat.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-300">{cat.product_count} products</span>
                    <ChevronRight className="w-3 h-3 text-white/60 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FEATURED PRODUCTS SECTION ========== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Top Rated Products</h2>
              <p className="text-sm text-slate-500 mt-1">Highest rated items from our catalog</p>
            </div>
            <Link
              to="/products"
              className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
