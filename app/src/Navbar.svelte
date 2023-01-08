<script>
  import { loggedInUser } from "./auth.js";
  import { navigateTo } from "svelte-router-spa";

  export let currentRoute;

  let path;
  $: path = currentRoute.name;

  let open = false;
  let innerWidth;

  function logOut() {
    $loggedInUser = null;
    navigateTo("/login");
  }

  function goTo(path) {
    open = false;
    if ($loggedInUser !== null) {
      navigateTo(path);
    }
  }
</script>

<svelte:window bind:innerWidth />
{#if $loggedInUser !== null}
  <button class="hamburger" class:open on:click={() => (open = !open)}>
    <svg width="32" height="24">
      <line id="top" x1="0" y1="2" x2="32" y2="2" />
      <line id="middle" x1="0" y1="12" x2="24" y2="12" />
      <line id="bottom" x1="0" y1="22" x2="32" y2="22" />
    </svg>
  </button>
  {#if open || innerWidth > 600}
    <div class="navbar">
      <div class="title">
        <img on:click={() => goTo("/")} src="/assets/logo.png" alt="NFL Pick'em" />
      </div>
      <div class="navbar-pages">
        <p on:click={() => goTo("/bets")} class={path.includes("/bets") ? "selected" : ""}>Bets</p>
        <p on:click={() => goTo("/leagues")} class={path.includes("/leagues") ? "selected" : ""}>Leagues</p>
        <p on:click={() => goTo("/statistics")} class={path.includes("/statistics") ? "selected" : ""}>Statistics</p>
        <h3 on:click={() => goTo("/profile")} class={path.includes("/profile") ? "selected" : ""}>{$loggedInUser?.username}</h3>
        <p on:click={logOut}>Logout</p>
      </div>
    </div>
  {/if}
{/if}

<style>
  .navbar {
    height: 100vh;
    width: 190px;
    display: flex;
    flex-direction: column;
    padding-left: 10px;
    background-color: rgb(12, 35, 49);
    color: white;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 3;
    overflow-x: hidden;
    font-size: 18px;
  }

  .title img {
    width: 150px;
    cursor: pointer;
  }

  .navbar-pages {
    display: flex;
    flex-direction: column;
    margin-left: 20px;
  }

  .navbar-pages p,
  .navbar-pages h3 {
    cursor: pointer;
  }

  .selected {
    color: rgb(233, 147, 97);
    border-bottom: 3px solid rgb(233, 147, 97);
    font-weight: bold;
    width: fit-content;
    animation: fadein 0.5s;
  }

  .hamburger {
    display: none;
    z-index: 1000;
    margin-left: 0px;
    position: fixed;
    top: 0;
  }

  button {
    background-color: rgb(12, 35, 49);
    outline: none;
    border: none;
  }

  .open svg {
    transform: scale(0.7);
  }

  .open #top {
    transform: translate(6px, 0px) rotate(45deg);
  }

  .open #middle {
    opacity: 0;
  }

  .open #bottom {
    transform: translate(-12px, 9px) rotate(-45deg);
  }

  svg {
    color: white;
    background-color: rgb(12, 35, 49);
    min-height: 24px;
    transition: transform 0.3s ease-in-out;
  }

  svg line {
    stroke: currentColor;
    stroke-width: 3;
    transition: transform 0.3s ease-in-out;
  }

  @media only screen and (max-width: 600px) {
    .navbar {
      width: 100vw;
      height: 100vh;
    }
    .hamburger {
      display: block;
      background-color: rgb(12, 35, 49);
    }
    .title {
      margin-top: 60px;
    }
  }
</style>
