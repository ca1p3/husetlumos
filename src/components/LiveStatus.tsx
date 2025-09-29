import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Ghost, TreePine, Play, Clock, Wifi, WifiOff } from "lucide-react";

interface ShowInfo {
  name: string;
  isLive: boolean;
  currentSequence: string;
  nextShow: string;
  icon: React.ReactNode;
  theme: string;
}

interface FPPPlaybackInfo {
  currentSong: string;
  nextSong: string;
  progressSeconds: number;
  remainingSeconds: number;
  progressPercent: number;
}

interface HAConnectionStatus {
  connected: boolean;
  lastUpdate: Date | null;
}

// Home Assistant configuration - You need to set your token
const HA_URL = 'https://rodbettan.org';
const HA_TOKEN = 'your_long_lived_access_token_here'; // Replace with your actual token

const LiveStatus = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [playbackInfo, setPlaybackInfo] = useState<FPPPlaybackInfo | null>(null);
  const [haStatus, setHaStatus] = useState<HAConnectionStatus>({ connected: false, lastUpdate: null });
  const [fppSystemStatus, setFppSystemStatus] = useState<string>('unknown');
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Fetch FPP status from Home Assistant
  const fetchFPPStatus = async () => {
    try {
      const [systemResponse, currentSongResponse, nextSongResponse, progressResponse, remainingResponse, progressPercentResponse] = await Promise.all([
        fetch(`${HA_URL}/api/states/sensor.fpp_system_status`, {
          headers: {
            'Authorization': `Bearer ${HA_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${HA_URL}/api/states/sensor.fpp_current_song`, {
          headers: { 'Authorization': `Bearer ${HA_TOKEN}` }
        }),
        fetch(`${HA_URL}/api/states/sensor.fpp_next_song`, {
          headers: { 'Authorization': `Bearer ${HA_TOKEN}` }
        }),
        fetch(`${HA_URL}/api/states/sensor.fpp_progress_seconds`, {
          headers: { 'Authorization': `Bearer ${HA_TOKEN}` }
        }),
        fetch(`${HA_URL}/api/states/sensor.fpp_remaining_seconds`, {
          headers: { 'Authorization': `Bearer ${HA_TOKEN}` }
        }),
        fetch(`${HA_URL}/api/states/sensor.fpp_progress_percentage`, {
          headers: { 'Authorization': `Bearer ${HA_TOKEN}` }
        })
      ]);

      if (systemResponse.ok) {
        const systemData = await systemResponse.json();
        setFppSystemStatus(systemData.state);

        const [currentSong, nextSong, progress, remaining, progressPercent] = await Promise.all([
          currentSongResponse.json(),
          nextSongResponse.json(),
          progressResponse.json(),
          remainingResponse.json(),
          progressPercentResponse.json()
        ]);

        setPlaybackInfo({
          currentSong: currentSong.state || 'Okänd',
          nextSong: nextSong.state || 'Okänd',
          progressSeconds: parseInt(progress.state) || 0,
          remainingSeconds: parseInt(remaining.state) || 0,
          progressPercent: parseFloat(progressPercent.state) || 0
        });

        setHaStatus({ connected: true, lastUpdate: new Date() });
      }
    } catch (error) {
      console.error('Fel vid hämtning av FPP-status:', error);
      setHaStatus({ connected: false, lastUpdate: haStatus.lastUpdate });
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchFPPStatus();
    
    // Update every 5 seconds
    const interval = setInterval(fetchFPPStatus, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Format seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getShowStatus = (): ShowInfo => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const hour = now.getHours();
    
    // Check if FPP is playing
    const isPlaying = fppSystemStatus === 'playing' || fppSystemStatus === 'idle';
    
    // Halloween season: October
    if (month === 10) {
      return {
        name: "Halloween Show",
        isLive: isPlaying,
        currentSequence: playbackInfo?.currentSong || (isPlaying ? "Spelas nu" : "Inte på luften"),
        nextShow: playbackInfo?.nextSong ? `Nästa: ${playbackInfo.nextSong}` : "Nästa show kl 18:00",
        icon: <Ghost className="w-5 h-5" />,
        theme: "halloween"
      };
    }
    
    // Christmas season: December 1-25
    if (month === 12 && now.getDate() <= 25) {
      return {
        name: "Julshow",
        isLive: isPlaying,
        currentSequence: playbackInfo?.currentSong || (isPlaying ? "Spelas nu" : "Inte på luften"),
        nextShow: playbackInfo?.nextSong ? `Nästa: ${playbackInfo.nextSong}` : "Nästa show kl 17:00",
        icon: <TreePine className="w-5 h-5" />,
        theme: "christmas"
      };
    }
    
    // Off season
    return {
      name: "Ljusshower",
      isLive: isPlaying,
      currentSequence: playbackInfo?.currentSong || "Inte säsong",
      nextShow: playbackInfo?.nextSong || (month < 10 ? "Halloween-shower börjar i oktober" : "Julshower börjar 1 december"),
      icon: <Clock className="w-5 h-5" />,
      theme: "default"
    };
  };

  // Remove old mock functions as we're using real data
  const showInfo = getShowStatus();

  return (
    <Card className={`p-4 bg-card/80 backdrop-blur-sm border-2 ${
      showInfo.theme === 'halloween' ? 'border-halloween/30' :
      showInfo.theme === 'christmas' ? 'border-christmas/30' :
      'border-border'
    }`}>
      {/* Connection status indicator */}
      <div className="flex items-center gap-2 mb-2">
        <div className={`flex items-center gap-1 text-xs ${
          haStatus.connected ? 'text-green-500' : 'text-red-500'
        }`}>
          {haStatus.connected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
          {haStatus.connected ? 'Home Assistant ansluten' : 'Home Assistant frånkopplad'}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`${
            showInfo.theme === 'halloween' ? 'text-halloween' :
            showInfo.theme === 'christmas' ? 'text-christmas' :
            'text-muted-foreground'
          }`}>
            {showInfo.icon}
          </div>
          
          <div className="flex-1">
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
              <div className="font-medium">{showInfo.currentSequence}</div>
              <div className="text-xs opacity-75">{showInfo.nextShow}</div>
              
              {/* Progress bar and time display */}
              {playbackInfo && showInfo.isLive && (
                <div className="mt-2 space-y-1">
                  <Progress 
                    value={playbackInfo.progressPercent} 
                    className="h-2 w-full"
                  />
                  <div className="flex justify-between text-xs opacity-75">
                    <span>{formatTime(playbackInfo.progressSeconds)}</span>
                    <span>{formatTime(playbackInfo.progressSeconds + playbackInfo.remainingSeconds)}</span>
                  </div>
                </div>
              )}
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