<script>
	// @ts-nocheck

	import { fetchLeague } from '../../api';
	import { onMount } from 'svelte';
	import { loggedInUser } from '../../auth';
	import { isLoggedIn } from '$lib/shared/utils';
	import DisplayBets from '../../DisplayBets.svelte';
	import { goto } from '$app/navigation';
	let league = {};
	let loading = false;
	onMount(async () => {
		if (!isLoggedIn($loggedInUser)) {
			goto('/login');
		}
		loading = true;
		try {
			const leagueId = '66d6f285572a73adfb63b80f';
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
	<h1 class="md:text-7xl xs:text-5xl text-center tracking-tight font-bold pt-10">Compare Picks</h1>
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
