<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import { loggedInUser } from './auth';
	import SelectSeason from './SelectSeason.svelte';

	export let league;

	let loading = false;
	let allUsers = [];
	let selectedUser = {};
	let games = [];

	onMount(async () => {
		allUsers = Object.values(league.users ?? []).filter((u) => u.id !== $loggedInUser?.id);
		selectedUser = allUsers[0];
	});

	function handleSeasonSelectFinished(evt) {
		games = evt.detail.games;
		loading = false;
	}

	function handleSeasonSelectStarted() {
		loading = true;
	}

	function getBetByUser(gameId, userId, league) {
		const userBets = league.bets[userId];
		if (!userBets) {
			return {};
		}
		return userBets?.find((b) => b.game.id === gameId);
	}

	function getCellClass(gameId, userId, league) {
		const bet = getBetByUser(gameId, userId, league);
		if (!bet?.finished) {
			return '';
		}
		return bet.successful ? 'bg-teal-800 p-4' : 'bg-rose-900 p-4';
	}

	function pointsForUser(userBets, week, seasonType) {
		return userBets
			.filter((b) => b.game.week === week && b.game.seasonType === seasonType)
			.reduce((x, y) => x + y.points, 0);
	}

	function nbrOfSuccessfulBets(bets, week, seasonType) {
		return bets.filter(
			(b) => b.game.week === week && b.game.seasonType === seasonType && b.successful
		).length;
	}

	function nbrOfFinishedBets(bets, week, seasonType) {
		return bets.filter(
			(b) => b.game.week === week && b.game.seasonType === seasonType && b.finished
		).length;
	}

	function getPointsText(existingBets) {
		if (!existingBets) {
			return '';
		}
		const week = games[0].week;
		const seasonType = games[0].seasonType;
		return `${pointsForUser(existingBets, week, seasonType).toFixed(2)}`;
	}

	function getRecord(existingBets) {
		if (!existingBets) {
			return '';
		}
		const week = games[0].week;
		const seasonType = games[0].seasonType;
		return `(${nbrOfSuccessfulBets(existingBets, week, seasonType)}-${
			nbrOfFinishedBets(existingBets, week, seasonType) -
			nbrOfSuccessfulBets(existingBets, week, seasonType)
		})`;
	}
</script>

<div class="flex flex-col max-w-full items-center">
	<SelectSeason
		on:season-select-started={handleSeasonSelectStarted}
		on:season-select-finished={handleSeasonSelectFinished}
	/>
	{#if loading}
		<div
			role="status"
			class="flex justify-center align-middle h-full mt-10 loading loading-dots mx-auto"
		></div>
	{:else if games.length > 0}
		<label class="label mt-5" for="compareto">
			<span class="label-text text-white">Compare to</span>
		</label>
		<select
			id="compareto"
			bind:value={selectedUser}
			class="select select-bordered max-w-xs w-1/2 font-extrabold"
		>
			{#each allUsers as user}
				<option class="font-extrabold" value={user}>{user.username}</option>
			{/each}
		</select>
		<table class="mt-10 rounded-xl bg-sky-950">
			<tr>
				<th class="game-heading min-w-40 max-w-40 p-4">Game</th>
				<th class="min-w-40 max-w-40 p-4">{$loggedInUser?.username}</th>
				<th class="min-w-40 max-w-40 p-4">{selectedUser.username}</th>
			</tr>
			<tr>
				<td class="p-4 text-center">Points</td>
				<td class="p-4 text-center"
					>{getPointsText(league.bets[$loggedInUser?.id])}<br />{getRecord(
						league.bets[$loggedInUser?.id]
					)}</td
				>
				<td class="p-4 text-center"
					>{getPointsText(league.bets[selectedUser.id])}<br />{getRecord(
						league.bets[selectedUser.id]
					)}</td
				>
			</tr>
			{#each games as game}
				<tr>
					<td class="p-4 text-center">
						{game.awayTeam.abbreviation}
						<b>@</b>
						{game.homeTeam.abbreviation}
					</td>
					<td class={getCellClass(game.id, $loggedInUser?.id, league)}>
						<img
							src={getBetByUser(game.id, $loggedInUser?.id, league)?.winningTeam?.logo ??
								'/logo.png'}
							alt={getBetByUser(game.id, $loggedInUser?.id, league)?.winningTeam?.name ?? 'No bet'}
							class="mx-auto"
							width="50"
						/>
					</td>
					<td class={getCellClass(game.id, selectedUser.id, league)}>
						<img
							src={getBetByUser(game.id, selectedUser.id, league)?.winningTeam?.logo ?? '/logo.png'}
							alt={getBetByUser(game.id, selectedUser.id, league)?.winningTeam?.name ?? 'No bet'}
							class="mx-auto"
							width="50"
						/>
					</td>
				</tr>
			{/each}
		</table>
	{:else}
		<h3>No games yet</h3>
	{/if}
</div>
