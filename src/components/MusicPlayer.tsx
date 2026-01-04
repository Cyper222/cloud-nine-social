import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, X, Music } from 'lucide-react';
import { useMusicStore } from '@/store/useMusicStore';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface MusicPlayerProps {
  className?: string;
}

export function MusicPlayer({ className }: MusicPlayerProps) {
  const { 
    currentTrack, 
    isPlaying, 
    progress, 
    volume,
    pause, 
    resume, 
    stop,
    next, 
    previous,
    setProgress,
    setVolume,
  } = useMusicStore();

  if (!currentTrack) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50',
          'bg-white/90 backdrop-blur-xl border-t border-border/50',
          'shadow-float',
          className
        )}
      >
        {/* Progress bar */}
        <div className="h-1 bg-muted relative">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary to-sky-medium"
            style={{ width: `${(progress / currentTrack.duration) * 100}%` }}
          />
        </div>

        <div className="container max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Track Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-lg overflow-hidden shadow-soft">
                <img
                  src={currentTrack.cover}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-foreground truncate">{currentTrack.title}</p>
                <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={previous}
                className="text-muted-foreground hover:text-foreground"
              >
                <SkipBack className="w-5 h-5" />
              </Button>
              
              <Button
                onClick={isPlaying ? pause : resume}
                size="icon"
                className="w-12 h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={next}
                className="text-muted-foreground hover:text-foreground"
              >
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>

            {/* Time & Volume */}
            <div className="hidden md:flex items-center gap-4 flex-1 justify-end">
              <span className="text-sm text-muted-foreground min-w-[80px] text-right">
                {formatTime(progress)} / {formatTime(currentTrack.duration)}
              </span>
              
              <div className="flex items-center gap-2 w-32">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <Slider
                  value={[volume]}
                  max={100}
                  step={1}
                  onValueChange={([v]) => setVolume(v)}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Close */}
            <Button
              variant="ghost"
              size="icon"
              onClick={stop}
              className="text-muted-foreground hover:text-foreground ml-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
