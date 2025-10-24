import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, ArrowLeft, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const donationSchema = z.object({
  donor_name: z.string().trim().min(1, "Namn måste fyllas i").max(50, "Namnet får vara max 50 tecken"),
  amount: z.number().min(1, "Belopp måste vara minst 1 kr").max(100000, "Belopp får vara max 100 000 kr"),
});

const Donation = () => {
  const swishNumber = "0722392474";
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState("");

  const handleSwishDonation = () => {
    // Open Swish app with pre-filled number
    window.location.href = `swish://payment?data={"version":1,"payee":{"value":"${swishNumber}"},"message":{"value":"Donation till Huset Lumos"}}`;
  };

  // Fetch top 5 donations over 100kr
  const { data: leaderboard } = useQuery({
    queryKey: ['donations-leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .gte('amount', 100)
        .order('amount', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
  });

  // Add donation mutation
  const addDonationMutation = useMutation({
    mutationFn: async (donation: { donor_name: string; amount: number }) => {
      donationSchema.parse(donation);
      const { error } = await supabase
        .from('donations')
        .insert([{
          donor_name: donation.donor_name,
          amount: donation.amount
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Tack för din donation! ❤️",
        description: "Din donation har registrerats på leaderboarden.",
      });
      setDonorName("");
      setAmount("");
      queryClient.invalidateQueries({ queryKey: ['donations-leaderboard'] });
    },
    onError: (error) => {
      toast({
        title: "Ett fel uppstod",
        description: "Kunde inte registrera donationen. Försök igen.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitDonation = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseInt(amount);
    
    if (isNaN(amountNum) || amountNum < 1) {
      toast({
        title: "Ogiltigt belopp",
        description: "Ange ett giltigt belopp i kronor.",
        variant: "destructive",
      });
      return;
    }

    addDonationMutation.mutate({
      donor_name: donorName,
      amount: amountNum,
    });
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
            <p className="text-xl text-muted-foreground mb-4">
              Hjälp oss att fortsätta sprida glädje genom ljusets magi
            </p>
            <div className="flex items-center justify-center gap-3 bg-primary/10 rounded-lg px-6 py-4 border-2 border-primary">
              <Heart className="w-8 h-8 text-primary" fill="currentColor" />
              <p className="text-2xl text-primary font-bold">
                25% av alla donationer går till Barncancerfonden
              </p>
              <Heart className="w-8 h-8 text-primary" fill="currentColor" />
            </div>
          </div>

          {/* Main Donation Card */}
          <Card className="bg-card/50 backdrop-blur-sm border-2 border-primary/30 hover:border-primary/60 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Heart className="w-6 h-6 text-primary" />
                Donera via Swish
              </CardTitle>
              <CardDescription>
                Din donation hjälper oss att skapa ännu mer magi och underhålla våra ljusshower. 25% går till Barncancerfonden.
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
                    <span className="font-semibold">25% till Barncancerfonden</span>
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

          {/* Leaderboard */}
          {leaderboard && leaderboard.length > 0 && (
            <Card className="mt-8 bg-card/50 backdrop-blur-sm border-2 border-primary/30 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-primary" />
                  Donationsleaderboard
                </CardTitle>
                <CardDescription>
                  Top 5 donatorer som donerat över 100kr
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((donation, index) => (
                    <div 
                      key={donation.id}
                      className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0 ? 'bg-primary text-primary-foreground' :
                          index === 1 ? 'bg-muted text-muted-foreground' :
                          index === 2 ? 'bg-muted/50 text-muted-foreground' :
                          'bg-background text-foreground'
                        }`}>
                          {index + 1}
                        </div>
                        <span className="font-semibold">{donation.donor_name}</span>
                      </div>
                      <span className="text-lg font-bold text-primary">{donation.amount} kr</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Add Donation Form */}
          <Card className="mt-8 bg-card/50 backdrop-blur-sm border-2 border-primary/30 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle className="text-xl">Registrera din donation</CardTitle>
              <CardDescription>
                Efter att du donerat via Swish, fyll i dina uppgifter här för att synas på leaderboarden (kräver minst 100kr)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitDonation} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="donor_name">Ditt namn</Label>
                  <Input
                    id="donor_name"
                    type="text"
                    placeholder="Ange ditt namn"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    required
                    maxLength={50}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Belopp (kr)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Ange belopp"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="1"
                    max="100000"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={addDonationMutation.isPending}
                >
                  {addDonationMutation.isPending ? "Registrerar..." : "Registrera donation"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Thank You Message */}
          <div className="text-center mt-8 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
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
