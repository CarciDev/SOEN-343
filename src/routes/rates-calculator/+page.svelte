<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData } from "./$types";
  import { invalidateAll } from "$app/navigation";
  import { fade } from "svelte/transition";

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

  export let data: PageData;
  let showForm = false;
  let error: { message: string; field?: string } | null = null;
  let loading = false;
  let lastQuotation: {
    id: any;
    origin: { city: any; countryCode: any };
    destination: { city: any; countryCode: any };
    box: { widthCm: any; depthCm: any; heightCm: any; weightG: any };
    amountQuotedCents: number;
  };
  let quotationId = "";
  let retrievedQuotation = data.retrievedQuotation;
  let errorMessage = data.errorMessage;

  function formatAmount(cents: number): string {
    return (cents / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "CAD",
    });
  }

  async function handleSubmit(event: SubmitEvent) {
    loading = true;
    error = null;

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

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
        retrievedQuotation = result.data.quotation;
        await invalidateAll();
      }
      await update();
    };
  }

  async function redirectToQuotation() {
    console.log("Redirecting");
    if (parseInt(quotationId) < 0 || !Number.isInteger(parseInt(quotationId))) {
      error = {
        message: "Quotation ID must be a positive number",
        field: "retrieve",
      };
      return;
    } else {
      window.location.href = "/rates-calculator?quotationId=" + quotationId;
    }
  }
</script>

