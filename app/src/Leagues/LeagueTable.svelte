<script>
  import { Navigate } from "svelte-router-spa";
  import { loggedInUser } from "../auth";
  import JoinLeague from "./JoinLeague.svelte";
  import DeleteLeague from "./DeleteLeague.svelte";
  export let leagues = [];

  function getNbrOfPlayers(league) {
    return Object.keys(league.users).length;
  }

  function isLoggedInUserInLeague(league) {
    return Object.keys(league.users).some((k) => k === $loggedInUser?.id);
  }
</script>

<table>
  <tr>
    <th>Name</th>
    <th>Players</th>
    <th>Admin</th>
    <th>Season</th>
    <th>League ends</th>
  </tr>
  {#each leagues as league}
    <tr class={isLoggedInUserInLeague(league) ? "user-in-league" : ""}>
      <td>
        <Navigate to={`/leagues/${league.id}`}>
          {league.name}
        </Navigate>
      </td>
      <td>{getNbrOfPlayers(league)}</td>
      <td>{league.admin.username}</td>
      <td>{league.season}</td>
      <td>{new Date(league.endsAt).toLocaleDateString("sv-SE")}</td>
      {#if !isLoggedInUserInLeague(league)}
        <td>
          <div class="button">
            <JoinLeague {league} on:join-league-succeeded />
          </div>
        </td>
      {/if}
      {#if $loggedInUser?.id === league.admin.id}
        <td>
          <div class="button">
            <DeleteLeague {league} on:delete-league-succeeded />
          </div>
        </td>
      {/if}
    </tr>
  {/each}
</table>

<style>
  table {
    width: 100%;
  }
  .user-in-league td:nth-child(1) {
    border: 1px solid rgb(233, 147, 97);
  }
  table,
  th,
  td {
    border-radius: 5px;
    word-wrap: break-word;
  }
  th {
    padding: 1.5em;
    text-align: center;
  }
  td {
    padding: 1.5em;
    text-align: center;
  }
  tr:nth-child(odd) {
    background-color: rgb(12, 35, 49);
  }
  tr:nth-child(even) {
    background-color: rgb(12, 35, 49);
  }
  tr td:nth-child(6) {
    background-color: rgb(231, 117, 52);
  }
  @media only screen and (max-width: 600px) {
    th {
      padding: 1vw;
      text-align: center;
    }
    td {
      padding: 1vw;
      text-align: center;
    }
  }
</style>
