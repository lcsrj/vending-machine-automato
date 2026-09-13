import { readFile } from 'node:fs/promises';
import { automaton } from '../src/automaton-definition.js';

const xml = await readFile('docs/jflap/vending-machine.jff', 'utf8');
const stateMatches = [...xml.matchAll(/<state id="(\d+)" name="([^"]+)">([\s\S]*?)<\/state>/g)];
const transitions = [...xml.matchAll(/<transition><from>(\d+)<\/from><to>(\d+)<\/to><read>(\d+)<\/read><\/transition>/g)];
const stateById = new Map(stateMatches.map(([, id, name]) => [id, name]));
const expectedTransitions = Object.entries(automaton.transitions).flatMap(([from, row]) => Object.entries(row).map(([read, to]) => `${from}|${to}|${read}`));
const actualTransitions = transitions.map(([, from, to, read]) => `${stateById.get(from)}|${stateById.get(to)}|${read}`);
const initial = stateMatches.filter((m) => m[3].includes('<initial/>')).map((m) => m[2]);
const finals = stateMatches.filter((m) => m[3].includes('<final/>')).map((m) => m[2]);
const valid = xml.includes('<type>fa</type>') &&
  stateMatches.length === automaton.states.length &&
  automaton.states.every((state) => stateByIdHas(stateById, state)) &&
  initial.length === 1 && initial[0] === automaton.initialState &&
  finals.length === automaton.finalStates.length && automaton.finalStates.every((state) => finals.includes(state)) &&
  actualTransitions.length === expectedTransitions.length && expectedTransitions.every((t) => actualTransitions.includes(t));
function stateByIdHas(map, value) { return [...map.values()].includes(value); }
if (!valid) throw new Error('O arquivo JFLAP diverge da definição central do autômato.');
console.log(`JFLAP válido: ${stateMatches.length} estados, ${transitions.length} transições.`);

