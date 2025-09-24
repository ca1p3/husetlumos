import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Ghost, Skull, Moon, Zap } from "lucide-react";
import halloweenHero from "@/assets/halloween-hero.jpg";

const SpookySpirit = ({ delay = 0 }: { delay?: number }) => (
  <div 
    className="absolute w-4 h-4 bg-halloween rounded-full animate-spookyFloat opacity-60 halloween-glow"
    style={{ 
      animationDelay: `${delay}s`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`
    }}
  />
);

const Halloween = () => {
  return (
    <div className="min-h-screen relative overflow-hidden page-transition" style={{ background: 'var(--gradient-halloween)' }}>
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${halloweenHero})` }}
      />
      <div className="absolute inset-0" style={{ background: 'var(--gradient-halloween)' }} />
      
      {/* Floating spooky elements */}
      {Array.from({ length: 15 }, (_, i) => (
        <SpookySpirit key={i} delay={i * 0.3} />
      ))}
      
      {/* Navigation */}
      <div className="relative z-10 p-6">
        <Link to="/">
          <Button variant="ghost" className="text-halloween hover:text-halloween/80 hover:bg-halloween/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Huset Lumos
          </Button>
        </Link>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <Ghost className="w-20 h-20 mx-auto text-halloween animate-spookyFloat halloween-glow mb-6" />
          <h1 className="text-5xl md:text-7xl font-bold text-halloween mb-4">
            Halloween Light Show
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Step into a world of spine-tingling wonder where lights dance with shadows, 
            creating an otherworldly experience that celebrates the magic of Halloween
          </p>
        </div>

        {/* Show Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-halloween-dark/80 backdrop-blur-sm border-halloween/30 p-6">
            <Skull className="w-12 h-12 text-halloween mb-4 animate-spookyFloat" />
            <h3 className="text-2xl font-bold text-halloween mb-2">Haunting Projections</h3>
            <p className="text-gray-300">
              Ghostly figures and eerie scenes projected onto surfaces, 
              creating an immersive haunted atmosphere
            </p>
          </Card>

          <Card className="bg-halloween-dark/80 backdrop-blur-sm border-halloween/30 p-6">
            <Moon className="w-12 h-12 text-halloween-secondary mb-4 animate-spookyFloat" />
            <h3 className="text-2xl font-bold text-halloween-secondary mb-2">Synchronized Effects</h3>
            <p className="text-gray-300">
              Perfectly timed light sequences synchronized with spooky soundtracks 
              for maximum impact
            </p>
          </Card>

          <Card className="bg-halloween-dark/80 backdrop-blur-sm border-halloween/30 p-6">
            <Zap className="w-12 h-12 text-halloween-accent mb-4 animate-spookyFloat" />
            <h3 className="text-2xl font-bold text-halloween-accent mb-2">Interactive Elements</h3>
            <p className="text-gray-300">
              Motion-activated displays that respond to visitors, 
              creating personalized frightening experiences
            </p>
          </Card>
        </div>

        {/* Show Details */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-halloween-dark/80 backdrop-blur-sm border-halloween/30 p-8">
            <h2 className="text-3xl font-bold text-halloween mb-6">The Experience</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Our Halloween light show transforms your evening into a thrilling journey through a 
                haunted wonderland. Using cutting-edge LED technology and custom programming, we create 
                dynamic displays that tell spooky stories through light and shadow.
              </p>
              <p>
                From creeping fog effects illuminated by eerie green glows to sudden bursts of 
                orange lightning that reveal ghoulish silhouettes, every element is designed to 
                deliver chills and thrills while maintaining the festive spirit of Halloween.
              </p>
              <p>
                The 25-minute show features multiple acts, each with its own theme - from a 
                graveyard scene complete with rising spirits to a witch's cauldron brewing with 
                magical lights. The finale brings all elements together in a spectacular 
                crescendo of color and movement.
              </p>
            </div>
          </Card>
        </div>

        {/* Show Schedule */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-halloween mb-8">Show Schedule</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card className="bg-halloween-dark/80 backdrop-blur-sm border-halloween/30 p-6">
              <h3 className="text-xl font-bold text-halloween mb-2">Weekdays</h3>
              <p className="text-gray-300">7:00 PM - 9:00 PM</p>
              <p className="text-sm text-gray-400">Shows every 30 minutes</p>
            </Card>
            <Card className="bg-halloween-dark/80 backdrop-blur-sm border-halloween/30 p-6">
              <h3 className="text-xl font-bold text-halloween mb-2">Weekends</h3>
              <p className="text-gray-300">6:00 PM - 10:00 PM</p>
              <p className="text-sm text-gray-400">Shows every 25 minutes</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Halloween;