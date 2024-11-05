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
}

// Cache implementation for production use
export class CachedGeocodingService extends GeocodingService {
  private cache: Map<string, GeocodingResult>;
  private readonly cacheSize: number;

  constructor(config?: Partial<GeocodingConfig>, cacheSize: number = 1000) {
    super(config);
    this.cache = new Map();
    this.cacheSize = cacheSize;
  }

  private getCacheKey(
    address: string,
    city: string,
    country: string,
    postalCode: string,
  ): string {
    return `${address}|${city}|${country}|${postalCode}`.toLowerCase();
  }

  private pruneCache(): void {
    if (this.cache.size > this.cacheSize) {
      const keysToDelete = Array.from(this.cache.keys()).slice(0, 100);
      keysToDelete.forEach((key) => this.cache.delete(key));
    }
  }

  async geocode(
    address: string,
    city: string,
    country: string,
    postalCode: string,
  ): Promise<GeocodingResult> {
    const cacheKey = this.getCacheKey(address, city, country, postalCode);

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const result = await super.geocode(address, city, country, postalCode);

    if (result.valid) {
      this.cache.set(cacheKey, result);
      this.pruneCache();
    }

    return result;
  }
}
