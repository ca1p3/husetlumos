import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const LiveStatus = () => {
  const [countdown, setCountdown] = useState<string>("");
  
  useEffect(() => {
    const calculateCountdown = () => {
      const targetDate = new Date('2026-12-01T00:00:00');
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setCountdown(`${days} dagar ${hours}h ${minutes}m ${seconds}s`);
      } else {
        setCountdown("Säsongen har börjat!");
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-5 backdrop-blur-sm border-2 bg-card/80 border-border">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-col md:flex-row items-center gap-4 flex-1 w-full">
            <div className="text-primary/60 hover:text-primary hover:scale-110 transition-all duration-300">
              <Sparkles className="w-5 h-5" />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <h3 className="font-bold text-lg text-foreground">Ljusshow</h3>
              </div>
              
              <div className="space-y-1.5">
                <div className="text-foreground/70 font-semibold text-base">
                  Väntar på säsongsstart
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-muted-foreground mb-1">Nedräkning till 1 dec 2026</div>
            <div className="text-base font-bold text-primary animate-pulse">
              {countdown}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LiveStatus;