<script>
	import { displayDate } from '$lib/shared/utils';
	import FinishedGameTeamDisplay from './FinishedGameTeamDisplay.svelte';

	/**
	 * @type {Game}
	 */
	export let game;
	/**
	 * @type {GamePick[]}
	 */
	export let picks = [];

	/**
	 * @returns {boolean}
	 */
	function isPickCorrect() {
		const matchingPick = getUserPick();
		return game.winner.id === matchingPick?.winningTeam.id;
	}

	/**
	 * @returns {boolean}
	 */
	function hasUserPickedGame() {
		return picks.findIndex((p) => p.game.id === game.id) > -1;
	}

	/**
	 * @returns {GamePick | undefined}
	 */
	function getUserPick() {
		return picks.find((p) => p.game.id === game.id);
	}

	/**
	 * @param {number | null} firstScore
	 * @param {any | null} secondScore
	 * @returns {boolean}
	 */
	function isWinner(firstScore, secondScore) {
		if (firstScore === null || secondScore === null) {
			return false;
		}

		return firstScore > secondScore;
	}
</script>

<div
	class={`${hasUserPickedGame() ? (isPickCorrect() ? 'bg-success' : 'bg-error') : 'bg-neutral'} rounded-xl px-5 mt-5`}
>
	<div class="py-2 italic font-bold tracking-wide">{displayDate(game)}</div>
	<div class="grid grid-cols-1 pb-5 gap-4">
		<FinishedGameTeamDisplay
			logo={game.homeTeam.logo}
			name={game.homeTeam.name}
			abbreviation={game.homeTeam.abbreviation}
			score={game.homeTeamScore || 0}
			odds={getUserPick()?.game.homeTeamOdds || 0}
			isWinner={isWinner(game.homeTeamScore, game.awayTeamScore)}
			userPick={getUserPick()}
		/>
		<FinishedGameTeamDisplay
			logo={game.awayTeam.logo}
			name={game.awayTeam.name}
			abbreviation={game.awayTeam.abbreviation}
			score={game.awayTeamScore || 0}
			odds={getUserPick()?.game.awayTeamOdds || 0}
			isWinner={isWinner(game.awayTeamScore, game.homeTeamScore)}
			userPick={getUserPick()}
		/>
	</div>
</div>
