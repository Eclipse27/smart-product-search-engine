import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  TrendingUp,
  Award,
  Layers,
  ArrowRight,
  Database,
  Search,
  Cpu,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { categoriesApi, productsApi } from '../api';
import ProductCard from '../components/products/ProductCard';
import ProductGrid from '../components/products/ProductGrid';
import SearchBar from '../components/search/SearchBar';
import Loader from '../components/ui/Loader';

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [catsRes, trendingRes, recsRes, bestRes] = await Promise.all([
          categoriesApi.getAll(),
          productsApi.getTrending({ limit: 4 }),
          productsApi.getRecommendations({ limit: 4 }),
          productsApi.getBestSellers({ limit: 4 }),
        ]);

        setCategories(catsRes.categories || []);
        setTrendingProducts(trendingRes.products || []);
        setRecommendations(recsRes.recommendations || []);
        setBestSellers(bestRes.products || []);
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <Loader text="Unveiling curated boutique collection..." />;
  }

  return (
    <div className="space-y-16 pb-20">
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FCE9DE] via-[#FAD8C8] to-[#EAD5C5] border border-[#EAD5C5] p-8 sm:p-14 shadow-sm">
        {/* Soft background accents */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#C77B61]/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-[#EAD5C5] text-[#765344] text-xs font-semibold uppercase tracking-widest shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C77B61]" />
            <span>Advanced MySQL 8.0 Intelligence Engine</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl text-[#49352D] font-normal tracking-tight leading-tight">
            Elevated Shopping, Powered by{' '}
            <span className="font-cursive text-5xl sm:text-7xl text-[#C77B61] block sm:inline font-bold">
              Intelligent SQL
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#765344] max-w-2xl mx-auto font-light leading-relaxed">
            Experience lightning-fast product discovery with typo-tolerant FULLTEXT scoring,
            dynamic JSON attribute filtering, and collaborative recommendation queries computed directly inside the database.
          </p>

          {/* Hero Search Bar */}
          <div className="max-w-2xl mx-auto pt-2">
            <SearchBar />
          </div>

          {/* Quick Typo Test Pills */}
          <div className="pt-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#765344] block mb-2">
              Try Typo-Tolerant Search Demo:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              {[
                { label: 'blu tooth headfones', target: 'blu tooth headfones' },
                { label: 'nik shooes', target: 'nik shooes' },
                { label: 'samsng moble', target: 'samsng moble' },
                { label: 'lapotp', target: 'lapotp' },
                { label: 'wireles earbuds', target: 'wireles earbuds' },
              ].map((item) => (
                <Link
                  key={item.target}
                  to={`/search?q=${encodeURIComponent(item.target)}`}
                  className="px-3 py-1.5 rounded-full bg-[#FFFCF7] border border-[#EAD5C5] text-[#765344] hover:bg-[#C77B61] hover:text-white hover:border-[#C77B61] transition-all shadow-xs"
                >
                  &ldquo;{item.label}&rdquo;
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= ARCHITECTURAL INTELLIGENCE TICKER ================= */}
      <section className="bg-[#FFFCF7] border border-[#EAD5C5] rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1 border-r border-[#EAD5C5] last:border-0 pr-4">
            <div className="inline-flex p-2 rounded-xl bg-[#FCE9DE] text-[#C77B61] mb-1">
              <Search className="w-5 h-5" />
            </div>
            <div className="font-serif text-xl font-bold text-[#49352D]">FULLTEXT</div>
            <p className="text-xs text-[#765344]">MATCH() AGAINST() Natural & Boolean Search</p>
          </div>

          <div className="space-y-1 border-r border-[#EAD5C5] last:border-0 pr-4">
            <div className="inline-flex p-2 rounded-xl bg-[#FCE9DE] text-[#C77B61] mb-1">
              <Zap className="w-5 h-5" />
            </div>
            <div className="font-serif text-xl font-bold text-[#49352D]">Fuzzy + Soundex</div>
            <p className="text-xs text-[#765344]">Levenshtein edit-distance & phonetic correction</p>
          </div>

          <div className="space-y-1 border-r border-[#EAD5C5] last:border-0 pr-4">
            <div className="inline-flex p-2 rounded-xl bg-[#FCE9DE] text-[#C77B61] mb-1">
              <Layers className="w-5 h-5" />
            </div>
            <div className="font-serif text-xl font-bold text-[#49352D]">JSON Schemas</div>
            <p className="text-xs text-[#765344]">Dynamic category attributes JSON_EXTRACT()</p>
          </div>

          <div className="space-y-1">
            <div className="inline-flex p-2 rounded-xl bg-[#FCE9DE] text-[#C77B61] mb-1">
              <Database className="w-5 h-5" />
            </div>
            <div className="font-serif text-xl font-bold text-[#49352D]">Window Functions</div>
            <p className="text-xs text-[#765344]">RANK() & DENSE_RANK() OVER(PARTITION BY)</p>
          </div>
        </div>
      </section>

      {/* ================= EXPLORE CATEGORIES ================= */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-[#EAD5C5] pb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C77B61]">
              Curated Collections
            </span>
            <h2 className="font-serif text-3xl font-normal text-[#49352D] mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/products"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#C77B61] hover:text-[#B3684F]"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.category_id}
              to={`/category/${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-[#FFFCF7] border border-[#EAD5C5] p-5 hover:border-[#C77B61] transition-all hover:shadow-md"
            >
              <div className="aspect-square w-full rounded-xl overflow-hidden bg-[#FCE9DE]/40 mb-3">
                <img
                  src={cat.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-serif text-base font-bold text-[#49352D] group-hover:text-[#C77B61] transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-[#765344] mt-0.5 line-clamp-1">{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= TRENDING NOW (MODULE 4) ================= */}
      {trendingProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-[#EAD5C5] pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#C77B61]">
                <TrendingUp className="w-4 h-4" />
                <span>Real-Time Pulse (Module 4)</span>
              </div>
              <h2 className="font-serif text-3xl font-normal text-[#49352D] mt-1">
                Trending Right Now
              </h2>
            </div>
            <Link
              to="/ranking?metric=views"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#C77B61] hover:text-[#B3684F]"
            >
              <span>Explore Analytics</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((p) => (
              <ProductCard key={p.product_id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ================= CURATED RECOMMENDATIONS (MODULE 3) ================= */}
      {recommendations.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-[#EAD5C5] pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#C77B61]">
                <Sparkles className="w-4 h-4" />
                <span>Collaborative Intelligence (Module 3)</span>
              </div>
              <h2 className="font-serif text-3xl font-normal text-[#49352D] mt-1">
                Recommended For You
              </h2>
            </div>
            <Link
              to="/products"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#C77B61] hover:text-[#B3684F]"
            >
              <span>More Recommendations</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((p) => (
              <ProductCard key={p.product_id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ================= BEST SELLERS (MODULE 4) ================= */}
      {bestSellers.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-[#EAD5C5] pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#C77B61]">
                <Award className="w-4 h-4" />
                <span>Proven Favorites (Module 4)</span>
              </div>
              <h2 className="font-serif text-3xl font-normal text-[#49352D] mt-1">
                All-Time Best Sellers
              </h2>
            </div>
            <Link
              to="/ranking?metric=sales"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#C77B61] hover:text-[#B3684F]"
            >
              <span>Sales Leaderboard</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((p) => (
              <ProductCard key={p.product_id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ================= MODULE 5 SHOWCASE TEASER ================= */}
      <section className="rounded-3xl bg-[#FFFCF7] border border-[#EAD5C5] p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FCE9DE] text-[#C77B61] text-xs font-semibold uppercase tracking-widest">
            <Cpu className="w-3.5 h-3.5" />
            <span>Module 5: SQL Window Functions</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#49352D] font-bold">
            Interactive Product Ranking Engine
          </h3>
          <p className="text-sm text-[#765344] leading-relaxed">
            Inspect real-time analytical SQL queries utilizing <code className="px-1.5 py-0.5 rounded bg-[#FCE9DE] text-[#49352D] font-mono text-xs">ROW_NUMBER()</code>,{' '}
            <code className="px-1.5 py-0.5 rounded bg-[#FCE9DE] text-[#49352D] font-mono text-xs">RANK()</code>, and{' '}
            <code className="px-1.5 py-0.5 rounded bg-[#FCE9DE] text-[#49352D] font-mono text-xs">DENSE_RANK()</code> partitioned by category.
          </p>
        </div>
        <Link
          to="/ranking"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#C77B61] text-white font-medium text-sm hover:bg-[#B3684F] shadow-sm hover:shadow-md transition-all whitespace-nowrap"
        >
          <span>Launch Ranking Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
