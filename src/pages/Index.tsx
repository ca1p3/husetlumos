import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ghost, TreePine, Zap, Heart, MapPin } from "lucide-react";
import heroImage from "@/assets/huset-lumos-hero.jpg";
import LiveStatus from "@/components/LiveStatus";
import Schedule from "@/components/Schedule";

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
            Fantastiska ljusshower som förvandlar Halloween och jul till magiska upplevelser
          </p>
        </div>

        {/* Live Status */}
        <div className="mb-8 max-w-2xl w-full">
          <LiveStatus />
        </div>

        {/* Schedule */}
        <div className="mb-8 max-w-2xl w-full">
          <Schedule />
        </div>

        {/* Theme Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
          {/* Halloween Card */}
          <div className="group">
            <Card className="theme-card p-8 bg-card/50 backdrop-blur-sm border-2 border-halloween/30 h-full relative overflow-hidden cursor-not-allowed">
              {/* Construction Tape Overlay */}
              <div className="absolute inset-0 pointer-events-none z-10">
                <div className="absolute top-12 left-0 w-full h-12 bg-gradient-to-r from-yellow-400/0 via-yellow-400/90 to-yellow-400/0 transform -rotate-12 flex items-center justify-center">
                  <div className="text-black font-bold text-sm tracking-wider whitespace-nowrap">
                    ⚠ UNDER KONSTRUKTION ⚠ UNDER KONSTRUKTION ⚠ UNDER KONSTRUKTION ⚠
                  </div>
                </div>
              </div>
              
              <div className="text-center space-y-4 flex flex-col justify-between min-h-[320px] relative">
                <div className="space-y-4">
                  <div className="relative inline-block mx-auto opacity-50">
                    <Ghost className="w-16 h-16 text-halloween" />
                  </div>
                  <h2 className="text-3xl font-bold text-halloween">Halloween Show</h2>
                  <div className="space-y-2">
                    <p className="text-muted-foreground min-h-[3rem] flex items-center justify-center">
                      Ingen Halloween-show i år, men vi planerar att återvända 2026!
                    </p>
                    <p className="text-sm text-yellow-500 font-semibold">
                      🚧 Under konstruktion
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="border-halloween/50 text-halloween/50 cursor-not-allowed opacity-50" disabled>
                  Kommer 2026
                </Button>
              </div>
            </Card>
          </div>

          {/* Christmas Card */}
          <Link to="/christmas" className="group">
            <Card className="theme-card p-8 bg-card/50 backdrop-blur-sm border-2 border-christmas/30 hover:border-christmas/60 h-full">
              <div className="text-center space-y-4 flex flex-col justify-between min-h-[320px]">
                <div className="space-y-4">
                  <TreePine className="w-16 h-16 mx-auto text-christmas animate-gentle-glow christmas-glow" />
                  <h2 className="text-3xl font-bold text-christmas">Julshow</h2>
                  <p className="text-muted-foreground min-h-[3rem] flex items-center justify-center">
                    Magiskt vinterlandskap med glittrande ljus, festlig musik och hjärtvärmande julstämning
                  </p>
                </div>
                <Button variant="outline" className="sparkle border-christmas text-christmas hover:bg-christmas hover:text-foreground">
                  Upptäck magin
                </Button>
              </div>
            </Card>
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/contact">
              <Button variant="outline" className="sparkle border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg">
                <MapPin className="w-5 h-5 mr-2" />
                Hitta hit & Kontakt
              </Button>
            </Link>
            <Link to="/donation">
              <Button variant="outline" className="sparkle border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg">
                <Heart className="w-5 h-5 mr-2" />
                Stöd oss via Swish
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-2 mt-3 text-primary font-semibold text-lg">
            <Heart className="w-5 h-5" fill="currentColor" />
            <p>10% av alla donationer går till Barncancerfonden</p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-4 text-center">
          <p className="text-muted-foreground">
            Skapar oförglömliga stunder genom ljusets konst
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;