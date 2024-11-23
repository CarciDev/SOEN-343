<script lang="ts">
  import { onMount, setContext } from "svelte";
  import type L from "leaflet";
  import { key } from "$lib/components/map";
  import { modeCurrent } from "@skeletonlabs/skeleton";

  import "leaflet/dist/leaflet.css";

  export let mapLat: number;
  export let mapLon: number;
  export let zoom: number;

  let leaflet: typeof L;
  let leafletMap: L.Map;
  let mapEl: HTMLDivElement;
  let baseLayer: L.TileLayer;

  setContext(key, {
    getLeaflet: () => leaflet,
    getMap: () => leafletMap,
  });

  const baseLayers = {
    light: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    dark: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png",
  };

  const baseLayerAttribution = {
    light:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    dark: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  };

  $: if (leafletMap && baseLayer) {
    // Update the base layer reactively based on current Skeleton theme value
    const currentTheme = $modeCurrent === false ? "dark" : "light";
    const url = baseLayers[currentTheme];
    const attribution = baseLayerAttribution[currentTheme];

    const newLayer = leaflet.tileLayer(url, {
      minZoom: 2,
      maxZoom: 20,
      attribution,
    });

    leafletMap.addLayer(newLayer);
    leafletMap.removeLayer(baseLayer);
    baseLayer = newLayer;

    // Reapply zoom control styles when the theme changes (otherwise they won't be applied)
    styleZoomControls();
  }

  function styleZoomControls() {
    setTimeout(() => {
      const zoomControls = document.querySelectorAll(".leaflet-control-zoom");

      zoomControls.forEach((control) => {
        if (control instanceof HTMLElement) {
          // Apply the theme-specific styles
          const isDarkMode = $modeCurrent === false;
          control.style.backgroundColor = isDarkMode
            ? "rgba(50, 50, 50, 0.8)"
            : "rgba(255, 255, 255, 0.8)";
          control.style.borderRadius = "5px";
          control.style.padding = "5px";

          const buttons = control.querySelectorAll(
            ".leaflet-control-zoom-in, .leaflet-control-zoom-out",
          );
          buttons.forEach((button) => {
            if (button instanceof HTMLElement) {
              button.style.backgroundColor = isDarkMode ? "#333" : "#fff";
              button.style.color = isDarkMode ? "#fff" : "#333";
              button.style.border = isDarkMode
                ? "1px solid #666"
                : "1px solid #ccc";
              button.style.borderRadius = "3px";
              button.style.width = "30px";
              button.style.height = "30px";
              button.style.lineHeight = "30px";
              button.style.textAlign = "center";
              button.style.cursor = "pointer";
            }
          });
        }
      });
    }, 0);
  }

  onMount(async () => {
    leaflet = await import("leaflet");

    leafletMap = leaflet
      .map(mapEl, {
        zoomControl: true,
      })
      .setView([mapLat, mapLon], zoom);

    const initialTheme = $modeCurrent === false ? "dark" : "light";
    baseLayer = leaflet.tileLayer(baseLayers[initialTheme], {
      minZoom: 2,
      maxZoom: 20,
      attribution: baseLayerAttribution[initialTheme],
    });

    baseLayer.addTo(leafletMap);
    leafletMap.attributionControl.setPrefix(false);

    styleZoomControls(); // Style the zoom controls after mounting
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
