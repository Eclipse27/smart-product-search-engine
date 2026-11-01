import { Loader2, Sparkles } from 'lucide-react';

export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in text-center">
      <div className="relative">
        <Loader2 className="w-10 h-10 text-[#C77B61] animate-spin" />
        <Sparkles className="w-4 h-4 text-[#E29D84] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <p className="mt-4 text-[#765344] text-sm font-medium tracking-wide">{text}</p>
    </div>
  );
}
