<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { fetchGames, fetchGamesForCurrentWeek } from "./api";
  const dispatch = createEventDispatcher();
  let season = 2020;
  let seasonType = "Pre";
  let week = 1;
  let games = [];
  const seasons = [2020];
  let weeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
  const seasonTypes = ["Pre", "Reg", "Post"];

  onMount(async () => {
    dispatch("season-select-started");
    games = await fetchGamesForCurrentWeek();
    games = sortGames(games);
    if (games && games.length > 0) {
      season = games[0].season;
      seasonType = games[0].seasonType;
      week = games[0].week;
    }
    setWeeks();
    
    dispatch("season-select-finished", {
      games, season, seasonType, week
    });
  });

  async function dispatchEvent() {
    dispatch("season-select-started");
    setWeeks();
    games = await fetchGames(season, seasonType, week);
    games = sortGames(games);
    dispatch("season-select-finished", {
      games, season, seasonType, week
    });
  }

  function setWeeks() {
    if(seasonType === 'Pre'){
      weeks = [1,2,3,4,5];
    }else if(seasonType === 'Reg'){
      weeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
    }else if(seasonType === 'Post'){
      weeks = [1,2,3,4];
    }
  }

  function sortGames(games) {
    return games.sort((a, b) => {
      if (a.startTime > b.startTime) return 1;
      if (a.startTime < b.startTime) return -1;
      if (a.startTime == b.startTime) return 0;
    });
  }
</script>

<main>
  <!-- svelte-ignore a11y-no-onchange -->
  <select bind:value={season} on:change={dispatchEvent}>
    {#each seasons as s}
      <option value={s}>{s}</option>
    {/each}
  </select>
  <!-- svelte-ignore a11y-no-onchange -->
  <select bind:value={seasonType} on:change={dispatchEvent}>
    {#each seasonTypes as s}
      <option value={s}>{s.toUpperCase()}</option>
    {/each}
  </select>
  <!-- svelte-ignore a11y-no-onchange -->
  <select bind:value={week} on:change={dispatchEvent}>
    {#each weeks as w}
      <option value={w}>{w}</option>
    {/each}
  </select>
</main>
