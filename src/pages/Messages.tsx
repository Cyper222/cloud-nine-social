import { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Search, Send, Phone, Video, MoreVertical, Smile, Paperclip, Image, ArrowLeft } from 'lucide-react';
import { MainLayout } from '@/components/MainLayout';
import { Avatar } from '@/components/Avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MessageSkeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';
import { mockConversations, mockUsers, currentUser } from '@/services/mockData';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

const Messages = forwardRef<HTMLDivElement>((_, ref) => {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading] = useState(false);

  // Mock messages for selected conversation
  const mockMessages = [
    {
      id: '1',
      senderId: selectedConversation?.participant.id || '',
      content: 'Привет! Как твои дела?',
      createdAt: '2024-12-20T14:00:00Z',
    },
    {
      id: '2',
      senderId: currentUser.id,
      content: 'Привет! Всё отлично, спасибо! Как сам?',
      createdAt: '2024-12-20T14:05:00Z',
    },
    {
      id: '3',
      senderId: selectedConversation?.participant.id || '',
      content: 'Тоже хорошо! Видел твои новые фотографии, очень круто получилось! 📸',
      createdAt: '2024-12-20T14:10:00Z',
    },
    {
      id: '4',
      senderId: currentUser.id,
      content: 'Спасибо! 🙏 Давно хотел поснимать на закате',
      createdAt: '2024-12-20T14:15:00Z',
    },
    {
      id: '5',
      senderId: selectedConversation?.participant.id || '',
      content: 'Привет! Как дела?',
      createdAt: '2024-12-20T15:30:00Z',
    },
  ];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Mock send message
      console.log('Sending message:', messageInput);
      setMessageInput('');
    }
  };

  return (
    <MainLayout>
      <div className="h-[calc(100vh-4rem)] lg:h-screen flex">
        {/* Conversations List */}
        <div className={cn(
          'w-full md:w-80 lg:w-96 border-r border-border/50 flex flex-col bg-white/50 backdrop-blur-sm',
          selectedConversation && 'hidden md:flex'
        )}>
          {/* Search Header */}
          <div className="p-4 border-b border-border/50">
            <h1 className="text-xl font-display font-bold text-foreground mb-4">Сообщения</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50 border-0"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto scrollbar-cloud">
            {isLoading ? (
              <>
                <MessageSkeleton />
                <MessageSkeleton />
                <MessageSkeleton />
              </>
            ) : mockConversations.length === 0 ? (
              <EmptyState type="messages" />
            ) : (
              mockConversations.map((conv) => (
                <motion.button
                  key={conv.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => setSelectedConversation(conv)}
                  className={cn(
                    'w-full flex items-center gap-3 p-4 text-left transition-colors',
                    'hover:bg-muted/50',
                    selectedConversation?.id === conv.id && 'bg-primary/5'
                  )}
                >
                  <Avatar 
                    src={conv.participant.avatar}
                    alt={conv.participant.displayName}
                    size="md"
                    isOnline={conv.participant.isOnline}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-foreground truncate">
                        {conv.participant.displayName}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(conv.lastMessage.createdAt), { 
                          locale: ru,
                          addSuffix: false 
                        })}
                      </span>
                    </div>
                    <p className={cn(
                      'text-sm truncate',
                      conv.unreadCount > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'
                    )}>
                      {conv.lastMessage.senderId === currentUser.id && 'Вы: '}
                      {conv.lastMessage.content}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                      {conv.unreadCount}
                    </span>
                  )}
                </motion.button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col bg-gradient-to-b from-sky-light/30 to-transparent">
            {/* Chat Header */}
            <div className="p-4 border-b border-border/50 bg-white/70 backdrop-blur-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setSelectedConversation(null as any)}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <Avatar 
                  src={selectedConversation.participant.avatar}
                  alt={selectedConversation.participant.displayName}
                  size="md"
                  isOnline={selectedConversation.participant.isOnline}
                />
                <div>
                  <p className="font-medium text-foreground">
                    {selectedConversation.participant.displayName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedConversation.participant.isOnline ? 'В сети' : 'Не в сети'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-cloud">
              {mockMessages.map((message, idx) => {
                const isOwn = message.senderId === currentUser.id;
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={cn(
                      'flex',
                      isOwn ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div className={cn(
                      'max-w-[70%] px-4 py-2 rounded-2xl',
                      isOwn 
                        ? 'bg-primary text-primary-foreground rounded-br-md' 
                        : 'glass-card rounded-bl-md'
                    )}>
                      <p className={cn(
                        'text-sm',
                        isOwn ? 'text-primary-foreground' : 'text-foreground'
                      )}>
                        {message.content}
                      </p>
                      <p className={cn(
                        'text-[10px] mt-1',
                        isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      )}>
                        {new Date(message.createdAt).toLocaleTimeString('ru-RU', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-border/50 bg-white/70 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Image className="w-5 h-5" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Написать сообщение..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="pr-10 bg-muted/50 border-0"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <Smile className="w-5 h-5" />
                  </button>
                </div>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="cloud-button"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center">
            <EmptyState 
              type="messages" 
              title="Выберите чат"
              description="Выберите беседу из списка слева"
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
});

Messages.displayName = 'Messages';

export default Messages;
