import { sineIn } from 'svelte/easing'

export function flyIntoInventory(node: HTMLElement, params?: { delay?: number; duration?: number }) {
	const rotation = Math.random() * 22.5
	const right = parseInt(getComputedStyle(node).right)
	const top = parseInt(getComputedStyle(node).top)

	return {
		delay: params?.delay ?? 0,
		duration: params?.duration ?? 500,
		css: (t: number) => `
			right: ${(right - 64) * sineIn(t) + 64}px;
			top: ${(top + 0) * t - 0}px;
			opacity: ${t};
			scale: ${0.75 * t + 0.25};
			rotate: ${-rotation * t + rotation}deg;
		`
	}
}
