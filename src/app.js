import { automaton, money } from './automaton-definition.js';
import { AutomatonError, createMachine, parseSequence } from './automaton-engine.js';
import { graphMarkup } from './graph.js';
import { renderHistory } from './history.js';
import { canRelease, productById, productChange } from './products.js';

const machine = createMachine();
const $ = (selector) => document.querySelector(selector);
const ui = {
  machine: $('#machine'), machineTitle: $('#machine-title'), credit: $('#credit'), balance: $('#balance'), balanceLabel: $('#balance-label'), headerState: $('#header-state'), headerStatus: $('#header-status'),
  status: $('#status-message'), delta: $('#delta-readout'), graph: $('#graph-output'), history: $('#history-output'), undo: $('#undo-button'), reset: $('#reset-button'),
  coins: [...document.querySelectorAll('[data-coin]')], form: $('#sequence-form'), input: $('#sequence-input'), stepMode: $('#step-mode-button'), previous: $('#previous-step'), next: $('#next-step'), stepStatus: $('#step-status'),
  academic: $('#academic-panel'), academicToggle: $('#academic-toggle'), details: $('#formal-details'), table: $('#transition-table-body'),
  products: [...document.querySelectorAll('[data-product]')], releaseBottle: $('#release-bottle'), releaseName: $('#release-name')
};
let stepSequence = [];
let stepIndex = 0;
let selectedProduct = productById('fagulha');

function deltaFor(snapshot) {
  const t = snapshot.lastTransition;
  return t ? `δ(${t.from}, ${t.input}) = ${t.to}` : `δ(${snapshot.state}, —) = ${snapshot.state}`;
}
function selectedMessage(snapshot) {
  if (!snapshot.accepted) return `Crédito atual: ${money(snapshot.credit)}. Faltam ${money(Math.max(0, selectedProduct.price - snapshot.credit))} para ${selectedProduct.name}.`;
  if (!canRelease(selectedProduct, snapshot)) return `${selectedProduct.name} custa ${money(selectedProduct.price)}. O AFD parou em ${snapshot.state}; inicie uma nova compra e use a rota sugerida.`;
  return `${selectedProduct.name} liberada · Inserido: ${money(snapshot.credit)} · Troco: ${money(productChange(selectedProduct, snapshot.credit))}.`;
}
function routeText(product) { return product.route.map((coin) => `${coin}¢`).join(' + '); }
function update(snapshot = machine.snapshot(), message = selectedMessage(snapshot), error = false) {
  const released = canRelease(selectedProduct, snapshot);
  ui.credit.textContent = money(snapshot.credit);
  ui.balanceLabel.textContent = released ? 'troco' : 'faltam';
  ui.balance.textContent = money(released ? productChange(selectedProduct, snapshot.credit) : Math.max(0, selectedProduct.price - snapshot.credit));
  ui.machineTitle.textContent = `${selectedProduct.name} · ${money(selectedProduct.price)}`;
  ui.headerState.textContent = snapshot.state;
  ui.headerStatus.textContent = snapshot.accepted ? 'aceita' : 'não aceita';
  ui.headerStatus.style.color = snapshot.accepted ? 'var(--mint)' : 'var(--muted)';
  ui.delta.textContent = deltaFor(snapshot);
  ui.graph.innerHTML = graphMarkup(snapshot);
  ui.history.innerHTML = renderHistory(snapshot);
  ui.undo.disabled = !snapshot.history.length;
  ui.coins.forEach((button) => { button.disabled = snapshot.accepted; });
  ui.machine.classList.toggle('is-vended', released);
  ui.products.forEach((button) => {
    const chosen = button.dataset.product === selectedProduct.id;
    button.classList.toggle('is-selected', chosen);
    button.setAttribute('aria-pressed', String(chosen));
  });
  ui.releaseBottle.className = `release-bottle ${selectedProduct.className}`;
  ui.releaseName.innerHTML = selectedProduct.name.toUpperCase().replace(' ', '<br>');
  ui.status.textContent = message;
  ui.status.classList.toggle('is-error', error);
  ui.status.classList.toggle('is-success', snapshot.accepted && !error);
  renderAcademic(snapshot);
}
function insert(coin, announce = true) {
  try { const snapshot = machine.insert(coin); update(snapshot, snapshot.accepted ? selectedMessage(snapshot) : announce ? `${deltaFor(snapshot)} · crédito atualizado.` : selectedMessage(snapshot)); return snapshot; }
  catch (error) { update(machine.snapshot(), error.message, true); return null; }
}
function renderAcademic(snapshot) {
  ui.details.innerHTML = `<div><dt>Q</dt><dd>{ ${automaton.states.join(', ')} }</dd></div><div><dt>Σ</dt><dd>{ ${automaton.alphabet.join(', ')} }</dd></div><div><dt>q0</dt><dd>${automaton.initialState}</dd></div><div><dt>F</dt><dd>{ ${automaton.finalStates.join(', ')} }</dd></div><div><dt>Estado</dt><dd>${snapshot.state}</dd></div><div><dt>Função</dt><dd>${deltaFor(snapshot)}</dd></div><div><dt>Aceitação</dt><dd>${snapshot.accepted ? 'SIM' : 'NÃO'}</dd></div>`;
  ui.table.innerHTML = Object.entries(automaton.transitions).map(([state, row]) => `<tr class="${state === snapshot.state ? 'current-row' : ''}"><td>${state}</td>${automaton.alphabet.map((coin) => `<td>${row[coin]}</td>`).join('')}</tr>`).join('');
}
function reset(message = 'Nova compra iniciada. Estado restaurado para q0.') { machine.reset(); stepSequence = []; stepIndex = 0; update(machine.snapshot(), message); updateStepControls(); }
function selectProduct(id) {
  selectedProduct = productById(id);
  const snapshot = machine.snapshot();
  const message = canRelease(selectedProduct, snapshot)
    ? `${selectedProduct.name} liberada · Troco: ${money(productChange(selectedProduct, snapshot.credit))}.`
    : snapshot.accepted
      ? `${selectedProduct.name} custa ${money(selectedProduct.price)}. O crédito final é ${money(snapshot.credit)}; use Nova compra e a rota ${routeText(selectedProduct)}.`
      : `${selectedProduct.name} selecionada · ${money(selectedProduct.price)} · rota sugerida: ${routeText(selectedProduct)}.`;
  update(snapshot, message);
}
function updateStepControls() {
  const hasSequence = stepSequence.length > 0;
  ui.previous.disabled = !hasSequence || stepIndex === 0;
  ui.next.disabled = !hasSequence || stepIndex >= stepSequence.length;
  if (!hasSequence) ui.stepStatus.textContent = 'Carregue uma sequência para iniciar a execução guiada.';
  else if (stepIndex === stepSequence.length) { const current = machine.snapshot(); ui.stepStatus.textContent = `Fim · ${current.accepted ? `ACEITA em ${current.state}; troco ${money(current.change)}.` : `REJEITA em ${current.state}.`}`; }
  else ui.stepStatus.textContent = `Passo ${stepIndex + 1}/${stepSequence.length} · próxima moeda: ${stepSequence[stepIndex]}¢`;
}
function setStepSequence(sequence) { stepSequence = sequence; stepIndex = 0; machine.reset(); update(machine.snapshot(), `Sequência carregada: ${sequence.join(', ')}.`); updateStepControls(); }
function goNext() { if (stepIndex >= stepSequence.length) return; const snapshot = insert(stepSequence[stepIndex], false); if (snapshot) stepIndex += 1; updateStepControls(); }
function goPrevious() { if (stepIndex <= 0) return; stepIndex -= 1; machine.reset(); for (const coin of stepSequence.slice(0, stepIndex)) machine.insert(coin); update(machine.snapshot(), `Passo ${stepIndex}/${stepSequence.length} restaurado.`); updateStepControls(); }

