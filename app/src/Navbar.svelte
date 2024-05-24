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
	{#if !$page.url.pathname.includes('/login') && !$page.url.pathname.includes('/register')}
		<nav class="w-full grid justify-center">
			<ul class="menu menu-vertical lg:menu-horizontal rounded-box hover:none">
				<li>
					<a
						href="/bets"
						class={`text-white px-6 py-2 rounded-2xl mt-10 transition-colors hover:bg-sky-900 ${path.includes('/bets') ? 'bg-sky-900 ' : ''}`}
						>Picks</a
					>
				</li>
				<li>
					<a
						href="/compare"
						class={`text-white px-6 py-2 rounded-2xl mt-10 transition-colors hover:bg-sky-900 ${path.includes('/compare') ? 'bg-sky-900 ' : ''}`}
						>Compare</a
					>
				</li>
				<li>
					<a
						href="/leaderboards"
						class={`text-white px-6 py-2 rounded-2xl mt-10 transition-colors hover:bg-sky-900 ${path.includes('/leaderboards') ? 'bg-sky-900 ' : ''}`}
						>Leaderboards</a
					>
				</li>
				<li>
					<a
						href="/statistics"
						class={`text-white px-6 py-2 rounded-2xl mt-10 transition-colors hover:bg-sky-900 ${path.includes('/statistics') ? 'bg-sky-900 ' : ''}`}
						>Statistics</a
					>
				</li>
				{#if $loggedInUser !== null}
					<li>
						<a
							href="/profile"
							class={`text-white px-6 py-2 rounded-2xl mt-10 transition-colors hover:bg-sky-900 ${path.includes('/profile') ? 'bg-sky-900 ' : ''}`}
							>Profile</a
						>
					</li>
					<li>
						<a
							on:click={logOut}
							href="/login"
							data-sveltekit-preload-data="off"
							class="text-white border-white px-6 py-2 rounded-l mt-10 hover:bg-sky-900">Sign out</a
						>
					</li>
				{:else}
					<li>
						<a
							href="/login"
							class="text-white border-white px-6 py-2 rounded-l mt-10 hover:bg-sky-900">Sign in</a
						>
					</li>
				{/if}
			</ul>
		</nav>
	{/if}
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
