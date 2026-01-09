import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, Clock, Users, MoreHorizontal, MessageCircle } from 'lucide-react';
import { MainLayout } from '@/components/MainLayout';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/EmptyState';
import { mockUsers, mockFriendRequests } from '@/services/mockData';
import { cn } from '@/lib/utils';

const Friends = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [friendRequests, setFriendRequests] = useState(mockFriendRequests);
  const friends = mockUsers.slice(1); // Mock friends

  const handleAcceptRequest = (requestId: string) => {
    setFriendRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const handleRejectRequest = (requestId: string) => {
    setFriendRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const filteredFriends = friends.filter(friend =>
    friend.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="container max-w-3xl mx-auto px-4 py-6 pb-20 lg:pb-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-foreground mb-4">Друзья</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Поиск друзей..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-white/70 border-border/50"
            />
          </div>
        </div>

        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none p-0 h-auto mb-6">
            <TabsTrigger 
              value="friends" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent gap-2 pb-3"
            >
              <Users className="w-4 h-4" />
              Все друзья
              <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full">
                {friends.length}
              </span>
            </TabsTrigger>
            <TabsTrigger 
              value="requests" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent gap-2 pb-3 relative"
            >
              <Clock className="w-4 h-4" />
              Заявки
              {friendRequests.length > 0 && (
                <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                  {friendRequests.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="online" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent gap-2 pb-3"
            >
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              Онлайн
            </TabsTrigger>
          </TabsList>

          {/* All Friends */}
          <TabsContent value="friends">
            {filteredFriends.length === 0 ? (
              <EmptyState type="friends" />
            ) : (
              <div className="grid gap-3">
                {filteredFriends.map((friend, idx) => (
                  <motion.div
                    key={friend.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="glass-card p-4 flex items-center gap-4 hover:shadow-cloud transition-shadow"
                  >
                    <Avatar 
                      src={friend.avatar}
                      alt={friend.displayName}
                      size="lg"
                      isOnline={friend.isOnline}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{friend.displayName}</p>
                      <p className="text-sm text-muted-foreground truncate">@{friend.username}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {friend.friendsCount} друзей
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-primary hover:bg-primary/10"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Friend Requests */}
          <TabsContent value="requests">
            {friendRequests.length === 0 ? (
              <EmptyState 
                type="general" 
                title="Нет заявок"
                description="Новые заявки в друзья появятся здесь"
              />
            ) : (
              <div className="grid gap-3">
                {friendRequests.map((request, idx) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="glass-card-strong p-4 flex items-center gap-4"
                  >
                    <Avatar 
                      src={request.from.avatar}
                      alt={request.from.displayName}
                      size="lg"
                      isOnline={request.from.isOnline}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{request.from.displayName}</p>
                      <p className="text-sm text-muted-foreground truncate">@{request.from.username}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {request.from.friendsCount} общих друзей
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleAcceptRequest(request.id)}
                        className="cloud-button"
                        size="sm"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Принять
                      </Button>
                      <Button 
                        onClick={() => handleRejectRequest(request.id)}
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive"
                      >
                        Отклонить
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Online Friends */}
          <TabsContent value="online">
            {friends.filter(f => f.isOnline).length === 0 ? (
              <EmptyState 
                type="general" 
                title="Никого нет онлайн"
                description="Ваши друзья сейчас не в сети"
              />
            ) : (
              <div className="grid gap-3">
                {friends.filter(f => f.isOnline).map((friend, idx) => (
                  <motion.div
                    key={friend.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="glass-card p-4 flex items-center gap-4 hover:shadow-cloud transition-shadow"
                  >
                    <Avatar 
                      src={friend.avatar}
                      alt={friend.displayName}
                      size="lg"
                      isOnline={true}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{friend.displayName}</p>
                      <p className="text-sm text-green-600">В сети</p>
                    </div>
                    <Button className="cloud-button gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Написать
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Suggestions */}
        <div className="mt-8">
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">
            Возможно, вы знакомы
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {mockUsers.slice(0, 6).map((user, idx) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
                className="glass-card p-4 text-center hover:shadow-cloud transition-shadow"
              >
                <Avatar 
                  src={user.avatar}
                  alt={user.displayName}
                  size="xl"
                  className="mx-auto mb-3"
                />
                <p className="font-medium text-foreground truncate">{user.displayName}</p>
                <p className="text-sm text-muted-foreground truncate mb-3">@{user.username}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Добавить
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Friends;
