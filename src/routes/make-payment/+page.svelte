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

<div class="py-28">
  <div class="container">
    <h1>
      This page/route is meant to assist in demonstrating the functionality for
      making a payment using a real quotation object. The UI will be finalized
      and will make use of sveltekit-superforms.
    </h1>
    <br />
    <h1>
      We aim to display quotation details in an appealing way, including origin,
      destination, and other relevant information.
    </h1>
    <br />
    <h1>
      As much information as possible will be shown before Stripe manages
      checkout and payment processing.
    </h1>
  </div>

  <div class="bg-white font-[sans-serif]">
    <div class="flex h-full gap-12 max-lg:gap-4 max-sm:flex-col">
      <div
        class="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 sm:sticky sm:top-0 sm:h-screen sm:min-w-[300px] lg:min-w-[370px]">
        <div class="relative h-full">
          <div class="px-4 py-8 sm:h-[calc(100vh-60px)] sm:overflow-auto">
            <div class="space-y-4">
              <!-- Example of displaying the quotation details -->
              <div class="flex items-start gap-4">
                <div
                  class="flex h-28 w-32 shrink-0 rounded-md bg-gray-300 p-3 max-lg:h-24 max-lg:w-24">
                  <img
                    src="https://static.wikia.nocookie.net/clubpenguin/images/7/7b/Box17.png"
                    alt="Regular Box"
                    class="w-full object-contain" />
                </div>
                <div class="w-full">
                  <h3 class="text-base text-white">Package Details</h3>
                  <ul class="mt-2 space-y-2 text-xs text-gray-300">
                    <li class="flex flex-wrap gap-4">
                      Origin ID <span class="ml-auto">{originId}</span>
                    </li>
                    <li class="flex flex-wrap gap-4">
                      Destination ID <span class="ml-auto"
                        >{destinationId}</span>
                    </li>
                    <li class="flex flex-wrap gap-4">
                      Total Price
                      <span class="ml-auto">
                        {centsToDollars(amountQuotedCents)}
                      </span>
                    </li>
                    <li class="flex flex-wrap gap-4">
                      ETA (Days) <span class="ml-auto">{etaDays}</span>
                    </li>
                    <li class="flex flex-wrap gap-4">
                      Box ID <span class="ml-auto">{boxId}</span>
                    </li>
                  </ul>
                </div>
              </div>
              <!-- Repeat for other package types if needed -->
            </div>
          </div>

          <div
            class="w-full space-y-3 bg-gray-800 p-4 md:absolute md:bottom-0 md:left-0">
            <h4 class="flex flex-wrap gap-4 text-sm text-neutral-500">
              <span class="mx-auto">Prices are shown in $CAD.</span>
            </h4>
            <h4 class="flex flex-wrap gap-4 text-base text-white">
              Total
              <span class="ml-auto">{centsToDollars(amountQuotedCents)}</span>
            </h4>
          </div>
        </div>
      </div>

      <div class="sticky top-0 h-max w-full max-w-4xl rounded-md px-4 py-8">
        <h2 class="text-2xl font-bold text-gray-800">Checkout</h2>
        <form class="mt-8">
          <div class="mt-8">
            <h3 class="mb-4 text-base text-gray-800">
              Please review the quotation details before proceeding to payment.
            </h3>

            <div class="mt-8 flex gap-4 max-md:flex-col">
              <button
                type="button"
                class="w-full rounded-md border border-gray-300 bg-transparent px-6 py-3 text-sm tracking-wide text-gray-800 hover:bg-gray-100 max-md:order-1"
                >Cancel</button>
              <a
                href={`/api/stripe/checkout?${checkoutUrlParams.toString()}`}
                class="w-full rounded-md bg-[#ff3e00] px-6 py-3 text-center text-sm font-medium tracking-wide text-white hover:bg-[#d93800] focus:outline-none focus:ring-4 focus:ring-[#ff6a33] dark:bg-[#ff3e00] dark:hover:bg-[#d93800] dark:focus:ring-[#ff6a33]"
                >Complete Purchase</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
