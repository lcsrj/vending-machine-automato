# Design — Vending Machine AFD

## Intenção

Uma bancada didática de laboratório: a máquina é tátil e física; o autômato é um instrumento técnico que responde em tempo real. O público são estudantes de Linguagens Formais e Autômatos, e a única tarefa da tela é tornar uma transição formal legível enquanto ela acontece.

## Tokens normativos

| Token | Valor | Uso |
|---|---:|---|
| `--ink` | `#081923` | fundo profundo, texto escuro |
| `--panel` | `#102b3a` | superfícies da máquina |
| `--paper` | `#eaf3ee` | texto e áreas de leitura |
| `--mint` | `#66e0b4` | estado atual, ação segura |
| `--amber` | `#ffc857` | moeda, transição ativa |
| `--coral` | `#ff7a6b` | atenção e estados finais |

Tipografia: `Space Grotesk` para interface; `IBM Plex Mono` para estados e função δ. Os valores são implementados apenas em `css/variables.css`, consumidos por `layout.css` e `components.css`.

## Assinatura

O grafo ocupa a lateral inteira como um circuito de estados: ao inserir uma moeda, a aresta e o nó de destino se iluminam no mesmo vocabulário de cor da moeda física.

## Acessibilidade

Contraste AA, controles nativos, foco bem visível, regiões de status ao vivo e remoção de animações não essenciais em `prefers-reduced-motion`.

