import { json, type RequestEvent } from '@sveltejs/kit'
import { database } from '$lib/server/database'
import { usernameSchema } from '$lib/shared/zodSchemas'

const dailyBonusBulbs = 33

export async function POST(event: RequestEvent) {
	const lastTimeCollected = event.locals.user.lastDailyBonus
	const currentDate = new Date()
	const nextAvailableTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 3, 0, 0)

	if (lastTimeCollected && lastTimeCollected >= nextAvailableTime) {
		nextAvailableTime.setUTCDate(nextAvailableTime.getUTCDate() + 1)
	}

	const msUntilNextBonus = nextAvailableTime.getTime() - currentDate.getTime()

	if (msUntilNextBonus <= 0) {
		await database.user.update({
			where: {
				id: event.locals.user.id
			},
			data: {
				bulbs: {
					increment: dailyBonusBulbs
				},
				lastDailyBonus: new Date()
			}
		})

		return json(
			{
				collected: true,
				_updates: {
					bulbs: event.locals.user.bulbs + dailyBonusBulbs
				}
			},
			{
				status: 200
			}
		)
	} else {
		return json(
			{
				collected: false,
				nextAvailableBonus: msUntilNextBonus
			},
			{
				status: 200
			}
		)
	}
}
