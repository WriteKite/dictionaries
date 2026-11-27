import { fileURLToPath } from 'node:url';

export const REGIONS = ['US', 'GB', 'CA', 'AU', 'IN'];
export const HEADER = 'entry,regions';

const points = value => Array.from(value, character => character.codePointAt(0));

function compare(left, right) {
	const [a, b] = [points(left), points(right)];
	for (let index = 0; index < Math.min(a.length, b.length); index += 1) {
		if (a[index] !== b[index]) return a[index] - b[index];
	}
	return a.length - b.length;
}

export const order = (left, right) => compare(left.toLowerCase(), right.toLowerCase()) || compare(left, right);

export function rooted(script, given) {
	const flagged = given[0] === '--root';
	return {
		root: flagged ? given[1] : fileURLToPath(new URL('..', script)),
		rest: flagged ? given.slice(2) : given,
	};
}
