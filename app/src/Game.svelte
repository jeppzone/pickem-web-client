<script>
  import Fa from "svelte-fa";
  import { faFootballBall } from "@fortawesome/free-solid-svg-icons";
  export let existingBets = [];
  export let choices = {};
  export let game = {};
  $: innerWidth = 0;

  function displayTeamName(width, team) {
    return width > 800 ? team.name : team.abbreviation;
  }

  function isBetSuccessful(bets, game) {
    var existingBet = bets.find((b) => b.game.id === game.id);
    return existingBet ? existingBet.successful : false;
  }

  function getGameCardClass(existingBets, game) {
    return game.isFinished && hasUserBetOnGame(game, existingBets)
      ? isBetSuccessful(existingBets, game)
        ? "game-card success"
        : "game-card failure"
      : "game-card";
  }
  function displayDate(game) {
    const date = game.startTime;
    if (game.isFinished) {
      return "FINAL";
    }
    return `${new Date(date).toLocaleDateString("sv-SE")} ${new Date(date).toLocaleTimeString("sv-SE")}`;
  }

  function displayScore(game, score) {
    if (game.isFinished || game.isOngoing) {
      return score;
    }

    return "";
  }

  function displayDownAndDistance(width, game) {
    if (width < 1000) {
      return "";
    }
    return game.ongoingGameProperties?.downAndDistance || "";
  }

  function hasUserBetOnGame(game, existingBets) {
    const existingBet = getBetByGame(game, existingBets);
    return existingBet ? true : false;
  }

  function isBetOnTeam(game, team, existingBets) {
    const bet = getBetByGame(game, existingBets);
    return bet?.winningTeam?.id === team.id;
  }

  function getBetByGame(game, existingBets) {
    return existingBets.find((b) => b.game.id === game.id);
  }
</script>

<svelte:window bind:innerWidth />

<div class={getGameCardClass(existingBets, game)}>
  <div class="start-time">
    <i><b>{displayDate(game)}</b></i>
  </div>
  <div class="team">
    <div class="team-name-and-logo">
      <span>
        <img src={game.awayTeam.logo} alt={game.awayTeam.name} />
      </span>
      <span class="team-name">
        <b>{displayTeamName(innerWidth, game.awayTeam)}</b>
      </span>
      {#if !game.isFinished && !game.isOngoing && game.awayTeam.record}
        <span class="record">
          ({game.awayTeam.record})
        </span>
      {/if}
    </div>
    {#if game.isFinished}
      <div class={game?.awayTeam?.id === game?.winner?.id ? "winner" : "loser"}>
        {game.awayTeamScore}
      </div>
    {:else}
      <div class="not-finished-score">
        <i>{displayScore(game, game.awayTeamScore)}</i>
      </div>
    {/if}
    {#if !hasUserBetOnGame(game, existingBets) && game.isBetable}
      <div class="odds">{game.awayTeamOdds || "N/A"}</div>
      <div class="input">
        <input type="radio" bind:group={choices[game.id]} value={game.awayTeam.id} />
      </div>
    {/if}
    <div class="user-bet">
      {#if isBetOnTeam(game, game.awayTeam, existingBets)}
        {game.awayTeam.abbreviation} <b>@</b>
        {getBetByGame(game, existingBets).game.awayTeamOdds}
      {/if}
    </div>
    {#if game.isOngoing && game.teamWithPossession?.id === game.awayTeam.id}
      <div style="color: white;" class="game-status">
        {#if innerWidth > 850}
          <Fa icon={faFootballBall} size="s" />
        {/if}
        <span> {displayDownAndDistance(innerWidth, game)} </span>
      </div>
    {/if}
  </div>
  <div class="team">
    <div class="team-name-and-logo">
      <span>
        <img src={game.homeTeam.logo} alt={game.homeTeam.name} />
      </span>
      <span class="team-name">
        <b>{displayTeamName(innerWidth, game.homeTeam)}</b>
      </span>
      {#if !game.isFinished && !game.isOngoing && game.homeTeam.record}
        <span class="record">
          ({game.homeTeam.record})
        </span>
      {/if}
    </div>
    {#if game.isFinished}
      <div class={game?.homeTeam?.id === game?.winner?.id ? "winner" : "loser"}>
        {game.homeTeamScore}
      </div>
    {:else}
      <div class="not-finished-score">
        <i>{displayScore(game, game.homeTeamScore)}</i>
      </div>
    {/if}
    {#if !hasUserBetOnGame(game, existingBets) && game.isBetable}
      <div class="odds">{game.homeTeamOdds || "N/A"}</div>
      <div class="input">
        <input type="radio" bind:group={choices[game.id]} value={game.homeTeam.id} />
      </div>
    {/if}
    <div class="user-bet">
      {#if isBetOnTeam(game, game.homeTeam, existingBets)}
        {game.homeTeam.abbreviation} <b>@</b>
        {getBetByGame(game, existingBets).game.homeTeamOdds}
      {/if}
    </div>
    {#if game.isOngoing && game.teamWithPossession?.id === game.homeTeam.id}
      <div style="color: white;" class="game-status">
        {#if innerWidth > 850}
          <Fa icon={faFootballBall} size="s" />
        {/if}
        <span> {displayDownAndDistance(innerWidth, game)} </span>
      </div>
    {/if}
  </div>
</div>

<style>
  .game-card {
    background-color: rgb(5, 47, 75);
    margin-bottom: 0.5em;
    padding: 8px;
    border-radius: 10px;
  }

  b {
    margin-bottom: 1vh;
    margin-top: 1vh;
  }

  .success {
    background-color: rgb(22, 98, 54);
  }

  .failure {
    background-color: rgb(88, 28, 35);
  }

  .game-card img {
    width: 30px;
  }

  .team {
    display: flex;
    align-items: center;
  }
  .team-name-and-logo b {
    padding: 0.3em;
  }
  .team-name-and-logo {
    display: flex;
    align-items: center;
  }
  .team-name {
    width: 210px;
  }
  .record {
    width: 120px;
  }
  .odds {
    width: 150px;
  }

  .input {
    margin-top: 18px;
    width: 100%;
  }

  .winner {
    font-weight: bold;
    width: 4em;
  }

  .loser {
    opacity: 0.8;
    width: 4em;
  }

  .not-finished-score {
    width: 4em;
  }

  .start-time {
    padding-bottom: 1vh;
    padding-left: 0.5vh;
  }

  .game-status {
    display: flex;
    flex-direction: row;
    justify-content: left;
    width: 200px;
    align-items: center;
  }
  .game-status span {
    padding-left: 5px;
  }
  .user-bet {
    width: 150px;
  }

  @media only screen and (max-width: 800px) {
    .team-name-and-logo {
      width: 100px;
    }
    .team-name {
      width: 100px;
    }
    .not-finished-score,
    .winner,
    .loser {
      width: 3em;
    }
  }
</style>
