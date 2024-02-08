import { error, json, type RequestEvent } from '@sveltejs/kit'
import { database } from '$lib/server/database'
import { getWeightedRandomItem } from '$lib/weightedRandom'
import { scanDrop } from '$lib/scanDrop'
import { giveUserItem, giveUserXp } from '$lib/server/user'

const xpReward = 1
const catchPrice = 5
const cooldown = 10_000
const waitMinTime = 15_000

export async function POST(event: RequestEvent) {
	const { t, user, initData } = event.locals

	if (user.lastTimeScanned && Date.now() < user.lastTimeScanned.getTime() + cooldown + waitMinTime) {
		throw error(403, {
			message: t('api.catchFingerprint.tooFast')
		})
	}

	if (user.bulbs < catchPrice) {
		throw error(403, {
			message: t('api.notEnoughBulbs')
		})
	}

	const itemCatched = getWeightedRandomItem(scanDrop)

	let newLevelData

	if (!itemCatched.isJunk) {
		giveUserItem(initData.user.id, itemCatched.itemId)

		newLevelData = await giveUserXp(initData.user.id, xpReward)
	}

	const lastTimeScanned = new Date()

	await database.user.update({
		data: {
			bulbs: {
				decrement: 2
			},
			lastTimeScanned
		},
		where: {
			id: event.locals.initData.user.id
		}
	})

	return json({
		...itemCatched,
		_updates: {
			bulbs: event.locals.user.bulbs - 5,
			level: newLevelData?.level,
			xp: newLevelData?.xp,
			lastTimeScanned
		}
	})
}
