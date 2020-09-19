<script>
  import { Router } from "svelte-router-spa";
  import Home from "./Home.svelte";
  import Login from "./Login.svelte";
  import { loggedInUser } from "./auth.js";

  function isLoggedIn() {
    return $loggedInUser !== null;
  }

  let routes = [
    {
      name: "/",
      component: Home,
      onlyIf: { guard: isLoggedIn, redirect: "/login" }
    },
    {
      name: "login",
      component: Login,
      onlyIf: { guard: !isLoggedIn, redirect: "/" }
    }
  ];
</script>

<Router {routes} />