<div class="container mx-auto p-4">
  <h1 class="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
    Create Shipping Quote
  </h1>

  <div class="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md dark:bg-gray-800">
    <label
      class="mb-4 block text-sm font-bold text-gray-700 dark:text-gray-200">
      Quotation ID
      <input
        type="number"
        required={true}
        min="0"
        bind:value={quotationId}
        placeholder="Enter Quotation ID"
        class="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow dark:bg-gray-700 dark:text-gray-200" />
    </label>
    <button
      class="rounded bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
      on:click={redirectToQuotation}
      disabled={loading}>
      {loading ? "Retrieving..." : "Retrieve Quotation"}
    </button>
    {#if errorMessage}
      <div
        class="mt-4 rounded bg-red-100 p-4 text-red-700 dark:bg-red-200 dark:text-red-800"
        transition:fade>
        {errorMessage}
      </div>
    {/if}
  </div>
</div>

{#if retrievedQuotation}
  <div class="mt-6 rounded bg-white px-8 pb-8 pt-6 shadow-md dark:bg-gray-800">
    <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">
      Retrieved Quotation
    </h2>
    <table
      class="mt-4 w-full border-collapse border border-gray-300 dark:border-gray-700">
      <thead>
        <tr>
          <th class="border border-gray-300 p-2 dark:border-gray-700">ID</th>
          <th class="border border-gray-300 p-2 dark:border-gray-700"
            >Origin</th>
          <th class="border border-gray-300 p-2 dark:border-gray-700"
            >Destination</th>
          <th class="border border-gray-300 p-2 dark:border-gray-700"
            >Dimensions</th>
          <th class="border border-gray-300 p-2 dark:border-gray-700"
            >Weight</th>
          <th class="border border-gray-300 p-2 dark:border-gray-700">Cost</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="border border-gray-300 p-2 dark:border-gray-700">
            {retrievedQuotation.id}
          </td>
          <td class="border border-gray-300 p-2 dark:border-gray-700">
            {retrievedQuotation.origin.city}, {retrievedQuotation.origin
              .countryCode}
          </td>
          <td class="border border-gray-300 p-2 dark:border-gray-700">
            {retrievedQuotation.destination.city}, {retrievedQuotation
              .destination.countryCode}
          </td>
          <td class="border border-gray-300 p-2 dark:border-gray-700">
            {retrievedQuotation.box.widthCm} x {retrievedQuotation.box.depthCm} x
            {retrievedQuotation.box.heightCm} cm
          </td>
          <td class="border border-gray-300 p-2 dark:border-gray-700">
            {retrievedQuotation.box.weightG} g
          </td>
          <td class="border border-gray-300 p-2 dark:border-gray-700">
            {formatAmount(retrievedQuotation.amountQuotedCents)}
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Button to proceed to payment -->
  <div class="mt-6 text-right">
    <button
      class="rounded bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
      on:click={() => {
        window.location.href = "/payment?quotationId=" + retrievedQuotation.id;
      }}>
      Proceed to Payment
    </button>
  </div>
{/if}

{#if !retrievedQuotation}
  <div class="mt-6 flex justify-center">
    <button
      class="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
      on:click={() => {
        showForm = !showForm;
        console.log("showForm:", showForm); // Add this line to debug
      }}>
      {showForm ? "Hide Form" : "Show Form"}
    </button>
  </div>
{/if}

{#if showForm}
<div
transition:fade
class="mt-4 rounded bg-white p-6 shadow-md dark:bg-gray-800">
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
    <div class={error?.field === "origin" ? "border-red-500 p-4" : "p-4"}>
      <h3 class="mb-2 font-bold text-gray-700 dark:text-gray-300">
        Pickup Location
      </h3>
      <label class="form-label text-gray-800 dark:text-gray-200">
        Street Address
        <input
          name="originAddress1"
          type="text"
          placeholder="1234 Main St"
          class="form-input bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
          required />
      </label>
      <label class="form-label text-gray-800 dark:text-gray-200">
        City
        <input
          name="originCity"
          type="text"
          placeholder="San Francisco"
          class="form-input bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
          required />
      </label>
      <div class="grid grid-cols-2 gap-4">
        <label class="form-label text-gray-800 dark:text-gray-200">
          Country
          <select
            name="originCountry"
            class="form-select bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
            required>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="MX">Mexico</option>
          </select>
        </label>
        <label class="form-label text-gray-800 dark:text-gray-200">
          Postal Code
          <input
            name="originPostal"
            type="text"
            placeholder="94105"
            class="form-input bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
            required />
        </label>
      </div>
    </div>

    <!-- Destination Information -->
    <div
      class={error?.field === "destination"
        ? "border-red-500 p-4"
        : "p-4"}>
      <h3 class="mb-2 font-bold text-gray-700 dark:text-gray-300">
        Delivery Location
      </h3>
      <label class="form-label text-gray-800 dark:text-gray-200">
        Street Address
        <input
          name="destAddress1"
          type="text"
          placeholder="5678 Market St"
          class="form-input bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
          required />
      </label>
      <label class="form-label text-gray-800 dark:text-gray-200">
        City
        <input
          name="destCity"
          type="text"
          placeholder="New York"
          class="form-input bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
          required />
      </label>
      <div class="grid grid-cols-2 gap-4">
        <label class="form-label text-gray-800 dark:text-gray-200">
          Country
          <select
            name="destCountry"
            class="form-select bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
            required>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="MX">Mexico</option>
          </select>
        </label>
        <label class="form-label text-gray-800 dark:text-gray-200">
          Postal Code
          <input
            name="destPostal"
            type="text"
            placeholder="10001"
            class="form-input bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
            required />
        </label>
      </div>
    </div>
  </div>

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

{#if lastQuotation}
  <div class="mt-6">
    <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">
      Last Quotation
    </h2>
    <table
      class="mt-4 w-full border-collapse border border-gray-300 dark:border-gray-700">
      <thead>
        <tr>
          <th class="border border-gray-300 p-2 dark:border-gray-700">ID</th>
          <th class="border border-gray-300 p-2 dark:border-gray-700"
            >Origin</th>
          <th class="border border-gray-300 p-2 dark:border-gray-700"
            >Destination</th>
          <th class="border border-gray-300 p-2 dark:border-gray-700"
            >Dimensions</th>
          <th class="border border-gray-300 p-2 dark:border-gray-700"
            >Weight</th>
          <th class="border border-gray-300 p-2 dark:border-gray-700">Cost</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="border border-gray-300 p-2 dark:border-gray-700">
            {lastQuotation.id}
          </td>
          <td class="border border-gray-300 p-2 dark:border-gray-700">
            {lastQuotation.origin.city}, {lastQuotation.origin.countryCode}
          </td>
          <td class="border border-gray-300 p-2 dark:border-gray-700">
            {lastQuotation.destination.city}, {lastQuotation.destination
              .countryCode}
          </td>
          <td class="border border-gray-300 p-2 dark:border-gray-700">
            {lastQuotation.box.widthCm} x {lastQuotation.box.depthCm} x
            {lastQuotation.box.heightCm} cm
          </td>
          <td class="border border-gray-300 p-2 dark:border-gray-700">
            {lastQuotation.box.weightG} g
          </td>
          <td class="border border-gray-300 p-2 dark:border-gray-700">
            {formatAmount(lastQuotation.amountQuotedCents)}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
{/if}
