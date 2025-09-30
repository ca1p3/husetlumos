import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ghost, TreePine, Play, Clock } from "lucide-react";

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
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const getShowStatus = (): ShowInfo => {
    const now = new Date();
    const month = now.getMonth() + 1; // 0-based to 1-based
    const hour = now.getHours();
    
    // Halloween season: October
    if (month === 10) {
      const isShowTime = hour >= 18 && hour <= 22; // 6 PM to 10 PM
      return {
        name: "Halloween Show",
        isLive: isShowTime,
        currentSequence: isShowTime ? getHalloweenSequence(now) : "Inte på luften",
        nextShow: isShowTime ? "Nästa sekvens om 2 minuter" : "Nästa show kl 18:00",
        icon: <Ghost className="w-5 h-5" />,
        theme: "halloween"
      };
    }
    
    // Christmas season: December 1-25
    if (month === 12 && now.getDate() <= 25) {
      const isShowTime = hour >= 17 && hour <= 23; // 5 PM to 11 PM
      return {
        name: "Julshow",
        isLive: isShowTime,
        currentSequence: isShowTime ? getChristmasSequence(now) : "Inte på luften",
        nextShow: isShowTime ? "Nästa sekvens om 90 sekunder" : "Nästa show kl 17:00",
        icon: <TreePine className="w-5 h-5" />,
        theme: "christmas"
      };
    }
    
    // Off season
    return {
      name: "Ljusshower",
      isLive: false,
      currentSequence: "Inte säsong",
      nextShow: month < 10 ? "Halloween-shower börjar i oktober" : "Julshower börjar 1 december",
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
            </div>
            
            <div className="text-xs text-muted-foreground">
              <div className="font-medium">{showInfo.currentSequence}</div>
              <div className="text-xs opacity-75">{showInfo.nextShow}</div>
            </div>
          </div>
        </div>
        
        <div className="text-right text-xs text-muted-foreground">
          <div>{currentTime.toLocaleTimeString()}</div>
          <div>{currentTime.toLocaleDateString()}</div>
        </div>
      </div>
    </Card>
  );
};

export default LiveStatus;