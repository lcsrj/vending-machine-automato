# Modelo formal do AFD

## Problema

A máquina aceita moedas de 5¢, 10¢ e 25¢ e libera um produto que custa 30¢. Cada estado registra exatamente o crédito acumulado. Ao atingir 30¢ ou mais, a palavra é aceita e a compra é encerrada.

## Definição

`M = (Q, Σ, δ, q0, F)`

- `Q = {q0, q5, q10, q15, q20, q25, q30, q35, q40, q45, q50}`
- `Σ = {5, 10, 25}`
- estado inicial: `q0`
- `F = {q30, q35, q40, q45, q50}`

## Função de transição δ

| Estado | δ(·, 5) | δ(·, 10) | δ(·, 25) |
|---|---|---|---|
| q0 | q5 | q10 | q25 |
| q5 | q10 | q15 | q30 |
| q10 | q15 | q20 | q35 |
| q15 | q20 | q25 | q40 |
| q20 | q25 | q30 | q45 |
| q25 | q30 | q35 | q50 |

Não há transições a partir dos estados finais porque a compra se encerra quando o produto é liberado e a interface bloqueia novas moedas. Esta é uma decisão operacional deliberada do simulador: não foram adicionados loops artificiais em `F`. Se a disciplina exigir uma função total `δ: Q × Σ → Q`, a variante acadêmica pode acrescentar loops `5,10,25` em cada estado final; ela não é usada aqui porque mudaria o significado de encerramento da venda.

## Exemplos

- `5, 25`: `q0 → q5 → q30`; aceita, troco 0¢.
- `25, 10`: `q0 → q25 → q35`; aceita, troco 5¢.
- `10, 10`: `q0 → q10 → q20`; rejeita, pois `q20 ∉ F`.

## Fonte de verdade e consistência

[`src/automaton-definition.js`](../src/automaton-definition.js) é a única definição do modelo. O motor, o grafo, a tabela do modo acadêmico, os testes e [`scripts/generate-jflap.mjs`](../scripts/generate-jflap.mjs) a importam diretamente. Portanto, o arquivo [`vending-machine.jff`](jflap/vending-machine.jff) não possui tabela de transições escrita manualmente.
