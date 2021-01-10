<script>
  import { Route } from "svelte-router-spa";
  import Navbar from "./Navbar.svelte";

  export let currentRoute;

  const params = {};

  let loading = false;

  function setLoading() {
    loading = true;
  }

  function setNotLoading() {
    loading = false;
  }
</script>

<style>
  .navigation {
    height: 10%;
  }

  .routes {
    margin-top: 5%;
  }
</style>

<div class="navigation">
  <Navbar {currentRoute} />
</div>
<div class="routes">
  <Route {currentRoute} {params} />
</div>
