<script lang="ts">
	import { fetchData } from '$lib/client/fetchData'
	import Await from '$lib/client/components/Await.svelte'
	import { userData } from '$lib/client/store'
	import { ripple } from '$lib/client/actions'
	import { goto } from '$app/navigation'
	import Tabs from '../../lib/client/components/Tabs.svelte'
	import ProfilePhoto from '../../lib/client/components/ProfilePhoto.svelte'
	import { t } from '$lib/shared/localization'
	import Analytics from '$lib/analytics.svelte'

	const webApp = window.Telegram.WebApp
	webApp.BackButton.show()
	webApp.BackButton.onClick(() => goto('/'))
	webApp.MainButton.hide()

	let topPromise = fetchData('top')
	let selectedTop = 'level'
</script>

<Analytics />

<div class="top">
	<Tabs
		tabs={[
			{
				title: $t('top.level'),
				value: 'level'
			},
			{
				title: $t('top.bulbs'),
				value: 'bulbs'
			},
			{
				title: $t('top.keys'),
				value: 'keys'
			}
		]}
		bind:selected={selectedTop}
	/>

	<div class="list">
		<Await promise={topPromise} once>
			<svelte:fragment slot="await">
				{#each new Array(100) as _}
					<div class="user skeleton">
						<span class="place" />
						<span class="profile-photo" />
						<span class="username" style:width={Math.random() * 5 + 3 + 'rem'} />
						<span class="stats" style:width={Math.random() + 1 + 'rem'} />
					</div>
				{/each}
			</svelte:fragment>
			<svelte:fragment slot="then" let:then={result}>
				{#each result[selectedTop] as user, i}
					<div class="user" class:self={user.username === $userData.username} use:ripple>
						<span class="place">
							{i + 1}
						</span>
						<!-- svelte-ignore a11y-img-redundant-alt -->
						<ProfilePhoto {user} />
						<span class="username">
							{user.username}
						</span>
						<span class="stats">
							{#if selectedTop === 'level'}
								{user.level}
							{:else if selectedTop === 'bulbs'}
								{user.bulbs} <img src="/icons/bulb.webp" width={16} alt="bulb" />
							{:else if selectedTop === 'keys'}
								{user.keys} <img src="/icons/key.webp" width={16} alt="keys" />
							{/if}
						</span>
						<div class="divider" />
					</div>
				{/each}
			</svelte:fragment>
		</Await>
	</div>
</div>

<style lang="scss">
	@import '../../styles/mixins';

	.top {
		box-shadow: 0px 0.5px 0px 0px rgba(0, 0, 0, 0.07);
		background: rgba(var(--background));
		backdrop-filter: blur(20px);
		margin-bottom: 1rem;
	}

	.skeleton {
		.place,
		.profile-photo,
		.username,
		.stats {
			animation: skeleton 1s infinite;
		}

		.username,
		.stats {
			height: 1.5rem;
			border-radius: 0.25rem;
		}

		.profile-photo {
			width: 2.7rem;
			height: 2.7rem;
			border-radius: 12px;
		}
	}

	.user {
		width: 100%;
		height: 3.5rem;
		padding: 1rem;
		display: flex;
		align-items: center;
		gap: 1rem;

		&.self {
			color: #2188ff;
			font-weight: bold;
			--ripple-color: color-mix(in srgb, #2188ff 15%, transparent);

			.place {
				color: #2188ff;
			}
		}

		&:last-child .divider {
			display: none;
		}

		&:nth-child(1) .place {
			background: #d4af37;
			border: 1px solid rgba(0, 0, 0, 0.05);
			color: white;
			display: none;
		}
		&:nth-child(1)::before {
			width: 1.5rem;
			height: 1.5rem;
			content: '🥇';
			font-size: 1.5rem;
			position: relative;
			left: -3px;
		}

		&:nth-child(2) .place {
			background: #c0c0c0;
			border: 1px solid rgba(0, 0, 0, 0.05);
			color: white;
			display: none;
		}
		&:nth-child(2)::before {
			width: 1.5rem;
			height: 1.5rem;
			content: '🥈';
			font-size: 1.5rem;
			position: relative;
			left: -3px;
		}

		&:nth-child(3) .place {
			background: #cd7f32;
			border: 1px solid rgba(0, 0, 0, 0.05);
			color: white;
			display: none;
		}
		&:nth-child(3)::before {
			width: 1.5rem;
			height: 1.5rem;
			content: '🥉';
			font-size: 1.5rem;
			position: relative;
			left: -3px;
		}
	}

	.place {
		font-size: 1rem;
		font-weight: 600;
		font-size: 0.875rem;
		width: 1.5rem;
		height: 1.5rem;
		color: var(--text);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.username {
		margin-left: -0.25rem;
		font-size: 0.875rem;
	}

	.stats {
		font-size: 1.125rem;
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.divider {
		position: absolute;
		bottom: 0;
		left: 1rem;
		right: 0;
		height: 1px;
		// background: var(--border-color);
	}
</style>
