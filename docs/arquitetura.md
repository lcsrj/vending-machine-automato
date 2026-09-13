# Arquitetura

```text
automaton-definition.js
 ├─ automaton-engine.js  → estado, transição, aceitação, troco, undo/reset
 ├─ graph.js             → SVG do AFD e destaque da transição
 ├─ history.js           → histórico legível
 ├─ products.js          → catálogo, rotas e preços das garrafas
 ├─ app.js               → interface e execução de sequência
 ├─ tests/*.test.js      → validação automatizada
 └─ generate-jflap.mjs   → docs/jflap/vending-machine.jff
```

`app.js` mantém uma instância de `createMachine()`. A inserção de moeda consulta `transition()` e registra `{from, input, to}`. Esse mesmo registro alimenta o histórico, o rótulo `δ(q, entrada) = próximo`, a aresta animada e a tabela acadêmica. `undo()` recompõe o estado a partir do último registro preservado; `reset()` volta a `q0`.

O gerador JFLAP lê apenas `automaton-definition.js`, atribui IDs e coordenadas de apresentação e escreve XML no formato de autômato finito do JFLAP. `validate-jflap.mjs` volta a ler o XML e confere estados, inicial, finais e todas as transições contra a fonte central.

## Autores

Lucas Costa e Silva e Benvindo.
