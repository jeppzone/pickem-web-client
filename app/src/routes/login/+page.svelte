<script>
	// @ts-nocheck

	import { goto } from '$app/navigation';
	import { login } from '../../api';
	import { loggedInUser } from '../../auth.js';
	let username;
	let error;
	let password;
	let loading = false;

	async function loginUser() {
		try {
			error = '';
			loading = true;
			// @ts-ignore
			const user = await login({ username, password });
			$loggedInUser = user;
			goto('/');
		} catch (err) {
			error = 'There was a problem logging in. Please try again';
		} finally {
			loading = false;
		}
	}
</script>

<section class="flex items-center flex-col justify-center my-auto">
	<img src="/logo-text.png" class="rounded mb-10" alt="Pickem logo" />
	<h1 class="text-center text-5xl font-extrabold pb-5">Login</h1>
	<div class="card w-96 bg-base-300-content shadow-xl">
		<div class="card-body">
			<form on:submit|preventDefault={loginUser} class="">
				<div class="form-control">
					<label class="label" for="username">
						<span class="label-text text-white">Username</span>
					</label>
					<input
						id="username"
						type="text"
						bind:value={username}
						placeholder="Username"
						class="input input-bordered"
						required
					/>
				</div>
				<div class="form-control mt-4">
					<label class="label" for="password">
						<span class="text-white">Password</span>
					</label>
					<input
						id="password"
						type="password"
						bind:value={password}
						placeholder="Password"
						class="input input-bordered"
						required
					/>
				</div>
				<div class="form-control mt-6">
					<button type="submit" class="btn btn-primary">
						{#if loading}
							<span class="loading loading-spinner"></span>
						{:else}
							Login
						{/if}</button
					>
				</div>
				<div class="mt-6">
					<a href="/register">
						<button class="btn btn-outline btn-primary border-none"> Or Register </button>
					</a>
				</div>
			</form>
		</div>
		{#if error}
			<div class="toast toast-bottom toast-end">
				<div class="alert bg-error border-none text-white">
					<span>{error}</span>
				</div>
			</div>
		{/if}
	</div>
</section>

<svelte:head>
	<!-- Title -->
	<title>Login | NFL Pick'em</title>

	<!-- Meta Description -->
	<meta
		name="description"
		content="Login to your NFL Pick'em account to make your weekly picks and track your performance."
	/>

	<!-- Meta Keywords -->
	<meta
		name="keywords"
		content="NFL Pick'em login, NFL Pickem, NFL picks, login, football picks, sports login, NFL predictions"
	/>

	<!-- Open Graph Meta Tags -->
	<meta property="og:title" content="Login | NFL Pick'em" />
	<meta
		property="og:description"
		content="Login to your NFL Pick'em account to make your weekly picks and track your performance."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://nflpickem.jeppzonestudios.se/login" />
	<meta property="og:image" content="https://nflpickem.jeppzonestudios.se/logo-text.png" />

	<!-- Twitter Card Meta Tags -->
	<meta name="twitter:title" content="Login | NFL Pick'em" />
	<meta
		name="twitter:description"
		content="Login to your NFL Pick'em account to make your weekly picks and track your performance."
	/>

	<!-- Canonical Link -->
	<link rel="canonical" href="https://nflpickem.jeppzonestudios.se/login" />

	<!-- Favicon -->
	<link rel="icon" href="/favicon.png" type="image/x-icon" />
</svelte:head>

<style>
	.card {
		@apply rounded-lg overflow-hidden;
	}

	.card-body {
		@apply p-6;
	}

	.form-control {
		@apply w-full;
	}

	.label {
		@apply mb-2;
	}

	.input {
		@apply w-full;
	}

	.btn {
		@apply w-full;
	}
</style>
