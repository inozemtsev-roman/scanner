import cryptoEs from 'crypto-es'

export function random(seed: string) {
	const hash = cryptoEs.SHA256(seed)

	return parseInt(hash.toString(), 16) / 16 ** 64
}
