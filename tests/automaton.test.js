import test from 'node:test';
import assert from 'node:assert/strict';
import { automaton } from '../src/automaton-definition.js';
import { AutomatonError, changeFor, createMachine, isFinal, parseSequence, simulate, transition } from '../src/automaton-engine.js';
import { canRelease, productById, productChange, products } from '../src/products.js';

test('a definição tem os estados e finais exigidos', () => {
  assert.equal(automaton.initialState, 'q0');
  assert.deepEqual(automaton.finalStates, ['q30', 'q35', 'q40', 'q45', 'q50']);
  assert.deepEqual(automaton.alphabet, [5, 10, 25]);
});
test('a tabela de transições é exatamente a especificação da atividade', () => {
  assert.deepEqual(automaton.transitions, {
    q0: { 5: 'q5', 10: 'q10', 25: 'q25' }, q5: { 5: 'q10', 10: 'q15', 25: 'q30' },
    q10: { 5: 'q15', 10: 'q20', 25: 'q35' }, q15: { 5: 'q20', 10: 'q25', 25: 'q40' },
    q20: { 5: 'q25', 10: 'q30', 25: 'q45' }, q25: { 5: 'q30', 10: 'q35', 25: 'q50' }
  });
});
test('todas as transições oficiais são determinísticas e corretas', () => {
  assert.equal(transition('q0', 5), 'q5'); assert.equal(transition('q0', 10), 'q10'); assert.equal(transition('q0', 25), 'q25');
  assert.equal(transition('q5', 25), 'q30'); assert.equal(transition('q10', 25), 'q35');
  assert.equal(transition('q15', 25), 'q40'); assert.equal(transition('q20', 25), 'q45'); assert.equal(transition('q25', 25), 'q50');
});
for (const [sequence, expected] of [
  [[5], false], [[10], false], [[25], false], [[5,5], false], [[10,10], false],
  [[5,25], true], [[25,5], true], [[10,10,10], true], [[25,10], true], [[10,25], true]
]) test(`${sequence.join(', ')} ${expected ? 'aceita' : 'rejeita'}`, () => assert.equal(simulate(sequence).accepted, expected));
test('sequências aceitas chegam aos estados corretos', () => {
  assert.equal(simulate([5,25]).state, 'q30'); assert.equal(simulate([25,5]).state, 'q30');
  assert.equal(simulate([25,10]).state, 'q35'); assert.equal(simulate([10,25]).state, 'q35');
});
test('entrada inválida é rejeitada', () => {
  assert.throws(() => parseSequence('15'), AutomatonError); assert.throws(() => transition('q0', 15), AutomatonError);
});
test('cálculo de troco é correto', () => {
  assert.equal(changeFor('q30'), 0); assert.equal(changeFor('q35'), 5); assert.equal(changeFor('q40'), 10); assert.equal(changeFor('q45'), 15); assert.equal(changeFor('q50'), 20);
});
test('estados finais são detectados e bloqueiam moedas novas', () => {
  assert.equal(isFinal('q25'), false); assert.equal(isFinal('q30'), true);
  const machine = createMachine(); machine.insert(25); machine.insert(5);
  assert.throws(() => machine.insert(5), AutomatonError);
});
test('undo restaura estado, crédito e histórico', () => {
  const machine = createMachine(); machine.insert(10); machine.insert(5); const snapshot = machine.undo();
  assert.equal(snapshot.state, 'q10'); assert.equal(snapshot.credit, 10); assert.equal(snapshot.history.length, 1);
});
test('reset restaura a configuração inicial', () => {
  const machine = createMachine(); machine.insert(25); machine.insert(10); const snapshot = machine.reset();
  assert.equal(snapshot.state, 'q0'); assert.equal(snapshot.credit, 0); assert.equal(snapshot.history.length, 0); assert.equal(snapshot.accepted, false);
});
test('catálogo mantém preços e rotas alcançáveis pelo AFD', () => {
  assert.deepEqual(products.map(({ name, price }) => [name, price]), [
    ['Fagulha Fizz', 30], ['Nébula Nox', 35], ['Solaris Splash', 40], ['Violeta Volt', 45]
  ]);
  for (const product of products) {
    const snapshot = simulate(product.route);
    assert.equal(snapshot.credit, product.price);
    assert.equal(canRelease(product, snapshot), true);
    assert.equal(productChange(product, snapshot.credit), 0);
  }
});
test('produto selecionado calcula troco pelo preço da garrafa', () => {
  const nebula = productById('nebula');
  const snapshot = simulate([10, 10, 25]);
  assert.equal(snapshot.state, 'q45');
  assert.equal(canRelease(nebula, snapshot), true);
  assert.equal(productChange(nebula, snapshot.credit), 10);
});
