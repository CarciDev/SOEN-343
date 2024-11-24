<script>
  import Attributions from "./Attributions.svelte";
  import { attributionsData } from "./helpers";
</script>

<main style="background-color: var(--color-surface-800);">
  <section class="relative py-24">
    <div class="mx-auto w-full max-w-7xl px-4 md:px-5 lg:px-5">
      <div
        class="grid w-full grid-cols-1 items-center justify-start gap-12 lg:grid-cols-2">
        <div
          class="order-last grid w-full grid-cols-1 items-start justify-center gap-6 sm:grid-cols-2 lg:order-first">
          <div
            class="flex items-start justify-start gap-2.5 pt-24 sm:justify-end lg:justify-center">
            <img
              class="rounded-xl object-cover"
              src="https://images.unsplash.com/photo-1638045420324-e431122074c2?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Parcels out for delivery" />
          </div>
          <img
            class="ml-auto rounded-xl object-cover sm:ml-0"
            src="https://images.unsplash.com/photo-1615678815958-5910c6811c25?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Special delivery" />
        </div>
        <div
          class="inline-flex w-full flex-col items-center justify-center gap-10 lg:items-start">
          <div class="flex w-full flex-col items-start justify-center gap-8">
            <div
              class="flex w-full flex-col items-center justify-start gap-3 lg:items-start">
              <h6
                class="font-manrope text-center text-xl font-bold leading-normal text-gray-800 dark:text-gray-200 lg:text-start">
                About Us
              </h6>
              <h2
                class="font-manrope text-center text-4xl font-bold leading-normal text-gray-900 dark:text-gray-100 lg:text-start">
                Delivering Excellence Every Time
              </h2>
              <p
                class="text-center text-base font-normal leading-relaxed text-gray-500 dark:text-gray-300 lg:text-start">
                At SvelteShipSolutions, we're all about ensuring that every
                package reaches its destination on time, building lasting trust
                and satisfaction with our clients. Every shipment we handle
                represents our commitment to speed, safety, and precision.
              </p>
            </div>
            <div
              class="inline-flex w-full items-center justify-center gap-5 sm:gap-10 lg:justify-start">
              <div class="inline-flex flex-col items-start justify-start">
                <h3
                  class="font-manrope text-4xl font-bold leading-normal text-gray-900 dark:text-gray-100">
                  19
                </h3>
                <h6
                  class="text-base font-normal leading-relaxed text-gray-500 dark:text-gray-300">
                  Years in Logistics
                </h6>
              </div>
              <div class="inline-flex flex-col items-start justify-start">
                <h4
                  class="font-manrope text-4xl font-bold leading-normal text-gray-900 dark:text-gray-100">
                  343
                </h4>
                <h6
                  class="text-base font-normal leading-relaxed text-gray-500 dark:text-gray-300">
                  Million Deliveries
                </h6>
              </div>
              <div class="inline-flex flex-col items-start justify-start">
                <h4
                  class="font-manrope text-4xl font-bold leading-normal text-gray-900 dark:text-gray-100">
                  194+
                </h4>
                <h6
                  class="text-base font-normal leading-relaxed text-gray-500 dark:text-gray-300">
                  Countries Served
                </h6>
              </div>
            </div>
          </div>
          <button
            on:click={() => {
              location.href = "/quotation";
            }}
            class="flex w-full items-center justify-center rounded-lg bg-[rgb(var(--color-primary-500))] px-3.5 py-2 shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] transition-all duration-700 ease-in-out hover:bg-[rgb(var(--color-primary-700))] dark:bg-[rgb(var(--color-primary-600))] dark:hover:bg-[rgb(var(--color-primary-800))] sm:w-fit">
            <span class="px-1.5 text-sm font-medium leading-6 text-white"
              >Get Started Now</span>
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- About This Website Section -->
  <section class="relative py-24">
    <div class="mx-auto w-full max-w-7xl px-4 md:px-5 lg:px-5">
      <div
        class="inline-flex w-full flex-col items-center justify-center gap-10 lg:items-start">
        <div class="flex w-full flex-col items-start justify-center gap-8">
          <div
            class="flex w-full flex-col items-center justify-start gap-3 lg:items-start">
            <h6
              class="font-manrope text-center text-xl font-bold leading-normal text-gray-800 dark:text-gray-200 lg:text-start">
              More Information
            </h6>
            <h2
              class="font-manrope text-center text-4xl font-bold leading-normal text-gray-900 dark:text-gray-100 lg:text-start">
              About This Website
            </h2>
            <p
              class="text-center text-base font-normal leading-relaxed text-gray-500 dark:text-gray-300 lg:text-start">
              This project was developed for educational purposes only, as part
              of a semester-long course assignment at Concordia University. The
              aim is to provide hands-on experience in the design and
              development a software system — keeping best practices in mind
              with regards to UML and software architecture design. All content,
              resources, and design elements are used solely to support the
              learning objectives from SOEN-343 at Concordia University. See the
              next section for a full list of licensing.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Copyright Section -->
  <section class="relative py-24">
    <div class="mx-auto w-full max-w-7xl px-4 md:px-5 lg:px-5">
      <div
        class="inline-flex w-full flex-col items-center justify-center gap-10 lg:items-start">
        <div class="flex w-full flex-col items-start justify-center gap-8">
          <div
            class="flex w-full flex-col items-center justify-start gap-3 lg:items-start">
            <h6
              class="font-manrope text-center text-xl font-bold leading-normal text-gray-800 dark:text-gray-200 lg:text-start">
              Copyright
            </h6>
            <h2
              class="font-manrope text-center text-4xl font-bold leading-normal text-gray-900 dark:text-gray-100 lg:text-start">
              Licensing &amp; Attributions
            </h2>
            <p
              class="mb-3 text-center text-base font-normal leading-relaxed text-gray-500 dark:text-gray-300 sm:mb-6 lg:text-start">
              The following third-party resources were used in the creation of
              this website:
            </p>
            <Attributions attributions={attributionsData} />
          </div>
        </div>
      </div>
    </div>
  </section>
</main>
