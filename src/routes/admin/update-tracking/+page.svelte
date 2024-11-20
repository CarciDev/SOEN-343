<script>
  import LocationPinIcon from "$lib/icons/LocationPinIcon.svelte";
  import { page } from "$app/stores";

  const initialTrackingNumber = $page.url.searchParams.get("trackingNumber");

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
          <input class="input" type="text" placeholder="111111111111" value="{initialTrackingNumber}"/>
        </label>

        <label class="label">
          <span>Status</span>
          <select name="status" class="select">
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
            class="select">
            <option value="origin">Use shipment origin location</option>
            <option value="destination"
              >Use shipment destination location</option>
            <option value="input">Enter location...</option>
          </select>
        </label>

        <div id="locationInputs" class="opacity-50">
          <label class="label">
            <span>Coordinates</span>
            <div
              class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
              <div class="input-group-shim">
                <LocationPinIcon></LocationPinIcon>
              </div>
              <input
                type="text"
                name="coordinates"
                placeholder="45.49727, -73.57893"
                disabled />
              <button class="variant-filled-secondary" disabled
                >Locate Me</button>
            </div>
          </label>

          <label class="label">
            <span>City</span>
            <input type="text" class="input" name="city" />
          </label>

          <label class="label">
            <span>Administrative area</span>
            <input type="text" class="input" name="administrativeArea" />
          </label>

          <label class="label">
            <span>Country code</span>
            <input type="text" class="input" name="country" />
          </label>
        </div>

        <button class="variant-filled-primary btn mt-4" type="submit"
          >Update</button>
      </form>
    </section>
  </div>
</div>
