import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch("https://ipapi.co/json/");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching geolocation:", error);
    return NextResponse.json(
      { error: "Failed to fetch geolocation" },
      { status: 500 }
    );
  }
}
