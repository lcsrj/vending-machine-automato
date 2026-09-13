import { automaton } from './automaton-definition.js';

export class AutomatonError extends Error {}

export function isFinal(state) {
  return automaton.finalStates.includes(state);
}

export function valueOf(state) {
  if (!(state in automaton.stateValues)) throw new AutomatonError(`Estado desconhecido: ${state}`);
  return automaton.stateValues[state];
}

export function transition(state, input) {
  const coin = Number(input);
  if (!automaton.alphabet.includes(coin)) throw new AutomatonError(`Moeda inválida: ${input}`);
  if (isFinal(state)) throw new AutomatonError(`Compra encerrada em ${state}; inicie uma nova compra.`);
  const next = automaton.transitions[state]?.[coin];
  if (!next) throw new AutomatonError(`Transição indefinida: δ(${state}, ${coin})`);
  return next;
}

export function changeFor(state) {
  return Math.max(0, valueOf(state) - automaton.productPrice);
}

export function makeSnapshot(state, history = [], lastTransition = null) {
  const credit = valueOf(state);
  const accepted = isFinal(state);
  return Object.freeze({ state, credit, change: accepted ? changeFor(state) : 0, accepted, history: Object.freeze([...history]), lastTransition });
}

export function createMachine() {
  let state = automaton.initialState;
  let history = [];
  let lastTransition = null;
  const snapshot = () => makeSnapshot(state, history, lastTransition);
  return {
    snapshot,
    insert(input) {
      const from = state;
      const to = transition(from, input);
      const record = Object.freeze({ step: history.length + 1, from, input: Number(input), to });
      state = to;
      history = [...history, record];
      lastTransition = record;
      return snapshot();
    },
    undo() {
      if (!history.length) return snapshot();
      history = history.slice(0, -1);
      state = history.length ? history.at(-1).to : automaton.initialState;
      lastTransition = history.at(-1) ?? null;
      return snapshot();
    },
    reset() {
      state = automaton.initialState;
      history = [];
      lastTransition = null;
      return snapshot();
    }
  };
}

export function parseSequence(text) {
  if (Array.isArray(text)) return text.map(Number);
  const cleaned = String(text).trim();
  if (!cleaned) return [];
  const tokens = cleaned.split(/[\s,;+]+/).filter(Boolean);
  const sequence = tokens.map(Number);
  if (sequence.some((coin) => !Number.isInteger(coin) || !automaton.alphabet.includes(coin))) {
    throw new AutomatonError('Use apenas moedas de 5, 10 ou 25, separadas por vírgulas.');
  }
  return sequence;
}

export function simulate(sequence) {
  const coins = parseSequence(sequence);
  const machine = createMachine();
  for (const coin of coins) {
    if (machine.snapshot().accepted) throw new AutomatonError('A sequência contém moedas após a compra ser aceita.');
    machine.insert(coin);
  }
  return machine.snapshot();
}

