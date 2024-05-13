<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import CreateLeagues from '../../Leagues/CreateLeagues.svelte';
	import { loggedInUser } from '../../auth';
	import { fetchLeagues } from '../../api';
	import { getCurrentSeason, getSeasons } from '../../util';
	import LeagueTable from '../../Leagues/LeagueTable.svelte';
	import LoadingIndicator from '../../LoadingIndicator.svelte';

	let leagues = [];
	let leaguesForSeason = [];
	let createToggled = false;
	let loading = false;
	let season = getCurrentSeason();
	let seasons = getSeasons();

	function toggleCreate() {
		createToggled = !createToggled;
	}

	function handleLeagueCreated(evt) {
		leagues = [...leagues, evt.detail.createdLeague];
		filterLeagues();
	}

	function filterLeagues() {
		leaguesForSeason = leagues.filter((l) => l.season === season);
	}

	onMount(async () => {
		try {
			loading = true;
			leagues = await fetchLeagues($loggedInUser);
			leaguesForSeason = leagues.filter((l) => l.season === season);
			loading = false;
		} catch (err) {
			loading = false;
		}
	});
</script>

<section class="mx-auto">
	<h1 class="text-7xl font-extrabold text-white">Leagues</h1>
	<div class="select-season">
		<select bind:value={season} on:change={filterLeagues} class="text-black w-full">
			{#each seasons as s}
				<option value={s}>{s}</option>
			{/each}
		</select>
	</div>
	{#if loading}
		<LoadingIndicator />
	{:else}
		{#if leaguesForSeason && leaguesForSeason.length > 0}
			<div class="leagues">
				<LeagueTable leagues={leaguesForSeason} />
			</div>
		{/if}
		{#if createToggled}
			<CreateLeagues
				on:create-league-cancelled={toggleCreate}
				on:create-league-succeeded={handleLeagueCreated}
			/>
		{:else}<button on:click={toggleCreate}>Create League</button>{/if}
	{/if}
</section>

<style>
	h1,
	.select-season,
	.leagues {
		padding-bottom: 15px;
	}

	button {
		background-color: rgb(231, 117, 52);
		color: white;
		cursor: pointer;
		margin-top: 1em;
		width: 300px;
	}
</style>
