<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import ChatBox from "$lib/components/ChatBox.svelte";

  // Function to check if the user is logged in
  async function checkLogin() {
    const response = await fetch('/api/check-session');
    const data = await response.json();
    if (!data.loggedIn) {
      goto('/auth/login');
      return false;
    }
    return true;
  }

  // Check login status on mount
  onMount(async () => {
    const loggedIn = await checkLogin();
    if (!loggedIn) {
      goto('/auth/login');
    }
  });
</script>

<main>
  <div class="mx-auto mb-10 max-w-2xl text-center">
    <h1 class="mb-6 text-5xl sm:text-6xl">ChatBot - Customer Service</h1>
    <p class="text-lg">
      Need assistance? SvelteShipSolutions is proud to offer the latest and
      greatest in AI-driven customer support, directly at your fingertips.
    </p>
    <ChatBox />
  </div>
</main>
