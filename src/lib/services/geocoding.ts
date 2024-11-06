interface GeocodingConfig {
  provider: "nominatim";
  endpoint: string;
  userAgent: string;
  email?: string;
  rateLimit: number;
}

interface GeocodingResult {
  lat: number;
  lng: number;
  valid: boolean;
  displayName?: string;
  error?: string;
  countryCode?: string;
}

const lastRequestTime: { [key: string]: number } = {};

export class GeocodingService {
  private config: GeocodingConfig;

  constructor(config?: Partial<GeocodingConfig>) {
    this.config = {
      provider: "nominatim",
      endpoint: "https://nominatim.openstreetmap.org",
      userAgent: "YourAppName/1.0",
      rateLimit: 1000,
      ...config,
    };
  }

  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const lastRequest = lastRequestTime[this.config.endpoint] || 0;
    const timeSinceLastRequest = now - lastRequest;

    if (timeSinceLastRequest < this.config.rateLimit) {
      await new Promise((resolve) =>
        setTimeout(resolve, this.config.rateLimit - timeSinceLastRequest),
      );
    }

    lastRequestTime[this.config.endpoint] = Date.now();
  }

  async geocode(
    address: string,
    city: string,
    country: string,
    postalCode: string,
  ): Promise<GeocodingResult> {
    try {
      await this.enforceRateLimit();

      const searchQuery = encodeURIComponent(
        `${address}, ${city}, ${postalCode}, ${country}`,
      );

      const headers: HeadersInit = {
        "User-Agent": this.config.userAgent,
      };

      if (this.config.email) {
        headers["Email"] = this.config.email;
      }

      const response = await fetch(
        `${this.config.endpoint}/search?q=${searchQuery}&format=json&limit=1`,
        { headers },
      );

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.length) {
        return {
          valid: false,
          lat: 0,
          lng: 0,
          error: "Location not found. Please check the address.",
        };
      }

      const location = data[0];
      return {
        valid: true,
        lat: parseFloat(location.lat),
        lng: parseFloat(location.lon),
        displayName: location.display_name,
      };
    } catch (error) {
      console.error("Geocoding error:", error);
      return {
        valid: false,
        lat: 0,
        lng: 0,
        error:
          error instanceof Error
            ? error.message
            : "Failed to validate location",
      };
    }
  }
  //distance between 2 coordinates
  async calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): Promise<number> {
    try {
      const R = 6371e3; // metres
      const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
      const φ2 = (lat2 * Math.PI) / 180;
      const Δφ = ((lat2 - lat1) * Math.PI) / 180;
      const Δλ = ((lng2 - lng1) * Math.PI) / 180;

      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const distance = R * c; // in metres
      return distance;
    } catch (error) {
      console.error("Error calculating distance:", error);
      return 0;
    }
  }
}