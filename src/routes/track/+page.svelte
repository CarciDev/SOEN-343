<script lang="ts">
  import MagnifyingGlass from "$lib/icons/MagnifyingGlass.svelte";

  export let data;
</script>

<div class="container mx-auto py-10">
  <h1 class="mb-6 text-center text-3xl font-bold">Track</h1>

  <form method="POST">
    <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
      <div class="input-group-shim"><MagnifyingGlass></MagnifyingGlass></div>
      <input
        type="text"
        name="searchTrackingNumber"
        placeholder="Tracking number..." />
      <button class="variant-filled-secondary">Track</button>
    </div>
  </form>

  <br /><br />

  {#if data.user}
    <h2 class="mb-6 text-2xl font-bold">Your Shipments</h2>
    <div class="table-container">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Tracking Number</th>
            <th>Promised Date</th>
            <th>Last Updated</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {#each data.overview as item}
            <tr>
              <td>{item.trackingNumber}</td>
              <td>{item.eta ? item.eta.toLocaleDateString() : ""}</td>
              <td
                >{item.lastUpdated
                  ? item.lastUpdated.toLocaleString()
                  : ""}</td>
              <td>{item.status}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {:else}
    <p>
      <a href="/auth/login?destination=/track" class="underline">Log in</a>
      for a list of your shipments.
    </p>
  {/if}
</div>
