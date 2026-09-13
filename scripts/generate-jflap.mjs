import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { automaton } from '../src/automaton-definition.js';

const output = resolve('docs/jflap/vending-machine.jff');
const coordinates = {
  q0:[50,250], q5:[105,165], q10:[160,250], q15:[215,165], q20:[270,250], q25:[325,165],
  q30:[380,250], q35:[440,145], q40:[440,270], q45:[500,250], q50:[500,145]
};
const escapeXml = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&apos;' })[c]);

const states = automaton.states.map((name, id) => {
  const [x, y] = coordinates[name];
  return `    <state id="${id}" name="${escapeXml(name)}"><x>${x}</x><y>${y}</y>${name === automaton.initialState ? '<initial/>' : ''}${automaton.finalStates.includes(name) ? '<final/>' : ''}</state>`;
}).join('\n');
const ids = Object.fromEntries(automaton.states.map((state, id) => [state, id]));
const transitions = Object.entries(automaton.transitions).flatMap(([from, rows]) => Object.entries(rows).map(([read, to]) =>
  `    <transition><from>${ids[from]}</from><to>${ids[to]}</to><read>${read}</read></transition>`
)).join('\n');
const xml = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<structure>\n  <type>fa</type>\n  <automaton>\n${states}\n${transitions}\n  </automaton>\n</structure>\n`;

await mkdir(dirname(output), { recursive: true });
await writeFile(output, xml, 'utf8');
console.log(`JFLAP gerado: ${output}`);
