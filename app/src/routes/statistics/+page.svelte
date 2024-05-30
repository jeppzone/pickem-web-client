<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import { getStatistics } from '../../api';
	import { loggedInUser } from '../../auth';
	import { getCurrentSeason } from '$lib/shared/utils';

	let statistics = [];
	let regularSeasonStatistics = [];
	let postSeasonStatistics = [];
	let season = getCurrentSeason();
	let loading = false;

	onMount(async () => {
		loading = true;
		statistics = await getStatistics($loggedInUser, season);
		regularSeasonStatistics = statistics?.filter((s) => s.seasonType === 'Reg');
		postSeasonStatistics = statistics?.filter((s) => s.seasonType === 'Post');
		loading = false;
	});

	async function fetchStatistics() {
		loading = true;
		statistics = await getStatistics($loggedInUser, season);
		regularSeasonStatistics = statistics?.filter((s) => s.seasonType === 'Reg');
		postSeasonStatistics = statistics?.filter((s) => s.seasonType === 'Post');
		loading = false;
	}
</script>

<svelte:head>
	<title>Statistics | NFL Pickem | Jeppzone Sports</title>
	<meta name="description" content="Statistics" />
</svelte:head>

<section class="">
	<h1 class="md:text-7xl xs:text-5xl text-center tracking-tight font-bold pt-10">Statistics.</h1>
	{#if loading}
		<div
			role="status"
			class="flex justify-center align-middle h-full mt-10 loading loading-dots mx-auto"
		></div>
	{:else}
		<h2 class="md:text-5xl xs:text-3xl text-center tracking-tight font-bold pt-10">
			Regular Season.
		</h2>
		<div class="grid grid-cols-1 pt-10 w-full">
			{#each regularSeasonStatistics as statEntry}
				<div
					class={`grid grid-cols-12 py-3 md:gap-4 xs:gap-0 mt-5 rounded-l px-5 w-full h-16 ${$loggedInUser?.username === statEntry.user ? 'bg-info ' : 'bg-neutral'}`}
				>
					<span class="md:text-xl xs:text-m tracking-tight font-extrabold col-span-6 px-2 my-auto"
						>{statEntry.description}</span
					>
					<span class="md:text-3xl xs:text-m tracking-tight font-extrabold my-auto col-span-4 px-2"
						>{statEntry.value}</span
					>
					<span class="md:text-xl xs:text-m tracking-tight font-extrabold col-span-2 my-auto px-2"
						>{statEntry.user}</span
					>
				</div>
			{/each}
		</div>
		<h2 class="md:text-5xl xs:text-3xl text-center tracking-tight font-bold pt-10">Post Season.</h2>
		<div class="grid grid-cols-1 pt-10 w-full">
			{#each postSeasonStatistics as statEntry}
				<div
					class={`grid grid-cols-12 py-3 md:gap-4 xs:gap-0 mt-5 rounded-l px-5 w-full h-16 ${$loggedInUser?.username === statEntry.user ? 'bg-info ' : 'bg-neutral'}`}
				>
					<span class="md:text-xl xs:text-m tracking-tight font-extrabold col-span-6 px-2 my-auto"
						>{statEntry.description}</span
					>
					<span class="md:text-3xl xs:text-m tracking-tight font-extrabold my-auto col-span-4 px-2"
						>{statEntry.value}</span
					>
					<span class="md:text-xl xs:text-m tracking-tight font-extrabold col-span-2 my-auto px-2"
						>{statEntry.user}</span
					>
				</div>
			{/each}
		</div>
	{/if}
</section>
