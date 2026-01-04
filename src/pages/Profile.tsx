import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, MessageCircle, UserPlus, Settings, Music, Video, Users, Grid3X3, MapPin, Calendar, Link as LinkIcon } from 'lucide-react';
import { MainLayout } from '@/components/MainLayout';
import { Avatar } from '@/components/Avatar';
import { PostCard } from '@/components/PostCard';
import { ProfileSkeleton, PostSkeleton } from '@/components/Skeleton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { currentUser, mockPosts, mockTracks } from '@/services/mockData';
import { cn } from '@/lib/utils';

const Profile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isOwner] = useState(true); // Check if viewing own profile
  const user = currentUser;
  const userPosts = mockPosts.filter(p => p.author.id === user.id);

  const handleEditProfile = () => {
    navigate('/settings');
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container max-w-3xl mx-auto px-4 py-6">
          <ProfileSkeleton />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="pb-20 lg:pb-6">
        {/* Cover Image */}
        <div className="relative h-48 md:h-64 lg:h-80">
          <img
            src={user.cover || 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1200&h=400&fit=crop'}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          
          {isOwner && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-foreground/20 backdrop-blur-sm text-white hover:bg-foreground/30"
            >
              <Camera className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Profile Info */}
        <div className="container max-w-3xl mx-auto px-4">
          <div className="relative -mt-16 md:-mt-20">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col md:flex-row md:items-end gap-4"
            >
              {/* Avatar */}
              <div className="relative">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-background overflow-hidden shadow-float bg-white">
                  <img
                    src={user.avatar}
                    alt={user.displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
                {isOwner && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute bottom-2 right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Name & Actions */}
              <div className="flex-1 pb-2">
                <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                  {user.displayName}
                </h1>
                <p className="text-muted-foreground">@{user.username}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pb-2">
                {isOwner ? (
                  <Button variant="outline" className="gap-2" onClick={handleEditProfile}>
                    <Settings className="w-4 h-4" />
                    Редактировать
                  </Button>
                ) : (
                  <>
                    <Button className="cloud-button gap-2">
                      <UserPlus className="w-4 h-4" />
                      Добавить в друзья
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Сообщение
                    </Button>
                  </>
                )}
              </div>
            </motion.div>

            {/* Bio & Info */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mt-6 space-y-4"
            >
              {user.bio && (
                <p className="text-foreground max-w-xl">{user.bio}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Москва, Россия
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined January 2024
                </span>
                <span className="flex items-center gap-1">
                  <LinkIcon className="w-4 h-4" />
                  <a href="#" className="text-primary hover:underline">mysite.com</a>
                </span>
              </div>

              {/* Stats */}
              <div className="flex gap-6">
                <button className="group">
                  <span className="font-bold text-foreground">{user.postsCount}</span>{' '}
                  <span className="text-muted-foreground group-hover:text-foreground">публикаций</span>
                </button>
                <button className="group">
                  <span className="font-bold text-foreground">{user.friendsCount}</span>{' '}
                  <span className="text-muted-foreground group-hover:text-foreground">друзей</span>
                </button>
                <button className="group">
                  <span className="font-bold text-foreground">1.2K</span>{' '}
                  <span className="text-muted-foreground group-hover:text-foreground">подписчиков</span>
                </button>
              </div>
            </motion.div>

            {/* Content Tabs */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-8"
            >
              <Tabs defaultValue="posts" className="w-full">
                <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none p-0 h-auto">
                  <TabsTrigger 
                    value="posts" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent gap-2 pb-3"
                  >
                    <Grid3X3 className="w-4 h-4" />
                    Посты
                  </TabsTrigger>
                  <TabsTrigger 
                    value="music" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent gap-2 pb-3"
                  >
                    <Music className="w-4 h-4" />
                    Музыка
                  </TabsTrigger>
                  <TabsTrigger 
                    value="videos" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent gap-2 pb-3"
                  >
                    <Video className="w-4 h-4" />
                    Видео
                  </TabsTrigger>
                  <TabsTrigger 
                    value="friends" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent gap-2 pb-3"
                  >
                    <Users className="w-4 h-4" />
                    Друзья
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="posts" className="mt-6 space-y-6">
                  {mockPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </TabsContent>

                <TabsContent value="music" className="mt-6">
                  <div className="grid gap-3">
                    {mockTracks.map((track) => (
                      <div 
                        key={track.id}
                        className="glass-card p-3 flex items-center gap-3 hover:shadow-cloud transition-shadow cursor-pointer"
                      >
                        <img 
                          src={track.cover} 
                          alt={track.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{track.title}</p>
                          <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="videos" className="mt-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div 
                        key={i}
                        className="aspect-[9/16] bg-muted rounded-xl overflow-hidden relative group cursor-pointer"
                      >
                        <img
                          src={`https://images.unsplash.com/photo-151748300087${i}-1dbf64a6e1c6?w=300&h=500&fit=crop`}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-white text-sm font-medium">Short #{i}</p>
                          <p className="text-white/70 text-xs">12K views</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="friends" className="mt-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div 
                        key={i}
                        className="glass-card p-4 text-center hover:shadow-cloud transition-shadow cursor-pointer"
                      >
                        <Avatar 
                          src={`https://images.unsplash.com/photo-150700321116${i}-0a1dd7228f2d?w=100&h=100&fit=crop`}
                          alt="Friend"
                          size="lg"
                          isOnline={i % 2 === 0}
                          className="mx-auto mb-2"
                        />
                        <p className="font-medium text-foreground">Друг {i + 1}</p>
                        <p className="text-sm text-muted-foreground">@friend{i + 1}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
