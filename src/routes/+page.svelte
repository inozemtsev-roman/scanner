<script lang="ts">
	import { ripple } from '$lib/client/actions/ripple'
	import { t } from '$lib/shared/localization'
	import { userData } from '$lib/client/store'
	import { fetchData } from '../lib/client/fetchData'
	import Analytics from '$lib/analytics.svelte'

	window.Telegram.WebApp.BackButton.hide()
	window.Telegram.WebApp.MainButton.hide()

	let scanningTimeRemained: number
	let frame
	let lastTime = window.performance.now()

	function updateScanProgress() {
		frame = requestAnimationFrame(updateScanProgress)

		const time = window.performance.now()
		scanningTimeRemained -= time - lastTime

		lastTime = time
	}
	updateScanProgress()

	userData.subscribe((value) => {
		scanningTimeRemained = new Date(value?.lastTimeScanned ?? 0).getTime() + 10_000 - new Date().getTime()
		if (scanningTimeRemained < 0) scanningTimeRemained = 0
	})

	async function handleBonusCardClick() {
		const data = await fetchData('collectDailyBonus')
		window.Telegram.WebApp.showPopup({
			title: $t('home.dailyBonus'),
			message: data.collected ? $t('home.dailyBonusMessage.collected.text') : $t('home.dailyBonusMessage.timeout.text')
		})
	}
</script>

<Analytics />

<div class="nav-card-list">
	<a class="nav-card" href="/inventory" use:ripple>
		<img src="/icons/id.webp" alt="inventory" />
		{$t('home.inventory')}
	</a>
	<a class="nav-card" href="/scanning" use:ripple>
		<img src="/icons/finger.webp" alt="scanning" />
		{$t('home.scanning')}
		<span class="progress" style:width={`${(scanningTimeRemained / 10000) * 100}%`} />
	</a>
	<button class="nav-card small" use:ripple on:click={handleBonusCardClick}>
		<img src="/icons/jetton.webp" alt="daily bonus" />
		{$t('home.dailyBonus')}
	</button>
	<a class="nav-card small" href="/top" use:ripple>
		<img src="/icons/trophy.webp" alt="top" />
		{$t('home.top')}
	</a>
	<a class="nav-card small" href="/settings" use:ripple>
		<img src="/icons/gear.webp" alt="settings" />
		{$t('home.settings')}
	</a>

	<a class="nav-card tg" href={$t('home.links.telegramln')} target="_blank" use:ripple>
		<img src="/icons/telegram.webp" alt="getgems" />
		{$t('home.links.telegram')}
	</a>
	<a class="nav-card gg" href="https://getgems.io/fingerprints" target="_blank" use:ripple>
		<img src="/icons/gg.webp" alt="getgems" />
	</a>
	<a class="nav-card gh" href="https://github.com/mir-one/fingerprints" target="_blank" use:ripple>
		<img src="/icons/github.webp" alt="github" />
	</a>
	<a class="nav-card dao" href="https://t.me/ton_fingerprints_dao_bot" use:ripple>
		<img src="/icons/dao.webp" alt="dao" />
		{$t('home.links.dao')}
	</a>
	<a class="nav-card longgg" href="https://getgems.io/fingerprints" target="_blank" use:ripple />
</div>

<style lang="scss">
	@import '../styles/mixins';

	.nav-card {
		@include card;

		display: flex;
		aspect-ratio: 1/1;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1.5rem;
		color: var(--foreground);
		font-size: 1rem;
		line-height: 1rem;
		grid-column: span 3;
		border: none;
		font-weight: 500;

		&.tg {
			grid-column: span 2;
			flex-direction: row;
			aspect-ratio: 2/0.88;
			gap: 0.5rem;
			background: #0088cc;
			color: white;
			font-size: 1rem;

			img {
				width: 1.2rem;
			}
		}

		&.dao {
			grid-column: span 2;
			flex-direction: row;
			aspect-ratio: 2/0.88;
			gap: 0.5rem;
			color: var(--foreground);
			font-size: 1rem;

			img {
				width: 1.9rem;
			}
		}

		&.gg {
			grid-column: span 1;
			flex-direction: row;
			aspect-ratio: 1/1;
			gap: 1rem;
			background: linear-gradient(135deg, #5cc8fa 0%, #4398f7 100%);
			color: white;
			font-size: 1rem;

			img {
				width: 1.2rem;
			}
		}

		&.gh {
			grid-column: span 1;
			flex-direction: row;
			gap: 1rem;
			aspect-ratio: 1/1;
			background: #24292f;
			color: white;
			font-size: 1rem;

			img {
				width: 1.2rem;
			}
		}

		&.small {
			grid-column: span 2;
			gap: 1rem;

			img {
				width: 3rem;
			}
		}

		&.longgg {
			grid-column: span 6;
			aspect-ratio: 535/301;
			gap: 1rem;
			background-image: url(/fingerprint.webp);
			background-size: 100%;

			img {
				width: 2rem;
			}
		}

		&.disabled {
			opacity: 0.5;
		}

		img {
			width: 4rem;
		}
	}

	.nav-card-list {
		padding: 1rem;
		gap: 1rem;
		display: grid;
		grid-template-columns: repeat(6, 1fr);
	}

	.progress {
		position: absolute;
		bottom: 0;
		left: 0;
		background: #2188ff;
		height: 0.25rem;
		border-radius: 0.125rem;
	}
</style>
