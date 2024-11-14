<script lang="ts">
  import { Quotation } from "$lib/domain/Quotation";
  import { centsToDollars } from "$lib/utils";

  // make this page a form with superforms submit object (obj will be quotation that gets transformed with adapter)

  // Dummy quotation instance
  const dummyAmountQuotedCents =
    (Math.floor(Math.random() * (100 - 10 + 1)) + 10) * 100; // generate some price, in cents, between 10 and 100 dollars.

  const dummyQuotation = new Quotation({
    originId: 1,
    destinationId: 2,
    amountQuotedCents: dummyAmountQuotedCents,
    boxId: 3,
  });

  const checkoutUrlParams = new URLSearchParams({
    dummyQuotationId: dummyQuotation.id?.toString() || "", // dummy value for now
    amountQuotedCents: dummyAmountQuotedCents.toString(),
  }); // tne params that currently get passed to the strie API checkout route by URL
</script>

<div class="py-28">
  <div class="container">
    <h1>
      This page/route is meant to assist in demonstrating the functionality for
      making a payment, which is complete. It makes use of a test/dummy
      quotation object with a randomized price each time the payment page is
      reloaded. Once the quotation feature is complete, this entire page's UI
      will be completed and also make use of sveltekit-superforms.
    </h1>
    <br />
    <h1>
      For ui on this page (currently missing skeleton ui) I think we show the
      quotation details and make it look nice, show order on the side,
      origin+dest, ...
    </h1>
    <br />
    <h1>
      Show as much as we can on this page before stripe takes care of
      checkout+payment processing
    </h1>
  </div>

  <div class="bg-white font-[sans-serif]">
    <div class="flex h-full gap-12 max-lg:gap-4 max-sm:flex-col">
      <div
        class="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 sm:sticky sm:top-0 sm:h-screen sm:min-w-[300px] lg:min-w-[370px]">
        <div class="relative h-full">
          <div class="px-4 py-8 sm:h-[calc(100vh-60px)] sm:overflow-auto">
            <div class="space-y-4">
              <div class="flex items-start gap-4">
                <div
                  class="flex h-28 w-32 shrink-0 rounded-md bg-gray-300 p-3 max-lg:h-24 max-lg:w-24">
                  <img
                    src="https://static.wikia.nocookie.net/clubpenguin/images/7/7b/Box17.png"
                    alt="Regular Box"
                    class="w-full object-contain" />
                </div>
                <div class="w-full">
                  <h3 class="text-base text-white">Regular Package</h3>
                  <ul class="mt-2 space-y-2 text-xs text-gray-300">
                    <li class="flex flex-wrap gap-4">
                      Height (cm) <span class="ml-auto">37</span>
                    </li>
                    <li class="flex flex-wrap gap-4">
                      Other attrs... <span class="ml-auto">2 kg</span>
                    </li>
                    <li class="flex flex-wrap gap-4">
                      Total Price <span class="ml-auto">$40</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div
                  class="flex h-28 w-32 shrink-0 rounded-md bg-gray-300 p-3 max-lg:h-24 max-lg:w-24">
                  <img
                    src="https://static.wikia.nocookie.net/clubpenguin/images/7/7b/Box17.png"
                    alt="Regular Box"
                    class="w-full object-contain" />
                </div>
                <div class="w-full">
                  <h3 class="text-base text-white">Regular Package</h3>
                  <ul class="mt-2 space-y-2 text-xs text-gray-300">
                    <li>Height (cm) <span class="float-right">37</span></li>
                    <li>
                      Other attrs... <span class="float-right">2 kg</span>
                    </li>
                    <li>Total Price <span class="float-right">$40</span></li>
                  </ul>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div
                  class="flex h-28 w-32 shrink-0 rounded-md bg-gray-300 p-3 max-lg:h-24 max-lg:w-24">
                  <img
                    src="https://static.wikia.nocookie.net/clubpenguin/images/3/34/Cardboard_Box_Pin.PNG"
                    alt="Duties Box"
                    class="w-full object-contain" />
                </div>
                <div class="w-full">
                  <h3 class="text-base text-white">Duties Package</h3>
                  <ul class="mt-2 space-y-2 text-xs text-gray-300">
                    <li>Height (cm) <span class="float-right">37</span></li>
                    <li>
                      Other attrs... <span class="float-right">2 kg</span>
                    </li>
                    <li>Total Price <span class="float-right">$40</span></li>
                  </ul>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div
                  class="flex h-28 w-32 shrink-0 rounded-md bg-gray-300 p-3 max-lg:h-24 max-lg:w-24">
                  <img
                    src="https://banner2.cleanpng.com/20180525/gih/kisspng-club-penguin-box-skiing-search-box-5b0809664028a6.7018950315272533502628.jpg"
                    alt="Oversized boxes"
                    class="w-full object-contain" />
                </div>
                <div class="w-full">
                  <h3 class="text-base text-white">Oversized Package</h3>
                  <ul class="mt-2 space-y-2 text-xs text-gray-300">
                    <li>Height (cm) <span class="float-right">37</span></li>
                    <li>
                      Other attrs... <span class="float-right">2 kg</span>
                    </li>
                    <li>Total Price <span class="float-right">$40</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div
            class="w-full space-y-3 bg-gray-800 p-4 md:absolute md:bottom-0 md:left-0">
            <h4 class="flex flex-wrap gap-4 text-sm text-neutral-500">
              <span class="mx-auto">Prices are shown in $CAD.</span>
            </h4>
            <h4 class="flex flex-wrap gap-4 text-base text-white">
              Subtotal <span class="ml-auto">foo</span>
            </h4>
            <h4 class="flex flex-wrap gap-4 text-base text-white">
              Shipping.. <span class="ml-auto">bar</span>
            </h4>
            <h4 class="flex flex-wrap gap-4 text-base text-white">
              Tax Items.. <span class="ml-auto">baz</span>
            </h4>
            <hr />
            <h4 class="flex flex-wrap gap-4 text-base text-white">
              Total <span class="ml-auto"
                >{centsToDollars(dummyAmountQuotedCents)}</span>
            </h4>
          </div>
        </div>
      </div>

      <div class="sticky top-0 h-max w-full max-w-4xl rounded-md px-4 py-8">
        <h2 class="text-2xl font-bold text-gray-800">Lorem Ipsum</h2>
        <form class="mt-8">
          <div class="mt-8">
            <h3 class="mb-4 text-base text-gray-800">
              Demo page for Variable pricing in stripe (creates products at
              checkout)
            </h3>
            <h3 class="mb-4 text-base text-gray-800">
              Quotation details and any details that should be mentioned before
              checkout to the customer will go here.
            </h3>

            <div class="mt-8 flex gap-4 max-md:flex-col">
              <button
                type="button"
                class="w-full rounded-md border border-gray-300 bg-transparent px-6 py-3 text-sm tracking-wide text-gray-800 hover:bg-gray-100 max-md:order-1"
                >Cancel</button>
              <a
                href={`/api/stripe/checkout?${checkoutUrlParams.toString()}`}
                class="w-full rounded-md bg-[#ff3e00] px-6 py-3 text-center text-sm font-medium tracking-wide text-white hover:bg-[#d93800] focus:outline-none focus:ring-4 focus:ring-[#ff6a33] dark:bg-[#ff3e00] dark:hover:bg-[#d93800] dark:focus:ring-[#ff6a33]"
                >Complete purchase</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
