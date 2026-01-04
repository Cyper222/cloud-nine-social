import { useLocation, Link } from "react-router-dom";
import { useEffect, forwardRef } from "react";
import { Cloud, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = forwardRef<HTMLDivElement>((_, ref) => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div ref={ref} className="flex min-h-screen items-center justify-center sky-gradient-animated relative overflow-hidden">
      {/* Decorative clouds */}
      <div className="absolute inset-0 pointer-events-none">
        <Cloud className="absolute top-1/4 left-10 w-20 h-20 text-white/30 float-slow" />
        <Cloud className="absolute top-1/3 right-20 w-16 h-16 text-white/20 float-delayed" />
        <Cloud className="absolute bottom-1/4 left-1/4 w-24 h-24 text-white/25 float" />
      </div>
      
      <div className="text-center glass-card-strong p-12 max-w-md mx-4">
        <div className="text-8xl font-display font-bold text-primary mb-4">404</div>
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">
          Страница не найдена
        </h1>
        <p className="text-muted-foreground mb-6">
          Эта страница улетела за облака и не вернулась
        </p>
        <Button asChild className="cloud-button gap-2">
          <Link to="/">
            <Home className="w-4 h-4" />
            Вернуться на главную
          </Link>
        </Button>
      </div>
    </div>
  );
});

NotFound.displayName = 'NotFound';

export default NotFound;
