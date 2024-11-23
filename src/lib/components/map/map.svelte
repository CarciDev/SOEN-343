<script lang="ts">
  import { onDestroy, onMount, setContext } from "svelte";
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
  let observer: MutationObserver;

  setContext(key, {
    getLeaflet: () => leaflet,
    getMap: () => leafletMap,
  });

  const baseLayers = {
    light: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    dark: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  };

  const baseLayerAttribution = {
    light:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    dark: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  };

  $: if (leafletMap && baseLayer) {
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

  /**
   * Styles the Leaflet zoom control buttons based on the current theme.
   *
   * - Applies background color, text color, and border styles dynamically
   *   depending on whether dark mode or light mode is active.
   * - Ensures buttons and their container have consistent styling for usability
   *   and theme alignment.
   * - Runs after a short timeout to ensure the DOM elements are available
   *   for manipulation.
   */
  function styleZoomControls() {
    setTimeout(() => {
      const zoomControls = document.querySelectorAll(".leaflet-control-zoom");

      zoomControls.forEach((control) => {
        if (control instanceof HTMLElement) {
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

  /**
   * Applies a dark theme filter to Leaflet map tiles based on the current theme.
   *
   * - Adds a CSS filter to map tiles for dark mode to invert colors and adjust hue.
   * - Restores default appearance for tiles in light mode.
   * - Targets all elements with the `.leaflet-tile` class within the map container.
   */
  function applyTileFilter() {
    const isDarkMode = $modeCurrent === false;
    const mapTiles = document.querySelectorAll(".leaflet-tile");

    mapTiles.forEach((tile) => {
      if (tile instanceof HTMLElement) {
        tile.style.filter = isDarkMode
          ? "hue-rotate(185deg) invert(100%)"
          : "none";
      }
    });
  }

  /**
   * Observes changes to the map container's DOM and applies the theme filter
   * to newly added map tiles.
   *
   * - Monitors for new `.leaflet-tile` elements being added or removed.
   * - Ensures the dark theme filter is applied to any dynamically loaded tiles.
   * - Disconnects any previous observer before starting a new one to avoid duplication.
   */
  function observeTileChanges() {
    if (observer) observer.disconnect(); // Clean up previous observer, if any

    observer = new MutationObserver(() => {
      applyTileFilter(); // Apply the filter whenever a new tile is added
    });

    observer.observe(mapEl, {
      childList: true,
      subtree: true, // Observe `.leaflet-tile` changes within the map
    });
  }

  $: {
    if (leafletMap) {
      applyTileFilter();
      observeTileChanges();
      styleZoomControls();
    }
  }

  onMount(async () => {
    leaflet = await import("leaflet");

    leafletMap = leaflet
      .map(mapEl, {
        maxBoundsViscosity: 1.0,
        zoomControl: true,
      })
      .setView([mapLat, mapLon], zoom);

    var southWest = leaflet.latLng(-89.98155760646617, -180),
      northEast = leaflet.latLng(89.99346179538875, 180);
    var bounds = leaflet.latLngBounds(southWest, northEast);

    leafletMap.setMaxBounds(bounds);
    leafletMap.on("drag", function () {
      leafletMap.panInsideBounds(bounds, { animate: false });
    });

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

  // Clean up observer when the component is destroyed
  onDestroy(() => {
    if (observer) observer.disconnect();
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
