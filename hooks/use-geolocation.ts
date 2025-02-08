import { useState, useEffect } from 'react';
import { debug } from '../lib/debug';

interface GeolocationData {
  country_code: string;
  country_name: string;
}

const PHONE_CODES: { [key: string]: string } = {
  'BR': '+55',
  'US': '+1',
  'GB': '+44',
  'CA': '+1',
  'AU': '+61',
  'DE': '+49',
  'FR': '+33',
  'IT': '+39',
  'ES': '+34',
  'PT': '+351',
  // Adicione mais códigos conforme necessário
};

export function useGeolocation() {
  const [data, setData] = useState<GeolocationData>({ 
    country_code: 'BR',
    country_name: 'Brazil'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const detectLocation = async () => {
      try {
        const response = await fetch("/api/geolocation");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();
        setData({
          country_code: responseData.country_code,
          country_name: responseData.country_name
        });
      } catch (error) {
        console.error("Error detecting location:", error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    detectLocation();
  }, []);

  const getPhoneCode = (countryCode: string = data.country_code): string => {
    return PHONE_CODES[countryCode] || '+55'; // Fallback para Brasil
  };

  return {
    countryCode: data.country_code,
    countryName: data.country_name,
    phoneCode: getPhoneCode(data.country_code),
    isLoading,
    error
  };
}
