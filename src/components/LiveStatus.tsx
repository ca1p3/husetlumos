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

interface PlaylistEntry {
  sequenceName: string;
  type: string;
}

interface PlaylistDetails {
  name: string;
  playlistInfo: {
    total_duration: number;
    total_items: number;
  };
  mainPlaylist: PlaylistEntry[];
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
  const [playlistDetails, setPlaylistDetails] = useState<PlaylistDetails | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now());
  const [baseSecondsPlayed, setBaseSecondsPlayed] = useState<number>(0);
  
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
        setLastUpdateTime(Date.now());
        setBaseSecondsPlayed(data.seconds_played || 0);
        
        // Fetch playlist details if currently playing
        if (data.status_name === 'playing' && data.current_playlist?.playlist) {
          try {
            const playlistResponse = await fetch(`https://fpp.rodbettan.org/api/playlist/${data.current_playlist.playlist}`);
            const playlistData = await playlistResponse.json();
            setPlaylistDetails(playlistData);
          } catch (error) {
            console.error('Failed to fetch playlist details:', error);
          }
        } else {
          setPlaylistDetails(null);
        }
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
    
    // Calculate real-time progress
    let secondsPlayed = baseSecondsPlayed;
    let secondsRemaining = fppStatus?.seconds_remaining || 0;
    
    if (isPlaying) {
      const elapsedSinceUpdate = (Date.now() - lastUpdateTime) / 1000;
      secondsPlayed = baseSecondsPlayed + elapsedSinceUpdate;
      secondsRemaining = Math.max(0, secondsRemaining - elapsedSinceUpdate);
    }
    
    const totalSeconds = secondsPlayed + secondsRemaining;
    const progress = totalSeconds > 0 ? (secondsPlayed / totalSeconds) * 100 : 0;
    
    // Get next sequence from playlist
    let nextSequenceName = "";
    if (isPlaying && playlistDetails && currentSequence) {
      const currentIndex = playlistDetails.mainPlaylist.findIndex(
        entry => entry.sequenceName === currentSequence
      );
      if (currentIndex !== -1 && currentIndex < playlistDetails.mainPlaylist.length - 1) {
        nextSequenceName = playlistDetails.mainPlaylist[currentIndex + 1].sequenceName;
      }
    }
    
    // Get next show info from scheduler
    const nextPlaylistName = fppStatus?.scheduler?.nextPlaylist?.playlistName || "";
    
    const nextShowInfo = isPlaying
      ? (nextPlaylistName ? `Nästa show: ${nextPlaylistName}` : "")
      : nextPlaylistName
        ? `Nästa: ${nextPlaylistName}`
        : "";
        
    return {
      name: "Ljusshow",
      isLive: isPlaying,
      currentSequence: isPlaying ? currentSequence : "Väntar på start",
      nextSequence: isPlaying && nextSequenceName ? `Nästa: ${nextSequenceName}` : "",
      nextShow: nextShowInfo,
      icon: <Sparkles className="w-5 h-5" />,
      theme: "default",
      progress: isPlaying ? progress : undefined,
      secondsRemaining: isPlaying ? Math.round(secondsRemaining) : undefined
    };
  };

  const showInfo = getShowStatus();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={`p-5 backdrop-blur-sm border-2 transition-all ${
      showInfo.isLive
        ? 'bg-primary/20 border-primary shadow-lg shadow-primary/20'
        : 'bg-card/80 border-border'
    }`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className={`relative transition-all duration-300 ${
              showInfo.isLive 
                ? 'text-primary scale-110' 
                : 'text-primary/60 hover:text-primary hover:scale-110'
            }`}>
              {showInfo.icon}
              {showInfo.isLive && (
                <>
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </span>
                </>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-lg text-foreground">{showInfo.name}</h3>
                {showInfo.isLive && (
                  <Badge 
                    variant="default"
                    className="text-xs animate-pulse bg-primary text-primary-foreground px-2 py-0.5"
                  >
                    <Play className="w-3 h-3 mr-1" /> LIVE
                  </Badge>
                )}
              </div>
              
              <div className="space-y-1.5">
                {showInfo.currentSequence && (
                  <div className={`font-semibold text-base ${showInfo.isLive ? 'text-primary' : 'text-foreground/70'}`}>
                    {showInfo.isLive ? `♫ ${showInfo.currentSequence}` : showInfo.currentSequence}
                  </div>
                )}
                {showInfo.nextSequence && (
                  <div className="text-sm text-muted-foreground">{showInfo.nextSequence}</div>
                )}
                {showInfo.nextShow && (
                  <div className="text-sm text-muted-foreground">{showInfo.nextShow}</div>
                )}
              </div>
            </div>
          </div>
          
          {countdown && (
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">Startar om</div>
              <div className="text-base font-bold text-primary animate-pulse">
                {countdown}
              </div>
            </div>
          )}
        </div>
        
        {showInfo.isLive && showInfo.progress !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-primary font-medium">
                Framsteg
              </span>
              {showInfo.secondsRemaining !== undefined && (
                <span className="text-foreground/70 font-semibold">{formatTime(showInfo.secondsRemaining)} kvar</span>
              )}
            </div>
            <Progress 
              value={showInfo.progress} 
              className="h-3 [&>div]:bg-primary [&>div]:animate-pulse"
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default LiveStatus;