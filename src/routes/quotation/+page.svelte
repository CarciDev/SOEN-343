<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData } from "$lib/types";
  import { invalidateAll } from "$app/navigation";
  import { fade } from "svelte/transition";

  export let data: PageData;
  let showForm = false;
  let error: { message: string; field?: string } | null = null;
  let loading = false;
  let lastQuotation = data.lastQuotation;

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
        lastQuotation = result.data.quotation;
        await invalidateAll();
      }
      await update();
    };
  }
</script>

<div class="container mx-auto p-4">
  <h1 class="mb-4 text-2xl font-bold">Create Shipping Quote</h1>

  <button
    class="mb-4 rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
    on:click={() => (showForm = !showForm)}>
    {showForm ? "Hide Form" : "New Quote"}
  </button>

  {#if showForm}
    <div transition:fade>
      <form
        method="POST"
        action="?/createQuotation"
        use:enhance={handleSubmit}
        class="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md">
        {#if error}
          <div class="mb-4 rounded bg-red-100 p-4 text-red-700" transition:fade>
            {error.message}
          </div>
        {/if}
        <div class="grid grid-cols-2 gap-4">
          <!-- Origin Information -->
          <div
            class={error?.field === "origin"
              ? "rounded border border-red-500 p-4"
              : "p-4"}>
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
          <div
            class={error?.field === "destination"
              ? "rounded border border-red-500 p-4"
              : "p-4"}>
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
            disabled={loading}
            class="rounded bg-blue-500 px-6 py-2 font-bold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-300">
            {loading ? "Processing..." : "Get Quote"}
          </button>
        </div>
      </form>
    </div>
  {/if}

  <!-- Display the last quotation made using the form -->
  {#if lastQuotation}
    <div class="mt-6">
      <h2 class="text-xl font-bold">Last Quotation</h2>
      <table class="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr>
            <th class="border border-gray-300 p-2">Origin</th>
            <th class="border border-gray-300 p-2">Destination</th>
            <th class="border border-gray-300 p-2">Dimensions</th>
            <th class="border border-gray-300 p-2">Weight</th>
            <th class="border border-gray-300 p-2">Cost</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-gray-300 p-2">
              {lastQuotation.origin.city}, {lastQuotation.origin.countryCode}
            </td>
            <td class="border border-gray-300 p-2">
              {lastQuotation.destination.city}, {lastQuotation.destination.countryCode}
            </td>
            <td class="border border-gray-300 p-2">
              {lastQuotation.box.widthCm} x {lastQuotation.box.widthCm} x {lastQuotation.box.heightCm} cm
            </td>
            <td class="border border-gray-300 p-2">{lastQuotation.box.weightG} g</td>
            <td class="border border-gray-300 p-2">
              {formatAmount(lastQuotation.amountQuotedCents)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  {/if}
</div>
