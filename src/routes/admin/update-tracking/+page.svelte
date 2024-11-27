<script lang="ts">
  import LocationPinIcon from "$lib/icons/LocationPinIcon.svelte";
  import { page } from "$app/stores";

  const initialTrackingNumber = $page.url.searchParams.get("trackingNumber");

  let selectedStatus = "PICKED_UP_AT_ORIGIN";
  let selectedLocationInputType = "origin";

  function updateLocationInputFromStatus() {
    switch (selectedStatus) {
      case "PICKED_UP_AT_ORIGIN":
        selectedLocationInputType = "origin";
        break;
      case "FACILITY_TRANSIT":
      case "OUT_FOR_DELIVERY":
        selectedLocationInputType = "input";
        break;
      case "DELIVERED":
        selectedLocationInputType = "destination";
        break;
    }
    enableDisableLocationInput();
  }

  let locationInputsDiv: HTMLElement;

  function enableDisableLocationInput() {
    switch (selectedLocationInputType) {
      case "origin":
      case "destination":
        // Disable the form
        locationInputsDiv.classList.add("hidden");
        break;
      case "input":
        // Enable the form
        locationInputsDiv.classList.remove("hidden");
        break;
    }
  }

  let coordsValue = "";

  // GeolocationPosition trips up eslint, it's a spec object
  // eslint-disable-next-line no-undef
  async function updateFromGeolocation(position: GeolocationPosition) {
    coordsValue = `${position.coords.latitude}, ${position.coords.longitude}`;
  }
</script>

<div class="flex flex-col items-center justify-center gap-4">
  <div style="min-width: 36em;" class="card min-w-fit flex-grow">
    <header class="text4xl card-header flex justify-center font-bold">
      <h1 class="text-4xl">Update Tracking</h1>
    </header>

    <section class="p-4">
      <form method="POST" class="flex flex-col gap-3">
        <label class="label">
          <span>Tracking number</span>
          <input
            class="input"
            type="text"
            placeholder="111111111111"
            name="trackingNumber"
            value={initialTrackingNumber} />
        </label>

        <label class="label">
          <span>Status</span>
          <select
            name="status"
            class="select"
            bind:value={selectedStatus}
            on:change={updateLocationInputFromStatus}>
            <option value="PICKED_UP_AT_ORIGIN">Picked up at origin</option>
            <option value="FACILITY_TRANSIT">Transit through facility</option>
            <option value="OUT_FOR_DELIVERY">Out for delivery</option>
            <option value="DELIVERED">Delivered</option>
          </select>
        </label>

        <label class="label">
          <span>Location</span>
          <select
            name="locationInputType"
            id="locationInputType"
            class="select"
            bind:value={selectedLocationInputType}
            on:change={enableDisableLocationInput}>
            <option value="origin">Use shipment origin location</option>
            <option value="destination"
              >Use shipment destination location</option>
            <option value="input">Enter location...</option>
          </select>
        </label>

        <div id="locationInputs" bind:this={locationInputsDiv} class="hidden">
          <label class="label">
            <span>Coordinates</span>
            <div
              class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
              <div class="input-group-shim">
                <LocationPinIcon></LocationPinIcon>
              </div>
              <input
                type="text"
                name="coords"
                placeholder="45.49727, -73.57893"
                bind:value={coordsValue} />
              <button
                type="button"
                class="variant-filled-secondary"
                on:click={() =>
                  navigator.geolocation.getCurrentPosition(
                    updateFromGeolocation,
                  )}>Locate Me</button>
            </div>
          </label>
        </div>

        <button class="variant-filled-primary btn mt-4" type="submit"
          >Update</button>
      </form>
    </section>
  </div>
</div>
