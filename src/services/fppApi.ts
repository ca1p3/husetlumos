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
  private async fetchWithTimeout(url: string, timeout = 5000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        mode: 'cors',
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
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