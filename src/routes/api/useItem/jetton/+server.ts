import { type RequestEvent, json } from '@sveltejs/kit'
import { database } from '$lib/server/database'

const possibleDrops = [
	{ bulbs: 20 },
	{ bulbs: 30 },
	{ bulbs: 40 },
	{ bulbs: 50 },
	{ bulbs: 60 },
	{ keys: 2 },
	{ keys: 5 },
	{ keys: 7 }
]

export async function POST(event: RequestEvent) {
	const { t, initData } = event.locals
	if (!event.locals.user.inventoryItems.find((item) => item.itemId === 'jetton' && item.quantity > 0)) {
		return json(
			{
				message: t('items.jetton.use.absence')
			},
			{
				status: 400
			}
		)
	}

	const drop = possibleDrops[Math.floor(Math.random() * possibleDrops.length)]

	await database.inventoryItem.update({
		data: {
			quantity: {
				decrement: 1
			}
		},
		where: {
			userId_itemId: {
				userId: initData.user.id,
				itemId: 'jetton'
			}
		}
	})

	const updatedUser = await database.user.update({
		data: {
			bulbs: {
				increment: drop.bulbs ?? 0
			},
			keys: {
				increment: drop.keys ?? 0
			}
		},
		where: {
			id: initData.user.id
		}
	})

	return json({
		_updates: {
			bulbs: updatedUser.bulbs,
			keys: updatedUser.keys
		}
	})
}
