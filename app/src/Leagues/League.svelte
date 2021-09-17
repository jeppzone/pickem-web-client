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
      users = league.users;
      for (const [userId, user] of Object.entries(league.users)) {
        let userLeaderboard = {};
        userLeaderboard = {};
        userLeaderboard.userId = userId;
        userLeaderboard.username = user.username;
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
        leaderBoard.push(userLeaderboard);
        loading = false;
      }
      leaderBoard = leaderBoard.sort((a, b) => {
        if (a.points >= b.points) {
          return -1;
        } else if (a.points < b.points) {
          return 1;
        }
      });
    } catch (err) {
      loading = false;
    }
  });

  function isLoggedInUserInLeague() {
    return Object.keys(users).includes($loggedInUser.id);
  }
</script>

<div class="container">
  {#if loading}
    <LoadingIndicator />
  {:else}
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
        {#each leaderBoard as user, index}
          <tr class={user.userId === $loggedInUser?.id ? "my-row" : ""}>
            <td>{index + 1}</td>
            <td>{user.username}</td>
            <td>{user.points.toFixed(2)}</td>
            <td>{user.nbrCorrect}</td>
            <td>{((user.nbrCorrect / user.nbrFinished) * 100 || 0).toFixed(2)}</td>
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
