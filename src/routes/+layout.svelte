<script lang="ts" context="module">
  import type { PageData } from "./$types";
  import type { SvelteComponent } from "svelte";

  export type User = PageData["user"];

  export type Link = {
    name: string;
    href: string;
    icon: typeof SvelteComponent;
  };
</script>

<script lang="ts">
  import "../app.postcss";
  import { dev } from "$app/environment";
  import { inject } from "@vercel/analytics";
  import { page } from "$app/stores";
  import { writable } from "svelte/store";
  import ChatBox from "$lib/components/ChatBox.svelte";
  import { fade } from "svelte/transition";
  inject({ mode: dev ? "development" : "production" });

  import {
    computePosition,
    autoUpdate,
    offset,
    shift,
    flip,
    arrow,
  } from "@floating-ui/dom";

  import {
    initializeStores,
    AppShell,
    AppBar,
    Avatar,
    Drawer,
    getDrawerStore,
    Toast,
    LightSwitch,
    Modal,
    popup,
    storePopup,
    type PopupSettings,
  } from "@skeletonlabs/skeleton";
  import type { ModalComponent } from "@skeletonlabs/skeleton";
  import MobileNavigation from "$lib/components/MobileNavigation.svelte";
  import HamburgerMenuIcon from "$lib/icons/HamburgerMenuIcon.svelte";
  import HomeIcon from "$lib/icons/HomeIcon.svelte";
  import ProfilePopup from "$lib/components/ProfilePopup.svelte";
  import NavBar from "$lib/components/NavBar.svelte";
  import ClipboardListIcon from "$lib/icons/ClipboardListIcon.svelte";
  import Dollar from "$lib/icons/Dollar.svelte";
  import Truck from "$lib/icons/Truck.svelte";
  import Message from "$lib/icons/Message.svelte";
  import Star from "$lib/icons/Star.svelte";

  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  initializeStores();

  export let data;
  const modalRegistry: Record<string, ModalComponent> = {};

  const drawerStore = getDrawerStore();

  function drawerOpen() {
    drawerStore.open();
  }

  const profilePopup: PopupSettings = {
    event: "click",
    target: "profilePopup",
    placement: "bottom",
  };

  $: initials =
    data?.user?.name
      .match(/(\b\S)?/g)
      ?.join("")
      ?.match(/(^\S|\S$)?/g)
      ?.join("") ?? "?";

  type SvelteComponent = typeof import("svelte").SvelteComponent;

  const links: Link[] = [
    { name: "Home", href: "/", icon: HomeIcon as SvelteComponent },
    {
      name: "Track",
      href: "/track",
      icon: ClipboardListIcon as SvelteComponent,
    },
    {
      name: "Get a Quote",
      href: "/quotation",
      icon: Dollar as SvelteComponent,
    },
    {
      name: "Start an Order ",
      href: "/rates-calculator",
      icon: Truck as SvelteComponent,
    },
    {
      name: "Leave a Review",
      href: "/review",
      icon: Star as SvelteComponent,
    },
  ];


  // Store to manage chatbot visibility
  const isChatbotOpen = writable(false);

  // Function to toggle chatbot
  function toggleChatbot() {
    isChatbotOpen.update((open) => !open);
  }

  const currentYear: number = new Date().getFullYear();
  const startingYear: number = 2024;
  const yearDisplay: string =
    currentYear > startingYear
      ? `${startingYear} - ${currentYear}`
      : `${startingYear}`;

</script>

<Toast position="br" zIndex="z-[1000]" />

<Modal components={modalRegistry} />

<Drawer>
  <MobileNavigation {links} />
</Drawer>

<AppShell slotSidebarLeft="w-0 md:w-52 bg-surface-500/10" class="bg-light-100">
  <svelte:fragment slot="header">
    <AppBar padding="py-0 px-4">
      <svelte:fragment slot="lead">
        <button class="btn btn-sm mr-4 md:hidden" on:click={drawerOpen}>
          <HamburgerMenuIcon />
        </button>
        <a href="/" class="h-10">
          <!-- <img
            src={$modeCurrent
              ? "/SiteLogoForDark.png"
              : "/SiteLogoForLight.png"}
            alt="SvelteShip"
            class="h-full" /> -->
          SvelteShip (logo goes here)
        </a>
      </svelte:fragment>
      <NavBar {links} />
      <svelte:fragment slot="trail">
        <LightSwitch class="mr-2" />
        <div use:popup={profilePopup}>
          <div use:popup={profilePopup}>
            <Avatar
              {initials}
              background="bg-tertiary-500"
              width="w-12"
              border="border-4 border-surface-300-600-token hover:!border-primary-500 transition-colors"
              cursor="cursor-pointer" />
          </div>
          <ProfilePopup user={data.user} />
        </div></svelte:fragment>
    </AppBar>
  </svelte:fragment>
  <div class="container mx-auto p-10">
    <slot />
  </div>
  <svelte:fragment slot="pageFooter">
    <footer
      class="py-20 text-center"
      style="background-color: var(--color-surface-800);">
      <div
        class="mx-auto w-full max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span
          class="text-sm text-neutral-500 dark:text-neutral-400 sm:text-center">
          © {yearDisplay}
          <a href="/" class="hover:underline">SvelteShipSolutions</a>. All
          Rights Reserved.
        </span>
        <ul
          class="mt-3 flex flex-wrap items-center text-sm font-medium text-neutral-500 dark:text-neutral-400 sm:mt-0">
          <li>
            <a href="/about" class="me-4 hover:underline md:me-6">About</a>
          </li>
        </ul>
      </div>
    </footer>
  </svelte:fragment>
</AppShell>

<!--Add urls you dont want the chatbot to appear on-->
{#if $page.url.pathname !== "/some-excluded-page"}
  <!-- Floating Chatbot Button -->
  <div class="fixed bottom-6 right-6 z-[9999]">
    <button
      on:click={toggleChatbot}
      class="rounded-full bg-orange-500 p-4 text-white shadow-lg transition-colors duration-300 hover:bg-orange-600"
      aria-label="Open Chat">
      {#if $isChatbotOpen}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12" />
        </svg>
      {:else}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      {/if}
    </button>

    <!-- Floating Chatbot Container -->
    {#if $isChatbotOpen}
      <div
        transition:fade={{ duration: 300 }}
        class="fixed bottom-24 right-6 z-[9999] w-full max-w-md rounded-lg shadow-2xl">
        <ChatBox />
      </div>
    {/if}
  </div>
{/if}
