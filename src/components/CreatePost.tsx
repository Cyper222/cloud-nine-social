import { useState } from 'react';
import { Image, Music, Video, Smile, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from './Avatar';
import { currentUser } from '@/services/mockData';
import { cn } from '@/lib/utils';

interface CreatePostProps {
  onPost?: (content: string) => void;
  className?: string;
}

export function CreatePost({ onPost, className }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = () => {
    if (content.trim()) {
      onPost?.(content);
      setContent('');
      setIsFocused(false);
    }
  };

  return (
    <div className={cn(
      'glass-card-strong p-4 transition-all duration-300',
      isFocused && 'shadow-float',
      className
    )}>
      <div className="flex gap-3">
        <Avatar 
          src={currentUser.avatar} 
          alt={currentUser.displayName}
          size="md"
        />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => !content && setIsFocused(false)}
            placeholder="О чём думаете?"
            className={cn(
              'w-full bg-transparent resize-none outline-none placeholder:text-muted-foreground text-foreground',
              'transition-all duration-300',
              isFocused ? 'min-h-[100px]' : 'min-h-[40px]'
            )}
          />
          
          {isFocused && (
            <div className="flex items-center justify-between pt-3 border-t border-border/50 mt-3">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary hover:bg-primary/10"
                >
                  <Image className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary hover:bg-primary/10"
                >
                  <Music className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary hover:bg-primary/10"
                >
                  <Video className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary hover:bg-primary/10"
                >
                  <Smile className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary hover:bg-primary/10"
                >
                  <MapPin className="w-5 h-5" />
                </Button>
              </div>
              
              <Button
                onClick={handleSubmit}
                disabled={!content.trim()}
                className="cloud-button gap-2"
              >
                <Send className="w-4 h-4" />
                Опубликовать
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
