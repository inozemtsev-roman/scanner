import { type RequestEvent, json } from '@sveltejs/kit'
import { database } from '$lib/server/database'

const possibleDrops = [
	{ jettons: 20 },
	{ jettons: 30 },
	{ jettons: 40 },
	{ jettons: 50 },
	{ jettons: 60 },
	{ orbs: 2 },
	{ orbs: 5 }
]

export async function POST(event: RequestEvent) {
	const { t, initData } = event.locals
	if (!event.locals.user.inventoryItems.find((item) => item.itemId === 'envelope' && item.quantity > 0)) {
		return json(
			{
				message: t('items.envelope.use.absence')
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
				itemId: 'envelope'
			}
		}
	})

	const updatedUser = await database.user.update({
		data: {
			jettons: {
				increment: drop.jettons ?? 0
			},
			orbs: {
				increment: drop.orbs ?? 0
			}
		},
		where: {
			id: initData.user.id
		}
	})

	return json({
		_updates: {
			jettons: updatedUser.jettons,
			orbs: updatedUser.orbs
		}
	})
}
