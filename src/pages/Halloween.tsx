import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ghost, Skull, Moon, Zap, Heart } from "lucide-react";
import halloweenHero from "@/assets/halloween-hero.jpg";
import { useEffect, useState } from "react";

const Halloween = () => {
  const [showStickyDonation, setShowStickyDonation] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const bottomDonation = document.getElementById('bottom-donation');
      if (bottomDonation) {
        const rect = bottomDonation.getBoundingClientRect();
        setShowStickyDonation(rect.top > window.innerHeight);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden page-transition" style={{ background: 'var(--gradient-halloween)' }}>
      
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${halloweenHero})` }}
      />
      <div className="absolute inset-0" style={{ background: 'var(--gradient-halloween)' }} />
      
      {/* Floating spooky elements - fixed to viewport */}
      {Array.from({ length: 15 }, (_, i) => (
        <div 
          key={i}
          className="fixed w-4 h-4 bg-halloween rounded-full animate-spookyFloat opacity-60 halloween-glow pointer-events-none"
          style={{ 
            animationDelay: `${i * 0.3}s`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
        />
      ))}

      {/* Sticky Donation Button */}
      {showStickyDonation && (
        <Link to="/donation" className="fixed top-4 right-4 z-50 animate-fade-in">
          <Button
            size="sm"
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 animate-pulse shadow-lg shadow-primary/50 hover:scale-110 transition-all font-bold nav-shimmer"
          >
            <Heart className="w-4 h-4 fill-current" />
            <span>Donera</span>
          </Button>
        </Link>
      )}

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Ghost className="w-20 h-20 mx-auto text-halloween animate-spookyFloat halloween-glow mb-6" />
          <h1 className="text-5xl md:text-7xl font-bold text-halloween mb-4">
            Halloween Ljusshow
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Kliv in i en värld av rysskänd häpnad där ljus dansar med skuggor, 
            och skapar en övernaturlig upplevelse som firar Halloweens magi
          </p>
        </div>

        {/* Show Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-halloween-dark/80 backdrop-blur-sm border-halloween/30 p-6">
            <Skull className="w-12 h-12 text-halloween mb-4 animate-spookyFloat" />
            <h3 className="text-2xl font-bold text-halloween mb-2">Spöklika Projektioner</h3>
            <p className="text-gray-300">
              Spökliknande figurer och kusliga scener projicerade på ytor, 
              som skapar en uppslukande hemsökt atmosfär
            </p>
          </Card>

          <Card className="bg-halloween-dark/80 backdrop-blur-sm border-halloween/30 p-6">
            <Moon className="w-12 h-12 text-halloween-secondary mb-4 animate-spookyFloat" />
            <h3 className="text-2xl font-bold text-halloween-secondary mb-2">Synkroniserade Effekter</h3>
            <p className="text-gray-300">
              Perfekt tajmade ljussekvenser synkroniserade med spöklika ljudspår 
              för maximal effekt
            </p>
          </Card>

          <Card className="bg-halloween-dark/80 backdrop-blur-sm border-halloween/30 p-6">
            <Zap className="w-12 h-12 text-halloween-accent mb-4 animate-spookyFloat" />
            <h3 className="text-2xl font-bold text-halloween-accent mb-2">Interaktiva Element</h3>
            <p className="text-gray-300">
              Rörelsekänsliga displayer som reagerar på besökare, 
              och skapar personliga skrämmande upplevelser
            </p>
          </Card>
        </div>

        {/* Show Details */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-halloween-dark/80 backdrop-blur-sm border-halloween/30 p-8">
            <h2 className="text-3xl font-bold text-halloween mb-6">Upplevelsen</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Vår Halloween-ljusshow förvandlar din kväll till en spännande resa genom ett 
                hemsökt underland. Med hjälp av banbrytande LED-teknik och anpassad programmering skapar vi 
                dynamiska displayer som berättar spöklika historier genom ljus och skugga.
              </p>
              <p>
                Från krypande dimeffekter upplysta av kusliga gröna glöd till plötsliga utbrott av 
                orange blixtar som avslöjar spöklika silhuetter, varje element är utformat för att 
                leverera rysningar och spänning samtidigt som det bevarar Halloweens festliga anda.
              </p>
              <p>
                Den 25-minuter långa showen innehåller flera akter, var och en med sitt eget tema - från en 
                kyrkogårdsscen komplett med uppstående andar till en häxas kittel som kokar med 
                magiska ljus. Finalen för samman alla element i ett spektakulärt 
                crescendo av färg och rörelse.
              </p>
            </div>
          </Card>
        </div>

        {/* Show Schedule */}
        <div id="bottom-donation" className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-halloween mb-8">Show-schema</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card className="bg-halloween-dark/80 backdrop-blur-sm border-halloween/30 p-6">
              <h3 className="text-xl font-bold text-halloween mb-2">Vardagar</h3>
              <p className="text-gray-300">19:00 - 21:00</p>
              <p className="text-sm text-gray-400">Shower var 30:e minut</p>
            </Card>
            <Card className="bg-halloween-dark/80 backdrop-blur-sm border-halloween/30 p-6">
              <h3 className="text-xl font-bold text-halloween mb-2">Helger</h3>
              <p className="text-gray-300">18:00 - 22:00</p>
              <p className="text-sm text-gray-400">Shower var 25:e minut</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Halloween;