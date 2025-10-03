import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Donation = () => {
  const swishNumber = "1234567890"; // Replace with actual Swish number

  const handleSwishDonation = () => {
    // Open Swish app with pre-filled number
    window.location.href = `swish://payment?data={"version":1,"payee":{"value":"${swishNumber}"},"message":{"value":"Donation till Huset Lumos"}}`;
  };

  return (
    <div className="min-h-screen relative overflow-hidden page-transition bg-gradient-to-b from-background via-background/95 to-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      
      {/* Floating magical lights */}
      {Array.from({ length: 8 }, (_, i) => (
        <div 
          key={i}
          className="absolute w-3 h-3 bg-primary rounded-full animate-float opacity-70 magical-glow"
          style={{ 
            animationDelay: `${i * 0.5}s`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
        />
      ))}

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Tillbaka
        </Link>

        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fadeInUp">
            <Heart className="w-16 h-16 mx-auto mb-4 text-primary magical-glow" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-halloween to-christmas-gold bg-clip-text text-transparent mb-4">
              Stöd Huset Lumos
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              Hjälp oss att fortsätta sprida glädje genom ljusets magi
            </p>
            <p className="text-lg text-primary font-semibold">
              10% av alla donationer går till Barncancerfonden
            </p>
          </div>

          {/* Main Donation Card */}
          <Card className="bg-card/50 backdrop-blur-sm border-2 border-primary/30 hover:border-primary/60 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Heart className="w-6 h-6 text-primary" />
                Donera via Swish
              </CardTitle>
              <CardDescription>
                Din donation hjälper oss att skapa ännu mer magi och underhålla våra ljusshower. 10% går till Barncancerfonden.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-background/50 rounded-lg p-6 border border-border">
                <p className="text-sm text-muted-foreground mb-2">Swish-nummer</p>
                <p className="text-3xl font-bold text-primary mb-4">{swishNumber}</p>
                <Button 
                  onClick={handleSwishDonation}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg"
                >
                  Öppna Swish
                </Button>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Vad din donation går till:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✨</span>
                    <span>Underhåll och uppgradering av ljusutrustning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✨</span>
                    <span>Utveckling av nya ljussekvenser och shower</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✨</span>
                    <span>Elkostnader för att driva showerna</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✨</span>
                    <span>Musik och ljudeffekter</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">❤️</span>
                    <span className="font-semibold">10% till Barncancerfonden</span>
                  </li>
                </ul>
              </div>

              <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                <p className="text-sm text-foreground/80 text-center">
                  Varje bidrag, stort som litet, gör skillnad och uppskattas enormt! ❤️
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Thank You Message */}
          <div className="text-center mt-8 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <p className="text-muted-foreground">
              Tack för ditt stöd och för att du hjälper oss att sprida magisk stämning! 🌟
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donation;
