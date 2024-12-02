<script lang="ts">
  import { onMount } from "svelte";
  import { getContext } from "svelte";
  import { key, type MapContext } from "$lib/components/map";
  import type { LatLngLiteral } from "leaflet";
  import markerIconUrl from "$lib/icons/map/marker-icon.png";
  import shadowMarkerIconUrl from "$lib/icons/map/marker-shadow.png";
  import retinaMarkerIconUrl from "$lib/icons/map/marker-icon-2x.png";
  import { formatTrackingStatus } from "$lib/utils";

  export let senderLat: number;
  export let senderLon: number;
  export let receiverLat: number;
  export let receiverLon: number;
  export let trackingStatus: string;
  export let senderMarkerLabel: string;
  export let receiverMarkerLabel: string;

  const { getMap, getLeaflet } = getContext<MapContext>(key);

  const map = getMap();
  const leaflet = getLeaflet();

  const defIcon = leaflet.icon({
    iconUrl: markerIconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
    shadowUrl: shadowMarkerIconUrl,
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
    iconRetinaUrl: retinaMarkerIconUrl,
  });

  /**
   * Calculate the position of the delivery marker based on the tracking status.
   */
  const getRoutePositionByStatus = (
    coordinates: LatLngLiteral[],
    trackingStatus: string,
  ): LatLngLiteral => {
    let percentage: number;
    switch (trackingStatus.toUpperCase()) {
      case "PICKED_UP_AT_ORIGIN":
        percentage = 0.1;
        break;
      case "FACILITY_TRANSIT":
        percentage = 0.5;
        break;
      case "OUT_FOR_DELIVERY":
        percentage = 0.8;
        break;
      case "DELIVERED":
        return coordinates[coordinates.length - 1]; // Receiver's location
      default:
        percentage = 0.1;
    }

    const index = Math.floor(percentage * (coordinates.length - 1));

    return coordinates[index];
  };

  /**
   * Lifecycle hook: Runs when the component is mounted to the DOM.
   */
  onMount(async () => {
    const L = (await import("leaflet")).default;

    await import("leaflet-routing-machine");

    const routingControl = L.Routing.control({
      show: false,
      collapsible: false,
      waypoints: [
        L.latLng(senderLat, senderLon),
        L.latLng(receiverLat, receiverLon),
      ],
      //@ts-expect-error Ignore specific TypeScript error
      draggableWaypoints: false,
      routeWhileDragging: false,
      addWaypoints: false,
      createMarker: function () {
        return null;
      },
    }).addTo(map);

    routingControl.on("routesfound", (e) => {
      const route = e.routes[0];
      const routeCoordinates: LatLngLiteral[] = route.coordinates;

      const deliveryCoords = getRoutePositionByStatus(
        routeCoordinates,
        trackingStatus,
      );

      // Add sender marker
      const senderMarker = leaflet
        .marker([senderLat, senderLon], { icon: defIcon })
        .bindPopup(`${senderMarkerLabel}`);

      senderMarker.addTo(map);

      // Add receiver marker
      const receiverMarker = leaflet
        .marker([receiverLat, receiverLon], { icon: defIcon })
        .bindPopup(`${receiverMarkerLabel}`);

      receiverMarker.addTo(map);

      // Add delivery marker
      const deliveryMarker = leaflet
        .marker([deliveryCoords.lat, deliveryCoords.lng], {
          icon: defIcon,
        })
        .bindPopup(`Delivery Status: ${formatTrackingStatus(trackingStatus)}`);

      deliveryMarker.addTo(map);

      // there is an issue related to rendering Leaflet markers in production: https://github.com/Leaflet/Leaflet/issues/4968
      // a workaround for this is to add the image URLs from a different path
      // and (for an unknown reason) render a marker w/o an icon specified (it's placed out of map bounds to "hide" it)
      const foo = leaflet.marker([90.99346179538875, 181]);
      foo.addTo(map);
    });

    // Hide leaflet-routing-machine routing container
    setTimeout(() => {
      const routingContainer = document.querySelector(
        ".leaflet-routing-container",
      );
      if (routingContainer && routingContainer instanceof HTMLElement) {
        routingContainer.style.display = "none";
      }
    }, 0);
  });
</script>
