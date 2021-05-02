<script>
  import { loggedInUser } from "./auth.js";
  import { navigateTo } from "svelte-router-spa";

  export let currentRoute;

  let path;
  $: path = currentRoute.name;

  function logOut() {
    $loggedInUser = null;
    navigateTo("/login");
  }

  function goTo(path) {
    if ($loggedInUser !== null) {
      navigateTo(path);
    }
  }
</script>

{#if $loggedInUser !== null}
  <div class="navbar">
    <div class="title">
      <img on:click={() => goTo("/")} src="assets/logo.png" alt="NFL Pick'em" />
    </div>
    <div class="navbar-pages">
      <p on:click={() => goTo("/bets")} class={path.includes("/bets") ? "selected" : ""}>Bets</p>
      <p on:click={() => goTo("/leagues")} class={path.includes("/leagues") ? "selected" : ""}>Leagues</p>
    </div>
    <div class="user-info">
      <h3>{$loggedInUser?.username}</h3>
      <p on:click={logOut}>Logout</p>
    </div>
  </div>
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

  .user-info {
    display: flex;
    flex-direction: column;
    bottom: 10px;
    position: fixed;
    margin-left: 20px;
  }
  .user-info p {
    cursor: pointer;
  }

  .navbar-pages {
    display: flex;
    flex-direction: column;
    margin-left: 20px;
  }

  .navbar-pages p {
    cursor: pointer;
  }

  .selected {
    color: rgb(233, 147, 97);
    border-bottom: 3px solid rgb(233, 147, 97);
    font-weight: bold;
    width: fit-content;

    -webkit-animation: fadein 0.5s; /* Safari, Chrome and Opera > 12.1 */
    -moz-animation: fadein 0.5s; /* Firefox < 16 */
    -ms-animation: fadein 0.5s; /* Internet Explorer */
    -o-animation: fadein 0.5s; /* Opera < 12.1 */
    animation: fadein 0.5s;
  }
</style>
