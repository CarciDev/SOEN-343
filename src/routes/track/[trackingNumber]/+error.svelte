<script>
  import { page } from "$app/stores";
  import { error } from "@sveltejs/kit";

  if ($page.status !== 404) {
    error($page.status, $page.error?.message);
  }
</script>

<div class="container mx-auto py-10">
  <h1 class="mb-6 text-center text-3xl font-bold">Parcel Not Found</h1>
  <p>
    Go back to the <a href="/track" class="underline"
      >list of parcels you've shipped</a
    >.
  </p>
</div>
