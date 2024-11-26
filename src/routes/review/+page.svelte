<script lang="ts">
  import { superForm } from "sveltekit-superforms";
  import type { PageData } from "./$types";
  import {
    getToastStore,
    getModalStore,
    type ToastSettings,
  } from "@skeletonlabs/skeleton";
  import { goto } from "$app/navigation";
  import { fade } from "svelte/transition";

  const toastStore = getToastStore();
  const modalStore = getModalStore();

  let selectedTrackingNumber: string | null = null;
  let isTrackingNumberValid = false;
  let isSubmitting = false;
  let isFormSubmitted = false; // Tracks if the form has been successfully submitted

  async function handleTrackingNumberSubmit() {
    if (!selectedTrackingNumber) {
      const t: ToastSettings = {
        message: "❌ Please select a tracking number.",
        background: "variant-filled-error",
      };
      toastStore.trigger(t);
      return;
    }

    isSubmitting = true;

    try {
      const parsedSelection = JSON.parse(selectedTrackingNumber);
      const { trackingNumber, transactionId } = parsedSelection;

      isTrackingNumberValid = true;

      // Assign the transaction ID to the form
      $form.transactionId = transactionId;
    } catch (error) {
      const t: ToastSettings = {
        message: "❌ Please select a tracking number.",
        background: "variant-filled-error",
      };
      toastStore.trigger(t);
    } finally {
      isSubmitting = false;
    }
  }

  export let data: PageData;

  $: ({ deliveredTrackingNumbers } = data);

  const { form, errors, enhance } = superForm(data.form, {
    resetForm: true,
    taintedMessage: () => {
      return new Promise((resolve) => {
        modalStore.trigger({
          type: "confirm",
          title: "Do you want to leave?",
          body: "Changes you made may not be saved.",
          response: resolve,
        });
      });
    },
    onResult: ({ result }) => {
      switch (result.type) {
        case "success":
          const successToast: ToastSettings = {
            message: "✔️ Thanks for the feedback.",
            background: "variant-filled-success",
          };
          toastStore.trigger(successToast);
          isFormSubmitted = true; // Show thank-you section
          break;
        case "error":
        case "failure":
          const errorToast: ToastSettings = {
            message: "❌ Failed to submit feedback.",
            background: "variant-filled-error",
          };
          toastStore.trigger(errorToast);
          break;
      }
    },
  });

  if (!$form.rating) $form.rating = 1;
  if (!$form.deliveryRating) $form.deliveryRating = 1;
  if (data.userId) $form.userId = data.userId;
</script>

