import { cn } from '@/lib/utils';
import { Cloud, Music, Search } from 'lucide-react';

interface EmptyStateProps {
  type: 'posts' | 'messages' | 'friends' | 'music' | 'search' | 'general';
  title?: string;
  description?: string;
  className?: string;
  action?: React.ReactNode;
}

const emptyStates = {
  posts: {
    icon: Cloud,
    title: 'Пока здесь пусто',
    description: 'Будьте первым, кто поделится чем-то интересным!',
  },
  messages: {
    icon: Cloud,
    title: 'Нет сообщений',
    description: 'Начните общение с друзьями',
  },
  friends: {
    icon: Cloud,
    title: 'Нет друзей',
    description: 'Найдите интересных людей и добавьте их в друзья',
  },
  music: {
    icon: Music,
    title: 'Музыка не найдена',
    description: 'Попробуйте изменить параметры поиска',
  },
  search: {
    icon: Search,
    title: 'Ничего не найдено',
    description: 'Попробуйте изменить запрос',
  },
  general: {
    icon: Cloud,
    title: 'Здесь пока ничего нет',
    description: 'Скоро здесь появится что-то интересное',
  },
};

export function EmptyState({ 
  type, 
  title, 
  description, 
  className, 
  action 
}: EmptyStateProps) {
  const state = emptyStates[type];
  const Icon = state.icon;

  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-16 px-4 text-center',
      className
    )}>
      <div className="w-20 h-20 rounded-full bg-sky-light flex items-center justify-center mb-4 float">
        <Icon className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-lg font-display font-semibold text-foreground mb-2">
        {title || state.title}
      </h3>
      <p className="text-muted-foreground text-sm max-w-sm">
        {description || state.description}
      </p>
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}
