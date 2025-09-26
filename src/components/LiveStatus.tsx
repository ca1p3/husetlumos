import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ghost, TreePine, Play, Clock, Wifi, WifiOff } from "lucide-react";
import { useFPPStatus } from "@/hooks/useFPPStatus";

interface ShowInfo {
  name: string;
  isLive: boolean;
  currentSequence: string;
  nextShow: string;
  icon: React.ReactNode;
  theme: string;
}

const LiveStatus = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { data: fppStatus, isLoading, isError } = useFPPStatus();
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const getShowStatus = (): ShowInfo => {
    const now = new Date();
    const month = now.getMonth() + 1;
    
    // If we have FPP data, use it
    if (fppStatus && !isError) {
      const isLive = fppStatus.status === 1; // 1 = playing
      const currentSequence = fppStatus.current_sequence || "No sequence";
      
      // Determine theme based on season and sequence name
      let theme = "default";
      let name = "Light Show";
      let icon = <Play className="w-5 h-5" />;
      
      if (month === 10) {
        theme = "halloween";
        name = "Halloween Show";
        icon = <Ghost className="w-5 h-5" />;
      } else if (month === 12 && now.getDate() <= 25) {
        theme = "christmas";
        name = "Christmas Show";
        icon = <TreePine className="w-5 h-5" />;
      }
      
      return {
        name,
        isLive,
        currentSequence: isLive ? currentSequence : "Off Air",
        nextShow: isLive ? 
          (fppStatus.seconds_remaining ? 
            `${Math.ceil(fppStatus.seconds_remaining / 60)} min remaining` : 
            "Playing now") : 
          "Waiting for next show",
        icon,
        theme
      };
    }
    
    // Fallback to time-based logic when FPP is unavailable
    const hour = now.getHours();
    
    if (month === 10) {
      const isShowTime = hour >= 18 && hour <= 22;
      return {
        name: "Halloween Show",
        isLive: isShowTime,
        currentSequence: isShowTime ? getHalloweenSequence(now) : "Off Air",
        nextShow: isShowTime ? "Next sequence in 2 minutes" : "Next show at 6:00 PM",
        icon: <Ghost className="w-5 h-5" />,
        theme: "halloween"
      };
    }
    
    if (month === 12 && now.getDate() <= 25) {
      const isShowTime = hour >= 17 && hour <= 23;
      return {
        name: "Christmas Show",
        isLive: isShowTime,
        currentSequence: isShowTime ? getChristmasSequence(now) : "Off Air",
        nextShow: isShowTime ? "Next sequence in 90 seconds" : "Next show at 5:00 PM",
        icon: <TreePine className="w-5 h-5" />,
        theme: "christmas"
      };
    }
    
    return {
      name: "Light Shows",
      isLive: false,
      currentSequence: "Off Season",
      nextShow: month < 10 ? "Halloween shows start in October" : "Christmas shows start December 1st",
      icon: <Clock className="w-5 h-5" />,
      theme: "default"
    };
  };

  const getHalloweenSequence = (time: Date): string => {
    const sequences = [
      "Thriller - Michael Jackson",
      "Ghostbusters Theme",
      "Monster Mash",
      "This is Halloween",
      "Somebody's Watching Me",
      "Time Warp"
    ];
    
    const index = Math.floor((time.getMinutes() + time.getSeconds() / 60) / 10) % sequences.length;
    return sequences[index];
  };

  const getChristmasSequence = (time: Date): string => {
    const sequences = [
      "Jingle Bells - Traditional",
      "Carol of the Bells",
      "The Christmas Song",
      "Silent Night",
      "Deck the Halls",
      "White Christmas",
      "Feliz Navidad"
    ];
    
    const index = Math.floor((time.getMinutes() + time.getSeconds() / 60) / 7) % sequences.length;
    return sequences[index];
  };

  const showInfo = getShowStatus();

  return (
    <Card className={`p-4 bg-card/80 backdrop-blur-sm border-2 ${
      showInfo.theme === 'halloween' ? 'border-halloween/30' :
      showInfo.theme === 'christmas' ? 'border-christmas/30' :
      'border-border'
    }`}>
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
              
              {/* FPP Connection Status */}
              <div className="flex items-center gap-1">
                {isLoading ? (
                  <Clock className="w-3 h-3 text-muted-foreground animate-pulse" />
                ) : isError ? (
                  <WifiOff className="w-3 h-3 text-destructive" />
                ) : (
                  <Wifi className="w-3 h-3 text-muted-foreground" />
                )}
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <div className="font-medium">{showInfo.currentSequence}</div>
              <div className="text-xs opacity-75">{showInfo.nextShow}</div>
              {isError && (
                <div className="text-xs text-destructive">FPP Controller offline - using schedule</div>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-right text-xs text-muted-foreground">
          <div>{currentTime.toLocaleTimeString()}</div>
          <div>{currentTime.toLocaleDateString()}</div>
          {fppStatus && (
            <div className="text-xs opacity-75">
              FPP v{fppStatus.fppd}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default LiveStatus;