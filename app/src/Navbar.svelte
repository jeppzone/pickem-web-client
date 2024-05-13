<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { loggedInUser } from './auth.js';
	import { goto } from '$app/navigation';

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
		goto('/login');
	}
</script>

<svelte:window bind:innerWidth />
{#if $loggedInUser !== null}
	<button class="hamburger" class:open on:click={() => (open = !open)}>
		<svg width="32" height="24">
			<line id="top" x1="0" y1="2" x2="32" y2="2" />
			<line id="middle" x1="0" y1="12" x2="24" y2="12" />
			<line id="bottom" x1="0" y1="22" x2="32" y2="22" />
		</svg>
	</button>
	{#if open || innerWidth > 1200}
		{#if !$page.url.pathname.includes('/login')}
			<nav class="w-full grid justify-center">
				<div class="grid lg:grid-cols-7 lg:gap-4 sm:gap-x-2 xs:gap-x-1 text-center">
					<a
						href="/"
						class={`text-white px-6 py-2 rounded-2xl mt-10 transition-colors ${path === '/' ? 'bg-cyan-600' : ''}`}
						>Home</a
					>
					<a
						href="/bets"
						class={`text-white px-6 py-2 rounded-2xl mt-10 transition-colors ${path.includes('/bets') ? 'bg-cyan-600' : ''}`}
						>Bets</a
					>
					<a
						href="/leaderboards"
						class={`text-white px-6 py-2 rounded-2xl mt-10 transition-colors ${path.includes('/leaderboards') ? 'bg-cyan-600' : ''}`}
						>Leaderboards</a
					>
					<a
						href="/leagues"
						class={`text-white px-6 py-2 rounded-2xl mt-10 transition-colors ${path.includes('/leagues') ? 'bg-cyan-600' : ''}`}
						>Leagues</a
					>
					<a
						href="/statistics"
						class={`text-white px-6 py-2 rounded-2xl mt-10 transition-colors ${path.includes('/statistics') ? 'bg-cyan-600' : ''}`}
						>Statistics</a
					>
					{#if $loggedInUser !== null}
						<a
							href="/profile"
							class={`text-white px-6 py-2 rounded-2xl mt-10 transition-colors ${path.includes('/profile') ? 'bg-cyan-600' : ''}`}
							>Profile</a
						>
						<a
							href="/auth/sign-out"
							data-sveltekit-preload-data="off"
							class="text-white border-white px-6 py-2 rounded-l mt-10">Sign out</a
						>
					{:else}
						<a href="/auth/sign-in" class="text-white border border-white px-6 py-2 rounded-l mt-10"
							>Sign in</a
						>
					{/if}
				</div>
			</nav>
		{/if}
	{/if}
{/if}

<style>
	.navbar {
		height: 100vh;
		width: 190px;
		display: flex;
		flex-direction: column;
		padding-left: 10px;
		background-color: rgb(12, 35, 49);
		color: white;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 3;
		overflow-x: hidden;
		font-size: 18px;
	}

	.title img {
		width: 150px;
		cursor: pointer;
	}

	.navbar-pages {
		display: flex;
		flex-direction: column;
		margin-left: 20px;
	}

	.navbar-pages p,
	.navbar-pages h3 {
		cursor: pointer;
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
		background-color: rgb(12, 35, 49);
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
		background-color: rgb(12, 35, 49);
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
			background-color: rgb(12, 35, 49);
		}
		.title {
			margin-top: 60px;
		}
	}
</style>
