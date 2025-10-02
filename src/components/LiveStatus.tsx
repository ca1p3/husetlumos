import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Play } from "lucide-react";

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
  scheduler?: {
    enabled: number;
    nextPlaylist?: {
      playlistName: string;
      scheduledStartTime: number;
      scheduledStartTimeStr: string;
    };
    status: string;
  };
  next_playlist?: {
    playlist: string;
    start_time: string;
  };
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
      if (!fppStatus?.scheduler?.nextPlaylist?.scheduledStartTime) {
        setCountdown("");
        return;
      }
      
      const now = Date.now();
      const nextShowTime = fppStatus.scheduler.nextPlaylist.scheduledStartTime * 1000;
      const diff = nextShowTime - now;
      
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        if (days > 0) {
          setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        } else {
          setCountdown(`${hours}h ${minutes}m ${seconds}s`);
        }
      } else {
        setCountdown("");
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [fppStatus]);

  const getShowStatus = (): ShowInfo => {
    const isPlaying = fppStatus?.status_name === "playing";
    const currentSequence = fppStatus?.current_sequence || fppStatus?.current_playlist?.description || "";
    const secondsPlayed = fppStatus?.seconds_played || 0;
    const secondsRemaining = fppStatus?.seconds_remaining || 0;
    const totalSeconds = secondsPlayed + secondsRemaining;
    const progress = totalSeconds > 0 ? (secondsPlayed / totalSeconds) * 100 : 0;
    
    // Get next show info from scheduler
    const nextPlaylistName = fppStatus?.scheduler?.nextPlaylist?.playlistName || "";
    
    const nextShowInfo = isPlaying
      ? (nextPlaylistName ? `Nästa: ${nextPlaylistName}` : "")
      : nextPlaylistName
        ? `Nästa: ${nextPlaylistName}`
        : "";
        
    return {
      name: "Ljusshow",
      isLive: isPlaying,
      currentSequence: isPlaying ? currentSequence : "Väntar på start",
      nextSequence: isPlaying ? "Laddar..." : "",
      nextShow: nextShowInfo,
      icon: <Sparkles className="w-5 h-5" />,
      theme: "default",
      progress: isPlaying ? progress : undefined,
      secondsRemaining: isPlaying ? secondsRemaining : undefined
    };
  };

  const showInfo = getShowStatus();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={`p-4 backdrop-blur-sm border-2 transition-all ${
      showInfo.isLive
        ? 'bg-primary/20 border-primary'
        : 'bg-card/80 border-border'
    }`}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className={`transition-all duration-300 ${
              showInfo.isLive 
                ? 'text-primary animate-pulse scale-110' 
                : 'text-primary/60 hover:text-primary hover:scale-110'
            }`}>
              {showInfo.icon}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm">{showInfo.name}</h3>
                {showInfo.isLive && (
                  <Badge 
                    variant="default"
                    className="text-xs animate-pulse bg-primary text-primary-foreground"
                  >
                    <Play className="w-3 h-3 mr-1" /> LIVE
                  </Badge>
                )}
              </div>
              
              <div className="text-xs text-muted-foreground space-y-1">
                {showInfo.currentSequence && (
                  <div className={`font-medium ${showInfo.isLive ? 'text-foreground' : ''}`}>
                    {showInfo.isLive ? `♫ ${showInfo.currentSequence}` : showInfo.currentSequence}
                  </div>
                )}
                {showInfo.nextShow && (
                  <div className="text-xs opacity-75">{showInfo.nextShow}</div>
                )}
              </div>
            </div>
          </div>
          
          {countdown && (
            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-0.5">Startar om</div>
              <div className="text-sm font-semibold text-primary animate-pulse">
                {countdown}
              </div>
            </div>
          )}
        </div>
        
        {showInfo.isLive && showInfo.progress !== undefined && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-primary">
                Framsteg
              </span>
              {showInfo.secondsRemaining !== undefined && (
                <span className="text-muted-foreground">{formatTime(showInfo.secondsRemaining)} kvar</span>
              )}
            </div>
            <Progress 
              value={showInfo.progress} 
              className="h-2.5 [&>div]:bg-primary"
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default LiveStatus;