ui.coins.forEach((button) => button.addEventListener('click', () => insert(Number(button.dataset.coin))));
ui.products.forEach((button) => button.addEventListener('click', () => selectProduct(button.dataset.product)));
ui.undo.addEventListener('click', () => update(machine.undo(), 'Última moeda removida.'));
ui.reset.addEventListener('click', () => reset());
ui.form.addEventListener('submit', (event) => { event.preventDefault(); try { const sequence = parseSequence(ui.input.value); if (!sequence.length) throw new AutomatonError('Informe ao menos uma moeda.'); reset('Executando sequência completa.'); for (const coin of sequence) { if (machine.snapshot().accepted) throw new AutomatonError('A sequência adiciona moeda depois da aceitação.'); machine.insert(coin); } update(machine.snapshot(), `Sequência ${machine.snapshot().accepted ? 'ACEITA' : 'REJEITADA'} · estado ${machine.snapshot().state}.`); } catch (error) { update(machine.snapshot(), error.message, true); } });
ui.stepMode.addEventListener('click', () => { try { const sequence = parseSequence(ui.input.value); if (!sequence.length) throw new AutomatonError('Informe uma sequência antes de iniciar o passo a passo.'); setStepSequence(sequence); } catch (error) { update(machine.snapshot(), error.message, true); } });
document.querySelectorAll('[data-sequence]').forEach((button) => button.addEventListener('click', () => { ui.input.value = button.dataset.sequence; setStepSequence(parseSequence(button.dataset.sequence)); }));
ui.next.addEventListener('click', goNext); ui.previous.addEventListener('click', goPrevious);
ui.academicToggle.addEventListener('click', () => { const opening = ui.academic.hidden; ui.academic.hidden = !opening; ui.academicToggle.setAttribute('aria-expanded', String(opening)); ui.academicToggle.textContent = opening ? 'Fechar Modo Acadêmico' : 'Abrir Modo Acadêmico'; });
update();
// URL opcional para demonstrar um caso reprodutível, por exemplo ?demo=25,10.
const demoSequence = new URLSearchParams(window.location.search).get('demo');
if (demoSequence) {
  try {
    const coins = parseSequence(demoSequence);
    for (const coin of coins) {
      if (machine.snapshot().accepted) break;
      machine.insert(coin);
    }
    update(machine.snapshot(), `Demonstração carregada · ${machine.snapshot().accepted ? 'SEQUÊNCIA ACEITA' : 'SEQUÊNCIA REJEITADA'}.`);
  } catch (error) {
    update(machine.snapshot(), `Demonstração inválida: ${error.message}`, true);
  }
}
