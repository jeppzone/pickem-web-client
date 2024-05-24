<script>
	// @ts-nocheck

	import Navbar from '../Navbar.svelte';
	import '../app.css';
</script>

<div class="app bg-base-300 text-base-content">
	<header>
		<Navbar />
	</header>
	<main class="mx-auto">
		<slot />
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
