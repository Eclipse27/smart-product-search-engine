import { Star } from 'lucide-react';

export default function Rating({ rating = 0, count = null, size = 'sm' }) {
  const stars = [1, 2, 3, 4, 5];
  const sizeClass = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {stars.map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= Math.round(rating)
                ? 'text-amber-400 fill-amber-400'
                : 'text-slate-200 fill-slate-200'
            }`}
          />
        ))}
      </div>
      <span className={`text-slate-500 ${size === 'lg' ? 'text-sm' : 'text-xs'} ml-1`}>
        {rating > 0 ? rating.toFixed(1) : '0.0'}
        {count !== null && <span className="text-slate-400"> ({count})</span>}
      </span>
    </div>
  );
}
