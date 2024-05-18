<script>
	import { createEventDispatcher } from 'svelte';
	/**
	 * @type {any}
	 */
	export let startingSeason;
	/**
	 * @type {any}
	 */
	export let startingWeek;
	/**
	 * @type {any}
	 */
	export let startingSeasonType;

	let weeks = populateWeeks();
	let season = startingSeason;
	let week = weeks.find((w) => w.week === startingWeek && w.seasonType === startingSeasonType);

	const seasons = [2021, 2022, 2023];
	const dispatch = createEventDispatcher();
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
	function dispatchEvent() {
		dispatch('season-select', { season, week });
	}
</script>

<div class="grid grid-cols-2 pt-5">
	<div class="pr-5">
		<select
			bind:value={season}
			on:change={dispatchEvent}
			class="font-extrabold text-xl tracking-tight block appearance-none w-full bg-sky-900 border border-sky-600 text-white py-3 px-4 pr-8 rounded leading-tight focus:outline-none"
		>
			{#each seasons as s}
				<option class="font-extrabold text-xl tracking-tight" value={s}>{s}</option>
			{/each}
		</select>
	</div>
	<div>
		<select
			bind:value={week}
			on:change={dispatchEvent}
			class="font-extrabold text-xl tracking-tight block appearance-none w-full bg-sky-900 border border-sky-600 text-white py-3 px-4 pr-8 rounded leading-tight focus:outline-none"
		>
			{#each weeks as w}
				<option class="font-extrabold text-xl tracking-tight" value={w}>{w.displayName}</option>
			{/each}
		</select>
	</div>
</div>
