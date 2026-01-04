import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/MainLayout';
import { CreatePost } from '@/components/CreatePost';
import { PostCard } from '@/components/PostCard';
import { PostSkeleton, StorySkeleton } from '@/components/Skeleton';
import { Avatar } from '@/components/Avatar';
import { mockPosts, mockUsers } from '@/services/mockData';
import type { Post } from '@/types';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setPosts(mockPosts);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleNewPost = (content: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      author: mockUsers[0],
      content,
      likes: 0,
      comments: 0,
      reposts: 0,
      isLiked: false,
      reactions: [],
      createdAt: new Date().toISOString(),
    };
    setPosts([newPost, ...posts]);
  };

  return (
    <MainLayout>
      <div className="container max-w-2xl mx-auto px-4 py-6 pb-20 lg:pb-6">
        {/* Stories */}
        <section className="mb-6">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {/* Add Story */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-sky-medium p-[2px]">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
              </div>
              <span className="text-xs text-muted-foreground">Добавить</span>
            </div>

            {isLoading ? (
              <>
                <StorySkeleton />
                <StorySkeleton />
                <StorySkeleton />
                <StorySkeleton />
              </>
            ) : (
              mockUsers.slice(0, 6).map((user, idx) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer"
                >
                  <div className={cn(
                    'w-16 h-16 rounded-full p-[2px]',
                    idx % 2 === 0 
                      ? 'bg-gradient-to-br from-primary to-sky-medium' 
                      : 'bg-gradient-to-br from-sunset-pink to-sunset-orange'
                  )}>
                    <div className="w-full h-full rounded-full overflow-hidden bg-white p-[2px]">
                      <img 
                        src={user.avatar} 
                        alt={user.displayName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground truncate w-16 text-center">
                    {user.username}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* Create Post */}
        <CreatePost onPost={handleNewPost} className="mb-6" />

        {/* Feed */}
        <section className="space-y-6">
          {isLoading ? (
            <>
              <PostSkeleton />
              <PostSkeleton />
              <PostSkeleton />
            </>
          ) : (
            posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post}
                className="post-card"
              />
            ))
          )}
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
