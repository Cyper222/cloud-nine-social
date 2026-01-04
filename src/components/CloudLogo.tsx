import { cn } from '@/lib/utils';

interface CloudLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function CloudLogo({ className, size = 'md' }: CloudLogoProps) {
  const sizes = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <svg
        viewBox="0 0 40 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(sizes[size], 'w-auto')}
      >
        <defs>
          <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(199 89% 60%)" />
            <stop offset="100%" stopColor="hsl(199 89% 48%)" />
          </linearGradient>
        </defs>
        <path
          d="M32 22H10C5.58 22 2 18.42 2 14C2 9.58 5.58 6 10 6C10.34 6 10.68 6.02 11 6.06C12.4 3.08 15.44 1 19 1C23.5 1 27.24 4.22 27.9 8.46C28.26 8.42 28.62 8.4 29 8.4C33.42 8.4 37 11.98 37 16.4C37 19.56 35.12 22.28 32.42 23.52C32.28 23.04 32 22 32 22Z"
          fill="url(#cloudGradient)"
        />
        <path
          d="M32 22H10C5.58 22 2 18.42 2 14C2 9.58 5.58 6 10 6C10.34 6 10.68 6.02 11 6.06C12.4 3.08 15.44 1 19 1C23.5 1 27.24 4.22 27.9 8.46C28.26 8.42 28.62 8.4 29 8.4C33.42 8.4 37 11.98 37 16.4C37 19.56 35.12 22.28 32.42 23.52"
          stroke="white"
          strokeWidth="0.5"
          strokeOpacity="0.5"
          fill="none"
        />
      </svg>
      <span className={cn(
        'font-display font-semibold text-gradient-sky',
        size === 'sm' && 'text-lg',
        size === 'md' && 'text-xl',
        size === 'lg' && 'text-3xl',
      )}>
        Облака
      </span>
    </div>
  );
}
