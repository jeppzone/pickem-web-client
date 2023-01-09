<script>
  import { loggedInUser } from "../auth";
  export let leaderboard = [];
  export let leaderboardHeader = "";
</script>

<h2>{leaderboardHeader}</h2>
<table>
  <tr>
    <th>#</th>
    <th>User</th>
    <th>Record</th>
    <th>Points</th>
  </tr>
  {#each leaderboard as leaderBoardEntry, index}
    <tr class={leaderBoardEntry.user.id === $loggedInUser?.id ? "my-row" : ""}>
      <td>{index + 1}</td>
      <td>{leaderBoardEntry.user.username}</td>
      <td>{leaderBoardEntry.numberOfCorrectBets}-{leaderBoardEntry.numberOfIncorrectBets}</td>
      <td>{leaderBoardEntry.points.toFixed(2)}</td>
    </tr>
  {/each}
</table>

<style>
  table {
    max-width: 90%;
  }
  table,
  th,
  td {
    border-radius: 5px;
  }
  th {
    min-width: 100px;
    max-width: 100px;
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
      width: 90%;
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
  @media only screen and (max-width: 800px) {
    th {
      min-width: 40px;
      max-width: 40px;
    }
  }
</style>
