<script lang="ts">
  import { formatDbReservationDate, formatTrackingStatus } from "$lib/utils.js";

  export let data;
</script>

<div class="container mx-auto py-10">
  <h1 class="mb-6 text-center text-3xl font-bold">Track</h1>

  <h2 class="mb-6 text-2xl font-bold">
    Item {data.transaction.trackingNumber}
  </h2>

  <div class="mb-6 columns-3">
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
        {#if data.eta}
          Promised delivery date: {formatDbReservationDate(data.eta)}
        {/if}
      {:else}
        No tracking history yet
      {/if}
    </div>
  </div>

  <h3 class="mb-6 text-xl font-bold">Tracking History</h3>
  <div class="table-container">
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
</div>
