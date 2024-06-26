import { error, json, type RequestEvent } from '@sveltejs/kit'
import { database } from '$lib/server/database'
import { z } from 'zod'
import { items } from '$lib/shared/items'
import { t } from '$lib/shared/localization'

const sellItemSchema = z.object({
	item: z.string(),
	quantity: z.number().positive().int()
})

export async function POST(event: RequestEvent) {
	const body = sellItemSchema.safeParse(await event.request.json())

	if (!body.success) {
		throw error(402, {
			message: body.error.errors.map((error) => error.message).join('\n')
		})
	}

	const item = items.get(body.data.item)

	if (!item) {
		throw error(402, { message: 'This fingerprint does not exist' })
	}

	if (!item.sellable) {
		throw error(402, { message: 'This fingerprint is not sellable' })
	}

	const inventoryItem = await database.inventoryItem.findUnique({
		where: {
			userId_itemId: {
				userId: event.locals.initData.user.id,
				itemId: body.data.item
			}
		}
	})

	if (!inventoryItem) {
		throw error(402, { message: "You don't have this fingerprint" })
	}

	if (body.data.quantity > inventoryItem.quantity) {
		throw error(402, { message: "You don't have that many of this fingerprint" })
	}

	await database.inventoryItem.update({
		data: {
			quantity: {
				decrement: body.data.quantity
			}
		},
		where: {
			userId_itemId: {
				userId: event.locals.initData.user.id,
				itemId: body.data.item
			}
		}
	})

	await database.user.update({
		data: {
			bulbs: {
				increment: item.price * body.data.quantity
			}
		},
		where: {
			id: event.locals.initData.user.id
		}
	})

	return json({
		_updates: {
			bulbs: event.locals.user.bulbs + item.price * body.data.quantity
		}
	})
}
function $t(arg0: string): string {
	throw new Error('Function not implemented.')
}
