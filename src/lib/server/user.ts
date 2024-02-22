import { getXpForNextLevel } from '../shared/leveling'
import { database } from './database'
import { random } from './random'

export async function giveUserXp(userId: number, xp: number) {
	const user = await database.user.findUnique({
		where: {
			id: userId
		},
		select: {
			level: true,
			xp: true
		}
	})

	if (!user) return

	let newLevel = user.level
	let newXp = user.xp + xp
	let xpToNextLevel = getXpForNextLevel(user.level)

	while (newXp >= xpToNextLevel) {
		newXp -= xpToNextLevel
		newLevel++
		xpToNextLevel = getXpForNextLevel(newLevel)
	}

	await database.user.update({
		where: {
			id: userId
		},
		data: {
			level: newLevel,
			xp: newXp
		}
	})

	await giveUserItem(userId, 'jetton', newLevel - user.level)

	return {
		level: newLevel,
		xp: newXp
	}
}

export async function giveUserItem(userId: number, itemId: string, quantity: number = 1) {
	return await database.inventoryItem.upsert({
		where: {
			userId_itemId: {
				userId,
				itemId
			}
		},
		create: {
			userId,
			itemId,
			quantity
		},
		update: {
			quantity: {
				increment: quantity
			}
		}
	})
}

export function getLuck(userId: number) {
	const maxDelta = 0.1
	const today = new Date()
	today.setUTCHours(0, 0, 0, 0)
	const dateString = today.toLocaleString('en-US', {
		month: '2-digit',
		day: '2-digit',
		year: '2-digit'
	})
	const seed = userId.toString() + dateString
	const randomValue = random(seed)
	const dailyLuck = 1 - maxDelta + randomValue * maxDelta * 2
	return dailyLuck
}
