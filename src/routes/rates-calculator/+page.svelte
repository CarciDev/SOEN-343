<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData } from "./$types";
  import type { Quotation } from "@prisma/client";
  import { invalidateAll } from "$app/navigation";
  import { fade } from "svelte/transition";
  import { redirect } from "@sveltejs/kit";

  export let data: PageData;
  let showForm = false;
  let error: { message: string; field?: string } | null = null;
  let loading = false;
  let lastQuotation;
  let quotationId = "";
  let retrievedQuotation = data.retrievedQuotation;

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

    try {
      const response = await fetch("quotation/createQuotation", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      loading = false;

      if (!response.ok) {
        error = {
          message: result.message || "An error occurred",
          field: result.field,
        };
      } else {
        error = null;
        showForm = false;
        lastQuotation = result.data.quotation;
        await invalidateAll();
      }
    } catch (err: any) {
      error = { message: err.message, field: "submit" };
      loading = false;
    }
  }

  async function redirectToQuotation() {
    console.log("Redirecting");
    // Not Good Practice:
    if (parseInt(quotationId) < 0 || !Number.isInteger(parseInt(quotationId))) {
      error = { message: "Quotation ID must be a positive number", field: "retrieve" };
      return;
    } else {
      window.location.href="/rates-calculator?quotationId=" + quotationId;
    }
  }
</script>

