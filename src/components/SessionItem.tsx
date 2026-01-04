import { useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Monitor, Tablet, Globe, Clock, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Session } from '@/services/sessions';

interface SessionItemProps {
  session: Session;
  onRevoke: (sessionId: string) => Promise<void>;
}

const getDeviceIcon = (device: string) => {
  if (device.toLowerCase().includes('телефон') || device.toLowerCase().includes('iphone')) {
    return Smartphone;
  }
  if (device.toLowerCase().includes('планшет') || device.toLowerCase().includes('ipad')) {
    return Tablet;
  }
  return Monitor;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export function SessionItem({ session, onRevoke }: SessionItemProps) {
  const [isRevoking, setIsRevoking] = useState(false);
  const DeviceIcon = getDeviceIcon(session.device);

  const handleRevoke = async () => {
    setIsRevoking(true);
    try {
      await onRevoke(session.id);
    } finally {
      setIsRevoking(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'p-4 rounded-xl border transition-colors',
        session.isCurrent 
          ? 'bg-primary/5 border-primary/20' 
          : 'bg-white/50 border-border/50 hover:border-border'
      )}
    >
      <div className="flex items-start gap-4">
        {/* Device Icon */}
        <div className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
          session.isCurrent ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
        )}>
          <DeviceIcon className="w-6 h-6" />
        </div>

        {/* Session Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-foreground">
              {session.browser} • {session.os}
            </h3>
            {session.isCurrent && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                Текущая
              </span>
            )}
          </div>

          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5" />
              <span>{session.ip}</span>
              {session.location && <span>• {session.location}</span>}
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Вход: {formatDate(session.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Revoke Button */}
        {!session.isCurrent && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRevoke}
            disabled={isRevoking}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            {isRevoking ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </>
            )}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
