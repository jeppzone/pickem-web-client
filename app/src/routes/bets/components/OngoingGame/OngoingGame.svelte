<script>
	import { displayDate } from '$lib/shared/utils';
	import OngoingGameTeamDisplay from './OngoingGameTeamDisplay.svelte';

	/**
	 * @type {Game}
	 */
	export let game;
	/**
	 * @type {GamePick[]}
	 */
	export let picks = [];

	/**
	 * @returns {GamePick | undefined}
	 */
	function getUserPick() {
		return picks.find((p) => p.game.id === game.id);
	}
</script>

<div class="bg-neutral rounded-xl px-5 mt-5">
	<div class="py-2 italic font-bold tracking-wide">{displayDate(game)}</div>
	<div class="grid grid-cols-1 pb-5 gap-4">
		<OngoingGameTeamDisplay
			logo={game.homeTeam.logo}
			name={game.homeTeam.name}
			abbreviation={game.homeTeam.abbreviation}
			id={game.homeTeam.id}
			score={game.homeTeamScore || 0}
			odds={getUserPick()?.game.homeTeamOdds || 0}
			userPick={getUserPick()}
		/>
		<OngoingGameTeamDisplay
			logo={game.awayTeam.logo}
			name={game.awayTeam.name}
			abbreviation={game.awayTeam.abbreviation}
			id={game.awayTeam.id}
			score={game.awayTeamScore || 0}
			odds={getUserPick()?.game.awayTeamOdds || 0}
			userPick={getUserPick()}
		/>
	</div>
</div>
