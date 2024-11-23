<script lang="ts">
  import { onMount } from "svelte";
  import { getContext } from "svelte";
  import { key, type MapContext } from "$lib/components/map";
  import senderIconURL from "$lib/icons/map/sender-marker-icon.png";
  import receiverIconURL from "$lib/icons/map/receiver-marker-icon.png";
  import trackingEventIconURL from "$lib/icons/map/tracking-event-icon.png";
  import type { LatLngLiteral } from "leaflet";

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

  const senderIcon = leaflet.icon({
    iconUrl: senderIconURL,
    iconSize: [50, 80],
    iconAnchor: [25, 80],
    popupAnchor: [0, -40],
  });

  const receiverIcon = leaflet.icon({
    iconUrl: receiverIconURL,
    iconSize: [50, 80],
    iconAnchor: [25, 80],
    popupAnchor: [0, -40],
  });

  const deliveryIcon = leaflet.icon({
    iconUrl: trackingEventIconURL,
    iconSize: [50, 80],
    iconAnchor: [25, 80],
    popupAnchor: [0, -40],
  });

  /**
   * Calculate the position of the delivery marker based on the tracking status.
   * @param coordinates - Array of route coordinates.
   * @param trackingStatus - The current tracking status.
   * @returns {LatLngLiteral} The calculated coordinates for the delivery marker.
   */
  const getRoutePositionByStatus = (
    coordinates: LatLngLiteral[],
    trackingStatus: string,
  ): LatLngLiteral => {
    let percentage: number;
    switch (trackingStatus) {
      case "PICKED_UP_AT_ORIGIN":
        percentage = 0.1;
        break;
      case "FACILITY_TRANSIT":
        percentage = 0.5;
        break;
      case "OUT_FOR_DELIVERY":
        percentage = 0.9;
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
   * Makes sure the map is initialized, calculates the route, and places markers.
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
      //@ts-expect-error Object literal may only specify known properties, and 'draggableWaypoints' does not exist in type 'RoutingControlOptions'.ts(2353)
      draggableWaypoints: false,
      routeWhileDragging: false,
      addWaypoints: false,
      createMarker: () => null, // Disable default markers
    }).addTo(map);

    routingControl.on("routesfound", (e) => {
      const route = e.routes[0];
      const routeCoordinates: LatLngLiteral[] = route.coordinates;

      const deliveryCoords = getRoutePositionByStatus(
        routeCoordinates,
        trackingStatus,
      );

      // Add the markers with custom icons after the route has been generated
      leaflet
        .marker([senderLat, senderLon], { icon: senderIcon })
        .addTo(map)
        .bindPopup(`${senderMarkerLabel}`);
      leaflet
        .marker([receiverLat, receiverLon], { icon: receiverIcon })
        .addTo(map)
        .bindPopup(`${receiverMarkerLabel}`);
      leaflet
        .marker([deliveryCoords.lat, deliveryCoords.lng], {
          icon: deliveryIcon,
        })
        .addTo(map)
        .bindPopup(`Delivery Status: ${trackingStatus}`);
    });

    // Hide routing container
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
