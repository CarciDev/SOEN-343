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
  style="width: 640px; height: 640px; overflow: hidden; border: none;"
  scrolling="no"
  allow="autoplay">
</iframe>
