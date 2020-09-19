<script>
  import { Navigate } from "svelte-router-spa";
  import { onMount } from "svelte";
  import { loggedInUser } from "./auth.js";
  import { fetchGames, fetchBets, makeBets } from "./api";

  let games = [];
  let existingBets = [];
  let choices = {};
  let week = 2;
  const weeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

  onMount(async () => {
    await fetchGamesForWeek();
  });

  async function submitBets() {
    const madeChoices = {};
    for (const key of Object.keys(choices)) {
      if (choices[key] !== -1 && !games.find(g => g.id === key).isFinished) {
        madeChoices[key] = choices[key];
      }
    }
    await makeBets(madeChoices, $loggedInUser, null);
  }

  async function fetchGamesForWeek() {
    games = await fetchGames(week); //TODO: Parallel
    existingBets = await fetchBets(week, $loggedInUser);
    games.forEach(g => {
      var matchingBet = existingBets.find(b => b.game.id === g.id);
      choices[g.id] = matchingBet ? matchingBet.winningTeam.id : -1;
    });
  }

  function nbrOfSuccessfulBets(bets) {
    return bets.filter(b => b.successful).length;
  }

  function points(bets) {
    return bets.reduce((x, y) => x + y.points, 0);
  }

  function inProgress(bets) {
    return bets.filter(b => !b.finished).length;
  }

  function pointsForGame(bets, game) {
    var existingBet = bets.find(b => b.game.id === game.id);
    return existingBet ? existingBet.points : -1;
  }
</script>

<h1>Games for week {week}</h1>
<select bind:value={week} on:change={fetchGamesForWeek}>
  {#each weeks as w}
    <option value={w}>{w}</option>
  {/each}
</select>
<h4>
  {nbrOfSuccessfulBets(existingBets)} of {existingBets.length} for {points(existingBets)}
  points
</h4>
<h4>{inProgress(existingBets)} bets in progress</h4>
<ul>
  {#each games as game}
    <li style="display:block;padding: 15px;">
      <img src={game.awayTeam.logo} alt={game.awayTeam.name} width="50px" />
      ({game.awayTeamOdds}) @
      <img src={game.homeTeam.logo} alt={game.homeTeam.name} width="50px" />
      ({game.homeTeamOdds})
      {#if !game.isFinished}
        <label style="display:inline">
          <input
            type="radio"
            bind:group={choices[game.id]}
            value={game.awayTeam.id}
            disabled={game.isFinished} />
          {game.awayTeam.abbreviation}
        </label>
        <label label style="display:inline">
          <input
            type="radio"
            bind:group={choices[game.id]}
            value={game.homeTeam.id}
            disabled={game.isFinished} />
          {game.homeTeam.abbreviation}
        </label>
      {:else}
        <b>
          FINISHED: {game.awayTeamScore} - {game.homeTeamScore} {pointsForGame(existingBets, game)}
          points scored
        </b>
      {/if}
    </li>
  {/each}
</ul>
<button type="submit" on:click|preventDefault={submitBets}>Place bets</button>
