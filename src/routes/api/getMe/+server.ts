import { error, json, type RequestEvent } from '@sveltejs/kit'
import { database } from '$lib/server/database'

export async function POST(event: RequestEvent) {
	const user = await database.user.findUnique({
		where: {
			id: event.locals.initData.user.id
		},
		select: {
			username: true,
			bulbs: true,
			keys: true,
			level: true,
			xp: true,
			lastTimeScanned: true,
			profilePhoto: true
		}
	})

	return json(user)
}
