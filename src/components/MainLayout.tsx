import { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { MusicPlayer } from './MusicPlayer';
import { useMusicStore } from '@/store/useMusicStore';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { currentTrack } = useMusicStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-light via-background to-background">
      {/* Decorative clouds */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-sky-medium/10 rounded-full blur-3xl float-slow" />
        <div className="absolute top-1/4 -right-32 w-80 h-80 bg-primary/10 rounded-full blur-3xl float-delayed" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-sunset-pink/10 rounded-full blur-3xl float" />
      </div>

      <Navigation />

      <main className={cn(
        'relative lg:ml-64 min-h-screen',
        'pt-16 lg:pt-0', // Account for mobile header
        currentTrack && 'pb-24 lg:pb-20' // Account for music player
      )}>
        {children}
      </main>

      <MusicPlayer />
    </div>
  );
}
