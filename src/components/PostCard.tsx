import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal, Play, Pause } from 'lucide-react';
import type { Post } from '@/types';
import { Avatar } from './Avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMusicStore } from '@/store/useMusicStore';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface PostCardProps {
  post: Post;
  className?: string;
}

export function PostCard({ post, className }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [showReactions, setShowReactions] = useState(false);
  const { currentTrack, isPlaying, play, pause, resume } = useMusicStore();

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleMusicClick = () => {
    if (!post.music) return;
    
    if (currentTrack?.id === post.music.id) {
      isPlaying ? pause() : resume();
    } else {
      play(post.music);
    }
  };

  const isCurrentTrack = currentTrack?.id === post.music?.id;
  const isTrackPlaying = isCurrentTrack && isPlaying;

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { 
    addSuffix: true, 
    locale: ru 
  });

  const reactions = ['❤️', '😍', '😂', '😮', '😢', '👏', '🔥', '🎉'];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('glass-card-strong p-4 space-y-4', className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar 
            src={post.author.avatar} 
            alt={post.author.displayName}
            size="md"
            isOnline={post.author.isOnline}
          />
          <div>
            <h3 className="font-medium text-foreground">
              {post.author.displayName}
            </h3>
            <p className="text-sm text-muted-foreground">
              @{post.author.username} · {timeAgo}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <p className="text-foreground leading-relaxed">{post.content}</p>

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className={cn(
          'grid gap-2 rounded-xl overflow-hidden',
          post.images.length === 1 && 'grid-cols-1',
          post.images.length === 2 && 'grid-cols-2',
          post.images.length >= 3 && 'grid-cols-2',
        )}>
          {post.images.slice(0, 4).map((img, idx) => (
            <div 
              key={idx} 
              className={cn(
                'relative overflow-hidden',
                post.images!.length === 3 && idx === 0 && 'row-span-2',
                'aspect-square'
              )}
            >
              <img
                src={img}
                alt=""
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              {post.images!.length > 4 && idx === 3 && (
                <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    +{post.images!.length - 4}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Music Track */}
      {post.music && (
        <div 
          onClick={handleMusicClick}
          className={cn(
            'flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300',
            isCurrentTrack 
              ? 'bg-primary/10 border border-primary/20' 
              : 'bg-muted/50 hover:bg-muted'
          )}
        >
          <div className="relative w-12 h-12 rounded-lg overflow-hidden">
            <img
              src={post.music.cover}
              alt={post.music.title}
              className="w-full h-full object-cover"
            />
            <div className={cn(
              'absolute inset-0 flex items-center justify-center bg-foreground/20 transition-opacity',
              isTrackPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            )}>
              {isTrackPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white" />
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">{post.music.title}</p>
            <p className="text-sm text-muted-foreground truncate">{post.music.artist}</p>
          </div>
          <div className="text-sm text-muted-foreground">
            {Math.floor(post.music.duration / 60)}:{(post.music.duration % 60).toString().padStart(2, '0')}
          </div>
        </div>
      )}

      {/* Reactions Row */}
      {post.reactions && post.reactions.length > 0 && (
        <div className="flex items-center gap-1">
          {post.reactions.map((reaction, idx) => (
            <span 
              key={idx}
              className={cn(
                'inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm cursor-pointer transition-colors',
                reaction.isReacted 
                  ? 'bg-primary/10 text-primary' 
                  : 'bg-muted hover:bg-muted/80'
              )}
            >
              <span>{reaction.emoji}</span>
              <span className="text-xs">{reaction.count}</span>
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <div className="flex items-center gap-1 relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            onMouseEnter={() => setShowReactions(true)}
            onMouseLeave={() => setShowReactions(false)}
            className={cn(
              'gap-2 transition-colors',
              isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <motion.div
              animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart className={cn('w-5 h-5', isLiked && 'fill-current')} />
            </motion.div>
            <span>{likesCount}</span>
          </Button>

          {/* Reactions Popup */}
          <AnimatePresence>
            {showReactions && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className="absolute bottom-full left-0 mb-2 glass-card-strong p-2 rounded-full flex gap-1 z-10"
              >
                {reactions.map((emoji) => (
                  <button
                    key={emoji}
                    className="w-8 h-8 flex items-center justify-center text-lg hover:scale-125 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowReactions(false);
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <MessageCircle className="w-5 h-5" />
          <span>{post.comments}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <Repeat2 className="w-5 h-5" />
          <span>{post.reposts}</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
        >
          <Share className="w-5 h-5" />
        </Button>
      </div>
    </motion.article>
  );
}
