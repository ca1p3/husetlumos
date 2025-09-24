import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TreePine, Star, Gift, Snowflake as SnowflakeIcon } from "lucide-react";
import christmasHero from "@/assets/christmas-hero.jpg";

const TwinklingLight = ({ delay = 0 }: { delay?: number }) => (
  <div 
    className="absolute w-2 h-2 bg-christmas-gold rounded-full animate-twinkle opacity-80"
    style={{ 
      animationDelay: `${delay}s`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      boxShadow: '0 0 10px hsl(var(--christmas-gold))'
    }}
  />
);

const Snowflake = ({ delay = 0, size = 'w-1 h-1' }: { delay?: number; size?: string }) => (
  <div 
    className={`absolute ${size} bg-white rounded-full animate-snowfall opacity-60`}
    style={{ 
      animationDelay: `${delay}s`,
      animationDuration: `${8 + Math.random() * 4}s`,
      left: `${Math.random() * 100}%`,
    }}
  />
);

const Christmas = () => {
  return (
    <div className="min-h-screen relative overflow-hidden page-transition" style={{ background: 'var(--gradient-christmas)' }}>
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${christmasHero})` }}
      />
      <div className="absolute inset-0" style={{ background: 'var(--gradient-christmas)' }} />
      
      {/* Twinkling lights */}
      {Array.from({ length: 20 }, (_, i) => (
        <TwinklingLight key={`light-${i}`} delay={i * 0.2} />
      ))}
      
      {/* Falling snow */}
      {Array.from({ length: 30 }, (_, i) => (
        <Snowflake 
          key={`snow-${i}`} 
          delay={i * 0.3} 
          size={Math.random() > 0.7 ? 'w-2 h-2' : 'w-1 h-1'}
        />
      ))}
      
      {/* Navigation */}
      <div className="relative z-10 p-6">
        <Link to="/">
          <Button variant="ghost" className="text-christmas-gold hover:text-christmas-gold/80 hover:bg-christmas-gold/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Huset Lumos
          </Button>
        </Link>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <TreePine className="w-20 h-20 mx-auto text-christmas-secondary animate-gentle-glow christmas-glow mb-6" />
          <h1 className="text-5xl md:text-7xl font-bold text-christmas mb-4">
            Christmas Light Show
          </h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Experience the magic of Christmas through a breathtaking display of lights, 
            music, and wonder that brings the warmth of the season to life
          </p>
        </div>

        {/* Show Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-christmas-dark/80 backdrop-blur-sm border-christmas-gold/30 p-6">
            <Star className="w-12 h-12 text-christmas-gold mb-4 animate-gentle-glow" />
            <h3 className="text-2xl font-bold text-christmas-gold mb-2">Magical Projections</h3>
            <p className="text-green-100">
              Enchanting winter scenes and holiday imagery projected across 
              surfaces, creating a immersive wonderland
            </p>
          </Card>

          <Card className="bg-christmas-dark/80 backdrop-blur-sm border-christmas-gold/30 p-6">
            <Gift className="w-12 h-12 text-christmas mb-4 animate-gentle-glow" />
            <h3 className="text-2xl font-bold text-christmas mb-2">Musical Harmony</h3>
            <p className="text-green-100">
              Beloved Christmas carols and festive melodies perfectly 
              synchronized with dancing light patterns
            </p>
          </Card>

          <Card className="bg-christmas-dark/80 backdrop-blur-sm border-christmas-gold/30 p-6">
            <SnowflakeIcon className="w-12 h-12 text-christmas-secondary mb-4 animate-gentle-glow" />
            <h3 className="text-2xl font-bold text-christmas-secondary mb-2">Winter Effects</h3>
            <p className="text-green-100">
              Simulated snowfall, frost patterns, and twinkling icicles 
              create an authentic winter wonderland atmosphere
            </p>
          </Card>
        </div>

        {/* Show Details */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-christmas-dark/80 backdrop-blur-sm border-christmas-gold/30 p-8">
            <h2 className="text-3xl font-bold text-christmas-gold mb-6">The Experience</h2>
            <div className="space-y-4 text-green-100">
              <p>
                Our Christmas light show is a celebration of the season's warmth and joy, 
                featuring thousands of LED lights orchestrated in perfect harmony with 
                classic holiday music. The display transforms any space into a magical 
                winter wonderland that captures the heart of Christmas.
              </p>
              <p>
                From gentle snowfall effects that dance with soft blue and white lights 
                to jubilant sequences featuring red and green bursts synchronized with 
                "Jingle Bells," every moment is crafted to evoke the wonder and joy 
                of the Christmas season.
              </p>
              <p>
                The 30-minute show takes you on a journey from peaceful winter nights 
                to the excitement of Christmas morning, featuring scenes of Santa's 
                workshop, reindeer in flight, and a grand finale that celebrates the 
                spirit of giving and togetherness.
              </p>
            </div>
          </Card>
        </div>

        {/* Show Schedule */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-christmas-gold mb-8">Show Schedule</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card className="bg-christmas-dark/80 backdrop-blur-sm border-christmas-gold/30 p-6">
              <h3 className="text-xl font-bold text-christmas-gold mb-2">December 1-23</h3>
              <p className="text-green-100">6:00 PM - 9:00 PM</p>
              <p className="text-sm text-green-200">Shows every 30 minutes</p>
            </Card>
            <Card className="bg-christmas-dark/80 backdrop-blur-sm border-christmas-gold/30 p-6">
              <h3 className="text-xl font-bold text-christmas-gold mb-2">Christmas Eve & Day</h3>
              <p className="text-green-100">5:00 PM - 11:00 PM</p>
              <p className="text-sm text-green-200">Continuous shows</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Christmas;