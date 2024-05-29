<script>
	// @ts-nocheck

	import { fetchLeague } from '../../api';
	import { onMount } from 'svelte';
	import { loggedInUser } from '../../auth';
	import DisplayBets from '../../DisplayBets.svelte';
	let league = {};
	let loading = false;
	onMount(async () => {
		loading = true;
		try {
			const leagueId = '64eaeceb4a2ce9bea4c242e7';
			league = await fetchLeague($loggedInUser, leagueId);
			users = league.users;
			loading = false;
		} catch (err) {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>Compare Picks | NFL Pickem | Jeppzone Sports</title>
	<meta name="description" content="Leaderboards" />
</svelte:head>

<section>
	<h1 class="md:text-7xl xs:text-5xl text-center tracking-tight font-bold pt-10">Compare Picks.</h1>
	{#if loading}
		<div
			role="status"
			class="flex justify-center align-middle h-full mt-10 loading loading-dots mx-auto"
		></div>
	{:else}
		<div class="grid grid-cols-1 pt-10">
			<DisplayBets {league} />
		</div>
	{/if}
</section>
