<script lang="ts">
	import { goto } from '$app/navigation'
	import Button from '$lib/client/components/Button.svelte'
	import { fetchData } from '$lib/client/fetchData'
	import type { ScanDrop } from '$lib/scanDrop'
	import { fly } from 'svelte/transition'
	import { flyIntoInventory } from '$lib/client/transitions'
	import { userData } from '$lib/client/store'
	import type { User } from '@prisma/client'
	import { LottiePlayer } from '@lottiefiles/svelte-lottie-player'
	import { clientLanguage, t, userLanguage } from '$lib/shared/localization'

	const webApp = window.Telegram.WebApp

	webApp.expand()
	webApp.BackButton.show()
	webApp.BackButton.onClick(() => goto('/'))
	webApp.MainButton.hide()

	let currentDrop: ScanDrop | null = null

	let myData: User | undefined = undefined
	let scanningState: 'timeout' | 'idle' | 'waiting' | 'biting' | 'caught' | 'missed' = 'timeout'
	let timeout: NodeJS.Timeout
	let catchButtonPressed = false

	$: if (myData) {
		console.log(myData)
		const timeUntilCanScan = new Date(myData.lastTimeScanned ?? 0).getTime() + 10_000 - new Date().getTime()
		setTimeout(
			() => {
				scanningState = 'idle'
			},
			timeUntilCanScan > 0 ? timeUntilCanScan : 0
		)
	}

	function caughtItemTransition(node: HTMLElement) {
		if (currentDrop?.isFailure) {
			return fly(node, { y: 64 })
		}
		return flyIntoInventory(node, { duration: 750 })
	}

	userData.subscribe((data) => {
		if (!data) return
		myData = data
	})
</script>

{#if scanningState === 'caught' && currentDrop}
	<button
		on:click={() => {
			scanningState = 'timeout'
			clearTimeout(timeout)
		}}
		class="drop"
		in:fly={{ y: -32 }}
		out:caughtItemTransition
	>
		{#if !currentDrop?.isFailure}
			<img class="rays" src="rays.webp" alt="rays" />
			<img class="rays1" src="rays1.webp" alt="rays1" />
			<img class="rays2" src="rays2.webp" alt="rays2" />
			<img class="rays3" src="rays3.webp" alt="rays3" />
		{/if}
		<img src={`items/${currentDrop.itemId}.webp`} alt={currentDrop.itemId} height="100" loading="lazy" />
	</button>
{/if}

{#if scanningState === 'idle'}
	<div class="scanning-action">
		<Button
			variant="primary"
			on:click={() => {
				scanningState = 'waiting'
				clearTimeout(timeout)
				timeout = setTimeout(() => {
					scanningState = 'biting'

					timeout = setTimeout(() => {
						scanningState = 'missed'

						timeout = setTimeout(() => {
							scanningState = 'timeout'

							timeout = setTimeout(() => {
								scanningState = 'idle'
							}, 15_000)
						}, 7_000)
					}, 2_000)
				}, 5_000 + Math.random() * 10_000)
			}}
		>
			{$t('button.confirm')}
		</Button>
	</div>
{:else if scanningState === 'biting'}
	<div class="scanning-action">
		<Button
			variant="primary"
			disabled={catchButtonPressed}
			on:click={async () => {
				catchButtonPressed = true
				currentDrop = await fetchData('catchFingerprint')
				scanningState = 'caught'
				clearTimeout(timeout)
				timeout = setTimeout(() => {
					scanningState = 'timeout'
					catchButtonPressed = false
					timeout = setTimeout(() => {
						scanningState = 'idle'
					}, 10_000)
				}, 15_000)
			}}
		>
			{$t('button.authenticate')}
		</Button>
	</div>
{:else if scanningState === 'timeout'}
	<div class="animation">
		<LottiePlayer src="/animations/time2.json" loop autoplay width={160} />
	</div>
	<div class="scanning-action">{$t('message.timeout')}</div>
{:else if scanningState === 'waiting'}
	<div class="animation">
		<LottiePlayer src="/animations/scan-double.json" loop autoplay width={160} />
	</div>
	<div class="scanning-action">{$t('message.waiting')}</div>
{:else if scanningState === 'missed'}
	<div class="animation">
		<LottiePlayer src="/animations/er2.json" loop autoplay width={150} />
	</div>
	<div class="scanning-action">{$t('message.missed')}</div>
{/if}

<style lang="scss">
	.drop {
		position: absolute;
		right: 50%;
		top: 50%;
		translate: 50% -50%;
		transition: none;
		background: none;
		border: none;
		transition: 5.5s ease-in;
	}

	.scanning-action {
		position: absolute;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		left: 0;
		bottom: 10%;
		align-items: stretch;
		justify-content: center;
		text-align: center;
	}

	.animation {
		position: absolute;
		left: 50%;
		top: 50%;
		translate: -50% -50%;
	}

	.rays {
		position: absolute;
		left: calc(30% - 8rem);
		top: calc(30% - 8rem);
		z-index: -1;
		animation: rotate 8s linear infinite;
	}

	@keyframes rotate {
		from {
			rotate: 0deg;
		}
		to {
			rotate: 360deg;
		}
	}

	.rays1 {
		position: absolute;
		left: calc(50% - 8rem);
		top: calc(50% - 8rem);
		z-index: -1;
		animation: rotate1 8s linear infinite;
	}

	@keyframes rotate1 {
		from {
			rotate: 0deg;
		}
		to {
			rotate: -360deg;
		}
	}

	.rays2 {
		position: absolute;
		left: calc(50% - 8rem);
		top: calc(50% - 8rem);
		z-index: -1;
		animation: rotate2 4s linear infinite;
	}

	@keyframes rotate2 {
		from {
			rotate: 0deg;
		}
		to {
			rotate: 360deg;
		}
	}

	.rays3 {
		position: absolute;
		left: calc(50% - 8rem);
		top: calc(50% - 8rem);
		z-index: -1;
		animation: rotate3 15s linear infinite;
	}

	@keyframes rotate3 {
		from {
			rotate: 0deg;
		}
		to {
			rotate: -360deg;
		}
	}
</style>