<div class="container mx-auto p-4">
  <h1 class="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100">Create Shipping Quote</h1>

  <button
    class="mb-4 rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
    on:click={() => (showForm = !showForm)}>
    {showForm ? "Hide Form" : "New Quote"}
  </button>

  <div class="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md dark:bg-gray-800">
    <label class="mb-4 block text-sm font-bold text-gray-700 dark:text-gray-200">
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
    {#if error && error.field === "retrieve"}
      <div class="mt-4 rounded bg-red-100 p-4 text-red-700 dark:bg-red-200 dark:text-red-800" transition:fade>
        {error.message}
      </div>
    {/if}
  </div>
</div>

{#if retrievedQuotation}
<div class="mt-6 rounded bg-white px-8 pb-8 pt-6 shadow-md dark:bg-gray-800">
  <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">Retrieved Quotation</h2>
  <table class="w-full border-collapse border border-gray-300 mt-4 dark:border-gray-700">
    <thead>
      <tr>
        <th class="border border-gray-300 p-2 dark:border-gray-700">ID</th>
        <th class="border border-gray-300 p-2 dark:border-gray-700">Origin</th>
        <th class="border border-gray-300 p-2 dark:border-gray-700">Destination</th>
        <th class="border border-gray-300 p-2 dark:border-gray-700">Dimensions</th>
        <th class="border border-gray-300 p-2 dark:border-gray-700">Weight</th>
        <th class="border border-gray-300 p-2 dark:border-gray-700">Cost</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="border border-gray-300 p-2 dark:border-gray-700">
          {retrievedQuotation.id}
        </td>
        <td class="border border-gray-300 p-2 dark:border-gray-700">
          {retrievedQuotation.origin.city}, {retrievedQuotation.origin.countryCode}
        </td>
        <td class="border border-gray-300 p-2 dark:border-gray-700">
          {retrievedQuotation.destination.city}, {retrievedQuotation.destination.countryCode}
        </td>
        <td class="border border-gray-300 p-2 dark:border-gray-700">
          {retrievedQuotation.box.widthCm} x {retrievedQuotation.box.widthCm} x {retrievedQuotation.box.heightCm} cm
        </td>
        <td class="border border-gray-300 p-2 dark:border-gray-700">{retrievedQuotation.box.weightG} g</td>
        <td class="border border-gray-300 p-2 dark:border-gray-700">
          {formatAmount(retrievedQuotation.amountQuotedCents)}
        </td>
      </tr>
    </tbody>
  </table>
</div>
{/if}

{#if showForm}
  <div transition:fade>
    <form
      method="POST"
      action="?/createQuotation"
      on:submit|preventDefault={handleSubmit}
      class="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md dark:bg-gray-800">
      {#if error && error.field === "submit"}
        <div class="mb-4 rounded bg-red-100 p-4 text-red-700 dark:bg-red-200 dark:text-red-800" transition:fade>
          {error.message}
        </div>
      {/if}
      <div class="grid grid-cols-2 gap-4">
        <!-- Origin Information -->
        <div class={error?.field === "origin" ? "rounded border border-red-500 p-4" : "p-4"}>
          <h3 class="mb-2 font-bold text-gray-700 dark:text-gray-300">Pickup Location</h3>
          <div class="mb-4">
            <label class="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200">
              Street Address
              <input
                name="originAddress1"
                type="text"
                placeholder="1234 Main St"
                class="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow dark:bg-gray-700 dark:text-gray-200"
                required />
            </label>
          </div>
          <div class="mb-4">
            <label class="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200">
              City
              <input
                name="originCity"
                type="text"
                placeholder="San Francisco"
                class="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow dark:bg-gray-700 dark:text-gray-200"
                required />
            </label>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="mb-4">
              <label class="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200">
                Country
                <select
                  name="originCountry"
                  class="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow dark:bg-gray-700 dark:text-gray-200"
                  required>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="MX">Mexico</option>
                </select>
              </label>
            </div>
            <div class="mb-4">
              <label class="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200">
                Postal Code
                <input
                  name="originPostal"
                  type="text"
                  placeholder="94105"
                  class="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow dark:bg-gray-700 dark:text-gray-200"
                  required />
              </label>
            </div>
          </div>
        </div>

        <!-- Destination Information -->
        <div class={error?.field === "destination" ? "rounded border border-red-500 p-4" : "p-4"}>
          <h3 class="mb-2 font-bold text-gray-700 dark:text-gray-300">Delivery Location</h3>
          <div class="mb-4">
            <label class="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200">
              Street Address
              <input
                name="destAddress1"
                type="text"
                placeholder="5678 Market St"
                class="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow dark:bg-gray-700 dark:text-gray-200"
                required />
            </label>
          </div>
          <div class="mb-4">
            <label class="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200">
              City
              <input
                name="destCity"
                type="text"
                placeholder="New York"
                class="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow dark:bg-gray-700 dark:text-gray-200"
                required />
            </label>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="mb-4">
              <label class="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200">
                Country
                <select
                  name="destCountry"
                  class="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow dark:bg-gray-700 dark:text-gray-200"
                  required>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="MX">Mexico</option>
                </select>
              </label>
            </div>
            <div class="mb-4">
              <label class="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200">
                Postal Code
                <input
                  name="destPostal"
                  type="text"
                  placeholder="10001"
                  class="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow dark:bg-gray-700 dark:text-gray-200"
                  required />
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Package Dimensions -->
      <div class="mt-6">
        <h3 class="mb-2 font-bold text-gray-700 dark:text-gray-300">Package Dimensions</h3>
        <div class="grid grid-cols-4 gap-4">
          <div class="mb-4">
            <label class="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200">
              Width (cm)
              <input
                name="width"
                type="number"
                min="1"
                step="0.1"
                class="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow dark:bg-gray-700 dark:text-gray-200"
                required />
            </label>
          </div>
          <div class="mb-4">
            <label class="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200">
              Height (cm)
              <input
                name="height"
                type="number"
                min="1"
                step="0.1"
                class="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow dark:bg-gray-700 dark:text-gray-200"
                required />
            </label>
          </div>
          <div class="mb-4">
            <label class="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200">
              Depth (cm)
              <input
                name="depth"
                type="number"
                min="1"
                step="0.1"
                class="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow dark:bg-gray-700 dark:text-gray-200"
                required />
            </label>
          </div>
          <div class="mb-4">
            <label class="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200">
              Weight (g)
              <input
                name="weight"
                type="number"
                min="0.1"
                step="0.1"
                class="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow dark:bg-gray-700 dark:text-gray-200"
                required />
            </label>
          </div>
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
      <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">Last Quotation</h2>
      <table class="w-full border-collapse border border-gray-300 mt-4 dark:border-gray-700">
        <thead>
          <tr>
            <th class="border border-gray-300 p-2 dark:border-gray-700">ID</th>
            <th class="border border-gray-300 p-2 dark:border-gray-700">Origin</th>
            <th class="border border-gray-300 p-2 dark:border-gray-700">Destination</th>
            <th class="border border-gray-300 p-2 dark:border-gray-700">Dimensions</th>
            <th class="border border-gray-300 p-2 dark:border-gray-700">Weight</th>
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
              {lastQuotation.destination.city}, {lastQuotation.destination.countryCode}
            </td>
            <td class="border border-gray-300 p-2 dark:border-gray-700">
              {lastQuotation.box.widthCm} x {lastQuotation.box.widthCm} x {lastQuotation.box.heightCm} cm
            </td>
            <td class="border border-gray-300 p-2 dark:border-gray-700">{lastQuotation.box.weightG} g</td>
            <td class="border border-gray-300 p-2 dark:border-gray-700">
              {formatAmount(lastQuotation.amountQuotedCents)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  {/if}