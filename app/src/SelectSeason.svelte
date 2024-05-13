<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { fetchGames, fetchGamesForCurrentWeek } from './api';
	import { getCurrentSeason, getSeasons } from './util';
	const dispatch = createEventDispatcher();
	let games = [];
	let season = getCurrentSeason();
	const seasons = getSeasons();
	let weeks = populateWeeks();
	let week = {};
	let loading = false;
	onMount(async () => {
		loading = true;
		dispatch('season-select-started');
		games = await fetchGamesForCurrentWeek();
		games = sortGames(games);
		if (games && games.length > 0) {
			season = games[0].season;
			week = weeks.find((w) => w.week === games[0].week && w.seasonType === games[0].seasonType);
		}

		dispatch('season-select-finished', { games });
		loading = false;
	});

	function populateWeeks() {
		let weeksArray = [];
		for (let i = 1; i <= 4; i++) {
			weeksArray.push({ week: i, seasonType: 'Pre', displayName: `Preseason Week ${i}` });
		}
		for (let i = 1; i <= 18; i++) {
			weeksArray.push({ week: i, seasonType: 'Reg', displayName: `Week ${i}` });
		}
		weeksArray.push({ week: 1, seasonType: 'Post', displayName: 'Wild Card' });
		weeksArray.push({ week: 2, seasonType: 'Post', displayName: 'Divisional Round' });
		weeksArray.push({ week: 3, seasonType: 'Post', displayName: 'Conference Championships' });
		weeksArray.push({ week: 4, seasonType: 'Post', displayName: 'Pro Bowl' });
		weeksArray.push({ week: 5, seasonType: 'Post', displayName: 'Super Bowl' });

		return weeksArray;
	}

	async function dispatchEvent() {
		loading = true;
		dispatch('season-select-started');
		games = await fetchGames(season, week.seasonType, week.week);
		games = sortGames(games);
		dispatch('season-select-finished', { games });
		loading = false;
	}

	function sortGames(games) {
		return games.sort((a, b) => {
			if (a.startTime > b.startTime) return 1;
			if (a.startTime < b.startTime) return -1;
			if (a.startTime == b.startTime) return 0;
		});
	}
</script>

<div class="text-black grid grid-cols-2 gap-2">
	{#if !loading}
		<!-- svelte-ignore a11y-no-onchange -->
		<select bind:value={season} on:change={dispatchEvent} class="select select-bordered max-w-xs">
			{#each seasons as s}
				<option value={s}>{s}</option>
			{/each}
		</select>
		<!-- svelte-ignore a11y-no-onchange -->
		<select
			bind:value={week}
			on:change={dispatchEvent}
			class="select select-bordered max-w-xs m-auto"
		>
			{#each weeks as w}
				<option value={w}>{w.displayName}</option>
			{/each}
		</select>
	{/if}
</div>
