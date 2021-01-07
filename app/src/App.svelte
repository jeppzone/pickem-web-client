<script>
  import { Router } from "svelte-router-spa";
  import Home from "./Home.svelte";
  import Login from "./Login.svelte";
  import Leagues from "./Leagues.svelte";
  import League from "./League.svelte";
  import MakeBets from "./MakeBets.svelte";
  import Games from "./Games.svelte";
  import { loggedInUser } from "./auth.js";
  import Navbar from "./Navbar.svelte";

  function isLoggedIn() {
    return $loggedInUser !== null;
  }

  let routes = [
    {
      name: "/",
      component: Home,
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
      onlyIf: { guard: isLoggedIn, redirect: "/login" },
    },
    {
      name: "leagues/:id",
      component: League,
      onlyIf: { guard: isLoggedIn, redirect: "/login" },
    },
    {
      name: "bets",
      component: MakeBets,
      onlyIf: { guard: isLoggedIn, redirect: "/login" },
    },
    {
      name: "games",
      component: Games,
    },
  ];
</script>

<style>
  .navigation {
    height: 10%;
  }
</style>

<div class="navigation">
  <Navbar />
</div>
<div class="routes">
  <Router {routes} />
</div>