<div class="my-auto py-28">
  {#if !isTrackingNumberValid}
    <!-- Tracking Number Selection Card -->
    <div
      class="card mx-auto max-w-xl rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
      <h2 class="mb-6 text-center text-2xl font-bold text-primary-500">
        Select Your Tracking Number
      </h2>
      <p class="mb-6">
        As a sender, you can leave feedback on your experience with our
        serivice.
      </p>
      <div class="space-y-4">
        <label for="tracking-number" class="label">
          <span class="text-primary-500">Available Tracking Numbers</span>
        </label>
        {#if deliveredTrackingNumbers.length > 0}
          <select
            id="tracking-number"
            bind:value={selectedTrackingNumber}
            class="input form-select w-full">
            <option value="" disabled selected>Select a tracking number</option>
            {#each data.deliveredTrackingNumbers as tracking}
              <option
                value={JSON.stringify({
                  trackingNumber: tracking.trackingNumber,
                  transactionId: tracking.shipmentTransactionId,
                })}>
                {tracking.trackingNumber}
              </option>
            {/each}
          </select>

          <div class="flex items-center justify-center py-2">
            <button
              type="button"
              on:click={handleTrackingNumberSubmit}
              class="btn-primary btn w-full rounded-lg bg-primary-600 py-3 font-semibold tracking-wide text-white hover:bg-primary-700 focus:outline-none focus:ring focus:ring-primary-300 dark:bg-primary-500 dark:hover:bg-primary-600 dark:focus:ring-primary-400"
              disabled={isSubmitting}>
              {#if isSubmitting}
                <svg
                  class="h-5 w-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0V4a8 8 0 00-8 8H0zm0 0a8 8 0 018 8v-4l3.5 3.5L12 24v-4a8 8 0 00-8-8H0z"
                  ></path>
                </svg>
              {:else}
                Select Tracking Number
              {/if}
            </button>
          </div>
        {:else}
          <p>No tracking numbers found. Please check again later.</p>
        {/if}
      </div>
    </div>
  {:else if isFormSubmitted}
    <!-- Thank You Section -->
    <div
      in:fade
      out:fade
      class="card mx-auto max-w-xl rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
      <h2 class="text-center text-2xl font-bold text-primary-500">
        🎉 Thank You!
      </h2>
      <p class="mt-4 text-center text-gray-700 dark:text-gray-300">
        Your feedback has been submitted successfully. We appreciate your time
        and effort in helping us improve!
      </p>
      <div class="mt-6 flex justify-center">
        <button
          on:click={() => goto("/track")}
          class="btn-primary btn rounded-lg bg-primary-600 px-6 py-3 font-semibold tracking-wide text-white hover:bg-primary-700 focus:outline-none focus:ring focus:ring-primary-300 dark:bg-primary-500 dark:hover:bg-primary-600 dark:focus:ring-primary-400">
          Return to Tracking
        </button>
      </div>
    </div>
  {:else}
    <!-- Feedback Form -->
    <div class="card rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
      <form method="POST" use:enhance class="space-y-6">
        <div class="flex flex-col items-center justify-center space-y-2">
          <h2
            class="font-manrope text-center text-4xl font-bold leading-normal text-gray-900 dark:text-gray-100 lg:text-start">
            Leave a Review
          </h2>
          {#if selectedTrackingNumber}
            <h2
              class="font-manrope text-center text-xl font-light leading-normal tracking-tighter text-gray-900 dark:text-gray-100 lg:text-start">
              Review for Parcel No. {JSON.parse(selectedTrackingNumber)
                .trackingNumber}
            </h2>
          {/if}
        </div>

        <!-- Hidden Fields -->
        <input type="hidden" name="userId" bind:value={$form.userId} />
        <input
          type="hidden"
          name="transactionId"
          bind:value={$form.transactionId} />

        <!-- Rating Section -->
        <fieldset
          class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <legend
            class="px-2 text-lg font-semibold text-gray-700 dark:text-gray-300"
            >Rating</legend>
          <input type="hidden" name="rating" bind:value={$form.rating} />
          <div class="mt-2 flex gap-2">
            {#each [1, 2, 3, 4, 5] as star}
              <button
                type="button"
                class="text-3xl transition-transform duration-150 hover:scale-110"
                class:text-yellow-400={star <= $form.rating}
                class:text-neutral-500={star > $form.rating}
                on:click={() => ($form.rating = star)}>
                ★
              </button>
            {/each}
          </div>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Click a star to rate your experience.
          </p>
        </fieldset>

        <!-- Delivery Rating Section -->
        <fieldset
          class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <legend
            class="px-2 text-lg font-semibold text-gray-700 dark:text-gray-300"
            >Delivery Rating</legend>
          <input
            type="hidden"
            name="deliveryRating"
            bind:value={$form.deliveryRating} />
          <div class="mt-2 flex gap-2">
            {#each [1, 2, 3, 4, 5] as star}
              <button
                type="button"
                class="text-3xl transition-transform duration-150 hover:scale-110"
                class:text-yellow-400={star <= $form.deliveryRating}
                class:text-neutral-500={star > $form.deliveryRating}
                on:click={() => ($form.deliveryRating = star)}>
                ★
              </button>
            {/each}
          </div>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Click a star to rate the delivery service.
          </p>
        </fieldset>

        <!-- Delivery On-Time Section -->
        <fieldset
          class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <legend
            class="px-2 text-lg font-semibold text-gray-700 dark:text-gray-300"
            >Delivery Timeliness</legend>
          <div class="mt-2 flex items-center gap-4">
            <input
              type="checkbox"
              name="wasDeliveryOnTime"
              bind:checked={$form.wasDeliveryOnTime}
              class="checkbox h-5 w-5" />
            <label
              for="wasDeliveryOnTime"
              class="text-gray-700 dark:text-gray-300">
              Check this box if your delivery arrived on time to the receiver.
            </label>
          </div>
        </fieldset>

        <!-- Comments Section -->
        <fieldset
          class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <legend
            class="px-2 text-lg font-semibold text-gray-700 dark:text-gray-300"
            >Comments</legend>
          <label
            for="comment"
            class="mb-2 block font-medium text-gray-600 dark:text-gray-400"
            >Additional Comments (Optional)</label>
          <textarea
            name="comment"
            bind:value={$form.comment}
            class="form-textarea w-full rounded-md border border-gray-300 bg-white text-gray-800 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:border-primary-400 dark:focus:ring-primary-400"
            placeholder="Kindly enter your comments and concerns here."
            rows="4"></textarea>
        </fieldset>

        <!-- Submit Button -->
        <button
          type="submit"
          class="btn-primary btn w-full rounded-lg bg-primary-600 py-3 font-semibold tracking-wide text-white hover:bg-primary-700 focus:outline-none focus:ring focus:ring-primary-300 dark:bg-primary-500 dark:hover:bg-primary-600 dark:focus:ring-primary-400">
          Submit
        </button>
      </form>
    </div>
  {/if}
</div>
