import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productsApi, categoriesApi } from '../api';
import Loader from '../components/ui/Loader';
import Rating from '../components/ui/Rating';
import {
  Cpu,
  Layers,
  ArrowUpDown,
  Code2,
  Database,
  Eye,
  ShoppingBag,
  Star,
  Award,
  Sparkles,
} from 'lucide-react';

export default function RankingDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialMetric = searchParams.get('metric') || 'rating';

  const [metric, setMetric] = useState(initialMetric);
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [rankedProducts, setRankedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load Categories
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

  // Fetch Ranked Products
  useEffect(() => {
    async function loadRanked() {
      setLoading(true);
      try {
        const params = { metric };
        if (categoryId) params.category_id = categoryId;
        const data = await productsApi.getRanking(params);
        setRankedProducts(data.ranked_products || []);
      } catch (err) {
        console.error('Failed to fetch ranked products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRanked();
  }, [metric, categoryId]);

  const metricsList = [
    { id: 'rating', label: 'Highest Rated', icon: Star, orderClause: 'p.avg_rating DESC, p.review_count DESC' },
    { id: 'views', label: 'Most Viewed (Popularity)', icon: Eye, orderClause: 'p.view_count DESC' },
    { id: 'sales', label: 'Top Selling (Order Items)', icon: ShoppingBag, orderClause: 'COALESCE(sales.total_units_sold, 0) DESC' },
    { id: 'price_desc', label: 'Price (High to Low)', icon: ArrowUpDown, orderClause: 'p.price DESC' },
    { id: 'price_asc', label: 'Price (Low to High)', icon: ArrowUpDown, orderClause: 'p.price ASC' },
  ];

  const currentMetricObj = metricsList.find((m) => m.id === metric) || metricsList[0];

  return (
    <div className="space-y-8 pb-16 animate-fade-in">
      {/* Header */}
      <div className="border-b border-[#EAD5C5] pb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#C77B61] mb-1">
          <Cpu className="w-3.5 h-3.5" />
          <span>Module 5: Advanced SQL Window Functions</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#49352D]">
          Product Ranking Intelligence Dashboard
        </h1>
        <p className="text-sm text-[#765344] font-light mt-1 max-w-3xl leading-relaxed">
          Demonstrating SQL analytical capabilities with <code className="px-1.5 py-0.5 rounded bg-[#FCE9DE] text-[#49352D] font-mono text-xs">ROW_NUMBER()</code>,{' '}
          <code className="px-1.5 py-0.5 rounded bg-[#FCE9DE] text-[#49352D] font-mono text-xs">RANK()</code>, and{' '}
          <code className="px-1.5 py-0.5 rounded bg-[#FCE9DE] text-[#49352D] font-mono text-xs">DENSE_RANK()</code> partitioned dynamically across product categories in MySQL.
        </p>
      </div>

      {/* Control Strip */}
      <div className="bg-[#FFFCF7] border border-[#EAD5C5] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Metric Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {metricsList.map((m) => {
              const Icon = m.icon;
              const isSelected = metric === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setMetric(m.id);
                    setSearchParams({ metric: m.id });
                  }}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#C77B61] text-white shadow-xs'
                      : 'bg-[#FCE9DE]/40 text-[#765344] hover:bg-[#FCE9DE]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Category Filter Dropdown */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#765344] flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-[#C77B61]" /> Partition:
            </span>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-[#EAD5C5] bg-white text-xs text-[#49352D] focus:outline-none focus:ring-1 focus:ring-[#C77B61] cursor-pointer"
            >
              <option value="">All Categories (Global Partition)</option>
              {categories.map((c) => (
                <option key={c.category_id} value={c.category_id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic SQL Query Inspector */}
        <div className="p-3.5 rounded-xl bg-[#49352D] text-[#FFFCF7] font-mono text-xs space-y-1 shadow-inner">
          <div className="flex items-center justify-between text-[#EAD5C5] text-[11px] pb-1 border-b border-[#765344]">
            <span className="flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-[#C77B61]" />
              <span>Live Stored Procedure Call:</span>
            </span>
            <span className="text-emerald-300">MySQL 8.0 Engine</span>
          </div>
          <div className="pt-1 text-[#FCE9DE]">
            CALL get_ranked_products(&apos;{metric}&apos;, {categoryId ? categoryId : 'NULL'});
          </div>
          <div className="text-[11px] text-[#CBBBB0] pt-1">
            <span className="text-[#E29D84]">Window Function Syntax: </span>
            ROW_NUMBER() OVER(PARTITION BY {categoryId ? 'category_id' : 'NULL'} ORDER BY {currentMetricObj.orderClause}) AS row_num,
            RANK() OVER(...) AS rank_num, DENSE_RANK() OVER(...) AS dense_rank_num
          </div>
        </div>
      </div>

      {/* Table of Results */}
      {loading ? (
        <Loader text="Computing window function partitions in MySQL..." />
      ) : (
        <div className="bg-[#FFFCF7] border border-[#EAD5C5] rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-[#FCE9DE]/50 border-b border-[#EAD5C5] text-[#765344] font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4 text-center">Row #</th>
                  <th className="py-3.5 px-4 text-center">RANK()</th>
                  <th className="py-3.5 px-4 text-center">DENSE_RANK()</th>
                  <th className="py-3.5 px-6">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4 text-right">Price</th>
                  <th className="py-3.5 px-4 text-center">Rating</th>
                  <th className="py-3.5 px-4 text-center">Views</th>
                  <th className="py-3.5 px-4 text-center">Units Sold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAD5C5]/40 text-[#49352D]">
                {rankedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-[#765344]">
                      No ranked products found for the selected criteria.
                    </td>
                  </tr>
                ) : (
                  rankedProducts.map((p, idx) => (
                    <tr
                      key={p.product_id}
                      className="hover:bg-[#FCE9DE]/20 transition-colors"
                    >
                      <td className="py-3 px-4 text-center font-mono font-bold text-[#765344]">
                        {p.row_num || idx + 1}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#C77B61]/10 text-[#C77B61] font-bold font-mono">
                          {p.rank_num || idx + 1}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-[#765344]">
                        {p.dense_rank_num || idx + 1}
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover border border-[#EAD5C5]"
                          />
                          <div>
                            <Link
                              to={`/product/${p.slug}`}
                              className="font-semibold text-[#49352D] hover:text-[#C77B61] transition-colors line-clamp-1"
                            >
                              {p.name}
                            </Link>
                            {p.brand && (
                              <span className="text-[10px] text-[#A89080] uppercase tracking-wider block">
                                {p.brand}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#765344]">
                        {p.category_name}
                      </td>
                      <td className="py-3 px-4 text-right font-serif font-bold text-[#49352D]">
                        ${parseFloat(p.price).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FCE9DE] text-[#49352D] font-semibold">
                          ★ {parseFloat(p.avg_rating || 0).toFixed(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-[#765344] font-mono">
                        {p.view_count || 0}
                      </td>
                      <td className="py-3 px-4 text-center text-[#765344] font-mono">
                        {p.units_sold || 0}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

