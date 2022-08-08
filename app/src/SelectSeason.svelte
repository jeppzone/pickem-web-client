<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { fetchGames, fetchGamesForCurrentWeek } from "./api";
  const dispatch = createEventDispatcher();
  let season = 2022;
  let games = [];
  const seasons = [2021, 2022];
  let weeks = populateWeeks();
  let week = {};
  onMount(async () => {
    dispatch("season-select-started");
    games = await fetchGamesForCurrentWeek();
    games = sortGames(games);
    if (games && games.length > 0) {
      season = games[0].season;
      week = weeks.find((w) => w.week === games[0].week && w.seasonType === games[0].seasonType);
    }

    dispatch("season-select-finished", { games });
  });

  function populateWeeks() {
    let weeksArray = [];
    for (let i = 1; i <= 5; i++) {
      weeksArray.push({ week: i, seasonType: "Pre", displayName: `Preseason Week ${i}` });
    }
    for (let i = 1; i <= 18; i++) {
      weeksArray.push({ week: i, seasonType: "Reg", displayName: `Week ${i}` });
    }
    weeksArray.push({ week: 1, seasonType: "Post", displayName: "Wild Card" });
    weeksArray.push({ week: 2, seasonType: "Post", displayName: "Divisional Round" });
    weeksArray.push({ week: 3, seasonType: "Post", displayName: "Conference Championships" });
    weeksArray.push({ week: 4, seasonType: "Post", displayName: "Pro Bowl" });
    weeksArray.push({ week: 5, seasonType: "Post", displayName: "Super Bowl" });

    return weeksArray;
  }

  async function dispatchEvent() {
    dispatch("season-select-started");
    games = await fetchGames(season, week.seasonType, week.week);
    games = sortGames(games);
    dispatch("season-select-finished", { games });
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
  <select bind:value={week} on:change={dispatchEvent}>
    {#each weeks as w}
      <option value={w}>{w.displayName}</option>
    {/each}
  </select>
</main>
