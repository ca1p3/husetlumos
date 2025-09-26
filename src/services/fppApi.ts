// FPP Controller API Service
const FPP_IP = "192.168.1.166";
const FPP_BASE_URL = `http://${FPP_IP}/api`;

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
  private async fetchWithTimeout(url: string, timeout = 3000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        mode: 'no-cors', // Try no-cors mode first
      });
      clearTimeout(timeoutId);
      
      // no-cors mode returns opaque response, so we can't read the data
      // This will still trigger CORS errors, so let's handle differently
      if (response.type === 'opaque') {
        throw new Error('CORS blocked - cannot access FPP controller from browser');
      }
      
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      // Try with a different approach - this is expected to fail due to CORS
      console.log('FPP Controller access blocked by browser CORS policy');
      throw new Error('Network access restricted');
    }
  }

  async getStatus(): Promise<FPPStatus> {
    try {
      const response = await this.fetchWithTimeout(`${FPP_BASE_URL}/fppd/status`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch FPP status:', error);
      throw error;
    }
  }

  async getPlaylist(name: string): Promise<FPPPlaylist> {
    try {
      const response = await this.fetchWithTimeout(`${FPP_BASE_URL}/playlist/${name}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch FPP playlist:', error);
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