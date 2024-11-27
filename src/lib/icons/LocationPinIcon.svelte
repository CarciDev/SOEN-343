<script lang="ts">
  export let invertColor = false;
  export let constColor = false;
  let colorClass: string;
  if (constColor) {
    colorClass = invertColor ? "text-gray-800" : "text-white";
  } else {
    colorClass = invertColor
      ? "text-white dark:text-gray-800"
      : "text-gray-800 dark:text-white";
  }
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  class="h-4 w-4 {colorClass}"
  aria-hidden="true"
  width="24"
  height="24"
  fill="currentColor"
  viewBox="0 0 384 512">
  <path
    d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
</svg>
