import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";
  const referer = request.headers.get("referer") || "";

  fetch("https://app.athenahq.ai/api/robots", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer 59d802af-c2f4-4f6a-adc0-395ca87c3450" },
    body: JSON.stringify({ userAgent, referer, path: "/robots.txt" })
  }).catch(console.error);

  const response = await fetch("https://app.athenahq.ai/api/robots-txt/59d802af-c2f4-4f6a-adc0-395ca87c3450");
  const robotsTxt = await response.text();

  return new Response(robotsTxt, {
    headers: { "Content-Type": "text/plain" },
  });
} 