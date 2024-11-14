<script lang="ts">
  export let invertColor = false;
  export let constColor = false;
  let colorClass: string;
  if (constColor) {
    colorClass = "text-white";
  } else {
    colorClass = invertColor
      ? "text-white dark:text-gray-800"
      : "text-gray-800 dark:text-white";
  }
</script>

<svg
  class="h-[28px] w-[28px] {colorClass}"
  aria-hidden="true"
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  fill="currentColor"
  viewBox="0 0 24 24">
  <path
    fill-rule="evenodd"
    d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-6.616l-2.88 2.592C8.537 20.461 7 19.776 7 18.477V17H5a2 2 0 0 1-2-2V6Zm4 2a1 1 0 0 0 0 2h5a1 1 0 1 0 0-2H7Zm8 0a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2h-2Zm-8 3a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H7Zm5 0a1 1 0 1 0 0 2h5a1 1 0 1 0 0-2h-5Z"
    clip-rule="evenodd" />
</svg>
