<script lang="ts">
  import type { Attribution } from "./helpers";

  export let attributions: Attribution[] = [];
</script>

<div class="grid gap-6 md:grid-cols-3">
  {#each attributions as { resourceUrl, name, description, license, licenseUrl }}
    <div class="space-y-2">
      <a
        href={resourceUrl}
        class="text-lg font-semibold text-primary-600 hover:underline"
        >{name}</a>
      <p class="text-base">
        {description} It is used under terms of the
        <a
          href={licenseUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="text-primary-600 hover:underline">
          {license}.
        </a>
      </p>
    </div>
  {/each}
</div>
