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
	 * @type {number}
	 */
	export let score;
	/**
	 * @type {number}
	 */
	export let odds;
	/**
	 * @type {boolean}
	 */
	export let isWinner;
	/**
	 * @type {GamePick | undefined}
	 */
	export let userPick;
</script>

<svelte:window bind:innerWidth />

<div class="grid grid-cols-12 gap-4">
	<img src={logo} alt="logo" width="40" height="40" />
	<span
		class=" tracking-tight font-bold lg:text-3xl md:text-2xl xs:text-xl md:col-span-5 xs:col-span-2"
		>{displayTeamName(innerWidth, name, abbreviation)}</span
	>
	<span
		class={`lg:text-3xl md:text-2xl xs:text-xl md:col-span-1 xs:col-span-6 text-left font-extrabold ${isWinner ? '' : 'text-neutral-content'}`}
		>{score}</span
	>
	{#if userPick}
		{#if userPick.successful && isWinner}
			<span
				class="font-extrabold lg:text-3xl md:text-2xl xs:text-xl text-right md:col-span-4 xs:col-span-1"
				>💰</span
			>
			<span class="font-extrabold lg:text-3xl md:text-2xl xs:text-xl col-span-1 text-right mr-5"
				>{userPick.points.toFixed(2)}</span
			>
		{/if}
		{#if !userPick.successful && !isWinner}
			<span
				class="font-extrabold lg:text-3xl md:text-2xl xs:text-xl text-right md:col-span-4 xs:col-span-1"
				>❌</span
			>
			<span class="font-extrabold lg:text-3xl md:text-2xl xs:text-xl col-span-1 text-right pr-5"
				>{odds.toFixed(2)}</span
			>
		{/if}
	{:else}
		<span
			class="font-extrabold lg:text-3xl md:text-2xl xs:text-xl text-right md:col-span-4 xs:col-span-1"
			>🤷</span
		>
		<span
			class="font-extrabold lg:text-3xl md:text-2xl xs:text-xl col-span-1 text-right pr-5 w-full"
			>0.00</span
		>
	{/if}
</div>
