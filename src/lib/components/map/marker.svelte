<script lang="ts">
  import { createEventDispatcher, getContext } from "svelte";
  import { key, type MapContext } from "$lib/components/map";

  export let lat: number;
  export let lon: number;
  export let label: string;
  export let customIconURL: string;

  // get methods from context
  const { getLeaflet, getMap } = getContext<MapContext>(key);

  // get Leaflet instance and map from context
  const leaflet = getLeaflet();
  const map = getMap();

  var customMarkerIcon = leaflet.icon({
    iconUrl: customIconURL,

    iconSize: [50, 80], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
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
