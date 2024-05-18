<script>
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
	export let id;
	/**
	 * @type {number}
	 */
	export let score;
	/**
	 * @type {number}
	 */
	export let odds;
	/**
	 * @type {GamePick | undefined}
	 */
	export let userPick;
</script>

<div class="grid grid-cols-12 gap-4">
	<img src={logo} alt="logo" width="40" height="40" />
	<span
		class=" tracking-tight font-bold lg:text-3xl md:text-2xl xs:text-xl md:col-span-5 xs:col-span-7"
		>{name}</span
	>
	<span class="lg:text-3xl md:text-2xl xs:text-xl text-left font-extrabold">{score}</span>
	{#if userPick?.winningTeam?.id === id}
		<span
			class="font-extrabold lg:text-3xl md:text-2xl xs:text-xl text-right md:col-span-4 xs:col-span-1"
			>🎲</span
		>
		<span class="font-extrabold lg:text-3xl md:text-2xl xs:text-xl col-span-1 text-right pr-5"
			>{odds.toFixed(2)}</span
		>
	{/if}
</div>
