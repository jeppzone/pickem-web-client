<script>
	import { goto } from '$app/navigation';
	import { login, register } from '../../api';
	import { loggedInUser } from '../../auth.js';
	// @ts-ignore
	import { SvelteToast } from '@zerodevx/svelte-toast';
	// @ts-ignore
	import { toast } from '@zerodevx/svelte-toast';
	import LoadingIndicator from '../../LoadingIndicator.svelte';
	// @ts-ignore
	let username;
	// @ts-ignore
	let password;
	let registerToggled = false;
	let loading = false;

	function toggleMode() {
		registerToggled = !registerToggled;
	}

	async function loginUser() {
		try {
			loading = true;
			// @ts-ignore
			const user = await login({ username, password });
			$loggedInUser = user;
			goto('/');
		} catch (err) {
			showError('There was a problem logging in. Please try again');
		} finally {
			loading = false;
		}
	}

	async function registerUser() {
		try {
			loading = true;
			// @ts-ignore
			const user = await register({ username, password });
			$loggedInUser = user;
			goto('/');
		} catch (err) {
			showError('There was a problem when registering. Please try again');
		} finally {
			loading = false;
		}
	}

	// @ts-ignore
	function showError(errorMessage) {
		toast.push(errorMessage, {
			theme: {
				'--toastBackground': '#f54260',
				'--toastProgressBackground': 'white'
			}
		});
	}
</script>

<section class="mx-auto w-1/2">
	<div class="login">
		<div class="grid justify-center">
			<img src="/logo-text.png" alt="NFL Pick'em" />
		</div>
		{#if registerToggled}
			<div class="title">
				<h1 class="text-7xl font-extrabold">Register</h1>
			</div>
			<form on:submit|preventDefault={registerUser}>
				<div>
					<label for="username">Username</label>
					<input id="username" bind:value={username} type="text" />
					<label for="password">Password</label>
					<input id="password" bind:value={password} type="password" />
				</div>
				<button>
					<div class="loading">
						{#if loading}
							<LoadingIndicator />
						{/if}
					</div>
					Register
				</button>
			</form>
			<span class="span-button" on:click={toggleMode}>or <b>Login</b></span>
		{:else}
			<h1 class="text-7xl font-extrabold pt-10 pb-5 text-center">Login</h1>
			<form on:submit|preventDefault={loginUser}>
				<div class="grid grid-cols-1 justify-center">
					<label for="username">Username</label>
					<input
						type="text"
						placeholder="Type here"
						class="input w-full max-w-xs text-black"
						bind:value={username}
					/>
					<label for="password">Password</label>
					<input
						id="password"
						bind:value={password}
						type="password"
						class="input w-full max-w-xs text-black"
					/>
				</div>
				<div class="action-button">
					<button>
						<div class="loading">
							{#if loading}
								<LoadingIndicator />
							{/if}
						</div>
						Login
					</button>
				</div>
			</form>
			<span class="span-button" on:click={toggleMode}>or <b>Register</b></span>
		{/if}
	</div>
	<SvelteToast />
</section>
