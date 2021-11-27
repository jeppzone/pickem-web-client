<script>
  import { Router } from "svelte-router-spa";
  import jwtDecode from "jwt-decode";
  import Login from "./Login.svelte";
  import Leagues from "./Leagues/Leagues.svelte";
  import League from "./Leagues/League.svelte";
  import MakeBets from "./MakeBets.svelte";
  import { loggedInUser } from "./auth.js";
  import Layout from "./Layout.svelte";
  import Statistics from "./Statistics.svelte";

  function isLoggedIn() {
    if ($loggedInUser !== null) {
      var decoded = jwtDecode($loggedInUser.token);
      var nowSeconds = Math.floor(Date.now() / 1000);
      return decoded.exp > nowSeconds;
    }
    return false;
  }

  function isNotLoggedIn() {
    return !isLoggedIn();
  }

  let routes = [
    {
      name: "/",
      component: MakeBets,
      layout: Layout,
      redirectTo: "/bets",
      onlyIf: { guard: isLoggedIn, redirect: "/login" },
    },
    {
      name: "login",
      component: Login,
      onlyIf: { guard: isNotLoggedIn, redirect: "/" },
    },
    {
      name: "leagues",
      component: Leagues,
      layout: Layout,
      onlyIf: { guard: isLoggedIn, redirect: "/login" },
    },
    {
      name: "leagues/:id",
      component: League,
      layout: Layout,
      onlyIf: { guard: isLoggedIn, redirect: "/login" },
    },
    {
      name: "bets",
      component: MakeBets,
      layout: Layout,
      onlyIf: { guard: isLoggedIn, redirect: "/login" },
    },
    {
      name: "statistics",
      component: Statistics,
      layout: Layout,
      onlyIf: { guard: isLoggedIn, redirect: "/login" },
    },
  ];
</script>

<div class="routes">
  <Router {routes} />
</div>
