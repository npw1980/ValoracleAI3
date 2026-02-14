import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function Placeholder({ title }: { title: string }) {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-6">
          <Home className="w-8 h-8 text-slate-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">{title}</h1>
        <p className="text-slate-500 mb-6">This page is coming soon.</p>
        <Link to="/">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
