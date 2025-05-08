import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";
  const referer = request.headers.get("referer") || "";
  const url = new URL(request.url);
  const path = url.pathname;

  const websiteId = "59d802af-c2f4-4f6a-adc0-395ca87c3450"; // Using the token as websiteId
  
  try {
    await fetch("https://app.athenahq.ai/api/robots", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer 59d802af-c2f4-4f6a-adc0-395ca87c3450" },
      body: JSON.stringify({ 
        websiteId, 
        url: request.url, 
        path, 
        userAgent, 
        referrer: referer 
      })
    });

    const response = await fetch("https://app.athenahq.ai/api/robots-txt/59d802af-c2f4-4f6a-adc0-395ca87c3450", {
      method: "GET",
      headers: {
        "User-Agent": userAgent,
        "Referer": referer
      }
    });
    const robotsTxt = await response.text();

    return new Response(robotsTxt, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (e) {
    console.error("Error handling robots.txt:", e);
    
    // Fallback to a basic robots.txt if the request fails
    return new Response(`User-agent: *
Allow: /`, {
      headers: { "Content-Type": "text/plain" },
    });
  }
}