<script>
  import { fetchLeague } from "../api";
  import { onMount } from "svelte";
  import { loggedInUser } from "../auth";
  export let currentRoute;
  let league = {};
  let users = {};
  let leaderBoard = {};
  onMount(async () => {
    const leagueId = currentRoute.namedParams.id;
    league = await fetchLeague($loggedInUser, leagueId);
    console.log(league);
    users = league.users;
    for (const [userId, _] of Object.entries(league.users)) {
      let userLeaderboard = {};
      userLeaderboard = {};
      userLeaderboard.points = 0;
      userLeaderboard.nbrFinished = 0;
      userLeaderboard.nbrCorrect = 0;
      var userBets = league.bets[userId];
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
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  th{
    padding-right: 2em;
    padding-left: 0.5em;
  }
  td {
    padding-top: 0.5em;
    padding-bottom: 0.5em;
    padding-left: 0.5em;
    margin: auto;
  }
  tr:nth-child(2n+2) {
    background-color: #f0f3f3;
  }
</style>

<div class="container">
{#if users}
    <h2>{league.name}</h2>
    <table>
      <tr>
        <th>Username</th>
        <th>Points</th>
        <th>Correct bets</th>
        <th>% correct</th>
      </tr>
      {#each Object.entries(leaderBoard) as [k, v]}
        <tr>
          <td>{users[k].username}</td>
          <td>{v.points.toFixed(2)}</td>
          <td>{v.nbrCorrect}</td>
          <td>{(((v.nbrCorrect / v.nbrFinished) * 100) || 0).toFixed(2)}</td>
        </tr>
      {/each}
    </table>
{/if}
</div>
