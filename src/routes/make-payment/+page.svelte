<script lang="ts">
  import { Quotation } from "$lib/domain/Quotation";
  import { centsToDollars } from "$lib/utils";

  // Props to receive actual data passed from the load function
  export let data: { quotationData: Quotation | null };

  // Extract quotationData from the passed data object
  const { quotationData } = data;

  // Use default values if quotationData is null
  const amountQuotedCents = quotationData?.amountQuotedCents ?? 0;
  const originId = quotationData?.originId ?? "Unknown";
  const destinationId = quotationData?.destinationId ?? "Unknown";
  const etaDays = quotationData?.etaDays ?? 0;
  const boxId = quotationData?.boxId ?? "Unknown";

  // Construct URL parameters for the checkout route
  const checkoutUrlParams = new URLSearchParams({
    quotationId: quotationData?.id?.toString() || "",
    amountQuotedCents: amountQuotedCents.toString(),
    originId: originId.toString(),
    destinationId: destinationId.toString(),
    etaDays: etaDays.toString(),
    boxId: boxId.toString(),
  });
</script>

<div class="bg-base-200 py-10">
  <div class="container mx-auto space-y-10 px-4">
    <!-- Header Section -->
    <section class="text-center">
      <h1 class="text-primary text-4xl font-bold">Quotation Payment</h1>
      <p class="text-secondary mt-4 text-lg">
        All payments are processed with <a
          class="text-primary-500 underline hover:cursor-pointer"
          href="https://stripe.com"
          target="_blank">Stripe.</a>
      </p>
    </section>

    <!-- Main Content Section -->
    <div class="flex flex-col gap-8 lg:flex-row lg:items-start">
      <!-- Quotation Details Sidebar -->
      <aside
        class="bg-surface flex flex-col items-center rounded-lg p-6 text-center shadow-lg lg:w-1/3 lg:items-start lg:text-left">
        <h2 class="text-primary text-2xl font-semibold">Package Details</h2>
        <div
          class="mt-4 flex flex-col items-center lg:flex-row lg:items-start lg:gap-4">
          <!-- Image -->
          <div class="flex h-24 w-24 shrink-0 rounded-md bg-gray-300 p-3">
            <img
              src="https://static.wikia.nocookie.net/clubpenguin/images/7/7b/Box17.png"
              alt="Regular Box"
              class="h-full w-full object-contain" />
          </div>
          <!-- Details List -->
          <ul class="mt-4 space-y-4 lg:mt-0">
            <li class="flex justify-between lg:justify-start lg:gap-4">
              <span>Origin ID:</span>
              <span class="font-medium">{originId}</span>
            </li>
            <li class="flex justify-between lg:justify-start lg:gap-4">
              <span>Destination ID:</span>
              <span class="font-medium">{destinationId}</span>
            </li>
            <li class="flex justify-between lg:justify-start lg:gap-4">
              <span>Total Price:</span>
              <span class="font-medium">
                {centsToDollars(amountQuotedCents)}
              </span>
            </li>
            <li class="flex justify-between lg:justify-start lg:gap-4">
              <span>ETA (Days):</span>
              <span class="font-medium">{etaDays}</span>
            </li>
            <li class="flex justify-between lg:justify-start lg:gap-4">
              <span>Box ID:</span>
              <span class="font-medium">{boxId}</span>
            </li>
          </ul>
        </div>
        <div class="mt-8 text-sm text-neutral-500">
          Prices are shown in $CAD.
        </div>
      </aside>

      <!-- Checkout Section -->
      <section
        class="bg-surface flex flex-col items-center rounded-lg p-6 shadow-lg lg:w-2/3">
        <h2
          class="text-primary text-center text-2xl font-semibold lg:text-left">
          Checkout
        </h2>
        <p class="text-secondary mt-4 text-center lg:text-left">
          Please review the quotation details before proceeding to payment.
        </p>

        <div class="mt-8 flex w-full flex-col gap-4">
          <button type="button" class="btn-neutral variant-outline btn w-full">
            Cancel
          </button>
          <a
            href={`/api/stripe/checkout?${checkoutUrlParams.toString()}`}
            class="variant-filled-primary btn w-full">
            Complete Purchase
          </a>
        </div>
      </section>
    </div>
  </div>
</div>
