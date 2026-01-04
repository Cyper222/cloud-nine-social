import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('skeleton rounded-lg', className)} />
  );
}

export function PostSkeleton() {
  return (
    <div className="glass-card p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="w-32 h-4" />
          <Skeleton className="w-24 h-3" />
        </div>
      </div>
      <Skeleton className="w-full h-20" />
      <Skeleton className="w-full h-48 rounded-xl" />
      <div className="flex gap-4">
        <Skeleton className="w-16 h-8" />
        <Skeleton className="w-16 h-8" />
        <Skeleton className="w-16 h-8" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="w-full h-48 rounded-2xl" />
      <div className="flex items-end gap-4 -mt-16 px-4">
        <Skeleton className="w-24 h-24 rounded-full border-4 border-white" />
        <div className="space-y-2 pb-2">
          <Skeleton className="w-40 h-6" />
          <Skeleton className="w-24 h-4" />
        </div>
      </div>
      <div className="px-4 space-y-4">
        <Skeleton className="w-full h-16" />
        <div className="flex gap-4">
          <Skeleton className="w-24 h-10" />
          <Skeleton className="w-24 h-10" />
        </div>
      </div>
    </div>
  );
}

export function MessageSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3">
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="w-32 h-4" />
        <Skeleton className="w-48 h-3" />
      </div>
      <Skeleton className="w-12 h-3" />
    </div>
  );
}

export function StorySkeleton() {
  return (
    <div className="flex flex-col items-center gap-1">
      <Skeleton className="w-16 h-16 rounded-full" />
      <Skeleton className="w-12 h-3" />
    </div>
  );
}
