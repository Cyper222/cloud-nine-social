// Sessions / Devices API service

import { httpGet, httpPost } from './http';

export interface Session {
  id: string;
  ip: string;
  userAgent: string;
  browser: string;
  os: string;
  device: string;
  location?: string;
  createdAt: string;
  lastActiveAt: string;
  isCurrent: boolean;
}

export interface SessionsResponse {
  sessions: Session[];
}

// Parse user agent to get browser/OS info
const parseUserAgent = (ua: string): { browser: string; os: string; device: string } => {
  let browser = 'Неизвестный браузер';
  let os = 'Неизвестная ОС';
  let device = 'Неизвестное устройство';

  // Browser detection
  if (ua.includes('Chrome') && !ua.includes('Edge')) {
    browser = 'Chrome';
  } else if (ua.includes('Firefox')) {
    browser = 'Firefox';
  } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
    browser = 'Safari';
  } else if (ua.includes('Edge')) {
    browser = 'Edge';
  } else if (ua.includes('Opera')) {
    browser = 'Opera';
  }

  // OS detection
  if (ua.includes('Windows')) {
    os = 'Windows';
    device = 'Компьютер';
  } else if (ua.includes('Mac OS')) {
    os = 'macOS';
    device = 'Mac';
  } else if (ua.includes('Linux')) {
    os = 'Linux';
    device = 'Компьютер';
  } else if (ua.includes('Android')) {
    os = 'Android';
    device = 'Телефон';
  } else if (ua.includes('iPhone') || ua.includes('iPad')) {
    os = 'iOS';
    device = ua.includes('iPad') ? 'Планшет' : 'iPhone';
  }

  return { browser, os, device };
};

export const sessionsService = {
  // Get all active sessions
  async getSessions(): Promise<Session[]> {
    try {
      const response = await httpGet<any[]>('/auth/sessions');
      
      const sessions = Array.isArray(response) ? response : (response as any).sessions || [];
      
      // Получаем ID текущей сессии из localStorage
      const currentSessionId = localStorage.getItem('current_session_id');
      
      return sessions.map((session: any) => {
        const parsed = parseUserAgent(session.user_agent || session.userAgent || '');
        // Маппим snake_case в camelCase и добавляем недостающие поля
        return {
          id: session.id,
          ip: session.ip,
          userAgent: session.user_agent || session.userAgent || '',
          browser: parsed.browser,
          os: parsed.os,
          device: parsed.device,
          location: session.location,
          createdAt: session.created_at || session.createdAt || new Date().toISOString(),
          lastActiveAt: session.last_active_at || session.lastActiveAt || session.created_at || session.createdAt || new Date().toISOString(),
          isCurrent: session.id === currentSessionId,
        };
      });
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      
      // Return mock data for development
      return [
        {
          id: 'current',
          ip: '192.168.1.1',
          userAgent: navigator.userAgent,
          ...parseUserAgent(navigator.userAgent),
          createdAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
          isCurrent: true,
        },
      ];
    }
  },

  // Revoke a specific session by ID
  async revokeSession(sessionId: string): Promise<void> {
    await fetch(`${import.meta.env.VITE_API_URL || '/api'}/auth/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
  },

  // Revoke all sessions except current
  async revokeAllSessions(): Promise<void> {
    await httpPost('/auth/revoke-all');
  },
};
