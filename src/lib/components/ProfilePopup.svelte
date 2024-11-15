<script lang="ts">
  import UserSettingsIcon from "$lib/icons/UserSettingsIcon.svelte";
  import UserIcon from "$lib/icons/UserIcon.svelte";
  import GridIcon from "$lib/icons/GridIcon.svelte";
  import GridPlusIcon from "$lib/icons/GridPlusIcon.svelte";

  import type { User } from "../../routes/+layout.svelte";

  export let user: User;
  $: loggedIn = !!user;
</script>

<div
  style="margin: 1px"
  class="card variant-filled w-auto p-4 shadow-xl"
  data-popup="profilePopup">
  <div class="variant-filled arrow" />

  {#if loggedIn}
    <div class=" variant-filled btn-group-vertical w-full">
      <!-- TODO: Un-disable the button when the profile page is implemented -->
      <button
        style="justify-content: start;"
        class=" bg-secondary-hover-token gap-2"
        disabled={true}
        ><UserIcon invertColor={true} /><span>Profile</span></button>
      <a
        href="/track"
        style="justify-content: start;"
        class=" bg-secondary-hover-token gap-2"
        ><GridIcon invertColor={true} /><span>Dashboard</span></a>
      {#if user?.role === "ADMIN"}
        <a
          href="/admin"
          style="justify-content: start;"
          class=" bg-secondary-hover-token gap-2"
          ><GridPlusIcon invertColor={true} /><span>Admin Dashboard</span></a>
      {/if}
      <!-- TODO: Un-disable the button when the settings page is implemented -->
      <button
        style="justify-content: start;"
        class="bg-secondary-hover-token gap-2"
        disabled={true}
        ><UserSettingsIcon invertColor={true} /><span>Settings</span></button>
    </div>
    <div>
      <a
        class="variant-filled-error btn mt-2 w-full"
        href="/auth/logout"
        data-sveltekit-reload>Log Out</a>
    </div>
  {:else}
    <div>
      <a class="variant-filled-primary btn mt-2 w-full" href="/auth/login"
        >Log In</a>
      <a class="variant-filled-secondary btn mt-2 w-full" href="/auth/register"
        >Create Account</a>
    </div>
  {/if}
</div>
