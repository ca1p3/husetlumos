import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Ghost, TreePine, Play, Clock, Wifi, WifiOff, AlertCircle } from "lucide-react";

interface FPPStatus {
  current_playlist?: {
    playlist?: string;
    type?: string;
    index?: number;
  };
  current_song?: string;
  seconds_played?: number;
  seconds_remaining?: number;
  status?: number;
  status_name?: string;
}

interface ShowInfo {
  name: string;
  isLive: boolean;
  currentSequence: string;
  nextShow: string;
  icon: React.ReactNode;
  theme: string;
  progress?: number;
  isConnected: boolean;
}

const FPP_CONTROLLER_IP = "192.168.1.166";

const LiveStatus = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [fppStatus, setFppStatus] = useState<FPPStatus | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastFetch, setLastFetch] = useState<number>(0);
  
  // Fetch FPP status
  const fetchFPPStatus = async () => {
    try {
      const response = await fetch(`http://${FPP_CONTROLLER_IP}/api/fppd/status`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setFppStatus(data);
        setIsConnected(true);
        setLastFetch(Date.now());
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Failed to fetch FPP status:', error);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    // Update current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchFPPStatus();
    
    // Fetch FPP status every 5 seconds
    const statusInterval = setInterval(fetchFPPStatus, 5000);
    
    return () => clearInterval(statusInterval);
  }, []);

  const getNextShowTime = (now: Date, month: number, hour: number): string => {
    // Halloween season: October
    if (month === 10) {
      if (hour < 18) {
        return `Nästa show börjar idag kl 18:00`;
      } else if (hour >= 22) {
        return `Nästa show börjar imorgon kl 18:00`;
      } else {
        return `Show pågår till 22:00`;
      }
    }
    
    // Christmas season: December 1-25
    if (month === 12 && now.getDate() <= 25) {
      if (hour < 17) {
        return `Nästa show börjar idag kl 17:00`;
      } else if (hour >= 23) {
        return `Nästa show börjar imorgon kl 17:00`;
      } else {
        return `Show pågår till 23:00`;
      }
    }
    
    // Off season
    if (month < 10) {
      return `Nästa show börjar i oktober`;
    } else if (month === 11) {
      return `Nästa show börjar 1 december`;
    } else {
      return `Nästa show börjar nästa oktober`;
    }
  };

  const getShowStatus = (): ShowInfo => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const hour = now.getHours();
    
    // If connected to FPP and playing
    if (isConnected && fppStatus && fppStatus.status === 1) {
      const currentSequence = fppStatus.current_song || "Okänd sekvens";
      const playlist = fppStatus.current_playlist?.playlist || "Okänd spellista";
      const progress = fppStatus.seconds_played && fppStatus.seconds_remaining 
        ? (fppStatus.seconds_played / (fppStatus.seconds_played + fppStatus.seconds_remaining)) * 100
        : 0;
      
      // Determine theme based on current time/season
      let theme = "default";
      let icon = <Play className="w-5 h-5" />;
      let showName = "Ljusshow";
      
      if (month === 10) {
        theme = "halloween";
        icon = <Ghost className="w-5 h-5" />;
        showName = "Halloween Show";
      } else if (month === 12 && now.getDate() <= 25) {
        theme = "christmas";
        icon = <TreePine className="w-5 h-5" />;
        showName = "Julshow";
      }
      
      return {
        name: showName,
        isLive: true,
        currentSequence,
        nextShow: `Spellista: ${playlist}`,
        icon,
        theme,
        progress,
        isConnected: true
      };
    }

    // Fallback to schedule-based status when not connected or not playing
    
    // Halloween season: October
    if (month === 10) {
      return {
        name: "Halloween Show",
        isLive: false,
        currentSequence: "Redo för show",
        nextShow: getNextShowTime(now, month, hour),
        icon: <Ghost className="w-5 h-5" />,
        theme: "halloween",
        isConnected
      };
    }
    
    // Christmas season: December 1-25
    if (month === 12 && now.getDate() <= 25) {
      return {
        name: "Julshow",
        isLive: false,
        currentSequence: "Redo för show",
        nextShow: getNextShowTime(now, month, hour),
        icon: <TreePine className="w-5 h-5" />,
        theme: "christmas",
        isConnected
      };
    }
    
    // Off season
    return {
      name: "Ljusshower",
      isLive: false,
      currentSequence: "Säsongsviloläge",
      nextShow: getNextShowTime(now, month, hour),
      icon: <Clock className="w-5 h-5" />,
      theme: "default",
      isConnected
    };
  };

  const showInfo = getShowStatus();
  const connectionAge = lastFetch ? Math.floor((Date.now() - lastFetch) / 1000) : 0;

  return (
    <Card className={`p-4 bg-card/80 backdrop-blur-sm border-2 ${
      showInfo.theme === 'halloween' ? 'border-halloween/30' :
      showInfo.theme === 'christmas' ? 'border-christmas/30' :
      'border-border'
    }`}>
      <div className="space-y-3">
        {/* Header Row */}
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
                    'STANDBY'
                  )}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              {showInfo.isConnected ? (
                <><Wifi className="w-3 h-3" /> Ansluten</>
              ) : (
                <><WifiOff className="w-3 h-3" /> Offline</>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Content Row */}
        <div className="space-y-2">
          <div className="text-xs">
            <div className="font-medium text-foreground">{showInfo.currentSequence}</div>
            <div className="text-muted-foreground">{showInfo.nextShow}</div>
          </div>

          {/* Progress Bar */}
          {showInfo.progress !== undefined && showInfo.progress > 0 && (
            <div className="space-y-1">
              <Progress 
                value={showInfo.progress} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {fppStatus?.seconds_played ? `${Math.floor(fppStatus.seconds_played / 60)}:${(fppStatus.seconds_played % 60).toString().padStart(2, '0')}` : '0:00'}
                </span>
                <span>
                  {fppStatus?.seconds_remaining ? `${Math.floor(fppStatus.seconds_remaining / 60)}:${(fppStatus.seconds_remaining % 60).toString().padStart(2, '0')} kvar` : ''}
                </span>
              </div>
            </div>
          )}

          {/* Show schedule info when offline for too long */}
          {!showInfo.isConnected && connectionAge > 30 && (
            <div className="text-xs text-muted-foreground opacity-75">
              Visar schemalagd information
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default LiveStatus;