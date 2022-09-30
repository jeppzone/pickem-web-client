<script>
  import { Navigate } from "svelte-router-spa";
  import { loggedInUser } from "../auth";
  export let leagues = [];

  function isLoggedInUserInLeague(league) {
    return Object.keys(league.users).some((k) => k === $loggedInUser?.id);
  }
</script>

<table>
  {#each leagues as league}
    <tr class={isLoggedInUserInLeague(league) ? "user-in-league" : ""}>
      <td>
        <Navigate to={`/leagues/${league.id}`}>
          {league.name}
        </Navigate>
      </td>
    </tr>
  {/each}
</table>

<style>
  table {
    min-width: 300px;
    max-width: 300px;
  }
  .user-in-league td:nth-child(1) {
    border: 1px solid rgb(233, 147, 97);
  }
  table,
  td {
    border-radius: 5px;
    word-wrap: break-word;
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
  tr td:nth-child(2) {
    background-color: rgb(231, 117, 52);
  }
  @media only screen and (max-width: 1000px) {
    table {
      width: 95%;
    }
  }
  @media only screen and (min-width: 1500px) {
    table {
      width: 30%;
    }
  }
</style>
