import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ghost, TreePine, Zap } from "lucide-react";
import heroImage from "@/assets/huset-lumos-hero.jpg";

const FloatingLight = ({ delay = 0 }: { delay?: number }) => (
  <div 
    className="absolute w-3 h-3 bg-primary rounded-full animate-float opacity-70 magical-glow"
    style={{ 
      animationDelay: `${delay}s`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`
    }}
  />
);

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden page-transition">
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/80" />
      
      {/* Floating magical lights */}
      {Array.from({ length: 12 }, (_, i) => (
        <FloatingLight key={i} delay={i * 0.5} />
      ))}
      
      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="mb-8 animate-fadeInUp">
          <div className="flex items-center justify-center mb-4">
            <Zap className="w-12 h-12 text-primary magical-glow mr-4" />
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary via-halloween to-christmas-gold bg-clip-text text-transparent">
              Huset Lumos
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl">
            Immersive light shows that transform Halloween and Christmas into magical experiences
          </p>
        </div>

        {/* Theme Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
          {/* Halloween Card */}
          <Link to="/halloween" className="group">
            <Card className="theme-card p-8 bg-card/50 backdrop-blur-sm border-2 border-halloween/30 hover:border-halloween/60">
              <div className="text-center space-y-4">
                <Ghost className="w-16 h-16 mx-auto text-halloween animate-spookyFloat halloween-glow" />
                <h2 className="text-3xl font-bold text-halloween">Halloween Show</h2>
                <p className="text-muted-foreground">
                  Spine-chilling lights, eerie animations, and haunting displays that bring the spirit of Halloween to life
                </p>
                <Button variant="outline" className="sparkle border-halloween text-halloween hover:bg-halloween hover:text-halloween-dark">
                  Enter the Haunted Experience
                </Button>
              </div>
            </Card>
          </Link>

          {/* Christmas Card */}
          <Link to="/christmas" className="group">
            <Card className="theme-card p-8 bg-card/50 backdrop-blur-sm border-2 border-christmas/30 hover:border-christmas/60">
              <div className="text-center space-y-4">
                <TreePine className="w-16 h-16 mx-auto text-christmas animate-twinkle christmas-glow" />
                <h2 className="text-3xl font-bold text-christmas">Christmas Show</h2>
                <p className="text-muted-foreground">
                  Magical winter wonderland with twinkling lights, festive music, and heartwarming holiday spirit
                </p>
                <Button variant="outline" className="sparkle border-christmas text-christmas hover:bg-christmas hover:text-foreground">
                  Discover the Magic
                </Button>
              </div>
            </Card>
          </Link>
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            Creating unforgettable moments through the art of light
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;