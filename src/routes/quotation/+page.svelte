<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData, QuotationWithRelations } from "$lib/types";

  export let data: PageData;
  let showForm = false;

  function formatAmount(cents: number): string {
    return (cents / 100).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  $: quotations = data.quotations;
</script>

<div class="container mx-auto p-4">
  <h1 class="mb-4 text-2xl font-bold">Create Shipping Quote</h1>

  <button
    class="mb-4 rounded bg-blue-500 px-4 py-2 text-white"
    on:click={() => (showForm = !showForm)}>
    {showForm ? "Hide Form" : "New Quote"}
  </button>

  {#if showForm}
    <form
      method="POST"
      action="?/createQuotation"
      use:enhance
      class="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md">
      <div class="grid grid-cols-2 gap-4">
        <!-- Origin Information -->
        <div>
          <h3 class="mb-2 font-bold text-gray-700">Pickup Location</h3>
          <div class="mb-4">
            <label class="mb-2 block text-sm font-bold text-gray-700">
              Street Address
              <input
                name="originAddress1"
                type="text"
                placeholder="1234 Main St"
                class="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow"
                required />
            </label>
          </div>
          <div class="mb-4">
            <label class="mb-2 block text-sm font-bold text-gray-700">
              City
              <input
                name="originCity"
                type="text"
                placeholder="San Francisco"
                class="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow"
                required />
            </label>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="mb-4">
              <label class="mb-2 block text-sm font-bold text-gray-700">
                Country
                <select
                  name="originCountry"
                  class="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow"
                  required>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="MX">Mexico</option>
                </select>
              </label>
            </div>
            <div class="mb-4">
              <label class="mb-2 block text-sm font-bold text-gray-700">
                Postal Code
                <input
                  name="originPostal"
                  type="text"
                  placeholder="94105"
                  class="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow"
                  required />
              </label>
            </div>
          </div>
        </div>

        <!-- Destination Information -->
        <div>
          <h3 class="mb-2 font-bold text-gray-700">Delivery Location</h3>
          <div class="mb-4">
            <label class="mb-2 block text-sm font-bold text-gray-700">
              Street Address
              <input
                name="destAddress1"
                type="text"
                placeholder="5678 Market St"
                class="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow"
                required />
            </label>
          </div>
          <div class="mb-4">
            <label class="mb-2 block text-sm font-bold text-gray-700">
              City
              <input
                name="destCity"
                type="text"
                placeholder="New York"
                class="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow"
                required />
            </label>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="mb-4">
              <label class="mb-2 block text-sm font-bold text-gray-700">
                Country
                <select
                  name="destCountry"
                  class="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow"
                  required>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="MX">Mexico</option>
                </select>
              </label>
            </div>
            <div class="mb-4">
              <label class="mb-2 block text-sm font-bold text-gray-700">
                Postal Code
                <input
                  name="destPostal"
                  type="text"
                  placeholder="10001"
                  class="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow"
                  required />
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Package Dimensions -->
      <div class="mt-6">
        <h3 class="mb-2 font-bold">Package Dimensions</h3>
        <div class="grid grid-cols-4 gap-4">
          <div class="mb-4">
            <label class="mb-2 block text-sm font-bold text-gray-700">
              Length (cm)
              <input
                name="length"
                type="number"
                min="1"
                step="0.1"
                class="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow"
                required />
            </label>
          </div>
          <div class="mb-4">
            <label class="mb-2 block text-sm font-bold text-gray-700">
              Width (cm)
              <input
                name="width"
                type="number"
                min="1"
                step="0.1"
                class="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow"
                required />
            </label>
          </div>
          <div class="mb-4">
            <label class="mb-2 block text-sm font-bold text-gray-700">
              Height (cm)
              <input
                name="height"
                type="number"
                min="1"
                step="0.1"
                class="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow"
                required />
            </label>
          </div>
          <div class="mb-4">
            <label class="mb-2 block text-sm font-bold text-gray-700">
              Depth (cm)
              <input
                name="depth"
                type="number"
                min="1"
                step="0.1"
                class="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow"
                required />
            </label>
          </div>
          <div class="mb-4">
            <label class="mb-2 block text-sm font-bold text-gray-700">
              Weight (g)
              <input
                name="weight"
                type="number"
                min="0.1"
                step="0.1"
                class="w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow"
                required />
            </label>
          </div>
        </div>
      </div>

      <div class="mt-6">
        <button
          type="submit"
          class="rounded bg-blue-500 px-6 py-2 font-bold text-white hover:bg-blue-700">
          Get Quote
        </button>
      </div>
    </form>
  {/if}

  <!-- Quotations List -->
  <div class="rounded bg-white px-8 pb-8 pt-6 text-black shadow-md">
    <h2 class="mb-4 text-xl font-bold">Your Quotes</h2>
    <div class="overflow-x-auto">
      <table class="min-w-full table-auto">
        <thead>
          <tr>
            <th class="px-4 py-2">Quote ID</th>
            <th class="px-4 py-2">From</th>
            <th class="px-4 py-2">To</th>
            <th class="px-4 py-2">Package Size</th>
            <th class="px-4 py-2">Price</th>
            <th class="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {#each quotations as quotation}
            <tr class="border-t">
              <td class="px-4 py-2">{quotation.id}</td>
              <td class="px-4 py-2">
                {quotation.origin.city}, {quotation.origin.countryCode}
              </td>
              <td class="px-4 py-2">
                {quotation.destination.city}, {quotation.destination
                  .countryCode}
              </td>
              <td class="px-4 py-2">
                {quotation.box.depthCm}x{quotation.box.widthCm}x{quotation.box
                  .heightCm} cm
              </td>
              <td class="px-4 py-2"
                >{formatAmount(quotation.amountQuotedCents)}</td>
              <td class="px-4 py-2">
                {quotation.shipmentTransaction ? "Shipped" : "Pending"}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
