import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('Robots.txt route handler triggered');
  const userAgent = request.headers.get("user-agent") || "";
  const referer = request.headers.get("referer") || "";
  
  console.log(`Request headers - User-Agent: ${userAgent.substring(0, 50)}... | Referer: ${referer}`);

  try {
    console.log('Sending tracking data to AthenaHQ');
    fetch("https://app.athenahq.ai/api/robots", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer 59d802af-c2f4-4f6a-adc0-395ca87c3450" },
      body: JSON.stringify({ userAgent, referer, path: "/robots.txt" })
    }).catch(error => console.error('Error tracking robots.txt visit:', error));

    console.log('Fetching robots.txt content from AthenaHQ');
    // Try the endpoint from the Express example
    const response = await fetch('https://app.athenahq.ai/api/robots-txt/59d802af-c2f4-4f6a-adc0-395ca87c3450');
    
    console.log(`Response status: ${response.status}`);
    console.log(`Response content type: ${response.headers.get('content-type')}`);
    
    const robotsTxt = await response.text();
    console.log(`Response content (first 100 chars): ${robotsTxt.substring(0, 100)}...`);

    // Check if the response looks like HTML (might indicate a redirect or error page)
    if (robotsTxt.includes('<!DOCTYPE html>') || robotsTxt.includes('<html>')) {
      console.error('Received HTML instead of plain text - possible redirect or error page');
      return new Response('User-agent: *\nAllow: /', {
        headers: { "Content-Type": "text/plain" },
      });
    }

    console.log('Returning robots.txt content');
    return new Response(robotsTxt, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error('Error in robots.txt handler:', error);
    // Fallback content if there's an exception
    return new Response('User-agent: *\nAllow: /', {
      headers: { "Content-Type": "text/plain" },
    });
  }
}