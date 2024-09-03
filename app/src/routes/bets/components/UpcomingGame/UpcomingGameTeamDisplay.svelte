<script>
	import { displayTeamName } from '$lib/shared/utils';
	$: innerWidth = 0;
	/**
	 * @type {string}
	 */
	export let logo;
	/**
	 * @type {string}
	 */
	export let name;
	/**
	 * @type {string}
	 */
	export let abbreviation;
	/**
	 * @type {string}
	 */
	export let id;
	/**
	 * @type {number | null}
	 */
	export let odds;
	/**
	 * @type {GamePick | undefined}
	 */
	export let userPick;

	function isPickOnTeam() {
		return id === userPick?.winningTeam.id;
	}
</script>

<svelte:window bind:innerWidth />

<div class="grid grid-cols-12 gap-4">
	<span class="xs:col-span-2 md:col-span-1 my-auto">
		<img src={logo} alt="logo" width="40" height="40" />
	</span>
	<span
		class=" tracking-tight font-bold lg:text-3xl md:text-2xl xs:text-xl md:col-span-5 xs:col-span-6 my-auto"
		>{displayTeamName(innerWidth, name, abbreviation)}</span
	>
	{#if userPick}
		{#if isPickOnTeam()}
			<span
				class="font-extrabold lg:text-3xl md:text-2xl xs:text-xl text-right md:col-span-5 xs:col-span-2"
				>🎲</span
			>
			<span class="font-extrabold lg:text-3xl md:text-2xl xs:text-xl col-span-1 text-right pr-5"
				>{odds?.toFixed(2) ?? 0.0}</span
			>
		{/if}
	{:else}
		<span class="font-extrabold lg:text-3xl md:text-2xl xs:text-xl col-span-3 text-right"
			>{' '}</span
		>
		{#if odds && odds > 0}
			<span class="font-extrabold lg:text-3xl md:text-2xl xs:text-xl col-span-1 text-right pr-5"
				>{odds?.toFixed(2)}</span
			>
		{/if}
	{/if}
</div>

<style>
	img {
		max-width: 40px;
		min-width: 40px;
	}
</style>
