/** Fonte única da verdade do AFD da vending machine. Valores em centavos. */
export const automaton = Object.freeze({
  productPrice: 30,
  states: Object.freeze(['q0', 'q5', 'q10', 'q15', 'q20', 'q25', 'q30', 'q35', 'q40', 'q45', 'q50']),
  alphabet: Object.freeze([5, 10, 25]),
  initialState: 'q0',
  finalStates: Object.freeze(['q30', 'q35', 'q40', 'q45', 'q50']),
  stateValues: Object.freeze({
    q0: 0, q5: 5, q10: 10, q15: 15, q20: 20, q25: 25,
    q30: 30, q35: 35, q40: 40, q45: 45, q50: 50
  }),
  transitions: Object.freeze({
    q0: Object.freeze({ 5: 'q5', 10: 'q10', 25: 'q25' }),
    q5: Object.freeze({ 5: 'q10', 10: 'q15', 25: 'q30' }),
    q10: Object.freeze({ 5: 'q15', 10: 'q20', 25: 'q35' }),
    q15: Object.freeze({ 5: 'q20', 10: 'q25', 25: 'q40' }),
    q20: Object.freeze({ 5: 'q25', 10: 'q30', 25: 'q45' }),
    q25: Object.freeze({ 5: 'q30', 10: 'q35', 25: 'q50' })
  })
});

export const money = (cents) => `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;

