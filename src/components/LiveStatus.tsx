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
    
    // Get next show info from scheduler
    const nextPlaylistName = fppStatus?.scheduler?.nextPlaylist?.playlistName || 
                             fppStatus?.next_playlist?.playlist || "";
    const nextPlaylistTime = fppStatus?.scheduler?.nextPlaylist?.scheduledStartTimeStr || 
                            fppStatus?.next_playlist?.start_time || "";
    
    // Halloween season: October
    if (month === 10) {
      const isShowTime = hour >= 18 && hour <= 22;
      const nextShowInfo = isPlaying
        ? (nextPlaylistName ? `Nästa: ${nextPlaylistName}` : "")
        : nextPlaylistName 
          ? `Nästa: ${nextPlaylistName}`
          : countdown 
            ? `Startar om ${countdown}` 
            : (isShowTime ? "Show pågår snart" : "Startar kl 18:00");
          
      return {
        name: "Halloween Show",
        isLive: isPlaying && isShowTime,
        currentSequence: isPlaying ? currentSequence : "Väntar på start",
        nextSequence: isPlaying ? "Laddar..." : "",
        nextShow: nextShowInfo,
        icon: <Ghost className="w-5 h-5" />,
        theme: "halloween",
        progress: isPlaying ? progress : undefined,
        secondsRemaining: isPlaying ? secondsRemaining : undefined
      };
    }
    
    // Christmas season: December 1-25
    if (month === 12 && now.getDate() <= 25) {
      const isShowTime = hour >= 17 && hour <= 23;
      const nextShowInfo = isPlaying
        ? (nextPlaylistName ? `Nästa: ${nextPlaylistName}` : "")
        : nextPlaylistName 
          ? `Nästa: ${nextPlaylistName}`
          : countdown 
            ? `Startar om ${countdown}` 
            : (isShowTime ? "Show pågår snart" : "Startar kl 17:00");
          
      return {
        name: "Julshow",
        isLive: isPlaying && isShowTime,
        currentSequence: isPlaying ? currentSequence : "Väntar på start",
        nextSequence: isPlaying ? "Laddar..." : "",
        nextShow: nextShowInfo,
        icon: <TreePine className="w-5 h-5" />,
        theme: "christmas",
        progress: isPlaying ? progress : undefined,
        secondsRemaining: isPlaying ? secondsRemaining : undefined
      };
    }
    
    // Off season
    const nextShowInfo = nextPlaylistName 
      ? `Nästa: ${nextPlaylistName}`
      : month < 10 
        ? "Halloween-shower börjar i oktober" 
        : "Julshower börjar 1 december";
        
    return {
      name: "Ljusshower",
      isLive: false,
      currentSequence: "Inte säsong",
      nextSequence: "",
      nextShow: nextShowInfo,
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
    <Card className={`p-4 backdrop-blur-sm border-2 transition-all ${
      showInfo.isLive
        ? showInfo.theme === 'halloween' 
          ? 'bg-halloween/20 border-halloween' 
          : showInfo.theme === 'christmas'
            ? 'bg-christmas/20 border-christmas'
            : 'bg-primary/20 border-primary'
        : showInfo.theme === 'halloween' 
          ? 'bg-card/80 border-halloween/30' 
          : showInfo.theme === 'christmas'
            ? 'bg-card/80 border-christmas/30'
            : 'bg-card/80 border-border'
    }`}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className={`${
              showInfo.isLive
                ? showInfo.theme === 'halloween' ? 'text-halloween animate-pulse' :
                  showInfo.theme === 'christmas' ? 'text-christmas animate-pulse' :
                  'text-primary animate-pulse'
                : showInfo.theme === 'halloween' ? 'text-halloween' :
                  showInfo.theme === 'christmas' ? 'text-christmas' :
                  'text-muted-foreground'
            }`}>
              {showInfo.icon}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm">{showInfo.name}</h3>
                {showInfo.isLive && (
                  <Badge 
                    variant="default"
                    className={`text-xs animate-pulse ${
                      showInfo.theme === 'halloween' 
                        ? 'bg-halloween text-halloween-dark' 
                        : showInfo.theme === 'christmas'
                          ? 'bg-christmas text-white'
                          : 'bg-primary text-primary-foreground'
                    }`}
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
          
          <div className="text-right text-xs text-muted-foreground">
            <div>{currentTime.toLocaleTimeString('sv-SE')}</div>
            <div>{currentTime.toLocaleDateString('sv-SE')}</div>
          </div>
        </div>
        
        {showInfo.isLive && showInfo.progress !== undefined && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className={
                showInfo.theme === 'halloween' ? 'text-halloween' :
                showInfo.theme === 'christmas' ? 'text-christmas' :
                'text-primary'
              }>
                Framsteg
              </span>
              {showInfo.secondsRemaining !== undefined && (
                <span className="text-muted-foreground">{formatTime(showInfo.secondsRemaining)} kvar</span>
              )}
            </div>
            <Progress 
              value={showInfo.progress} 
              className={`h-2.5 ${
                showInfo.theme === 'halloween' ? '[&>div]:bg-halloween' :
                showInfo.theme === 'christmas' ? '[&>div]:bg-christmas' :
                '[&>div]:bg-primary'
              }`}
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default LiveStatus;