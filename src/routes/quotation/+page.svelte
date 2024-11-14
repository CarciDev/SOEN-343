<script lang="ts">
  //@ts-nocheck
  import { enhance } from "$app/forms";
  import type { PageData } from "$lib/types";
  import { invalidateAll } from "$app/navigation";
  import { fade } from "svelte/transition";
  import GooglePlacesAutocomplete from "$lib/components/GooglePlacesAutocomplete/GooglePlacesAutocomplete.svelte";

  interface EarthLocation {
    address1: string;
    city: string;
    countryCode: string;
    postalCode: string;
  }

  interface Box {
    widthCm: number;
    heightCm: number;
    depthCm: number;
    weightG: number;
  }

  interface Quotation {
    origin: EarthLocation;
    destination: EarthLocation;
    box: Box;
    amountQuotedCents: number;
  }

  export const data: PageData = {
    lastQuotation: null,
  };
  let showForm = false;
  let error = null;
  let loading = false;
  let currentQuotation = null;

  function formatAmount(cents) {
    return (cents / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "CAD",
    });
  }

  async function handleSubmit() {
    loading = true;
    error = null;

    //@ts-expect-error - FormData is not iterable
    return async ({ result, update }) => {
      loading = false;

      if (result.type === "failure") {
        error = {
          message: result.data?.message || "An error occurred",
          field: result.data?.field,
        };
      } else if (result.type === "success") {
        error = null;
        showForm = false;
        currentQuotation = result.data.quotation;
        await invalidateAll();
      }
      await update();
    };
  }

  const options = {
    fields: ["formatted_address", "address_components", "geometry"],
    types: ["address"],
  };
  const placeholder = "Destination city";

  // Variables to store address details
  let originAddress1 = "";
  let originCity = "";
  let originCountryCode = "";
  let originPostalCode = "";

  let destAddress1 = "";
  let destCity = "";
  let destCountryCode = "";
  let destPostalCode = "";

  // Utility function to extract address components
  function extractAddressComponent(components, type) {
    const component = components.find((comp) => comp.types.includes(type));
    if (!component) return "";

    // Return short_name for 'country', long_name for others
    return type === "country" ? component.short_name : component.long_name;
  }

  // Handle place_changed for origin
  function handlePlaceChanged(event) {
    const detail = event.detail;

    if (detail?.place) {
      const components = detail.place.address_components;

      // Extract origin address components
      originAddress1 =
        `${extractAddressComponent(components, "street_number")} ${extractAddressComponent(components, "route")}`.trim();
      originCity = extractAddressComponent(components, "locality");
      originCountryCode = extractAddressComponent(components, "country");
      originPostalCode = extractAddressComponent(components, "postal_code");

      console.log("Origin Street Address:", originAddress1);
      console.log("Origin City:", originCity);
      console.log("Origin Country Code:", originCountryCode);
      console.log("Origin Postal Code:", originPostalCode);
    } else {
      console.error("Place data is missing in event detail:", detail);
    }
  }

  // Handle place_changed for destination
  function handleDestPlaceChanged(event) {
    const detail = event.detail;

    if (detail?.place) {
      const components = detail.place.address_components;

      // Extract destination address components
      destAddress1 =
        `${extractAddressComponent(components, "street_number")} ${extractAddressComponent(components, "route")}`.trim();
      destCity = extractAddressComponent(components, "locality");
      destCountryCode = extractAddressComponent(components, "country");
      destPostalCode = extractAddressComponent(components, "postal_code");

      console.log("Destination Street Address:", destAddress1);
      console.log("Destination City:", destCity);
      console.log("Destination Country Code:", destCountryCode);
      console.log("Destination Postal Code:", destPostalCode);
    } else {
      console.error("Place data is missing in event detail:", detail);
    }
  }
</script>

