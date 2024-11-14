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
  fill="none"
  viewBox="0 0 24 24">
  <path
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2" />
</svg>
