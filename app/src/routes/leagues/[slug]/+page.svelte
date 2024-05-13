<script>
	// @ts-nocheck

	import { fetchLeague } from '../../../api';
	import { onMount } from 'svelte';
	import { loggedInUser } from '../../../auth';
	import DisplayBets from '../../../Leagues/DisplayBets.svelte';
	import LoadingIndicator from '../../../LoadingIndicator.svelte';
	import DeleteLeague from '../../../Leagues/DeleteLeague.svelte';
	import JoinLeague from '../../../Leagues//JoinLeague.svelte';
	import Leaderboard from '../../../Leagues/Leaderboard.svelte';
	export let currentRoute;
	export let data;
	let league = {};
	let users = {};
	let regularSeasonLeaderboard = [];
	let postSeasonLeaderboard = [];
	let loading = false;
	onMount(async () => {
		loading = true;
		try {
			const leagueId = data.slug;
			league = await fetchLeague($loggedInUser, leagueId);
			regularSeasonLeaderboard = league.leaderboards['Reg'].leaderBoardEntries;
			postSeasonLeaderboard = league.leaderboards['Post'].leaderBoardEntries;
			users = league.users;
			loading = false;
		} catch (err) {
			loading = false;
		}
	});

	function isLoggedInUserInLeague() {
		return Object.keys(users).includes($loggedInUser.id);
	}

	function isLoggedInUserAdmin() {
		return $loggedInUser?.id === league?.admin?.id;
	}

	async function handleJoinLeagueSuccess() {
		loading = true;
		try {
			const leagueId = currentRoute.namedParams.id;
			league = await fetchLeague($loggedInUser, leagueId);
			regularSeasonLeaderboard = league.leaderboards['Reg'].leaderBoardEntries;
			postSeasonLeaderboard = league.leaderboards['Post'].leaderBoardEntries;
			users = league.users;
			loading = false;
		} catch (err) {
			loading = false;
		}
	}
</script>

<div class="container">
	{#if loading}
		<div class="loading-indicator">
			<LoadingIndicator />
		</div>
	{:else}
		{#if users && league}
			<h1>{league.name}</h1>
			{#if !isLoggedInUserInLeague()}
				<JoinLeague {league} on:join-league-succeeded={handleJoinLeagueSuccess} />
			{/if}
			<Leaderboard
				leaderboard={regularSeasonLeaderboard}
				leaderboardHeader={'Regular season standings'}
			/>
			<Leaderboard
				leaderboard={postSeasonLeaderboard}
				leaderboardHeader={'Post season standings'}
			/>
		{/if}
		{#if league.bets && isLoggedInUserInLeague()}
			<DisplayBets {league} />
		{/if}
		{#if isLoggedInUserAdmin()}
			<DeleteLeague {league} />
		{/if}
	{/if}
</div>

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
