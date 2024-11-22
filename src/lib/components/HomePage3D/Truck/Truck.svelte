<script lang="ts">
  import { onMount } from "svelte";
  import { initializeScene } from "$lib/components/HomePage3D/Truck/truckScene";

  onMount(() => {
    initializeScene("truck-container");
  });
</script>

<div id="truck-container"></div>

<style>
  #truck-container {
    width: 100%;
    height: 100vh;
    position: relative;
    z-index: 1;
  }
</style>
