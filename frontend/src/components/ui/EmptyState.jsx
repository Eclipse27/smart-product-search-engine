import { PackageOpen } from 'lucide-react';

export default function EmptyState({
  icon: Icon = PackageOpen,
  title = 'No results found',
  description = 'Try adjusting your search or filters.',
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 animate-fade-in text-center">
      <div className="w-20 h-20 rounded-2xl bg-[#FCE9DE] border border-[#FAD8C8] flex items-center justify-center mb-5 shadow-sm">
        <Icon className="w-10 h-10 text-[#C77B61]" />
      </div>
      <h3 className="font-serif text-xl font-bold text-[#49352D] mb-2">{title}</h3>
      <p className="text-[#765344] text-sm max-w-sm mb-6 leading-relaxed">{description}</p>
      {action}
    </div>
  );
}
