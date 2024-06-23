const { floor, random, round } = Math;

declare global {
	interface Math {
		
		/** @deprecated */
		randomInt(from: number, to: number): number;
		
		/** @deprecated */
		round1(n: number): number;
		
		/** @deprecated */
		round2(n: number): number;
		
		/** @deprecated */
		round3(n: number): number;
	}
}

Math.randomInt = (from, to) => floor(random() * (to - from + 1) + from);

Math.round1 = n => round((n + .0001) * 10) / 10;

Math.round2 = n => round((n + .0001) * 100) / 100;

Math.round3 = n => round((n + .0001) * 1000) / 1000;
