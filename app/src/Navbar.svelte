<script>
  import { loggedInUser } from "./auth.js";
  import { navigateTo } from "svelte-router-spa";

  function logOut() {
    $loggedInUser = null;
    navigateTo("/login");
  }

  function goTo(path) {
    if($loggedInUser !== null){
      navigateTo(path);
      console.log("Navigating");  
    }
  }
</script>

<style>
  .navbar {
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: rgb(12, 35, 49);
    color: white;
    position: fixed;
    top:0;
    width: 99%;
  }
  .user-info {
    width: 60%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    align-content: space-between;
  }
  .user-info p {
    margin-left: 1em;
    cursor: pointer;
  }

  .navbar h2{
    margin-left: 0.5em;
    cursor: pointer;
  }

  .navbar-pages {
    margin: 1em;
    display: flex;
    width: fit-content;
  }

  .navbar-pages p {
    margin: 1em;
    cursor: pointer;
  }

  .title {
    width: 15%;
  }
</style>

{#if $loggedInUser !== null}
  <div class="navbar">
    <div class="title">
      <h2 on:click={() => goTo("/")}>NFL Pick'em</h2>
    </div>
    <div class="navbar-pages">
      <p on:click={() => goTo("/games")}>Games</p>
      <p on:click={() => goTo("/bets")}>Bets</p>
      <p on:click={() => goTo("/leagues")}>Leagues</p>
    </div>
    <div class="user-info">
      <h3>{$loggedInUser?.username}</h3>
      <p on:click={logOut}>Logout</p>
    </div>
  </div>
{/if}
