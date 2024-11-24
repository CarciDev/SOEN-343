<script lang="ts">
  import { TabAnchor, TabGroup } from "@skeletonlabs/skeleton";

  import type { Link } from "../../routes/+layout.svelte";

  import { page } from "$app/stores";

  export let links: Link[];
</script>

<TabGroup
  justify="justify-center"
  active="variant-filled-primary"
  hover="hover:variant-soft-primary"
  flex="flex-1 lg:flex-none justify-center"
  rounded=""
  border=""
  class="bg-surface-100-800-token hidden h-full md:block ">
  {#each links as link (link.name)}
    <TabAnchor
    on:click={() => (window.location.href = link.href)}
    selected={$page.url.pathname === link.href}>
      <svelte:fragment slot="lead"
        ><div class="flex justify-center">
          <svelte:component this={link.icon} />
        </div></svelte:fragment>
      <span>{link.name}</span>
    </TabAnchor>
  {/each}
</TabGroup>
