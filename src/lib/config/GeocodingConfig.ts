import axios from "axios";

// Define interface for geocoding response
interface GeocodingResponse {
  valid: boolean;
  lat?: number;
  lng?: number;
  error?: string;
  formattedAddress?: string;
}

export const geocodingService = {
  geocode: async (
    address: string,
    city: string,
    country: string,
  ): Promise<GeocodingResponse> => {
    // Replace spaces in each part with "+"
    const formattedAddress = address.replace(/\s+/g, "+");
    const formattedCity = city.replace(/\s+/g, "+");
    const formattedCountry = country.replace(/\s+/g, "+");

    // Construct the full address with "+" as the space separator
    const fullAddress = `${formattedAddress}+${formattedCity}+${formattedCountry}`;

    try {
      const response = await axios.get(
        `https://geocode.maps.co/search?q=${fullAddress}&api_key=6736cc8dc9ada175503049tcqd3c1fd`,
      );

      const res = response.data[0];

      // Check API response status
      if (!res) {
        return {
          valid: false,
          error: `Geocoding API Error: ${response.data.status}`,
        };
      }

      return {
        valid: true,
        lat: Number(res.lat),
        lng: Number(res.lon),
      };
    } catch (error) {
      console.error("Geocoding error:", error);
      return {
        valid: false,
        error: "An error occurred during geocoding",
      };
    }
  },

  async calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
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
  },
};
