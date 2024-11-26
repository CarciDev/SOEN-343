// Helper functions for distance and zoom level calculations
export function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

export function calculateZoomLevel(distance: number) {
  if (distance < 1) return 15;
  if (distance < 5) return 14;
  if (distance < 10) return 13;
  if (distance < 20) return 12;
  if (distance < 50) return 11;
  if (distance < 100) return 10;
  if (distance < 200) return 9;
  if (distance < 500) return 8;
  if (distance < 1000) return 7;
  return 4;
}
