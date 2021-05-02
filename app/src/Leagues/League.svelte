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

<div class="container">
  {#if users}
    <h2>{league.name}</h2>
    <h3>League ends {new Date(league.endsAt).toLocaleDateString("sv-SE")}</h3>
    <table>
      <tr>
        <th>Position</th>
        <th>Username</th>
        <th>Points</th>
        <th>Correct bets</th>
        <th>% correct</th>
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
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 100%;
  }

  table {
    width: 60%;
  }

  .my-row td {
    /* border: 2px solid rgb(233, 147, 97); */
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
</style>
