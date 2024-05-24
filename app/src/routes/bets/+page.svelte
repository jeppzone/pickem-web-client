<script>
	// @ts-nocheck
	import { toast } from '@zerodevx/svelte-toast';
	import { loggedInUser } from '../../auth.js';
	import { fetchBets, makeBets } from '../../api';
	import { groupByArray } from '../../util';
	import SelectSeason from '../../SelectSeason.svelte';
	import FinishedGame from './components/FinishedGame/FinishedGame.svelte';
	import UpcomingGame from './components/UpcomingGame/UpcomingGame.svelte';
	import GameToPick from './components/GameToPick/GameToPick.svelte';
	import OngoingGame from './components/OngoingGame/OngoingGame.svelte';
	$: innerWidth = 0;
	$: loading = false;
	$: games = [];
	$: existingBets = [];
	$: choices = {};
	$: nbrOfCorrect = existingBets.filter((p) => p.successful).length;
	$: nbrOfIncorrect = existingBets.filter((p) => !p.successful).length;
	$: totalPoints = existingBets.reduce((x, y) => x + y.points, 0).toFixed(2);
	$: finishedGames = games.filter((g) => g.isFinished);
	$: ongoingGames = games.filter((g) => g.isOngoing);
	$: upcomingGames = games.filter((g) => !g.isFinished && !g.isOngoing);
	$: gamesToPick = upcomingGames.filter((g) => g.isBetable && !hasUserPickedGame(g));

	let error = '';

	async function handleSeasonSelectFinished(evt) {
		games = evt.detail.games;
		groupGamesByDate(games);
		await setUpBets(games);
		loading = false;
	}

	function handleSeasonSelectStarted() {
		loading = true;
	}

	async function submitBets() {
		console.log('Submit bets');
		const madeChoices = {};
		for (const key of Object.keys(choices)) {
			if (choices[key] !== -1) {
				madeChoices[key] = choices[key];
			}
		}
		loading = true;
		try {
			await makeBets(madeChoices, $loggedInUser);
			await setUpBets(games);
			toast.push('Bets made');
			loading = false;
		} catch (err) {
			loading = false;
			pushErrorToast('Something went wrong while placing bets');
		}
	}

	async function setUpBets(games) {
		try {
			if (games && games.length > 0) {
				choices = {};
				existingBets = await fetchBets(
					games[0].season,
					games[0].seasonType,
					games[0].week,
					$loggedInUser
				);
				console.log(existingBets);
			}
		} catch (err) {
			toast.push('Could not fetch bets');
		}
	}

	function groupGamesByDate(games) {
		const gamesToShow = getGamesToShow(games);
		const result = groupByArray(gamesToShow, (g) => {
			return new Date(g.startTime).toDateString();
		});
		return result;
	}

	function pushErrorToast(message) {
		error = message;
		setTimeout(() => {
			error = '';
		}, 3000);
	}

	function getGamesToShow(games) {
		const gamesToShow = games.filter((g) => g.isFinished || g.isOngoing || g.isBetable);
		if (gamesToShow.some((g) => g.isBetable)) {
			return gamesToShow;
		}

		return games;
	}
	/**
	 * @param {{ gameId: string | number; winningTeamId: any; }} pick
	 */
	async function handleUserPick(pick) {
		choices[pick.gameId] = pick.winningTeamId;
	}
</script>

<svelte:head>
	<title>Picks | NFL Pickem | Jeppzone Sports</title>
	<meta name="description" content="Picks" />
</svelte:head>

<svelte:window bind:innerWidth />

<section class="">
	<h1 class="text-7xl text-center py-5 font-extrabold">Make bets</h1>
	<SelectSeason
		on:season-select-started={handleSeasonSelectStarted}
		on:season-select-finished={handleSeasonSelectFinished}
	/>
	{#if loading}
		<div
			role="status"
			class="flex justify-center align-middle h-full mt-10 loading loading-dots mx-auto"
		></div>
	{:else}
		<h2 class="md:text-5xl xs:text-3xl text-center tracking-tight font-bold pt-10">
			💰 {totalPoints}
			🏈 {nbrOfCorrect}-{nbrOfIncorrect}
		</h2>
		<div class="grid grid-col-1 pb-5"></div>
		{#if gamesToPick.length > 0}
			<form>
				<h2 class="md:text-5xl xs:text-3xl text-center tracking-tight font-bold pt-10">
					Games to pick.
				</h2>
				{#each gamesToPick as gameToPick}
					<GameToPick game={gameToPick} handlePick={handleUserPick} />
				{/each}
				<div class="mx-auto grid grid-cols-1 w-1/3 mt-5">
					<button type="submit" on:click={submitBets} class="btn btn-secondary">Make picks</button>
				</div>
			</form>
		{/if}
		{#if ongoingGames.length > 0}
			<div>
				<h2 class="md:text-5xl xs:text-3xl text-center tracking-tight font-bold pt-10">
					Ongoing games.
				</h2>
				{#each ongoingGames as ongoingGame}
					<OngoingGame game={ongoingGame} picks={existingBets} />
				{/each}
			</div>
		{/if}
		{#if upcomingGames.length > 0}
			<div>
				<h2 class="md:text-5xl xs:text-3xl text-center tracking-tight font-bold pt-10">
					Upcoming games.
				</h2>
				{#each upcomingGames as upcomingGame}
					<UpcomingGame game={upcomingGame} picks={existingBets} />
				{/each}
			</div>
		{/if}
		{#if finishedGames.length > 0}
			<div>
				<h2 class="md:text-5xl xs:text-3xl text-center tracking-tight font-bold pt-10">
					Finished games.
				</h2>
				{#each finishedGames as finishedGame}
					<FinishedGame game={finishedGame} picks={existingBets} />
				{/each}
			</div>
		{/if}
		{#if error}
			<div class="toast toast-bottom toast-end">
				<div class="alert bg-error border-none">
					<span>{error}</span>
				</div>
			</div>
		{/if}
	{/if}
</section>
