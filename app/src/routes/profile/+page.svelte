<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import { getProfile } from '../../api';
	import { loggedInUser } from '../../auth';
	import { goto } from '$app/navigation';
	import { isLoggedIn } from '$lib/shared/utils';

	let profile = {};
	let loading = false;
	$: innerWidth = 0;
	onMount(async () => {
		if (!isLoggedIn($loggedInUser)) {
			goto('/login');
		}
		loading = true;
		try {
			profile = await getProfile($loggedInUser);
			loading = false;
		} catch (err) {
			loading = false;
		}
	});

	function displayTeamName(width, team) {
		return width > 800 ? team.name : team.abbreviation;
	}
	function displayWinPercentage(teamBetRecord) {
		const decimal =
			teamBetRecord.nbrOfCorrectBets /
			(teamBetRecord.nbrOfIncorrectBets + teamBetRecord.nbrOfCorrectBets);
		const withTwoDecimalPoints = decimal.toFixed(2);
		const asPercentage = (withTwoDecimalPoints * 100).toFixed(0);
		return asPercentage;
	}
</script>

<svelte:head>
	<title>Profile | NFL Pickem | Jeppzone Sports</title>
	<meta name="description" content="Profile" />
</svelte:head>

<svelte:window bind:innerWidth />

<section>
	<h1 class="md:text-7xl xs:text-5xl text-center tracking-tight font-bold pt-10">Profile</h1>
	{#if loading}
		<div
			role="status"
			class="flex justify-center align-middle h-full mt-10 loading loading-dots mx-auto"
		></div>
	{:else}
		<h2 class="md:text-5xl xs:text-3xl text-center tracking-tight font-bold pt-10">
			All time record
		</h2>
		<h3 class="md:text-7xl xs:text-3xl text-center tracking-tight font-bold pt-10">
			{profile?.statistics?.nbrOfCorrectBets} - {profile.statistics?.nbrOfIncorrectBets}
		</h3>

		<h2 class="md:text-5xl xs:text-3xl text-center tracking-tight font-bold pt-10">
			Which team's games are you best at picking?
		</h2>
		<div class="grid grid-cols-1 md:w-2/3 sm:w-full pt-10 tracking-tight font-bold m-auto">
			{#each profile?.statistics?.gamesWithTeamsPickedRecord || [] as teamBetRecord}
				<div class="grid grid-cols-12 py-5 bg-neutral mb-5 rounded-l px-5 my-auto h-28 w-full">
					<div class="flex md:text-xl xs:text-l col-span-8">
						<img
							src={teamBetRecord.team.logo}
							width="40"
							height="40"
							alt="logo"
							class="object-scale-down"
						/>
						<span class="my-auto pl-3">{teamBetRecord.team.name}</span>
					</div>
					<div class="md:text-xl xs:text-l text-left my-auto col-span-4">
						{displayWinPercentage(teamBetRecord)}% ({teamBetRecord.nbrOfCorrectBets} - {teamBetRecord.nbrOfIncorrectBets})
					</div>
				</div>
			{/each}
		</div>

		<h2 class="md:text-5xl xs:text-3xl text-center tracking-tight font-bold pt-10">
			When you pick a team, how often do they win?
		</h2>
		<div class="grid grid-cols-1 md:w-2/3 sm:w-full pt-10 tracking-tight font-bold m-auto">
			{#each profile.statistics?.teamBetRecords || [] as teamBetRecord}
				<div class="grid grid-cols-12 py-5 bg-neutral mb-5 rounded-l px-5 my-auto h-28 w-full">
					<div class="flex md:text-xl xs:text-l col-span-8">
						<img
							src={teamBetRecord.team.logo}
							width="40"
							height="40"
							alt="logo"
							class="object-scale-down"
						/>
						<span class="my-auto pl-3">{teamBetRecord.team.name}</span>
					</div>
					<div class="md:text-xl xs:text-l text-left my-auto col-span-4">
						{displayWinPercentage(teamBetRecord)}% ({teamBetRecord.nbrOfCorrectBets} - {teamBetRecord.nbrOfIncorrectBets})
					</div>
				</div>
			{/each}
		</div>
	{/if}
</section>
