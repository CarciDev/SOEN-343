<script lang="ts">
  import { onMount } from "svelte";

  export let url: string;

  let iframe: HTMLIFrameElement | null = null;

  const keepIframeActive = () => {
    if (iframe) {
      iframe.contentWindow?.focus();
    }
  };

  onMount(() => {
    document.addEventListener("click", keepIframeActive);
    return () => {
      document.removeEventListener("click", keepIframeActive);
    };
  });
</script>

<iframe
  title="Game by SvelteShip Solutions"
  bind:this={iframe}
  src={url}
  class="h-[640px] w-[640px] resize overflow-auto"
  scrolling="no"
  allow="autoplay">
</iframe>
