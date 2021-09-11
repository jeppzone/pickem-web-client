<script>
  import { fetchLeague } from "../api";
  import { onMount } from "svelte";
  import { loggedInUser } from "../auth";
  import DisplayBets from "./DisplayBets.svelte";
  export let currentRoute;
  let league = {};
  let users = {};
  let leaderBoard = {};
  onMount(async () => {
    const leagueId = currentRoute.namedParams.id;
    league = await fetchLeague($loggedInUser, leagueId);
    users = league.users;
    for (const [userId, _] of Object.entries(league.users)) {
      let userLeaderboard = {};
      userLeaderboard = {};
      userLeaderboard.points = 0;
      userLeaderboard.nbrFinished = 0;
      userLeaderboard.nbrCorrect = 0;
      let userBets = league.bets[userId];
      if (userBets) {
        for (const bet of userBets) {
          userLeaderboard.points += bet.points;
          userLeaderboard.nbrFinished += bet.finished ? 1 : 0;
          userLeaderboard.nbrCorrect += bet.successful ? 1 : 0;
        }
      }
      leaderBoard[userId] = userLeaderboard;
    }
  });

  function isLoggedInUserInLeague() {
    return Object.keys(users).includes($loggedInUser.id);
  }
</script>

<div class="container">
  {#if users}
    <h1>{league.name}</h1>
    <h2>Standings</h2>
    <table>
      <tr>
        <th>#</th>
        <th>User</th>
        <th>Points</th>
        <th># Correct</th>
        <th>% Correct</th>
      </tr>
      {#each Object.entries(leaderBoard) as [k, v], index}
        <tr class={users[k].id === $loggedInUser?.id ? "my-row" : ""}>
          <td>{index + 1}</td>
          <td>{users[k].username}</td>
          <td>{v.points.toFixed(2)}</td>
          <td>{v.nbrCorrect}</td>
          <td>{((v.nbrCorrect / v.nbrFinished) * 100 || 0).toFixed(2)}</td>
        </tr>
      {/each}
    </table>
  {/if}
  {#if league.bets && isLoggedInUserInLeague()}
    <DisplayBets {league} />
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
