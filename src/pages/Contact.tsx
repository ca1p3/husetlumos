import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, ArrowLeft, Navigation } from "lucide-react";
import { Link } from "react-router-dom";

const Contact = () => {
  const address = "Rödbetsgatan 3, 271 54 Ystad";
  const phone = "0722392474";
  const email = "hoolmgustav@gmail.com";
  const name = "Gustav Holm";
  
  const openGoogleMaps = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${phone}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${email}`;
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

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fadeInUp">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-primary magical-glow" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-halloween to-christmas-gold bg-clip-text text-transparent mb-4">
              Hitta Hit & Kontakt
            </h1>
            <p className="text-xl text-muted-foreground">
              Välkommen att besöka oss eller ta kontakt
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Address Card */}
            <Card className="bg-card/50 backdrop-blur-sm border-2 border-primary/30 hover:border-primary/60 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-primary" />
                  Adress
                </CardTitle>
                <CardDescription>
                  Besök oss på denna adress
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-background/50 rounded-lg p-4 border border-border">
                  <p className="text-lg font-semibold text-foreground mb-2">Huset Lumos</p>
                  <p className="text-muted-foreground">{address}</p>
                </div>
                <Button 
                  onClick={openGoogleMaps}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Öppna i Google Maps
                </Button>
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card className="bg-card/50 backdrop-blur-sm border-2 border-primary/30 hover:border-primary/60 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Phone className="w-6 h-6 text-primary" />
                  Kontaktuppgifter
                </CardTitle>
                <CardDescription>
                  Hör av dig om du har frågor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-background/50 rounded-lg p-4 border border-border space-y-3">
                  <p className="text-lg font-semibold text-foreground">{name}</p>
                  
                  <button 
                    onClick={handleCall}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors w-full"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{phone}</span>
                  </button>
                  
                  <button 
                    onClick={handleEmail}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors w-full break-all"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{email}</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={handleCall}
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Ring
                  </Button>
                  <Button 
                    onClick={handleEmail}
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Maila
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map */}
          <Card className="bg-card/50 backdrop-blur-sm border-2 border-primary/30">
            <CardContent className="p-0">
              <iframe
                title="Karta till Huset Lumos"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2244.1234567890123!2d13.8251!3d55.4289!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTXCsDI1JzQ0LjAiTiAxM8KwNDknMzAuNCJF!5e0!3m2!1ssv!2sse!4v1234567890123!5m2!1ssv!2sse"
                width="100%"
                height="450"
                style={{ border: 0, borderRadius: '0.5rem' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <Card className="bg-primary/10 backdrop-blur-sm border-2 border-primary/30 p-6">
              <p className="text-foreground/80">
                Vi ser fram emot ditt besök eller att höra från dig! 🌟
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
