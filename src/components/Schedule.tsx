import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

interface PlaylistItem {
  playlist: string;
  startDate: string;
  startTime: string;
  endTime: string;
  enabled: number;
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

  const formatDateTime = (dateStr: string, timeStr: string): string => {
    if (!dateStr || !timeStr) return "";
    const date = new Date(`${dateStr}T${timeStr}`);
    return date.toLocaleString('sv-SE', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isCurrentShow = (dateStr: string, startTime: string, endTime: string): boolean => {
    const now = new Date();
    const start = new Date(`${dateStr}T${startTime}`);
    const end = new Date(`${dateStr}T${endTime}`);
    return now >= start && now <= end;
  };

  const isUpcoming = (dateStr: string, startTime: string): boolean => {
    const now = new Date();
    const start = new Date(`${dateStr}T${startTime}`);
    return start > now;
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
        {schedule.filter(item => item.enabled === 1).map((item, index) => {
          const isCurrent = isCurrentShow(item.startDate, item.startTime, item.endTime);
          const upcoming = isUpcoming(item.startDate, item.startTime);
          
          return (
            <div
              key={index}
              className={`p-3 rounded-lg border ${
                isCurrent
                  ? 'bg-primary/10 border-primary'
                  : upcoming
                    ? 'bg-accent/10 border-accent'
                    : 'bg-background/50 border-border'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-sm">{item.playlist}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Clock className="w-3 h-3" />
                    {formatDateTime(item.startDate, item.startTime)}
                  </div>
                </div>
                {isCurrent && (
                  <span className="text-xs font-semibold text-primary">PÅGÅR</span>
                )}
                {upcoming && !isCurrent && (
                  <span className="text-xs font-semibold text-accent">KOMMANDE</span>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default Schedule;
