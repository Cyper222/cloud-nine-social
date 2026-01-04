import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Bell, 
  MessageCircle, 
  Music, 
  Video, 
  Users, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { CloudLogo } from './CloudLogo';
import { Avatar } from './Avatar';
import { Button } from '@/components/ui/button';
import { currentUser } from '@/services/mockData';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { path: '/', icon: Home, label: 'Главная' },
  { path: '/explore', icon: Search, label: 'Поиск' },
  { path: '/messages', icon: MessageCircle, label: 'Сообщения', badge: 3 },
  { path: '/notifications', icon: Bell, label: 'Уведомления', badge: 5 },
  { path: '/music', icon: Music, label: 'Музыка' },
  { path: '/shorts', icon: Video, label: 'Shorts' },
  { path: '/friends', icon: Users, label: 'Друзья' },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 bg-white/80 backdrop-blur-xl border-r border-border/50 z-40">
        <div className="p-6">
          <CloudLogo size="md" />
        </div>
        
        <div className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-cloud">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                  'hover:bg-muted group',
                  isActive && 'bg-primary/10 text-primary'
                )}
              >
                <item.icon className={cn(
                  'w-5 h-5 transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                )} />
                <span className={cn(
                  'font-medium',
                  isActive ? 'text-primary' : 'text-foreground'
                )}>
                  {item.label}
                </span>
                {item.badge && (
                  <span className="ml-auto bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        <div className="p-4 border-t border-border/50">
          <NavLink
            to="/profile"
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
              'hover:bg-muted',
              location.pathname === '/profile' && 'bg-primary/10'
            )}
          >
            <Avatar 
              src={currentUser.avatar} 
              alt={currentUser.displayName}
              size="sm"
              isOnline={true}
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{currentUser.displayName}</p>
              <p className="text-sm text-muted-foreground truncate">@{currentUser.username}</p>
            </div>
          </NavLink>
          
          <NavLink
            to="/settings"
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors mt-1',
              'hover:bg-muted text-muted-foreground hover:text-foreground',
              location.pathname === '/settings' && 'bg-primary/10 text-primary'
            )}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Настройки</span>
          </NavLink>
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-border/50 z-40 px-4 flex items-center justify-between">
        <CloudLogo size="sm" />
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-xl border-t border-border/50 z-40 px-2 flex items-center justify-around">
        {navItems.slice(0, 5).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center p-2 rounded-xl transition-colors relative',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
              {item.badge && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden fixed right-0 top-0 h-full w-72 bg-white shadow-float z-50"
            >
              <div className="p-4 flex justify-between items-center border-b border-border/50">
                <CloudLogo size="sm" />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="p-4 space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
                        'hover:bg-muted',
                        isActive && 'bg-primary/10 text-primary'
                      )}
                    >
                      <item.icon className={cn(
                        'w-5 h-5',
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      )} />
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/50">
                <NavLink
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <Avatar 
                    src={currentUser.avatar} 
                    alt={currentUser.displayName}
                    size="md"
                    isOnline={true}
                  />
                  <div>
                    <p className="font-medium text-foreground">{currentUser.displayName}</p>
                    <p className="text-sm text-muted-foreground">@{currentUser.username}</p>
                  </div>
                </NavLink>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
