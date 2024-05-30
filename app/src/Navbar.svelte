<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { loggedInUser } from './auth.js';

	let path;
	$: path = browser ? $page.url.pathname : '';

	let open = false;
	let innerWidth;

	beforeNavigate((navigation) => {
		path = navigation.to?.route.id || '';
	});

	afterNavigate((navigation) => {
		open = false;
	});

	function logOut() {
		$loggedInUser = null;
	}
</script>

<svelte:window bind:innerWidth />

<button class="hamburger" class:open on:click={() => (open = !open)}>
	<svg width="32" height="24">
		<line id="top" x1="0" y1="2" x2="32" y2="2" />
		<line id="middle" x1="0" y1="12" x2="24" y2="12" />
		<line id="bottom" x1="0" y1="22" x2="32" y2="22" />
	</svg>
</button>
{#if open || innerWidth > 1200}
	<nav class="w-full grid justify-center">
		<ul class="menu menu-vertical lg:menu-horizontal rounded-box hover:none">
			{#if $loggedInUser !== null}
				<li>
					<a
						href="/bets"
						class={` px-6 py-2 rounded-2xl mt-10 transition-colors hover:bg-info ${path.includes('/bets') ? 'bg-info ' : ''}`}
						>Picks</a
					>
				</li>
				<li>
					<a
						href="/compare"
						class={` px-6 py-2 rounded-2xl mt-10 transition-colors hover:bg-info ${path.includes('/compare') ? 'bg-info ' : ''}`}
						>Compare</a
					>
				</li>
				<li>
					<a
						href="/leaderboards"
						class={` px-6 py-2 rounded-2xl mt-10 transition-colors hover:bg-info ${path.includes('/leaderboards') ? 'bg-info ' : ''}`}
						>Leaderboards</a
					>
				</li>
				<li>
					<a
						href="/statistics"
						class={` px-6 py-2 rounded-2xl mt-10 transition-colors hover:bg-info ${path.includes('/statistics') ? 'bg-info ' : ''}`}
						>Statistics</a
					>
				</li>

				<li>
					<a
						href="/profile"
						class={` px-6 py-2 rounded-2xl mt-10 transition-colors hover:bg-info ${path.includes('/profile') ? 'bg-info ' : ''}`}
						>Profile</a
					>
				</li>
				<li>
					<a
						on:click={logOut}
						href="/login"
						data-sveltekit-preload-data="off"
						class=" border-white px-6 py-2 rounded-2xl mt-10 hover:bg-info">Sign out</a
					>
				</li>
			{:else}
				<li>
					<a
						href="/"
						class={` px-6 py-2 rounded-2xl mt-10 transition-colors hover:bg-info ${path === '/' ? 'bg-info ' : ''}`}
						>Home</a
					>
				</li>
				<li>
					<a
						href="/login"
						class={` px-6 py-2 rounded-2xl mt-10 transition-colors hover:bg-info ${path === '/login' ? 'bg-info ' : ''}`}
						>Sign in</a
					>
				</li>
				<li>
					<a
						href="/register"
						class={` px-6 py-2 rounded-2xl mt-10 transition-colors hover:bg-info ${path === '/register' ? 'bg-info ' : ''}`}
						>Register</a
					>
				</li>
			{/if}
		</ul>
	</nav>
{/if}

<style>
	.navbar {
		height: 100vh;
		width: 190px;
		display: flex;
		flex-direction: column;
		padding-left: 10px;
		background-color: black;
		color: white;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 3;
		overflow-x: hidden;
		font-size: 18px;
	}

	.navbar-pages {
		display: flex;
		flex-direction: column;
		margin-left: 20px;
	}

	.selected {
		color: rgb(233, 147, 97);
		border-bottom: 3px solid rgb(233, 147, 97);
		font-weight: bold;
		width: fit-content;
		animation: fadein 0.5s;
	}

	.hamburger {
		display: none;
		z-index: 1000;
		margin-left: 0px;
		position: fixed;
		top: 0;
	}

	button {
		background-color: black;
		outline: none;
		border: none;
	}

	.open svg {
		transform: scale(0.7);
	}

	.open #top {
		transform: translate(6px, 0px) rotate(45deg);
	}

	.open #middle {
		opacity: 0;
	}

	.open #bottom {
		transform: translate(-12px, 9px) rotate(-45deg);
	}

	svg {
		color: white;
		background-color: black;
		min-height: 24px;
		transition: transform 0.3s ease-in-out;
	}

	svg line {
		stroke: currentColor;
		stroke-width: 3;
		transition: transform 0.3s ease-in-out;
	}

	@media only screen and (max-width: 1200px) {
		.navbar {
			width: 100vw;
			height: 100vh;
		}
		.hamburger {
			display: block;
			background-color: black;
		}
		.title {
			margin-top: 60px;
		}
	}
</style>
