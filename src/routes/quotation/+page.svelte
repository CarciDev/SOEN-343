<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData } from "$lib/types";
  import { invalidateAll, goto } from "$app/navigation";
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
  <h1 class="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100">Create Shipping Quote</h1>

  <div class="flex justify-end">
    <button
      class="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
      on:click={() => {
        showForm = !showForm;
        error = null;
      }}>
      {showForm ? "Hide Form" : "Show Form"}
    </button>
  </div>

  {#if showForm}
    <div transition:fade class="mt-4 p-6 bg-white dark:bg-gray-800 rounded shadow-md">
      <form
        method="POST"
        action="?/createQuotation"
        use:enhance={handleSubmit}>

        {#if error}
          <div class="alert alert-error mt-2 text-red-600 dark:text-red-400" transition:fade>
            {error.message}
          </div>
        {/if}

        <div class="grid grid-cols-2 gap-4">
          <!-- Origin Information -->
          <div class={error?.field === "origin" ? "border-red-500 p-4" : "p-4"}>
            <h3 class="mb-2 font-bold text-gray-700 dark:text-gray-300">Pickup Location</h3>
            <label class="form-label text-gray-800 dark:text-gray-200">
              Street Address
              <input name="originAddress1" type="text" placeholder="1234 Main St" class="form-input bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200" required />
            </label>
            <label class="form-label text-gray-800 dark:text-gray-200">
              City
              <input name="originCity" type="text" placeholder="San Francisco" class="form-input bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200" required />
            </label>
            <div class="grid grid-cols-2 gap-4">
              <label class="form-label text-gray-800 dark:text-gray-200">
                Country
                <select name="originCountry" class="form-select bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200" required>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="MX">Mexico</option>
                </select>
              </label>
              <label class="form-label text-gray-800 dark:text-gray-200">
                Postal Code
                <input name="originPostal" type="text" placeholder="94105" class="form-input bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200" required />
              </label>
            </div>
          </div>

          <!-- Destination Information -->
          <div class={error?.field === "destination" ? "border-red-500 p-4" : "p-4"}>
            <h3 class="mb-2 font-bold text-gray-700 dark:text-gray-300">Delivery Location</h3>
            <label class="form-label text-gray-800 dark:text-gray-200">
              Street Address
              <input name="destAddress1" type="text" placeholder="5678 Market St" class="form-input bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200" required />
            </label>
            <label class="form-label text-gray-800 dark:text-gray-200">
              City
              <input name="destCity" type="text" placeholder="New York" class="form-input bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200" required />
            </label>
            <div class="grid grid-cols-2 gap-4">
              <label class="form-label text-gray-800 dark:text-gray-200">
                Country
                <select name="destCountry" class="form-select bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200" required>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="MX">Mexico</option>
                </select>
              </label>
              <label class="form-label text-gray-800 dark:text-gray-200">
                Postal Code
                <input name="destPostal" type="text" placeholder="10001" class="form-input bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200" required />
              </label>
            </div>
          </div>
        </div>

        <!-- Package Dimensions -->
        <div class="mt-6">
          <h3 class="mb-2 font-bold text-gray-700 dark:text-gray-300">Package Dimensions</h3>
          <div class="grid grid-cols-4 gap-4">
            <label class="form-label text-gray-800 dark:text-gray-200">
              Width (cm)
              <input name="width" type="number" min="1" step="0.1" class="form-input bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200" required />
            </label>
            <label class="form-label text-gray-800 dark:text-gray-200">
              Height (cm)
              <input name="height" type="number" min="1" step="0.1" class="form-input bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200" required />
            </label>
            <label class="form-label text-gray-800 dark:text-gray-200">
              Depth (cm)
              <input name="depth" type="number" min="1" step="0.1" class="form-input bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200" required />
            </label>
            <label class="form-label text-gray-800 dark:text-gray-200">
              Weight (g)
              <input name="weight" type="number" min="0.1" step="0.1" class="form-input bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200" required />
            </label>
          </div>
        </div>

        <div class="mt-6">
          <button type="submit" disabled={loading} class="w-full rounded-md bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
            {loading ? "Processing..." : "Get Quote"}
          </button>
        </div>
      </form>
    </div>
  {/if}
</div>
