import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

interface PlaylistItem {
  playlistName: string;
  scheduledTime: string;
  scheduledEndTime: string;
}

const Schedule = () => {
  const [schedule, setSchedule] = useState<PlaylistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch('https://fpp.rodbettan.org/api/schedule');
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setSchedule(data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch schedule:', error);
        setLoading(false);
      }
    };

    fetchSchedule();
    const interval = setInterval(fetchSchedule, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  const formatTime = (timeStr: string): string => {
    if (!timeStr) return "";
    const date = new Date(timeStr);
    return date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
  };

  const isCurrentShow = (startTime: string, endTime: string): boolean => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    return now >= start && now <= end;
  };

  if (loading) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Schema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Laddar schema...</p>
        </CardContent>
      </Card>
    );
  }

  if (schedule.length === 0) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Schema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Inget schema tillgängligt för tillfället.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Schema
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {schedule.map((item, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border ${
              isCurrentShow(item.scheduledTime, item.scheduledEndTime)
                ? 'bg-primary/10 border-primary'
                : 'bg-background/50 border-border'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium text-sm">{item.playlistName}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(item.scheduledTime)} - {formatTime(item.scheduledEndTime)}
                </div>
              </div>
              {isCurrentShow(item.scheduledTime, item.scheduledEndTime) && (
                <span className="text-xs font-semibold text-primary">PÅGÅR</span>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default Schedule;
