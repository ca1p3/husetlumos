import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TreePine, Star, Gift, Snowflake as SnowflakeIcon, Heart, MapPin } from "lucide-react";
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

const Snowflake = ({ delay = 0, size = 'w-6 h-6' }: { delay?: number; size?: string }) => (
  <SnowflakeIcon 
    className={`absolute ${size} text-white animate-snowfall opacity-60`}
    style={{ 
      animationDelay: `${delay}s`,
      animationDuration: `${8 + Math.random() * 4}s`,
      left: `${Math.random() * 100}%`,
    }}
  />
);

const Christmas = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
          delay={i * 0.1} 
          size={Math.random() > 0.7 ? 'w-8 h-8' : 'w-6 h-6'}
        />
      ))}
      
      {/* Navigation */}
      <div className="relative z-10 p-6 flex justify-between items-center">
        <Link to="/">
          <Button variant="ghost" className="text-christmas-gold hover:text-christmas-gold/80 hover:bg-christmas-gold/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tillbaka till Huset Lumos
          </Button>
        </Link>
        <div className="flex gap-2">
          <Link to="/contact">
            <Button className="bg-christmas-gold text-christmas-dark hover:bg-christmas-gold/90">
              <MapPin className="w-4 h-4 mr-2" />
              Kontakt
            </Button>
          </Link>
          <Link to="/donation">
            <Button className="bg-christmas-gold text-christmas-dark hover:bg-christmas-gold/90">
              <Heart className="w-4 h-4 mr-2" />
              Donera
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Sticky Buttons */}
      <div className="fixed top-6 right-6 z-50 flex gap-2">
        <Link to="/contact">
          <Button className="bg-christmas-gold text-christmas-dark hover:bg-christmas-gold/90 shadow-lg christmas-glow animate-gentle-glow">
            <MapPin className="w-4 h-4 mr-2" />
            Kontakt
          </Button>
        </Link>
        <Link to="/donation">
          <Button className="bg-christmas-gold text-christmas-dark hover:bg-christmas-gold/90 shadow-lg christmas-glow animate-gentle-glow">
            <Heart className="w-4 h-4 mr-2" />
            Donera
          </Button>
        </Link>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <TreePine className="w-20 h-20 mx-auto text-christmas-secondary animate-gentle-glow christmas-glow mb-6" />
          <h1 className="text-5xl md:text-7xl font-bold text-christmas mb-4">
            Jul Ljusshow
          </h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Upplev julens magi genom en fantastisk uppvisning av ljus, 
            musik och förundran som för årstidstidens värme till liv
          </p>
        </div>

        {/* Show Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-christmas-dark/80 backdrop-blur-sm border-christmas-gold/30 p-6">
            <Star className="w-12 h-12 text-christmas-gold mb-4 animate-gentle-glow" />
            <h3 className="text-2xl font-bold text-christmas-gold mb-2">Magiska Projektioner</h3>
            <p className="text-green-100">
              Vid fönstret kan du kika rakt in i Nordpolen – där snögubbar dansar, pepparkakor busar och tomten förbereder sig inför julen!
            </p>
          </Card>

          <Card className="bg-christmas-dark/80 backdrop-blur-sm border-christmas-gold/30 p-6">
            <Gift className="w-12 h-12 text-christmas mb-4 animate-gentle-glow" />
            <h3 className="text-2xl font-bold text-christmas mb-2">Musikalisk Harmoni</h3>
            <p className="text-green-100">
              Älskade julsånger och festliga melodier perfekt 
              synkroniserade med dansande ljusmönster
            </p>
          </Card>

          <Card className="bg-christmas-dark/80 backdrop-blur-sm border-christmas-gold/30 p-6">
            <SnowflakeIcon className="w-12 h-12 text-christmas-secondary mb-4 animate-gentle-glow" />
            <h3 className="text-2xl font-bold text-christmas-secondary mb-2">Uppblåsbara Figurer</h3>
            <p className="text-green-100">
              Utanför huset står vår stora uppblåsbara tomte och snögubbe och hälsar glatt! Kom gärna fram och ta en rolig bild tillsammans med dem – de älskar att posa med alla barn som kommer på besök.
            </p>
          </Card>
        </div>

        {/* Show Details */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-christmas-dark/80 backdrop-blur-sm border-christmas-gold/30 p-8">
            <h2 className="text-3xl font-bold text-christmas-gold mb-6">Upplevelsen</h2>
            <div className="space-y-4 text-green-100">
              <p>
                Vår julshow är en magisk upplevelse för hela familjen – fylld med färg, musik och glädje! Tusentals ljus dansar i takt till både klassiska julsånger och moderna favoriter som alla kan sjunga med i. Tillsammans förvandlar de huset till ett levande vinterland fullt av överraskningar och stämning.
              </p>
              <p>
                Mellan showerna kan ni kika in genom fönstret och se vad som händer på Nordpolen – kanske får ni en glimt av tomten, nissarna eller dansande snögubbar! Utanför väntar också vår stora uppblåsbara tomte och snögubbe som gärna ställer upp på en rolig familjebild.
              </p>
              <p>
                Varje del av ljusshowen är skapad för att sprida julglädje, värme och ett leende till alla som tittar. Så samla familjen, ta på mössan och kom och upplev hur musiken och ljusen väcker julens magi till liv!
              </p>
            </div>
          </Card>
        </div>

        {/* Show Schedule */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-christmas-gold mb-8">Show-schema</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card className="bg-christmas-dark/80 backdrop-blur-sm border-christmas-gold/30 p-6">
              <h3 className="text-xl font-bold text-christmas-gold mb-2">Lördagar i December</h3>
              <p className="text-green-100 text-lg font-semibold mb-2">Kl 17:00, 18:00 & 19:00</p>
              <p className="text-sm text-green-200">3 shower à 20-30 minuter</p>
            </Card>
            <Card className="bg-christmas-dark/80 backdrop-blur-sm border-christmas-gold/30 p-6">
              <h3 className="text-xl font-bold text-christmas-gold mb-2">Söndagar i December</h3>
              <p className="text-green-100 text-lg font-semibold mb-2">Kl 16:00, 17:00 & 18:00</p>
              <p className="text-sm text-green-200">3 shower à 20-30 minuter</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Christmas;