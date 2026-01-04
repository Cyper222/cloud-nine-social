import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Lock, 
  Eye, 
  Palette, 
  Volume2,
  Globe,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Camera,
  Moon,
  Sun
} from 'lucide-react';
import { MainLayout } from '@/components/MainLayout';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { currentUser } from '@/services/mockData';
import { cn } from '@/lib/utils';

const settingsSections = [
  {
    id: 'profile',
    label: 'Профиль',
    icon: User,
  },
  {
    id: 'notifications',
    label: 'Уведомления',
    icon: Bell,
  },
  {
    id: 'privacy',
    label: 'Приватность',
    icon: Eye,
  },
  {
    id: 'security',
    label: 'Безопасность',
    icon: Lock,
  },
  {
    id: 'appearance',
    label: 'Внешний вид',
    icon: Palette,
  },
  {
    id: 'sound',
    label: 'Звук',
    icon: Volume2,
  },
  {
    id: 'language',
    label: 'Язык',
    icon: Globe,
  },
];

const Settings = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [formData, setFormData] = useState({
    displayName: currentUser.displayName,
    username: currentUser.username,
    email: currentUser.email,
    bio: currentUser.bio || '',
  });
  const [notifications, setNotifications] = useState({
    likes: true,
    comments: true,
    mentions: true,
    newFollowers: true,
    messages: true,
    emailDigest: false,
  });
  const [privacy, setPrivacy] = useState({
    privateProfile: false,
    showOnline: true,
    showLastSeen: true,
    allowMessages: true,
  });

  const handleSave = () => {
    console.log('Saving settings...', { formData, notifications, privacy });
  };

  return (
    <MainLayout>
      <div className="container max-w-5xl mx-auto px-4 py-6 pb-20 lg:pb-6">
        <h1 className="text-2xl font-display font-bold text-foreground mb-6">Настройки</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <nav className="w-full md:w-64 flex-shrink-0">
            <div className="glass-card p-2 space-y-1">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left',
                    activeSection === section.id 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-foreground hover:bg-muted'
                  )}
                >
                  <section.icon className="w-5 h-5" />
                  <span className="font-medium">{section.label}</span>
                  <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                </button>
              ))}
              
              <div className="border-t border-border my-2" />
              
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left text-muted-foreground hover:text-foreground hover:bg-muted">
                <HelpCircle className="w-5 h-5" />
                <span className="font-medium">Помощь</span>
              </button>
              
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left text-destructive hover:bg-destructive/10">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Выйти</span>
              </button>
            </div>
          </nav>

          {/* Content */}
          <div className="flex-1">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Profile Settings */}
              {activeSection === 'profile' && (
                <div className="glass-card-strong p-6 space-y-6">
                  <h2 className="text-lg font-display font-semibold text-foreground">
                    Редактирование профиля
                  </h2>

                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar 
                        src={currentUser.avatar}
                        alt={currentUser.displayName}
                        size="xl"
                      />
                      <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Фото профиля</p>
                      <p className="text-sm text-muted-foreground">JPG, PNG до 5MB</p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Отображаемое имя
                      </label>
                      <Input
                        value={formData.displayName}
                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                        className="bg-white/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Имя пользователя
                      </label>
                      <Input
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="bg-white/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-white/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        О себе
                      </label>
                      <Textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Расскажите о себе..."
                        className="bg-white/50 min-h-[100px]"
                      />
                    </div>
                  </div>

                  <Button onClick={handleSave} className="cloud-button">
                    Сохранить изменения
                  </Button>
                </div>
              )}

              {/* Notifications Settings */}
              {activeSection === 'notifications' && (
                <div className="glass-card-strong p-6 space-y-6">
                  <h2 className="text-lg font-display font-semibold text-foreground">
                    Настройки уведомлений
                  </h2>

                  <div className="space-y-4">
                    {Object.entries(notifications).map(([key, value]) => {
                      const labels: Record<string, string> = {
                        likes: 'Лайки',
                        comments: 'Комментарии',
                        mentions: 'Упоминания',
                        newFollowers: 'Новые подписчики',
                        messages: 'Сообщения',
                        emailDigest: 'Email-дайджест',
                      };
                      
                      return (
                        <div 
                          key={key}
                          className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
                        >
                          <div>
                            <p className="font-medium text-foreground">{labels[key]}</p>
                            <p className="text-sm text-muted-foreground">
                              Получать уведомления о {labels[key].toLowerCase()}
                            </p>
                          </div>
                          <Switch
                            checked={value}
                            onCheckedChange={(checked) => 
                              setNotifications({ ...notifications, [key]: checked })
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {activeSection === 'privacy' && (
                <div className="glass-card-strong p-6 space-y-6">
                  <h2 className="text-lg font-display font-semibold text-foreground">
                    Настройки приватности
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-border/50">
                      <div>
                        <p className="font-medium text-foreground">Закрытый профиль</p>
                        <p className="text-sm text-muted-foreground">
                          Только друзья могут видеть ваши публикации
                        </p>
                      </div>
                      <Switch
                        checked={privacy.privateProfile}
                        onCheckedChange={(checked) => 
                          setPrivacy({ ...privacy, privateProfile: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-border/50">
                      <div>
                        <p className="font-medium text-foreground">Показывать онлайн-статус</p>
                        <p className="text-sm text-muted-foreground">
                          Другие видят, когда вы в сети
                        </p>
                      </div>
                      <Switch
                        checked={privacy.showOnline}
                        onCheckedChange={(checked) => 
                          setPrivacy({ ...privacy, showOnline: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-border/50">
                      <div>
                        <p className="font-medium text-foreground">Показывать время последнего входа</p>
                        <p className="text-sm text-muted-foreground">
                          Другие видят, когда вы были онлайн
                        </p>
                      </div>
                      <Switch
                        checked={privacy.showLastSeen}
                        onCheckedChange={(checked) => 
                          setPrivacy({ ...privacy, showLastSeen: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-foreground">Сообщения от всех</p>
                        <p className="text-sm text-muted-foreground">
                          Разрешить сообщения от не-друзей
                        </p>
                      </div>
                      <Switch
                        checked={privacy.allowMessages}
                        onCheckedChange={(checked) => 
                          setPrivacy({ ...privacy, allowMessages: checked })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeSection === 'security' && (
                <div className="glass-card-strong p-6 space-y-6">
                  <h2 className="text-lg font-display font-semibold text-foreground">
                    Безопасность
                  </h2>

                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-between h-auto py-4">
                      <div className="text-left">
                        <p className="font-medium">Изменить пароль</p>
                        <p className="text-sm text-muted-foreground">Рекомендуем менять пароль периодически</p>
                      </div>
                      <ChevronRight className="w-5 h-5" />
                    </Button>

                    <Button variant="outline" className="w-full justify-between h-auto py-4">
                      <div className="text-left">
                        <p className="font-medium">Двухфакторная аутентификация</p>
                        <p className="text-sm text-muted-foreground">Дополнительная защита аккаунта</p>
                      </div>
                      <ChevronRight className="w-5 h-5" />
                    </Button>

                    <Button variant="outline" className="w-full justify-between h-auto py-4">
                      <div className="text-left">
                        <p className="font-medium">Активные сессии</p>
                        <p className="text-sm text-muted-foreground">Управление входами в аккаунт</p>
                      </div>
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeSection === 'appearance' && (
                <div className="glass-card-strong p-6 space-y-6">
                  <h2 className="text-lg font-display font-semibold text-foreground">
                    Внешний вид
                  </h2>

                  <div>
                    <p className="font-medium text-foreground mb-4">Тема</p>
                    <div className="grid grid-cols-3 gap-4">
                      <button className="p-4 rounded-xl border-2 border-primary bg-white flex flex-col items-center gap-2">
                        <Sun className="w-6 h-6 text-primary" />
                        <span className="text-sm font-medium">Светлая</span>
                      </button>
                      <button className="p-4 rounded-xl border border-border bg-muted/30 flex flex-col items-center gap-2 hover:border-primary/50 transition-colors">
                        <Moon className="w-6 h-6 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Тёмная</span>
                      </button>
                      <button className="p-4 rounded-xl border border-border bg-muted/30 flex flex-col items-center gap-2 hover:border-primary/50 transition-colors">
                        <Shield className="w-6 h-6 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Системная</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Sound Settings */}
              {activeSection === 'sound' && (
                <div className="glass-card-strong p-6 space-y-6">
                  <h2 className="text-lg font-display font-semibold text-foreground">
                    Звук
                  </h2>
                  <p className="text-muted-foreground">Настройки звуковых уведомлений</p>
                </div>
              )}

              {/* Language Settings */}
              {activeSection === 'language' && (
                <div className="glass-card-strong p-6 space-y-6">
                  <h2 className="text-lg font-display font-semibold text-foreground">
                    Язык
                  </h2>
                  <div className="space-y-2">
                    <button className="w-full p-4 rounded-xl border-2 border-primary bg-white/50 text-left flex items-center justify-between">
                      <span>🇷🇺 Русский</span>
                      <span className="text-primary text-sm">Выбрано</span>
                    </button>
                    <button className="w-full p-4 rounded-xl border border-border hover:border-primary/50 text-left transition-colors">
                      <span>🇬🇧 English</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
