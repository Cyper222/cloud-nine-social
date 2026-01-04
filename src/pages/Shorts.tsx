import { useState, useRef, useEffect, forwardRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Heart, MessageCircle, Share2, Music2, MoreVertical, Play, Volume2, VolumeX } from 'lucide-react';
import { MainLayout } from '@/components/MainLayout';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/ui/button';
import { mockShorts } from '@/services/mockData';
import { cn } from '@/lib/utils';

const Shorts = forwardRef<HTMLDivElement>((_, ref) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiked, setIsLiked] = useState<Record<string, boolean>>({});
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.y < -threshold && currentIndex < mockShorts.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (info.offset.y > threshold && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleLike = (shortId: string) => {
    setIsLiked(prev => ({
      ...prev,
      [shortId]: !prev[shortId]
    }));
  };

  // Handle wheel scroll
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0 && currentIndex < mockShorts.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else if (e.deltaY < 0 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [currentIndex]);

  const currentShort = mockShorts[currentIndex];

  return (
    <MainLayout>
      <div 
        ref={containerRef}
        className="h-[calc(100vh-4rem)] lg:h-screen flex items-center justify-center bg-foreground overflow-hidden"
      >
        <div className="relative w-full max-w-md h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentShort.id}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              className="absolute inset-0"
            >
              {/* Video Background */}
              <div className="absolute inset-0">
                <img
                  src={currentShort.thumbnail}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-foreground/80" />
              </div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                >
                  <Play className="w-8 h-8 ml-1" />
                </Button>
              </div>

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 pb-20 lg:pb-4">
                {/* Author Info */}
                <div className="flex items-center gap-3 mb-3">
                  <Avatar 
                    src={currentShort.author.avatar}
                    alt={currentShort.author.displayName}
                    size="md"
                  />
                  <div className="flex-1">
                    <p className="text-white font-medium">
                      {currentShort.author.displayName}
                    </p>
                    <p className="text-white/70 text-sm">
                      @{currentShort.author.username}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    Подписаться
                  </Button>
                </div>

                {/* Description */}
                <p className="text-white text-sm mb-3">{currentShort.description}</p>

                {/* Music */}
                {currentShort.music && (
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <Music2 className="w-4 h-4" />
                    <span className="truncate">{currentShort.music.title} — {currentShort.music.artist}</span>
                  </div>
                )}
              </div>

              {/* Side Actions */}
              <div className="absolute right-4 bottom-32 lg:bottom-20 flex flex-col items-center gap-6">
                <button 
                  onClick={() => handleLike(currentShort.id)}
                  className="flex flex-col items-center gap-1"
                >
                  <motion.div
                    animate={isLiked[currentShort.id] ? { scale: [1, 1.3, 1] } : {}}
                    className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center',
                      isLiked[currentShort.id] 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white/20 backdrop-blur-sm text-white'
                    )}
                  >
                    <Heart className={cn('w-6 h-6', isLiked[currentShort.id] && 'fill-current')} />
                  </motion.div>
                  <span className="text-white text-xs">
                    {currentShort.likes + (isLiked[currentShort.id] ? 1 : 0)}
                  </span>
                </button>

                <button className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <span className="text-white text-xs">{currentShort.comments}</span>
                </button>

                <button className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <span className="text-white text-xs">{currentShort.shares}</span>
                </button>

                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white"
                >
                  {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>

                <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                  <MoreVertical className="w-6 h-6" />
                </button>
              </div>

              {/* Progress Indicator */}
              <div className="absolute top-4 left-4 right-4 flex gap-1">
                {mockShorts.map((_, idx) => (
                  <div 
                    key={idx}
                    className={cn(
                      'h-1 rounded-full flex-1 transition-colors',
                      idx === currentIndex ? 'bg-white' : 'bg-white/30'
                    )}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Hints */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-6 lg:bottom-2 text-white/50 text-xs">
            Свайпните вверх для следующего
          </div>
        </div>
      </div>
    </MainLayout>
  );
});

Shorts.displayName = 'Shorts';

export default Shorts;
