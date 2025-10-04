import { Link, useLocation } from "react-router-dom";
import { Home, Ghost, Snowflake, Heart } from "lucide-react";
import { Button } from "./ui/button";

export const Navigation = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-xl font-bold text-primary hover:scale-105 transition-transform"
          >
            <span className="animate-pulse">✨</span>
            Huset Lumos
          </Link>

          <div className="flex items-center gap-2 md:gap-4">
            <Link to="/">
              <Button
                variant={isActive("/") ? "default" : "ghost"}
                size="sm"
                className="gap-2 hover:scale-105 transition-transform"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Hem</span>
              </Button>
            </Link>

            <Link to="/halloween">
              <Button
                variant={isActive("/halloween") ? "default" : "ghost"}
                size="sm"
                className="gap-2 hover:scale-105 transition-transform"
              >
                <Ghost className="w-4 h-4" />
                <span className="hidden sm:inline">Halloween</span>
              </Button>
            </Link>

            <Link to="/christmas">
              <Button
                variant={isActive("/christmas") ? "default" : "ghost"}
                size="sm"
                className="gap-2 hover:scale-105 transition-transform"
              >
                <Snowflake className="w-4 h-4" />
                <span className="hidden sm:inline">Jul</span>
              </Button>
            </Link>

            <Link to="/donation">
              <Button
                size="sm"
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 animate-pulse shadow-lg shadow-primary/50 hover:scale-110 transition-all font-bold"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span className="hidden sm:inline">Donera</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
