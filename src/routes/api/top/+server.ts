import { error, json, type RequestEvent } from '@sveltejs/kit'
import { database } from '$lib/server/database'
import type { Prisma } from '@prisma/client'

export async function POST(event: RequestEvent) {
	const [levelTop, bulbsTop, keysTop] = await Promise.all([
		getTopByFilter([
			{
				level: 'desc'
			},
			{
				xp: 'desc'
			}
		]),
		getTopByFilter({ bulbs: 'desc' }),
		getTopByFilter({ keys: 'desc' })
	])

	return json({
		level: levelTop,
		bulbs: bulbsTop,
		keys: keysTop
	})
}

async function getTopByFilter(orderBy: Prisma.UserFindManyArgs['orderBy']) {
	return await database.user.findMany({
		orderBy,
		take: 1000,
		select: {
			username: true,
			level: true,
			xp: true,
			bulbs: true,
			keys: true,
			profilePhoto: true
		}
	})
}
