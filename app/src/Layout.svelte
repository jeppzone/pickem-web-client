<script>
  import { Route } from "svelte-router-spa";
  import Navbar from "./Navbar.svelte";
  import { SvelteToast } from "@zerodevx/svelte-toast";

  export let currentRoute;

  const params = {};
  const options = {
    reversed: true,
  };
</script>

<div class="navigation">
  <Navbar {currentRoute} />
</div>
<div class="routes">
  <Route {currentRoute} {params} />
</div>
<SvelteToast {options} />

<style>
  .routes {
    margin-left: 200px;
  }
  :root {
    --toastContainerBottom: 2rem;
    --toastContainerTop: auto;
    --toastBackground: rgb(12, 35, 49);
    --toastColor: white;
  }

  @media only screen and (max-width: 600px) {
    .routes {
      margin-left: 0px;
      width: 100vw;
    }
  }
</style>
