import { error, json, type RequestEvent } from '@sveltejs/kit'
import { database } from '$lib/server/database'
import type { Prisma } from '@prisma/client'

export async function POST(event: RequestEvent) {
	const [levelTop, jettonsTop, orbsTop] = await Promise.all([
		getTopByFilter([
			{
				level: 'desc'
			},
			{
				xp: 'desc'
			}
		]),
		getTopByFilter({ jettons: 'desc' }),
		getTopByFilter({ orbs: 'desc' })
	])

	return json({
		level: levelTop,
		jettons: jettonsTop,
		orbs: orbsTop
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
			orbs: true,
			profilePhoto: true
		}
	})
}
