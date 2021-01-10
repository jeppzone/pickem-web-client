<script>
  import { onMount } from "svelte";
  import CreateLeagues from "./CreateLeagues.svelte";
  import JoinLeague from "./JoinLeague.svelte";
  import DeleteLeague from "./DeleteLeague.svelte";
  import { loggedInUser } from "../auth";
  import { fetchLeagues } from "../api";
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
    myLeagues = leagues.filter((l) =>
      Object.keys(l.users).includes($loggedInUser.id)
    );
    otherLeagues = leagues.filter((l) => !myLeagues.includes(l));
  });

  function getNbrOfPlayers(league) {
    return Object.keys(league.users).length;
  }
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .button button {
    height: 20%
  }
  th {
    padding-right: 2em;
    padding-left: 0.5em;
  }
  td {
    padding-top: 0.5em;
    padding-bottom: 0.5em;
    padding-left: 0.5em;
    margin: auto;
  }
  tr:nth-child(2n + 2) {
    background-color: #f0f3f3;
  }

  button {
    background-color:rgb(231, 117, 52);
    color: white;
    cursor: pointer;
    margin-top: 1em;
  }
</style>

<div class="container">
  <h2>My leagues</h2>
  <table>
    <tr>
      <th>Name</th>
      <th>Players</th>
      <th>Admin</th>
    </tr>
    {#each myLeagues as myLeague}
      <tr>
        <td>
          <Navigate to={`/leagues/${myLeague.id}`}>{myLeague.name}</Navigate>
        </td>
        <td>{getNbrOfPlayers(myLeague)}</td>
        <td>{myLeague.admin.username}</td>
      </tr>
    {/each}
  </table>
  <h2>Other leagues</h2>
  <table>
    <tr>
      <th>Name</th>
      <th>Players</th>
      <th>Admin</th>
    </tr>
  {#each otherLeagues as otherLeague}
  <tr>
    <td>
      <Navigate to={`/leagues/${otherLeague.id}`}>{otherLeague.name}</Navigate>
    </td>
    <td>{getNbrOfPlayers(otherLeague)}</td>
    <td>{otherLeague.admin.username}</td>
    <td><div class="button"><JoinLeague league={otherLeague} /></div></td>
    <td><div class="button"><DeleteLeague league={otherLeague} /></div></td>
  </tr>
  {/each}
  </table>
  {#if createToggled}
    <CreateLeagues on:create-league-cancelled={toggleCreate} />
  {:else}<button on:click={toggleCreate}>Create League</button>{/if}
</div>
