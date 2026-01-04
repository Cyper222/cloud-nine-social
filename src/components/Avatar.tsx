import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  className?: string;
}

export function Avatar({ src, alt = 'Avatar', size = 'md', isOnline, className }: AvatarProps) {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const onlineDotSizes = {
    xs: 'w-1.5 h-1.5 border',
    sm: 'w-2 h-2 border',
    md: 'w-2.5 h-2.5 border-2',
    lg: 'w-3 h-3 border-2',
    xl: 'w-4 h-4 border-2',
  };

  return (
    <div className={cn('relative inline-block', className)}>
      <div className={cn(
        sizes[size],
        'rounded-full overflow-hidden ring-2 ring-white shadow-soft bg-muted'
      )}>
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-sky-light to-sky-medium flex items-center justify-center">
            <span className="text-primary font-medium text-sm">
              {alt.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      {isOnline !== undefined && (
        <span className={cn(
          'absolute bottom-0 right-0 rounded-full border-white',
          onlineDotSizes[size],
          isOnline ? 'bg-green-500' : 'bg-muted-foreground'
        )} />
      )}
    </div>
  );
}
