import {
  GeocodingService,
} from "$lib/services/geocoding";
import { dev } from "$app/environment";

// Configuration for different environments
const config = {
  development: {
    provider: "nominatim",
    endpoint: "https://nominatim.openstreetmap.org",
    userAgent: "YourApp/1.0 (Development)",
    email: "your-email@example.com",
    rateLimit: 1000,
  },
  production: {
    provider: "nominatim",
    endpoint: "https://nominatim.openstreetmap.org",
    userAgent: "YourApp/1.0 (Production)",
    email: "your-email@example.com",
    rateLimit: 1000,
  },
} as const;

// Export the configured service
export const geocodingService = new GeocodingService(
  dev ? config.development : config.production
);