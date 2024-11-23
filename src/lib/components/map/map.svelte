<script lang="ts">
  import { onMount, setContext } from "svelte";
  import type L from "leaflet";
  import { key } from "$lib/components/map";

  import "leaflet/dist/leaflet.css";

  export let mapLat: number;
  export let mapLon: number;
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
  });
</script>

<div bind:this={mapEl} class="map" />

{#if leaflet && leafletMap}
  <slot />
{/if}

<style scoped>
  .map {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    border-radius: inherit;
  }
</style>
