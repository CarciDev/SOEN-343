<script lang="ts">
  import { onMount, setContext } from "svelte";
  import type L from "leaflet";
  import { key } from "$lib/components/map";

  import "leaflet/dist/leaflet.css";

  export let mapLat: number;
  export let mapLon: number;
  export let senderLat: number;
  export let senderLon: number;
  export let receiverLat: number;
  export let receiverLon: number;
  export let zoom: number;

  let leaflet: typeof L;
  let leafletMap: L.Map;
  let mapEl: HTMLDivElement;

  setContext(key, {
    getLeaflet: () => leaflet,
    getMap: () => leafletMap,
  });

  onMount(async () => {
    leaflet = await import("leaflet");

    leafletMap = leaflet
      .map(mapEl, {
        zoomControl: true,
      })
      .setView([mapLat, mapLon], zoom);

    leaflet
      .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        minZoom: 0,
        maxZoom: 20,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      })
      .addTo(leafletMap);

    leafletMap.attributionControl.setPrefix(false);

    // Function to calculate the number of intermediary points based on distance
    function calculateNumberOfPoints(
      startLat: number,
      startLon: number,
      endLat: number,
      endLon: number,
    ): number {
      const R = 6371; // Radius of the Earth in kilometers
      const dLat = ((endLat - startLat) * Math.PI) / 180;
      const dLon = ((endLon - startLon) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((startLat * Math.PI) / 180) *
          Math.cos((endLat * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in kilometers

      // Adjust the number of points based on the distance
      if (distance < 50) return 5; // Short distance
      if (distance < 200) return 20; // Medium distance
      if (distance < 1000) return 50; // Long distance
      return 100; // Very long distance
    }

    // Function to generate random intermediary points
    function generateIntermediaryPoints(
      startLat: number,
      startLon: number,
      endLat: number,
      endLon: number,
      numberOfPoints: number,
    ): [number, number][] {
      const points: [number, number][] = [];
      const latDiff = endLat - startLat;
      const lonDiff = endLon - startLon;

      for (let i = 1; i <= numberOfPoints; i++) {
        const factor = i / (numberOfPoints + 1);
        const randomLat =
          startLat + latDiff * factor + (Math.random() - 0.5) * 0.1; // Small random adjustment
        const randomLon =
          startLon + lonDiff * factor + (Math.random() - 0.5) * 0.1; // Small random adjustment
        points.push([randomLat, randomLon]);
      }
      return points;
    }

    // Calculate the number of points based on distance
    const numberOfPoints = calculateNumberOfPoints(
      senderLat,
      senderLon,
      receiverLat,
      receiverLon,
    );

    // Generate intermediary points
    const intermediaryPoints = generateIntermediaryPoints(
      senderLat,
      senderLon,
      receiverLat,
      receiverLon,
      numberOfPoints,
    );

    // Combine all points to form a polyline
    const route = leaflet.polyline(
      [
        [senderLat, senderLon],
        ...intermediaryPoints,
        [receiverLat, receiverLon],
      ],
      {
        color: "orange", // Color of the line
        weight: 4, // Line thickness
        opacity: 0.7, // Line opacity
      },
    );

    // Add the polyline to the map
    route.addTo(leafletMap);
  });
</script>

<div bind:this={mapEl} class="map" />

{#if leaflet && leafletMap}
  <slot />
{/if}

<style scoped>
  .map {
    position: absolute;
    inset: 0;
    z-index: 1;
    border-radius: 0.75rem;
  }
</style>
