<script lang="ts">
  import { createEventDispatcher, getContext } from "svelte";
  import { key, type MapContext } from "$lib/components/map";

  export let lat: number;
  export let lon: number;
  export let label: string;
  export let customIconURL: string;
  export let iconSize: [number, number] = [50, 80]; // Default icon size

  // get methods from context
  const { getLeaflet, getMap } = getContext<MapContext>(key);

  // get Leaflet instance and map from context
  const leaflet = getLeaflet();
  const map = getMap();

  // create custom marker icon with dynamic size
  const customMarkerIcon = leaflet.icon({
    iconUrl: customIconURL,
    iconSize: iconSize, // use the passed icon size
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [iconSize[0] / 2, iconSize[1]], // adjust anchor based on icon size
    popupAnchor: [-3, -iconSize[1] / 2], // adjust popup anchor based on icon size
  });

  // add marker
  const marker = leaflet
    .marker([lat, lon], { icon: customMarkerIcon })
    .addTo(map);
  marker.bindPopup(label);

  // custom events following https://leafletjs.com/reference.html#marker
  const dispatch = createEventDispatcher();
  marker.on("popupopen", () => dispatch("open"));
  marker.on("popupclose", () => dispatch("close"));
</script>
