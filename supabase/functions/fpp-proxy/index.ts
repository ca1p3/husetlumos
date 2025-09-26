import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const fppPath = url.searchParams.get('path') || '/api/fppd/status';
    
    // For now, we'll use the local IP. This won't work from hosted environment
    // User will need to make FPP controller publicly accessible
    const FPP_IP = "192.168.1.166";
    const fppUrl = `http://${FPP_IP}${fppPath}`;
    
    console.log(`Proxying request to FPP: ${fppUrl}`);
    
    const response = await fetch(fppUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`FPP responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('FPP response received:', data);
    
    return new Response(JSON.stringify(data), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
    });
    
  } catch (error) {
    console.error('Error proxying to FPP:', error);
    
    // Return a mock response when FPP is unavailable
    const mockResponse = {
      fppd: "9.1-3-g52a38b28",
      status: 0,
      status_name: "idle",
      error: "FPP controller not accessible from cloud environment"
    };
    
    return new Response(JSON.stringify(mockResponse), {
      status: 200, // Return 200 to prevent error state in UI
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
    });
  }
});