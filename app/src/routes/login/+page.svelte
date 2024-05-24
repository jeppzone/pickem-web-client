<script>
	// @ts-nocheck

	import { goto } from '$app/navigation';
	import { login, register } from '../../api';
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

<svelte:head>
	<title>Login | NFL Pickem | Jeppzone Sports</title>
	<meta name="description" content="Login" />
</svelte:head>

<section class="flex items-center flex-col justify-center my-auto">
	<img src="/logo-text.png" class="rounded mb-10" alt="Pickem logo" />
	<h1 class="text-center text-5xl font-extrabold pb-5">Login</h1>
	<div class="card w-96 bg-black shadow-xl">
		<div class="card-body">
			<form on:submit|preventDefault={loginUser} class="text-white">
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
						<span class="label-text text-white">Password</span>
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
					<button type="submit" class="btn btn-secondary">
						{#if loading}
							<span class="loading loading-spinner"></span>
						{:else}
							Login
						{/if}</button
					>
				</div>
				<div class="mt-6">
					<a href="/register">
						<button class="btn btn-outline btn-secondary border-none"> Or Register </button>
					</a>
				</div>
			</form>
		</div>
		{#if error}
			<div class="toast toast-bottom toast-end">
				<div class="alert bg-rose-900 border-none text-white">
					<span>{error}</span>
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	.card {
		@apply rounded-lg overflow-hidden;
	}

	.card-body {
		@apply p-6;
	}

	.card-title {
		@apply text-2xl font-bold mb-4;
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
