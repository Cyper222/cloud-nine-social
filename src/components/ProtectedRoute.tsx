import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, checkAuth, user } = useAuthStore();
  const location = useLocation();

  // Check auth on mount - всегда проверяем при монтировании компонента
  // checkAuth() теперь использует кэш, поэтому вызов безопасен
  useEffect(() => {
    // Проверяем авторизацию при монтировании
    // Если есть кэш, он загрузится мгновенно, иначе сделается запрос
    if (!isLoading) {
      checkAuth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Вызываем только при монтировании

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center sky-gradient-animated">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
