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

	export let selected = false;

	/**
	 * @type {(arg0: string) => void}
	 */
	export let dispatch;

	function handleSelect() {
		selected = !selected;
		if (selected) {
			dispatch(id);
		}
	}
</script>

<svelte:window bind:innerWidth />

<div class="grid grid-cols-12 gap-4">
	<span class="xs:col-span-2 md:col-span-1 my-auto">
		<img src={logo} alt="logo" width="40" height="40" />
	</span>
	<span
		class=" tracking-tight font-bold lg:text-3xl md:text-2xl xs:text-xl md:col-span-5 xs:col-span-4 my-auto"
		>{displayTeamName(innerWidth, name, abbreviation)}</span
	>
	<span class="md:col-span-4 xs:col-span-3 md:text-right xs:text-left w-full my-auto">
		<input
			type="radio"
			class="radio radio-secondary mt-1"
			on:change={handleSelect}
			checked={selected}
		/>
	</span>
	<span class="font-extrabold lg:text-3xl md:text-2xl xs:text-xl text-right xs:col-span-1 my-auto"
		>🎲</span
	>
	<span
		class="font-extrabold lg:text-3xl md:text-2xl xs:text-xl text-right xs:col-span-1 pr-5 my-auto"
		>{odds?.toFixed(2) ?? 0.0}</span
	>
</div>

<style>
	img {
		max-width: 40px;
		min-width: 40px;
	}
</style>
