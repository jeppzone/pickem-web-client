<script>
	// @ts-nocheck

	import { fetchLeague } from '../../api';
	import { onMount } from 'svelte';
	import { loggedInUser } from '../../auth';
	let league = {};
	let users = {};
	let regularSeasonLeaderboard = [];
	let postSeasonLeaderboard = [];
	let loading = false;
	onMount(async () => {
		loading = true;
		try {
			const leagueId = '64eaeceb4a2ce9bea4c242e7';
			league = await fetchLeague($loggedInUser, leagueId);
			regularSeasonLeaderboard = league.leaderboards['Reg'].leaderBoardEntries;
			console.log(regularSeasonLeaderboard);
			postSeasonLeaderboard = league.leaderboards['Post'].leaderBoardEntries;
			users = league.users;
			loading = false;
		} catch (err) {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>Leaderboards | NFL Pickem | Jeppzone Sports</title>
	<meta name="description" content="Leaderboards" />
</svelte:head>

<section>
	<h1 class="md:text-7xl xs:text-5xl text-center tracking-tight font-bold pt-10">Leaderboards.</h1>
	{#if loading}
		<div
			role="status"
			class="flex justify-center align-middle h-full mt-10 loading loading-dots mx-auto"
		></div>
	{:else}
		<div class="grid grid-cols-1 pt-10">
			<h2 class="md:text-5xl xs:text-3xl text-center tracking-tight font-bold">Regular Season</h2>
			{#each regularSeasonLeaderboard as leaderBoardEntry, index}
				<div
					class={`grid grid-cols-12 py-3 md:gap-4 xs:gap-0 mt-5 rounded-l px-5 w-full ${$loggedInUser?.id === leaderBoardEntry.user.id ? 'bg-sky-900 ' : 'bg-slate-800'}`}
				>
					<span
						class="md:text-5xl xs:text-xl tracking-tight font-extrabold col-span-1 my-auto md:w-36"
						>{index + 1}</span
					>
					<span
						class="md:text-3xl xs:text-xl tracking-tight font-extrabold col-span-4 my-auto md:w-36"
						>{leaderBoardEntry.user.username}</span
					>
					<span
						class="md:text-3xl xs:text-xl tracking-tight font-extrabold col-span-4 my-auto md:w-36"
						>{leaderBoardEntry.numberOfCorrectBets}-{leaderBoardEntry.numberOfIncorrectBets}</span
					>
					<span
						class="md:text-3xl xs:text-xl tracking-tight font-extrabold col-span-2 my-auto md:w-36"
						>{leaderBoardEntry.points.toFixed(2)}</span
					>
					{#if index === 0}
						<span class="md:text-xl xs:text-l tracking-tight font-extrabold col-span-1 my-auto pl-5"
							>👑</span
						>
					{/if}
				</div>
			{/each}
		</div>
		<div class="grid grid-cols-1 pt-10">
			<h2 class="md:text-5xl xs:text-3xl text-center tracking-tight font-bold pt-5">Post Season</h2>
			{#each postSeasonLeaderboard as leaderBoardEntry, index}
				<div
					class={`grid grid-cols-12 py-3 md:gap-4 xs:gap-0 mt-5 rounded-l px-5 w-full ${$loggedInUser?.id === leaderBoardEntry.user.id ? 'bg-sky-900 ' : 'bg-slate-800'}`}
				>
					<span class="md:text-5xl xs:text-xl tracking-tight font-extrabold col-span-1 md:w-36"
						>{index + 1}</span
					>
					<span
						class="md:text-3xl xs:text-xl tracking-tight font-extrabold col-span-4 my-auto md:w-36"
						>{leaderBoardEntry.user.username}</span
					>
					<span
						class="md:text-3xl xs:text-xl tracking-tight font-extrabold col-span-4 my-auto md:w-36"
						>{leaderBoardEntry.numberOfCorrectBets}-{leaderBoardEntry.numberOfIncorrectBets}</span
					>
					<span
						class="md:text-3xl xs:text-xl tracking-tight font-extrabold col-span-2 my-auto md:w-36"
						>{leaderBoardEntry.points.toFixed(2)}</span
					>
					{#if index === 0}
						<span class="md:text-xl xs:text-l tracking-tight font-extrabold col-span-1 my-auto pl-5"
							>👑</span
						>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</section>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.loading-indicator {
		margin: auto;
		width: 50%;
	}
</style>
