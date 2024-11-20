<script lang="ts">
  import Map from "$lib/components/map/map.svelte";
  import Marker from "$lib/components/map/marker.svelte";
  import senderIconURL from "$lib/icons/map/sender-marker-icon.png";
  import receiverIconURL from "$lib/icons/map/receiver-marker-icon.png";
  import trackingEventIconURL from "$lib/icons/map/tracking-event-icon.png";
  import { formatDbReservationDate, formatTrackingStatus } from "$lib/utils.js";
  import GameFacade from "$lib/components/Game/GameFacade.svelte";
  import { onMount } from "svelte";
  import { UserRole } from "@prisma/client";

  export let data;

  const lat1: number = Number(data.origin?.lat) || 0;
  const lon1: number = Number(data.origin?.lng) || 0;
  const lat2: number = Number(data.destination?.lat) || 0;
  const lon2: number = Number(data.destination?.lng) || 0;

  const avgLat = (lat1 + lat2) / 2;
  const avgLon = (lon1 + lon2) / 2;
  let zoomLevel = 12; // default zoom level

  onMount(() => {
    // Calculate a more realistic zoom based on distance
    const distance = getDistance(lat1, lon1, lat2, lon2); // Distance in km
    zoomLevel = calculateZoomLevel(distance);
  });

  // Enum for tracking status
  enum TrackingStatus {
    PICKED_UP_AT_ORIGIN = "PICKED_UP_AT_ORIGIN",
    FACILITY_TRANSIT = "FACILITY_TRANSIT",
    OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
    DELIVERED = "DELIVERED",
  }

  // Helper functions for distance and zoom level calculations
  function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
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

  function calculateZoomLevel(distance: number) {
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

  // Get the latest event
  const latestEvent = data.events.length > 0 ? data.events[0] : null;
  let eventLat = lat1; // Default to sender's location
  let eventLon = lon1;

  // Set the event marker location based on the latest tracking event
  if (latestEvent) {
    switch (latestEvent.type) {
      case TrackingStatus.PICKED_UP_AT_ORIGIN:
        eventLat = lat1;
        eventLon = lon1;
        break;
      case TrackingStatus.FACILITY_TRANSIT:
        // Intermediate point between sender and receiver
        eventLat = (lat1 + lat2) / 2;
        eventLon = (lon1 + lon2) / 2;
        break;
      case TrackingStatus.OUT_FOR_DELIVERY:
        // Closer to the receiver's location
        eventLat = lat2 - (lat2 - lat1) * 0.1;
        eventLon = lon2 - (lon2 - lon1) * 0.1;
        break;
      case TrackingStatus.DELIVERED:
        eventLat = lat2;
        eventLon = lon2;
        break;
    }
  }
</script>

<div class="container mx-auto py-10">
  <h1 class="mb-6 text-center text-3xl font-bold">Track</h1>

  <h2 class="mb-6 text-2xl font-bold">
    Item {data.transaction.trackingNumber}
  </h2>

  <!-- Information about origin, destination, and status -->
  <div class="mb-6 columns-3">
    <div class="card p-4">
      <h3 class="text-xl font-bold">Origin</h3>
      {data.origin?.address1 || ""}{#if data.origin?.address1}<br />{/if}
      {data.origin?.address2 || ""}{#if data.origin?.address2}<br />{/if}
      {data.origin?.city || ""}
      {data.origin?.administrativeArea || ""}
      {data.origin?.postalCode || ""}{#if data.origin?.city}<br />{/if}
      {data.origin?.countryCode || ""}
      <br /><br />
    </div>
    <div class="card p-4">
      <h3 class="text-xl font-bold">Destination</h3>
      {data.destination?.address1 ||
        ""}{#if data.destination?.address1}<br />{/if}
      {data.destination?.address2 ||
        ""}{#if data.destination?.address2}<br />{/if}
      {data.destination?.city || ""}
      {data.destination?.administrativeArea || ""}
      {data.destination?.postalCode ||
        ""}{#if data.destination?.city}<br />{/if}
      {data.destination?.countryCode || ""}
      <br /><br />
    </div>
    <div class="card p-4">
      <div class="text-xl font-bold">Status</div>
      {#if data.events.length > 0}
        {data.events.length > 0
          ? formatTrackingStatus(data.events[0].type)
          : ""}
        <br />
        Last updated: {formatDbReservationDate(
          data.events[0].createdAt ?? new Date(),
        )}, {data.events[0].createdAt?.toLocaleTimeString()}
        <br />
        Shipment paid for: {data.transaction.createdAt
          ? formatDbReservationDate(data.transaction.createdAt)
          : ""}
        <br />
        {#if data.eta}
          Promised delivery date: {formatDbReservationDate(data.eta)}
        {/if}
      {:else}
        No tracking history yet
      {/if}
    </div>
  </div>

  <!-- Tracking history and live map -->
  <h3 class="mb-6 text-xl font-bold">Tracking History</h3>
  <div class="table-container mb-6">
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Date</th>
          <th>Location</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {#each data.events as event}
          <tr>
            <td>
              {#if event.createdAt}
                {formatDbReservationDate(event.createdAt)},
                {event.createdAt.toLocaleTimeString()}
              {:else}
                unavailable
              {/if}
            </td>
            <td>
              {#if event.location?.city}
                {event.location.city}, {event.location.administrativeArea},
                {event.location.countryCode}
              {:else}
                unavailable
              {/if}
            </td>
            <td>
              {formatTrackingStatus(event.type)}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <h3 class="mb-6 text-xl font-bold">Live Map</h3>
  <div class="grid grid-cols-1 grid-rows-2 gap-4 sm:grid-cols-2 sm:grid-rows-1">
    <div class="card relative flex h-full min-h-[50vh] flex-col p-4">
      <div class="flex-1 rounded-xl">
        <Map
          mapLat={avgLat}
          mapLon={avgLon}
          senderLat={lat1}
          senderLon={lon1}
          receiverLat={lat2}
          receiverLon={lon2}
          zoom={zoomLevel}>
          <!-- Sender Marker -->
          <Marker
            lat={lat1}
            lon={lon1}
            label={String(data.origin?.address1)}
            customIconURL={senderIconURL}
            iconSize={[50, 80]}
            on:open={() => {
              console.log("Sender marker opened!");
            }}
            on:close={() => {
              console.log("Sender marker closed");
            }} />

          <!-- Receiver Marker -->
          <Marker
            lat={lat2}
            lon={lon2}
            label={String(data.destination?.address1)}
            customIconURL={receiverIconURL}
            iconSize={[50, 80]}
            on:open={() => {
              console.log("Receiver marker opened!");
            }}
            on:close={() => {
              console.log("Receiver marker closed");
            }} />

          <!-- Latest Tracking Event Marker -->
          {#if latestEvent}
            <Marker
              lat={eventLat}
              lon={eventLon}
              label={formatTrackingStatus(latestEvent.type)}
              customIconURL={trackingEventIconURL}
              iconSize={[80, 70]}
              on:open={() => {
                console.log("Tracking event marker opened!");
              }}
              on:close={() => {
                console.log("Tracking event marker closed");
              }} />
          {/if}
        </Map>
      </div>
    </div>
    <GameFacade />
  </div>

  {#if data.user?.role == UserRole.ADMIN}
    <div class="m-4 text-center">
      <a
        class="underline"
        href="/admin/update-tracking?trackingNumber={data.transaction
          .trackingNumber}">Update tracking</a>
    </div>
  {/if}
</div>
