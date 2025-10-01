import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Ghost, TreePine, Play, Clock } from "lucide-react";

interface FPPStatus {
  status_name: string;
  current_playlist?: {
    playlist: string;
    description: string;
  };
  current_sequence?: string;
  seconds_played?: number;
  seconds_remaining?: number;
  time?: string;
}

interface ShowInfo {
  name: string;
  isLive: boolean;
  currentSequence: string;
  nextSequence: string;
  nextShow: string;
  icon: React.ReactNode;
  theme: string;
  progress?: number;
  secondsRemaining?: number;
}

const LiveStatus = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [fppStatus, setFppStatus] = useState<FPPStatus | null>(null);
  const [countdown, setCountdown] = useState<string>("");
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchFPPStatus = async () => {
      try {
        const response = await fetch('https://fpp.rodbettan.org/api/fppd/status');
        const data = await response.json();
        setFppStatus(data);
      } catch (error) {
        console.error('Failed to fetch FPP status:', error);
      }
    };

    fetchFPPStatus();
    const interval = setInterval(fetchFPPStatus, 2000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const month = now.getMonth() + 1;
      const hour = now.getHours();
      
      let nextShowTime: Date | null = null;
      
      // Halloween season: October
      if (month === 10) {
        if (hour < 18) {
          nextShowTime = new Date(now);
          nextShowTime.setHours(18, 0, 0, 0);
        } else if (hour >= 22) {
          nextShowTime = new Date(now);
          nextShowTime.setDate(nextShowTime.getDate() + 1);
          nextShowTime.setHours(18, 0, 0, 0);
        }
      }
      
      // Christmas season: December 1-25
      if (month === 12 && now.getDate() <= 25) {
        if (hour < 17) {
          nextShowTime = new Date(now);
          nextShowTime.setHours(17, 0, 0, 0);
        } else if (hour >= 23) {
          nextShowTime = new Date(now);
          nextShowTime.setDate(nextShowTime.getDate() + 1);
          nextShowTime.setHours(17, 0, 0, 0);
        }
      }
      
      if (nextShowTime) {
        const diff = nextShowTime.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setCountdown("");
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [currentTime]);

  const getShowStatus = (): ShowInfo => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const hour = now.getHours();
    
    const isPlaying = fppStatus?.status_name === "playing";
    const currentSequence = fppStatus?.current_sequence || fppStatus?.current_playlist?.description || "";
    const secondsPlayed = fppStatus?.seconds_played || 0;
    const secondsRemaining = fppStatus?.seconds_remaining || 0;
    const totalSeconds = secondsPlayed + secondsRemaining;
    const progress = totalSeconds > 0 ? (secondsPlayed / totalSeconds) * 100 : 0;
    
    // Halloween season: October
    if (month === 10) {
      const isShowTime = hour >= 18 && hour <= 22;
      return {
        name: "Halloween Show",
        isLive: isPlaying && isShowTime,
        currentSequence: isPlaying ? currentSequence : "Inte på luften",
        nextSequence: isPlaying ? "Laddar..." : "",
        nextShow: countdown ? `Nästa show startar om ${countdown}` : (isShowTime ? "Show pågår" : "Nästa show kl 18:00"),
        icon: <Ghost className="w-5 h-5" />,
        theme: "halloween",
        progress: isPlaying ? progress : undefined,
        secondsRemaining: isPlaying ? secondsRemaining : undefined
      };
    }
    
    // Christmas season: December 1-25
    if (month === 12 && now.getDate() <= 25) {
      const isShowTime = hour >= 17 && hour <= 23;
      return {
        name: "Julshow",
        isLive: isPlaying && isShowTime,
        currentSequence: isPlaying ? currentSequence : "Inte på luften",
        nextSequence: isPlaying ? "Laddar..." : "",
        nextShow: countdown ? `Nästa show startar om ${countdown}` : (isShowTime ? "Show pågår" : "Nästa show kl 17:00"),
        icon: <TreePine className="w-5 h-5" />,
        theme: "christmas",
        progress: isPlaying ? progress : undefined,
        secondsRemaining: isPlaying ? secondsRemaining : undefined
      };
    }
    
    // Off season
    return {
      name: "Ljusshower",
      isLive: false,
      currentSequence: "Inte säsong",
      nextSequence: "",
      nextShow: month < 10 ? "Halloween-shower börjar i oktober" : "Julshower börjar 1 december",
      icon: <Clock className="w-5 h-5" />,
      theme: "default"
    };
  };

  const showInfo = getShowStatus();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={`p-4 bg-card/80 backdrop-blur-sm border-2 ${
      showInfo.theme === 'halloween' ? 'border-halloween/30' :
      showInfo.theme === 'christmas' ? 'border-christmas/30' :
      'border-border'
    }`}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`${
              showInfo.theme === 'halloween' ? 'text-halloween' :
              showInfo.theme === 'christmas' ? 'text-christmas' :
              'text-muted-foreground'
            }`}>
              {showInfo.icon}
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm">{showInfo.name}</h3>
                <Badge 
                  variant={showInfo.isLive ? "default" : "secondary"}
                  className={`text-xs ${
                    showInfo.isLive 
                      ? showInfo.theme === 'halloween' 
                        ? 'bg-halloween text-halloween-dark' 
                        : showInfo.theme === 'christmas'
                          ? 'bg-christmas text-white'
                          : 'bg-primary text-primary-foreground'
                      : ''
                  }`}
                >
                  {showInfo.isLive ? (
                    <><Play className="w-3 h-3 mr-1" /> LIVE</>
                  ) : (
                    'OFFLINE'
                  )}
                </Badge>
              </div>
              
              <div className="text-xs text-muted-foreground space-y-1">
                {showInfo.isLive && showInfo.currentSequence && (
                  <div className="font-medium">Spelas nu: {showInfo.currentSequence}</div>
                )}
                {!showInfo.isLive && showInfo.currentSequence && (
                  <div className="font-medium">{showInfo.currentSequence}</div>
                )}
                <div className="text-xs opacity-75">{showInfo.nextShow}</div>
              </div>
            </div>
          </div>
          
          <div className="text-right text-xs text-muted-foreground">
            <div>{currentTime.toLocaleTimeString('sv-SE')}</div>
            <div>{currentTime.toLocaleDateString('sv-SE')}</div>
          </div>
        </div>
        
        {showInfo.isLive && showInfo.progress !== undefined && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Framsteg</span>
              {showInfo.secondsRemaining !== undefined && (
                <span>{formatTime(showInfo.secondsRemaining)} kvar</span>
              )}
            </div>
            <Progress 
              value={showInfo.progress} 
              className={`h-2 ${
                showInfo.theme === 'halloween' ? '[&>div]:bg-halloween' :
                showInfo.theme === 'christmas' ? '[&>div]:bg-christmas' :
                ''
              }`}
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default LiveStatus;