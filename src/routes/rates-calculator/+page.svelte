<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData } from "./$types";
  import { invalidateAll } from "$app/navigation";
  import { fade } from "svelte/transition";

  export let data: PageData;
  let showForm = false;
  let error: { message: string; field?: string } | null = null;
  let loading = false;
  let lastQuotation: {
    id: number;
    origin: { city: string; countryCode: number };
    destination: { city: string; countryCode: number };
    box: {
      widthCm: number;
      depthCm: number;
      heightCm: number;
      weightG: number;
    };
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

  async function redirectToQuotation() {
    console.log("Redirecting to Quotation");
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
            {retrievedQuotation.origin.address1}
            <br />
            {retrievedQuotation.origin.postalCode}
            <br />
            {retrievedQuotation.origin.city}, {retrievedQuotation.origin
              .countryCode}
          </td>
          <td class="border border-gray-300 p-2 dark:border-gray-700">
            {retrievedQuotation.destination.address1}
            <br />
            {retrievedQuotation.destination.postalCode}
            <br />
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
        window.location.href =
          "/make-payment" + `?quotationId=${retrievedQuotation?.id}`;
      }}>
      Proceed to Payment
    </button>
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