<div class="container mx-auto p-4">
  <h1 class="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
    Create Shipping Quote
  </h1>

  <div class="flex justify-end">
    <button
      class="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
      on:click={() => {
        showForm = !showForm;
        error = null;
      }}>
      {showForm ? "Hide Form" : "Show Form"}
    </button>
  </div>
  {#if currentQuotation}
    <div
      transition:fade
      class="mb-6 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
      <h2 class="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
        Your Shipping Quotation (ID #:{currentQuotation.id})
      </h2>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <!-- Origin Information -->
        <div class="space-y-2">
          <h3 class="font-medium text-gray-700 dark:text-gray-300">
            Pickup Location
          </h3>
          <div class="text-gray-600 dark:text-gray-400">
            <p>{currentQuotation.origin.address1}</p>
            <p>{currentQuotation.origin.city}</p>
            <p>
              {currentQuotation.origin.countryCode}
              {currentQuotation.origin.postalCode}
            </p>
          </div>
        </div>

        <!-- Destination Information -->
        <div class="space-y-2">
          <h3 class="font-medium text-gray-700 dark:text-gray-300">
            Delivery Location
          </h3>
          <div class="text-gray-600 dark:text-gray-400">
            <p>{currentQuotation.destination.address1}</p>
            <p>{currentQuotation.destination.city}</p>
            <p>
              {currentQuotation.destination.countryCode}
              {currentQuotation.destination.postalCode}
            </p>
          </div>
        </div>

        <!-- Package Details -->
        <div class="space-y-2">
          <h3 class="font-medium text-gray-700 dark:text-gray-300">
            Package Details
          </h3>
          <div class="text-gray-600 dark:text-gray-400">
            <p>
              Dimensions: {currentQuotation.box.widthCm}cm × {currentQuotation
                .box.heightCm}cm × {currentQuotation.box.depthCm}cm
            </p>
            <p>Weight: {currentQuotation.box.weightG}g</p>
          </div>
        </div>

        <!-- Quote Amount -->
        <div class="space-y-2">
          <h3 class="font-medium text-gray-700 dark:text-gray-300">
            Shipping Cost
          </h3>
          <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatAmount(currentQuotation.amountQuotedCents)}
          </p>
        </div>
      </div>

      <div class="mt-6 flex justify-end">
        <button
          class="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
          on:click={() => {
            showForm = true;
            currentQuotation = null;
          }}>
          Create New Quote
        </button>
      </div>
    </div>
  {/if}
  {#if showForm}
    <div
      transition:fade
      class="mt-4 rounded bg-white p-6 shadow-md dark:bg-gray-800">
      <!--handleSubmit has type issues-->
      <form method="POST" action="?/createQuotation" use:enhance={handleSubmit}>
        {#if error}
          <div
            class="alert-error alert mt-2 text-red-600 dark:text-red-400"
            transition:fade>
            {error.message}
          </div>
        {/if}

        <div class="grid grid-cols-2 gap-4">
          <!-- Origin Information -->
          <div>
            <h3 class="mb-2 font-bold text-gray-700 dark:text-gray-300">
              Pickup Location
            </h3>
            <GooglePlacesAutocomplete
              class="form-input bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
              on:place_changed={handlePlaceChanged}
              {options}
              {placeholder}
              required />
          </div>

          <!-- Destination Information -->
          <div>
            <h3 class="mb-2 font-bold text-gray-700 dark:text-gray-300">
              Delivery Location
            </h3>
            <GooglePlacesAutocomplete
              class="form-input bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
              on:place_changed={handleDestPlaceChanged}
              {options}
              {placeholder}
              required />
          </div>
        </div>

        <input
          type="hidden"
          name="originAddress1"
          bind:value={originAddress1} />
        <input type="hidden" name="originCity" bind:value={originCity} />
        <input
          type="hidden"
          name="originCountry"
          bind:value={originCountryCode} />
        <input
          type="hidden"
          name="originPostal"
          bind:value={originPostalCode} />

        <input type="hidden" name="destAddress1" bind:value={destAddress1} />
        <input type="hidden" name="destCity" bind:value={destCity} />
        <input type="hidden" name="destCountry" bind:value={destCountryCode} />
        <input type="hidden" name="destPostal" bind:value={destPostalCode} />

        <!-- Package Dimensions -->
        <div class="mt-6">
          <h3 class="mb-2 font-bold text-gray-700 dark:text-gray-300">
            Package Dimensions
          </h3>
          <div class="grid grid-cols-4 gap-4">
            <label class="form-label text-gray-800 dark:text-gray-200">
              Width (cm)
              <input
                name="width"
                type="number"
                min="1"
                step="0.1"
                class="form-input bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                required />
            </label>
            <label class="form-label text-gray-800 dark:text-gray-200">
              Height (cm)
              <input
                name="height"
                type="number"
                min="1"
                step="0.1"
                class="form-input bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                required />
            </label>
            <label class="form-label text-gray-800 dark:text-gray-200">
              Depth (cm)
              <input
                name="depth"
                type="number"
                min="1"
                step="0.1"
                class="form-input bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                required />
            </label>
            <label class="form-label text-gray-800 dark:text-gray-200">
              Weight (g)
              <input
                name="weight"
                type="number"
                min="0.1"
                step="0.1"
                class="form-input bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                required />
            </label>
          </div>
        </div>

        <div class="mt-6">
          <button
            type="submit"
            disabled={loading}
            class="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
            {loading ? "Processing..." : "Get Quote"}
          </button>
        </div>
      </form>
    </div>
  {/if}
</div>
