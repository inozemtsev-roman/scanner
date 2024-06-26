<script lang="ts">
	import { cubicOut } from 'svelte/easing'
	import { tweened } from 'svelte/motion'
	import { activeRequests, userData } from '$lib/client/store'
	import { ripple } from '$lib/client/actions/ripple'
	import type { User } from '@prisma/client'
	import { getXpForNextLevel } from '$lib/shared/leveling'
	import { t } from '$lib/shared/localization'

	let myData: User = {
		bulbs: 0,
		id: BigInt(0),
		joined: new Date(),
		level: 0,
		keys: 0,
		xp: 0,
		lastTimeScanned: null,
		username: '',
		profilePhoto: '',
		lastDailyBonus: null
	}

	const xpProgress = tweened(0, {
		duration: 200,
		easing: cubicOut
	})

	const bulbsDisplayValue = tweened(0, {
		duration: 500,
		easing: cubicOut
	})

	const keysDisplayValue = tweened(0, {
		duration: 500,
		easing: cubicOut
	})

	$: xpProgress.set(myData?.xp ?? 0)
	$: bulbsDisplayValue.set(myData?.bulbs ?? 0)
	$: keysDisplayValue.set(myData?.keys ?? 0)

	userData.subscribe((data) => {
		if (!data) return
		myData = data
	})
</script>

<header class="header">
	<button
		use:ripple
		class="level"
		on:click={() =>
			window.Telegram.WebApp.showPopup({
				title: $t('levelPopupTitle', { level: myData.level }),
				message: `${myData.xp} / ${getXpForNextLevel(myData.level)}`
			})}
	>
		<span>{myData.level}</span>
		<div class="progress">
			<div class="progress-value" style:width={($xpProgress / getXpForNextLevel(myData.level)) * 100 + '%'} />
		</div>
	</button>
	<div class="wallet">
		<span class="currency" class:negative={myData.bulbs < 0}>
			{Math.round($bulbsDisplayValue)}
			<img draggable="false" class="currency-icon" src="/icons/bulb.webp" alt="bulb" />
		</span>
		<span class="currency" class:negative={myData.keys < 0}>
			{Math.round($keysDisplayValue)}
			<img draggable="false" class="currency-icon" src="/icons/key.webp" alt="keys" />
		</span>
	</div>
	{#if $activeRequests.length}
		<div class="loading-indicator" />
	{/if}
</header>

<style lang="scss">
	.header {
		height: 3rem;
		box-shadow: 0 0.5px 0 0 rgba(0, 0, 0, 0.07), 0 calc(-1 * var(--border-width)) 0 0 var(--border-color) inset;
		padding: 0 1rem 0 0.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: var(--background);
		z-index: 5;
		position: relative;
	}

	.level {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		height: 2rem;
		background: none;
		border: none;
		padding: 0 0.5rem;
		color: var(--foreground);
		font-size: 1rem;
		border-radius: 0.25rem;
	}

	.progress {
		width: 8rem;
		height: 0.33rem;
		border-radius: 0.25rem;
		background: var(--background-secondary);
		box-shadow: 0 0 0 1 rgba(92, 92, 92, 0.07) inset;
		overflow: hidden;

		&-value {
			background: #2188ff;
			height: 100%;
		}
	}

	.wallet {
		display: flex;
		gap: 1.5rem;
		font-weight: 500;
	}

	.currency {
		font-size: 1rem;
		line-height: 1.25rem;
		font-weight: 500;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.currency-icon {
		width: 1.25rem;
		height: 1.25rem;
	}

	.negative {
		color: var(--danger);
	}

	.loading-indicator {
		width: 100%;
		height: 8px;
		background: linear-gradient(to right, #2188ff, #ff2188, #2188ff);
		background-size: 200%;
		position: absolute;
		left: 0;
		bottom: 0;
		animation: loading 1s linear infinite;
	}

	@keyframes loading {
		0% {
			background-position-x: 0%;
		}

		100% {
			background-position-x: -200%;
		}
	}
</style>
