import { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Heart, MoreHorizontal, Search, ListMusic, Disc3, Clock, TrendingUp } from 'lucide-react';
import { MainLayout } from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMusicStore } from '@/store/useMusicStore';
import { mockTracks } from '@/services/mockData';
import { cn } from '@/lib/utils';

const Music = forwardRef<HTMLDivElement>((_, ref) => {
  const { currentTrack, isPlaying, play, pause, resume } = useMusicStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set());

  const handleTrackClick = (track: typeof mockTracks[0]) => {
    if (currentTrack?.id === track.id) {
      isPlaying ? pause() : resume();
    } else {
      play(track);
    }
  };

  const toggleLike = (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedTracks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(trackId)) {
        newSet.delete(trackId);
      } else {
        newSet.add(trackId);
      }
      return newSet;
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Extend mock tracks for demo
  const allTracks = [
    ...mockTracks,
    {
      id: '4',
      title: 'Полёт над облаками',
      artist: 'AeroSound',
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&h=200&fit=crop',
      duration: 267,
    },
    {
      id: '5',
      title: 'Рассвет',
      artist: 'Morning Light',
      cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&h=200&fit=crop',
      duration: 198,
    },
    {
      id: '6',
      title: 'Океан звуков',
      artist: 'Wave Studio',
      cover: 'https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=200&h=200&fit=crop',
      duration: 345,
    },
  ];

  const filteredTracks = allTracks.filter(track =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto px-4 py-6 pb-32 lg:pb-24">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-foreground mb-4">Музыка</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Поиск треков, исполнителей..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-white/70 border-border/50"
            />
          </div>
        </div>

        {/* Featured Track */}
        {currentTrack && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card-strong p-6 mb-6 overflow-hidden relative"
          >
            <div className="absolute inset-0 opacity-10">
              <img 
                src={currentTrack.cover} 
                alt="" 
                className="w-full h-full object-cover blur-3xl scale-150"
              />
            </div>
            
            <div className="relative flex items-center gap-6">
              <motion.div 
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 3, repeat: isPlaying ? Infinity : 0, ease: 'linear' }}
                className="w-24 h-24 rounded-full overflow-hidden shadow-float"
              >
                <img 
                  src={currentTrack.cover} 
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              <div className="flex-1">
                <p className="text-sm text-primary font-medium mb-1">Сейчас играет</p>
                <h2 className="text-xl font-display font-bold text-foreground">{currentTrack.title}</h2>
                <p className="text-muted-foreground">{currentTrack.artist}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => isPlaying ? pause() : resume()}
                  className="w-14 h-14 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none p-0 h-auto mb-6">
            <TabsTrigger 
              value="all" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent gap-2 pb-3"
            >
              <ListMusic className="w-4 h-4" />
              Все треки
            </TabsTrigger>
            <TabsTrigger 
              value="liked" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent gap-2 pb-3"
            >
              <Heart className="w-4 h-4" />
              Любимые
            </TabsTrigger>
            <TabsTrigger 
              value="recent" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent gap-2 pb-3"
            >
              <Clock className="w-4 h-4" />
              Недавние
            </TabsTrigger>
            <TabsTrigger 
              value="trending" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent gap-2 pb-3"
            >
              <TrendingUp className="w-4 h-4" />
              Популярное
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-2">
            {filteredTracks.map((track, idx) => {
              const isCurrentTrack = currentTrack?.id === track.id;
              const isTrackPlaying = isCurrentTrack && isPlaying;
              
              return (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleTrackClick(track)}
                  className={cn(
                    'flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all',
                    isCurrentTrack 
                      ? 'glass-card-strong shadow-cloud' 
                      : 'hover:bg-muted/50'
                  )}
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                    <img 
                      src={track.cover} 
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                    {isCurrentTrack && (
                      <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center">
                        {isTrackPlaying ? (
                          <div className="flex items-end gap-0.5 h-4">
                            <motion.div 
                              animate={{ height: ['40%', '100%', '40%'] }}
                              transition={{ duration: 0.5, repeat: Infinity }}
                              className="w-1 bg-white rounded-full"
                            />
                            <motion.div 
                              animate={{ height: ['100%', '40%', '100%'] }}
                              transition={{ duration: 0.5, repeat: Infinity }}
                              className="w-1 bg-white rounded-full"
                            />
                            <motion.div 
                              animate={{ height: ['60%', '100%', '60%'] }}
                              transition={{ duration: 0.5, repeat: Infinity }}
                              className="w-1 bg-white rounded-full"
                            />
                          </div>
                        ) : (
                          <Play className="w-5 h-5 text-white" />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'font-medium truncate',
                      isCurrentTrack ? 'text-primary' : 'text-foreground'
                    )}>
                      {track.title}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                  </div>

                  <button
                    onClick={(e) => toggleLike(track.id, e)}
                    className={cn(
                      'p-2 rounded-full transition-colors',
                      likedTracks.has(track.id) 
                        ? 'text-red-500' 
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Heart className={cn('w-5 h-5', likedTracks.has(track.id) && 'fill-current')} />
                  </button>

                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {formatDuration(track.duration)}
                  </span>

                  <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </motion.div>
              );
            })}
          </TabsContent>

          <TabsContent value="liked">
            <div className="text-center py-12">
              <Disc3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Добавляйте треки в избранное, нажимая ❤️</p>
            </div>
          </TabsContent>

          <TabsContent value="recent">
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Недавно прослушанные треки появятся здесь</p>
            </div>
          </TabsContent>

          <TabsContent value="trending">
            <div className="space-y-2">
              {allTracks.slice(0, 5).map((track, idx) => (
                <div
                  key={track.id}
                  onClick={() => handleTrackClick(track)}
                  className="flex items-center gap-4 p-3 rounded-xl cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <span className="text-2xl font-bold text-muted-foreground w-8">{idx + 1}</span>
                  <img 
                    src={track.cover} 
                    alt={track.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{track.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{formatDuration(track.duration)}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
});

Music.displayName = 'Music';

export default Music;
