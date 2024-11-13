<script lang="ts">
  import { onMount, setContext } from "svelte";

  import type L from "leaflet";
  import { key } from "$lib/components/map";

  import "leaflet/dist/leaflet.css";

  export let lat: number;
  export let lon: number;
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

    // Define bounds (example bounds around the world)
    const southWest = leaflet.latLng(-90, -180);
    const northEast = leaflet.latLng(90, 180);
    const bounds = leaflet.latLngBounds(southWest, northEast);

    leafletMap = leaflet
      .map(mapEl, {
        zoomControl: true,
      })
      .setView([lat, lon], zoom);

    leaflet
      .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        minZoom: 0,
        maxZoom: 20,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      })
      .addTo(leafletMap);

    leafletMap.attributionControl.setPrefix(false);

    // You can draw shapes on the map
    // leaflet.circle([lat, lon], { radius: 200000 }).addTo(leafletMap);

    const route = leaflet.polyline(
      [
        [57.74, 11.94], // Starting point
        [57.76, 11.95], // Intermediate point
        [57.78, 11.96], // Ending point
      ],
      {
        color: "blue", // Color of the line
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
