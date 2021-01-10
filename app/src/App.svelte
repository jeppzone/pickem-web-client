<script>
  import { Router } from "svelte-router-spa";
  import Home from "./Home.svelte";
  import Login from "./Login.svelte";
  import Leagues from "./Leagues/Leagues.svelte";
  import League from "./Leagues/League.svelte";
  import MakeBets from "./MakeBets.svelte";
  import Games from "./Games.svelte";
  import { loggedInUser } from "./auth.js";
  import Layout from "./Layout.svelte";

  function isLoggedIn() {
    return $loggedInUser !== null;
  }

  let routes = [
    {
      name: "/",
      component: Home,
      layout: Layout,
      onlyIf: { guard: isLoggedIn, redirect: "/login" },
    },
    {
      name: "login",
      component: Login,
      onlyIf: { guard: !isLoggedIn, redirect: "/" },
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
      name: "games",
      layout: Layout,
      component: Games,
    },
  ];
</script>

<div class="routes">
  <Router {routes} />
</div>
