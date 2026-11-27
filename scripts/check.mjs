import { readdirSync, readFileSync } from 'node:fs';
import { join, sep } from 'node:path';
import { HEADER, order, REGIONS, rooted } from './lists.mjs';

const { root, rest: chosen } = rooted(import.meta.url, process.argv.slice(2));
const ROOT = join(root, sep);
const LICENSES = {
	'WriteKite Dictionary License': 'WriteKite Dictionary License',
	'CC BY-SA 4.0': 'Creative Commons Attribution-ShareAlike',
	'CC BY-SA 3.0': 'Creative Commons Attribution-ShareAlike',
};
const FILES = new Set(['words.txt', 'regional.csv', 'dictionary.json', 'LICENSE.txt']);
const IDENTIFIER = /^[a-z0-9][a-z0-9-]{0,63}$/;
const WORD = /^[\p{Alphabetic}\p{N}\p{M}]+(?:['’-][\p{Alphabetic}\p{N}\p{M}]+)*$/u;
const BYTE_ORDER_MARK = '\uFEFF';
const MOST_WORDS = 12;
const MOST_CHARACTERS = 120;
const MOST_REPORTED = 50;

const problems = [];
const report = (path, message) => problems.push(`${path}: ${message}`);
const text = (value, limit) => typeof value === 'string' && value.length > 0 && value.length <= limit;

function entryProblem(entry) {
	if (entry !== entry.normalize('NFC')) return 'write the entry in NFC form';
	if (/\s/u.test(entry.replaceAll(' ', '')) || entry.split(' ').some(word => !word))
		return 'separate words with single spaces';
	const words = entry.split(' ');
	if (words.length > MOST_WORDS) return `a term has at most ${MOST_WORDS} words`;
	if (Array.from(entry).length > MOST_CHARACTERS) return `a term has at most ${MOST_CHARACTERS} characters`;
	const odd = words.find(word => !WORD.test(word));
	if (odd) return `"${odd}" has a character an entry cannot hold`;
	if (!/\p{Alphabetic}/u.test(entry)) return 'an entry needs a letter';
	return undefined;
}

function regionsProblem(entry, regions) {
	if (entry.includes(' ') || entry.includes('-')) return 'only a single word without a hyphen can have regions';
	const listed = regions.split(' ');
	if (listed.some(code => !REGIONS.includes(code))) return `regions are ${REGIONS.join(', ')}, separated by spaces`;
	if (listed.join(' ') !== REGIONS.filter(code => listed.includes(code)).join(' '))
		return `give each region once, in the order ${REGIONS.join(' ')}`;
	if (listed.length === REGIONS.length) return 'a word right in every region goes in words.txt';
	return undefined;
}

function readLines(path) {
	let content;
	try {
		content = new TextDecoder('utf-8', { fatal: true }).decode(readFileSync(path));
	} catch {
		report(path, 'save the file as UTF-8');
		return [];
	}
	if (content.startsWith(BYTE_ORDER_MARK)) report(path, 'save the file without a byte order mark');
	if (content.includes('\r')) report(path, 'end lines with LF, not CRLF');
	if (!content.endsWith('\n')) report(path, 'end the file with a newline');
	const lines = content.replace(BYTE_ORDER_MARK, '').replaceAll('\r', '').split('\n');
	if (lines.at(-1) === '') lines.pop();
	return lines;
}

function checkList(path, rows, first, seen) {
	let previous;
	let reported = 0;
	const flag = (number, message) => {
		reported += 1;
		if (reported <= MOST_REPORTED) report(`${path}:${number}`, message);
	};
	rows.forEach((row, index) => {
		const number = index + first;
		const { entry, problem } = row;
		if (problem) return flag(number, problem);
		const wrong =
			entryProblem(entry) ?? (row.regions === undefined ? undefined : regionsProblem(entry, row.regions));
		if (wrong) flag(number, wrong);
		if (seen.has(entry)) flag(number, `"${entry}" is listed twice in this dictionary`);
		seen.add(entry);
		if (previous !== undefined && order(previous, entry) > 0)
			flag(number, `"${entry}" belongs before "${previous}"; sort ignoring case, then by exact spelling`);
		previous = entry;
	});
	if (reported > MOST_REPORTED) report(path, `${reported - MOST_REPORTED} more problems`);
	return rows.length;
}

function wordRows(lines) {
	return lines.map(line => {
		if (!line) return { problem: 'remove the blank line' };
		if (line.includes('\t') || line.includes(','))
			return { problem: 'one entry per line, nothing else; regional spellings go in regional.csv' };
		return { entry: line };
	});
}

function regionalRows(path, lines) {
	if (lines[0] !== HEADER) report(`${path}:1`, `the first line is "${HEADER}"`);
	return lines.slice(1).map(line => {
		const fields = line.split(',');
		if (!line) return { problem: 'remove the blank line' };
		if (fields.length !== 2 || !fields[1]) return { problem: 'each line is an entry, a comma, then its regions' };
		return { entry: fields[0], regions: fields[1] };
	});
}

function checkAbout(id, path, sections) {
	const raw = readFileSync(path, 'utf8');
	let about;
	try {
		about = JSON.parse(raw);
	} catch (error) {
		report(path, `not valid JSON (${error.message})`);
		return;
	}
	if (!about || typeof about !== 'object' || Array.isArray(about)) {
		report(path, 'write the fields as one JSON object');
		return;
	}
	if (JSON.stringify(about, null, '\t') + '\n' !== raw)
		report(path, 'lay out the JSON with tabs, one field per line, ending in a newline');
	if (about.id !== id) report(path, `"id" must be "${id}", the folder's name`);
	if (!text(about.name, 120)) report(path, '"name" is required, up to 120 characters');
	if (!text(about.description, 400)) report(path, '"description" is required, up to 400 characters');
	if (!text(about.version, 64)) report(path, '"version" is required, up to 64 characters');
	if (!Array.isArray(about.keywords) || !about.keywords.length || !about.keywords.every(word => text(word, 80)))
		report(path, '"keywords" is a list of words and phrases, each up to 80 characters');
	const heading = LICENSES[about.license];
	const named = new RegExp(`(?<![a-z-])${id.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')}(?![a-z-])`, 'i');
	if (!heading) report(path, `"license" is one of ${Object.keys(LICENSES).join(', ')}`);
	else if (!named.test(sections.get(heading) ?? '')) report('LICENSE.md', `name ${id} under "${heading}"`);
	if (!Array.isArray(about.sources) || !about.sources.length) {
		report(path, '"sources" lists at least one source');
		return;
	}
	about.sources.forEach((source, index) => {
		const where = `${path}: source ${index + 1}`;
		for (const field of ['name', 'url', 'license', 'licenseUrl', 'attribution'])
			if (!text(source?.[field], 2000)) problems.push(`${where}: "${field}" is required`);
		if (typeof source?.notice !== 'string' || source.notice.length > 2000)
			problems.push(`${where}: "notice" is required, may be empty, and holds at most 2,000 characters`);
		for (const field of ['url', 'licenseUrl'])
			if (!/^https:\/\//.test(source?.[field] ?? '')) problems.push(`${where}: "${field}" starts with https://`);
	});
}

const sections = new Map(
	readFileSync(join(ROOT, 'LICENSE.md'), 'utf8')
		.split(/^## /m)
		.slice(1)
		.map(section => [section.slice(0, section.indexOf('\n')).trim(), section]),
);
const folders = readdirSync(join(ROOT, 'dictionaries'), { withFileTypes: true });
let entries = 0;
let dictionaries = 0;
for (const folder of folders) {
	const path = join('dictionaries', folder.name);
	if (!folder.isDirectory()) {
		report(path, 'only dictionary folders belong in dictionaries/');
		continue;
	}
	if (chosen.length && !chosen.includes(folder.name)) continue;
	dictionaries += 1;
	if (!IDENTIFIER.test(folder.name)) {
		report(path, 'name the folder in lowercase letters, digits and hyphens');
		continue;
	}
	const files = readdirSync(join(ROOT, path));
	for (const file of files) if (!FILES.has(file)) report(join(path, file), 'not a dictionary file');
	for (const file of ['words.txt', 'dictionary.json']) if (!files.includes(file)) report(join(path, file), 'missing');
	const seen = new Set();
	if (files.includes('words.txt')) {
		const words = join(path, 'words.txt');
		entries += checkList(words, wordRows(readLines(join(ROOT, words))), 1, seen);
	}
	if (files.includes('regional.csv')) {
		const regional = join(path, 'regional.csv');
		entries += checkList(regional, regionalRows(regional, readLines(join(ROOT, regional))), 2, seen);
	}
	if (files.includes('dictionary.json')) checkAbout(folder.name, join(ROOT, path, 'dictionary.json'), sections);
}
for (const problem of problems) console.error(problem.replace(ROOT, ''));
console.log(
	`${dictionaries} dictionaries, ${entries.toLocaleString('en-US')} entries: ${
		problems.length ? `${problems.length} problems` : 'no problems'
	}`,
);
process.exit(problems.length ? 1 : 0);
