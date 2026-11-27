import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { HEADER, order, REGIONS, rooted } from './lists.mjs';

const ROOT = rooted(import.meta.url, process.argv.slice(2)).root;
const lines = path => readFileSync(path, 'utf8').split('\n').filter(Boolean);

const everywhere = new Set();
const regional = new Map();
for (const id of readdirSync(join(ROOT, 'dictionaries'))) {
	const folder = join(ROOT, 'dictionaries', id);
	for (const entry of lines(join(folder, 'words.txt'))) everywhere.add(entry);
	if (!existsSync(join(folder, 'regional.csv'))) continue;
	for (const row of lines(join(folder, 'regional.csv')).slice(1)) {
		const [entry, regions] = row.split(',');
		const held = regional.get(entry) ?? new Set();
		for (const region of regions.split(' ')) held.add(region);
		regional.set(entry, held);
	}
}
for (const [entry, regions] of regional) {
	if (regions.size === REGIONS.length) everywhere.add(entry);
	if (regions.size === REGIONS.length || everywhere.has(entry)) regional.delete(entry);
}

const words = [...everywhere].sort(order);
const rows = [...regional.keys()]
	.sort(order)
	.map(entry => `${entry},${REGIONS.filter(region => regional.get(entry).has(region)).join(' ')}`);
writeFileSync(join(ROOT, 'words.txt'), words.join('\n') + '\n');
writeFileSync(join(ROOT, 'regional.csv'), [HEADER, ...rows].join('\n') + '\n');
console.log(`words.txt: ${words.length.toLocaleString('en-US')} entries; regional.csv: ${rows.length} entries`);
