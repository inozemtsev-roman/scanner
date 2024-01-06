import { error, json, type RequestEvent } from '@sveltejs/kit'
import { database } from '$lib/server/database'
import type { Prisma } from '@prisma/client'

export async function POST(event: RequestEvent) {
	const [levelTop, jettonsTop, gemsTop] = await Promise.all([
		getTopByFilter([
			{
				level: 'desc'
			},
			{
				xp: 'desc'
			}
		]),
		getTopByFilter({ jettons: 'desc' }),
		getTopByFilter({ gems: 'desc' })
	])

	return json({
		level: levelTop,
		jettons: jettonsTop,
		gems: gemsTop
	})
}

async function getTopByFilter(orderBy: Prisma.UserFindManyArgs['orderBy']) {
	return await database.user.findMany({
		orderBy,
		take: 20,
		select: {
			username: true,
			level: true,
			xp: true,
			jettons: true,
			gems: true,
			profilePhoto: true
		}
	})
}
