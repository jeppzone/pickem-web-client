<script>
  import { onMount } from "svelte";
  import CreateLeagues from "./CreateLeagues.svelte";
  import JoinLeague from "./JoinLeague.svelte";
  import DeleteLeague from "./DeleteLeague.svelte";
  import { loggedInUser } from "./auth";
  import { fetchLeagues } from "./api";
  import { Navigate } from "svelte-router-spa";

  let leagues = [];
  let myLeagues = [];
  let otherLeagues = [];
  let createToggled = false;

  function toggleCreate() {
    createToggled = !createToggled;
  }

  onMount(async () => {
    leagues = await fetchLeagues($loggedInUser);
    console.log(leagues);
    console.log($loggedInUser);
    myLeagues = leagues.filter(l => Object.keys(l.users).includes($loggedInUser.id));
    otherLeagues = leagues.filter(l => !myLeagues.includes(l))
  });
</script>

<div>
  <h1>My leagues</h1>
  {#each myLeagues as myLeague}
    <li>
      <Navigate to={`/leagues/${myLeague.id}`}>{myLeague.name}</Navigate>
    </li>
  {/each}
  <h1>Other leagues</h1>
  {#each otherLeagues as otherLeague}
    <li>
      <Navigate to={`/leagues/${otherLeague.id}`}>{otherLeague.name}</Navigate>
      <JoinLeague league={otherLeague} />
      <DeleteLeague league={otherLeague} />
    </li>
  {/each}
  {#if createToggled}
    <CreateLeagues />
  {:else}<button on:click={toggleCreate}>Create League</button>{/if}
</div>
