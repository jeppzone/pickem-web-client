<script>
  import { fetchLeague } from "../api";
  import { onMount } from "svelte";
  import { loggedInUser } from "../auth";
  import DisplayBets from "./DisplayBets.svelte";
  import LoadingIndicator from "../LoadingIndicator.svelte";
  export let currentRoute;
  let league = {};
  let users = {};
  let leaderBoard = [];
  let loading = false;
  onMount(async () => {
    loading = true;
    try {
      const leagueId = currentRoute.namedParams.id;
      league = await fetchLeague($loggedInUser, leagueId);
      leaderBoard = league.leaderBoard.leaderBoardEntries;
      users = league.users;
    } catch (err) {}
    loading = false;
  });

  function isLoggedInUserInLeague() {
    return Object.keys(users).includes($loggedInUser.id);
  }
</script>

<div class="container">
  {#if loading}
    <LoadingIndicator />
  {:else}
    {#if users && league}
      <h1>{league.name}</h1>
      <h2>Standings</h2>
      <table>
        <tr>
          <th>#</th>
          <th>User</th>
          <th>Record</th>
          <th>Points</th>
        </tr>
        {#each leaderBoard as leaderBoardEntry, index}
          <tr class={leaderBoardEntry.user.id === $loggedInUser?.id ? "my-row" : ""}>
            <td>{index + 1}</td>
            <td>{leaderBoardEntry.user.username}</td>
            <td>{leaderBoardEntry.numberOfCorrectBets}-{leaderBoardEntry.numberOfIncorrectBets}</td>
            <td>{leaderBoardEntry.points.toFixed(2)}</td>
          </tr>
        {/each}
      </table>
    {/if}
    {#if league.bets && isLoggedInUserInLeague()}
      <DisplayBets {league} />
    {/if}
  {/if}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  table {
    width: 60%;
  }

  table,
  th,
  td {
    border-radius: 5px;
  }
  th {
    padding: 1.5em;
    text-align: center;
  }
  td {
    padding: 1.5em;
    text-align: center;
  }
  .my-row td:nth-child(2) {
    border: 2px solid rgb(233, 147, 97);
  }
  tr:nth-child(odd) {
    background-color: rgb(12, 35, 49);
  }
  tr:nth-child(even) {
    background-color: rgb(12, 35, 49);
  }

  @media only screen and (max-width: 600px) {
    table {
      width: 100%;
    }
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
