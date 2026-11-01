import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="p-2 rounded-xl border border-[#EAD5C5] text-[#765344] bg-[#FFFCF7] hover:bg-[#FCE9DE]/40
                   disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Previous Page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {start > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="w-10 h-10 rounded-xl text-sm font-medium text-[#765344] bg-[#FFFCF7] border border-[#EAD5C5] hover:bg-[#FCE9DE]/40 transition-colors"
          >
            1
          </button>
          {start > 2 && <span className="text-[#A89080] px-1 font-serif">…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-10 h-10 rounded-xl text-sm font-medium transition-all duration-200 ${
            p === page
              ? 'bg-[#C77B61] text-white shadow-md shadow-[#C77B61]/25 border border-[#C77B61]'
              : 'bg-[#FFFCF7] border border-[#EAD5C5] text-[#765344] hover:bg-[#FCE9DE]/40'
          }`}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-[#A89080] px-1 font-serif">…</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="w-10 h-10 rounded-xl text-sm font-medium text-[#765344] bg-[#FFFCF7] border border-[#EAD5C5] hover:bg-[#FCE9DE]/40 transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="p-2 rounded-xl border border-[#EAD5C5] text-[#765344] bg-[#FFFCF7] hover:bg-[#FCE9DE]/40
                   disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Next Page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
