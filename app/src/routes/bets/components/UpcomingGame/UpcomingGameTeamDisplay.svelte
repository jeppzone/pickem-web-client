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
	function displayTeamName(width, team) {
		return width > 800 ? team.name : team.abbreviation;
	}
</script>

<div class="grid grid-cols-12 gap-4">
	<img src={logo} alt="logo" width="40" height="40" />
	<span
		class=" tracking-tight font-bold lg:text-3xl md:text-2xl xs:text-xl md:col-span-5 xs:col-span-7"
		>{name}</span
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
		<span class="font-extrabold lg:text-3xl md:text-2xl xs:text-xl col-span-5 text-right"
			>{' '}</span
		>
		<span class="font-extrabold lg:text-3xl md:text-2xl xs:text-xl col-span-1 text-right pr-5"
			>{odds?.toFixed(2)}</span
		>
	{/if}
</div>
