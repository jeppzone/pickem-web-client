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

<style>
  .navbar {
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: rgb(12, 35, 49);
    color: white;
    position: fixed;
    top: 0;
    width: 99%;
    z-index: 1000;
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

  .navbar h2 {
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

  .selected {
    color: rgb(233, 147, 97);
    border-bottom: 3px solid rgb(233, 147, 97);
    font-weight: bold;

    -webkit-animation: fadein 0.5s; /* Safari, Chrome and Opera > 12.1 */
    -moz-animation: fadein 0.5s; /* Firefox < 16 */
    -ms-animation: fadein 0.5s; /* Internet Explorer */
    -o-animation: fadein 0.5s; /* Opera < 12.1 */
    animation: fadein 0.5s;
  }

</style>

{#if $loggedInUser !== null}
  <div class="navbar">
    <div class="title">
      <h2 on:click={() => goTo('/')}>NFL Pick'em</h2>
    </div>
    <div class="navbar-pages">
      <p
        on:click={() => goTo('/games')}
        class={path.includes('/games') ? 'selected' : ''}>
        Games
      </p>
      <p
        on:click={() => goTo('/bets')}
        class={path.includes('/bets') ? 'selected' : ''}>
        Bets
      </p>
      <p
        on:click={() => goTo('/leagues')}
        class={path.includes('/leagues') ? 'selected' : ''}>
        Leagues
      </p>
    </div>
    <div class="user-info">
      <h3>{$loggedInUser?.username}</h3>
      <p on:click={logOut}>Logout</p>
    </div>
  </div>
{/if}
