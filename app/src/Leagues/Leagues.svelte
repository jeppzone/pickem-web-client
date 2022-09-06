<script>
  import { onMount } from "svelte";
  import CreateLeagues from "./CreateLeagues.svelte";
  import { loggedInUser } from "../auth";
  import { fetchLeagues } from "../api";
  import LeagueTable from "./LeagueTable.svelte";
  import LoadingIndicator from "../LoadingIndicator.svelte";

  let leagues = [];
  let joinedLeagues = [];
  let otherLeagues = [];
  let createToggled = false;
  let loading = false;

  function toggleCreate() {
    createToggled = !createToggled;
  }

  function handleLeagueCreated(evt) {
    joinedLeagues = [...joinedLeagues, evt.detail.createdLeague];
    leagues = [...joinedLeagues, ...otherLeagues];
  }

  function handleLeagueJoined(evt) {
    otherLeagues = otherLeagues.filter((l) => l.id !== evt.detail.joinedLeague.id);
    joinedLeagues = [...joinedLeagues, evt.detail.joinedLeague];
    leagues = [...joinedLeagues, ...otherLeagues];
  }

  function handleLeagueDeleted(evt) {
    joinedLeagues = joinedLeagues.filter((l) => l.id !== evt.detail.deletedLeague.id);
    leagues = [...joinedLeagues, ...otherLeagues];
  }

  onMount(async () => {
    try {
      loading = true;
      leagues = await fetchLeagues($loggedInUser);
      leagues = leagues.filter((l) => l.season === 2022);
      joinedLeagues = leagues.filter((l) => Object.keys(l.users).includes($loggedInUser.id));
      otherLeagues = leagues.filter((l) => !joinedLeagues.includes(l));
      leagues = [...joinedLeagues, ...otherLeagues];
      loading = false;
    } catch (err) {
      loading = false;
    }
  });
</script>

<div class="container">
  <h1>Leagues</h1>
  {#if loading}
    <LoadingIndicator />
  {:else}
    {#if leagues && leagues.length > 0}
      <LeagueTable {leagues} on:delete-league-succeeded={handleLeagueDeleted} on:join-league-succeeded={handleLeagueJoined} />
    {/if}
    {#if createToggled}
      <CreateLeagues on:create-league-cancelled={toggleCreate} on:create-league-succeeded={handleLeagueCreated} />
    {:else}<button on:click={toggleCreate}>Create League</button>{/if}
  {/if}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  button {
    background-color: rgb(231, 117, 52);
    color: white;
    cursor: pointer;
    margin-top: 1em;
    width: 300px;
  }
</style>
