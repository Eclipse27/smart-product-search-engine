import { Loader2 } from 'lucide-react';

export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
      <p className="mt-4 text-slate-500 text-sm font-medium">{text}</p>
    </div>
  );
}
