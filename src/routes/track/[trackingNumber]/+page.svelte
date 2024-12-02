<script lang="ts">
  import Map from "$lib/components/map/map.svelte";
  import { formatDbReservationDate, formatTrackingStatus } from "$lib/utils.js";
  import GameFacade from "$lib/components/Game/GameFacade.svelte";
  import { onMount } from "svelte";
  import { UserRole } from "@prisma/client";
  import RoutingMachine from "$lib/components/map/routingMachine.svelte";
  import { calculateZoomLevel, getDistance } from "./helpers.js";

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

  // Get and set the latest event
  const latestEvent = data.events.length > 0 ? data.events[0] : null;
</script>

<div class="container mx-auto py-10">
  <h1 class="mb-6 text-center text-3xl font-bold">Track</h1>

  <h2 class="mb-6 text-2xl font-bold">
    Item {data.transaction.trackingNumber}
  </h2>

  <!-- Information about origin, destination, and status -->
  <div class="mb-6 grid grid-cols-3 gap-4">
    <div class="card p-4">
      <h3 class="text-xl font-bold">Origin</h3>
      {data.origin?.address1 || ""}{#if data.origin?.address1}<br />{/if}
      {data.origin?.address2 || ""}{#if data.origin?.address2}<br />{/if}
      {data.origin?.city || ""}
      {data.origin?.administrativeArea || ""}
      {data.origin?.postalCode || ""}{#if data.origin?.city}<br />{/if}
      {data.origin?.countryCode || ""}
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
      <div class="relative h-full w-full flex-1 rounded-xl">
        <Map mapLat={avgLat} mapLon={avgLon} zoom={zoomLevel}>
          <RoutingMachine
            senderLat={lat1}
            senderLon={lon1}
            receiverLat={lat2}
            receiverLon={lon2}
            senderMarkerLabel={data.origin?.address1 ?? "Sender"}
            receiverMarkerLabel={data.destination?.address1 ?? "Receiver"}
            trackingStatus={latestEvent
              ? latestEvent.type
              : "PICKED_UP_AT_ORIGIN"} />
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
