import { money } from './automaton-definition.js';

export function renderHistory(snapshot) {
  if (!snapshot.history.length) return '<p class="empty-history">Nenhuma transição executada.</p>';
  return `<ol class="history-list">${snapshot.history.map(({ step, from, input, to }) => `<li><span>${String(step).padStart(2, '0')}</span><code>${from}</code><b>${input}¢</b><code>${to}</code></li>`).join('')}</ol>`;
}

export function resultText(snapshot) {
  if (!snapshot.accepted) return `Crédito atual: ${money(snapshot.credit)}. Faltam ${money(Math.max(0, 30 - snapshot.credit))}.`;
  return `Aceita — Fagulha Fizz liberada. Troco: ${money(snapshot.change)}.`;
}
