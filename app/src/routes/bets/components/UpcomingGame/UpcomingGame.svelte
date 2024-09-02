<script>
	import { displayDate } from '$lib/shared/utils';
	import UpcomingGameTeamDisplay from './UpcomingGameTeamDisplay.svelte';

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
		<UpcomingGameTeamDisplay
			logo={game.homeTeam.logo}
			name={game.homeTeam.name}
			abbreviation={game.homeTeam.abbreviation}
			id={game.homeTeam.id}
			odds={getUserPick()?.game.homeTeamOdds || 0}
			userPick={getUserPick()}
		/>
		<UpcomingGameTeamDisplay
			logo={game.awayTeam.logo}
			name={game.awayTeam.name}
			abbreviation={game.awayTeam.abbreviation}
			id={game.awayTeam.id}
			odds={getUserPick()?.game.homeTeamOdds || 0}
			userPick={getUserPick()}
		/>
	</div>
</div>
