<script lang="ts" context="module">
  export type HomePageCardType = {
    section: number;
    href: string;
    title: string;
    description: string;
    buttonText: string;
    image: string;
    previewImage: string;
  };
</script>

<script lang="ts">
  export let currentMode: boolean;
  export let card: HomePageCardType;
</script>

<div
  data-section={card.section}
  id={`section${card.section}`}
  class="section-card fade-transition flex h-[100vh] justify-center p-40 py-20">
  <div class="my-auto">
    <a
      id={`section${card.section}`}
      href={card.href}
      class="relative grid grid-cols-2 items-center justify-center">
      {#if card.section % 2 === 0}
        <div class="col-span-1">
          <img
            src={card.previewImage}
            alt=""
            class="img card-hover flex justify-center rounded-md align-middle" />
        </div>
        <div class="card card-hover col-span-1">
          <img
            class=" h-full w-full rounded-t-lg object-cover"
            src={card.image + (currentMode ? "Light.png" : "Dark.png")}
            alt={card.title} />
          <header class="card-header">
            <p class="h2">{card.title}</p>
          </header>
          <section class="p-4">
            {card.description}
          </section>
          <footer class="card-footer flex justify-center">
            <a href={card.href} class="btn bg-primary-500">{card.buttonText}</a>
          </footer>
        </div>
      {:else}
        <div class="card card-hover col-span-1">
          <img
            class=" h-full w-full rounded-t-lg object-cover"
            src={card.image + (currentMode ? "Light.png" : "Dark.png")}
            alt={card.title} />
          <header class="card-header">
            <p class="h2">{card.title}</p>
          </header>
          <section class="p-4">
            {card.description}
          </section>
          <footer class="card-footer flex justify-center">
            <a href={card.href} class="btn bg-primary-500">{card.buttonText}</a>
          </footer>
        </div>
        <div class="col-span-1">
          <img
            src={card.previewImage}
            alt=""
            class="img card-hover flex justify-center rounded-md align-middle" />
        </div>
      {/if}
    </a>
  </div>
</div>
