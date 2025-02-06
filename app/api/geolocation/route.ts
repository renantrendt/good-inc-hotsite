import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic' // disable caching

export async function GET() {
  try {
    console.log('Fetching geolocation data...');
    const response = await fetch("https://ipapi.co/json/");
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Geolocation data received:', data);
    
    // Extrair apenas os campos necessários
    const locationData = {
      country_code: data.country_code,
      country_name: data.country_name,
      city: data.city,
      region: data.region
    };
    
    console.log('Returning location data:', locationData);
    return NextResponse.json(locationData);
  } catch (error) {
    console.error("Error fetching geolocation:", error);
    return NextResponse.json(
      { error: "Failed to fetch geolocation" },
      { status: 500 }
    );
  }
}
