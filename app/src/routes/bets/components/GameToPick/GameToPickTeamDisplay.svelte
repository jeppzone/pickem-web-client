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

<div class="grid grid-cols-12 gap-4">
	<img src={logo} alt="logo" width="40" height="40" class="xs:my-auto" />
	<span
		class=" tracking-tight font-bold lg:text-3xl md:text-2xl xs:text-xl md:col-span-5 xs:col-span-4"
		>{name}</span
	>
	<span class="col-span-4 xs:col md:text-right xs:text-left w-full">
		<button
			on:click|preventDefault={handleSelect}
			class={`text-white border px-3 py-3 rounded-xl transition-colors ${selected ? 'bg-sky-900 border border-sky-600' : ''}`}
		></button>
	</span>
	<span class="font-extrabold lg:text-3xl md:text-2xl xs:text-xl text-right xs:col-span-1">🎲</span>
	<span class="font-extrabold lg:text-3xl md:text-2xl xs:text-xl text-right xs:col-span-1 pr-5"
		>{odds?.toFixed(2) ?? 0.0}</span
	>
</div>
