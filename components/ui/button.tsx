
import { cn } from '@/lib/utils';

export function Button({ children, className = '', variant = 'default', ...props }) {
  const base = 'px-4 py-2 font-semibold rounded transition-colors';
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-red-200 text-red-950 hover:bg-red-300',
    success: 'bg-green-200 text-green-950 hover:bg-green-300',
  };
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
