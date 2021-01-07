<script>
  import { fetchLeague } from "./api";
  import { onMount } from "svelte";
  import { loggedInUser } from "./auth";
  export let currentRoute;
  let league = {};;
  let users = {};
  let leaderBoard = {};
  onMount(async () => {
    const leagueId = currentRoute.namedParams.id;
    league = await fetchLeague($loggedInUser, leagueId);
    console.log(league);
    users = league.users;
    for(const [userId, _] of Object.entries(league.users)){
      let userLeaderboard = {}
      userLeaderboard = {}
      userLeaderboard.points = 0;
      userLeaderboard.nbrFinished = 0;
      userLeaderboard.nbrCorrect = 0;
      var userBets = league.bets[userId]
      if(userBets){
        for(const bet of userBets){
          userLeaderboard.points += bet.points;
          userLeaderboard.nbrFinished += bet.finished ? 1 : 0
          userLeaderboard.nbrCorrect += bet.successful ? 1 : 0
        }
      }
      leaderBoard[userId] = userLeaderboard;
    }
  });
</script>

{#if users}
  <h2>This is {league.name}</h2>
  {#each Object.entries(leaderBoard) as [k, v]}
  <li>{users[k].username} - {v.points} points - {v.nbrCorrect} correct bets out of {v.nbrFinished} finished </li>
  {/each}
{/if}
