// FPP Controller API Service via Supabase Edge Function
import { supabase } from "@/integrations/supabase/client";

export interface FPPStatus {
  fppd: string;
  status: number;
  status_name: string;
  current_playlist?: {
    playlist: string;
    type: string;
    index: number;
    count: number;
  };
  current_sequence?: string;
  seconds_played?: number;
  seconds_remaining?: number;
  error?: string;
}

export interface FPPPlaylist {
  name: string;
  entries: Array<{
    type: string;
    sequence?: string;
    duration?: number;
  }>;
}

class FPPApiService {
  async getStatus(): Promise<FPPStatus> {
    try {
      const { data, error } = await supabase.functions.invoke('fpp-proxy', {
        body: { path: '/api/fppd/status' }
      });
      
      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Failed to fetch FPP status via proxy:', error);
      throw error;
    }
  }

  async getPlaylist(name: string): Promise<FPPPlaylist> {
    try {
      const { data, error } = await supabase.functions.invoke('fpp-proxy', {
        body: { path: `/api/playlist/${name}` }
      });
      
      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Failed to fetch FPP playlist via proxy:', error);
      throw error;
    }
  }

  async getCurrentSequence(): Promise<string | null> {
    try {
      const status = await this.getStatus();
      return status.current_sequence || null;
    } catch (error) {
      console.error('Failed to get current sequence:', error);
      return null;
    }
  }

  isPlaying(status: FPPStatus): boolean {
    return status.status === 1; // 1 = playing, 0 = idle
  }
}

export const fppApi = new FPPApiService();