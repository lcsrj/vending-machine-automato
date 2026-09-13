# Design — Vending Machine AFD

## Intenção

Uma máquina de refrigerantes de fliperama dos anos 1980: chapa pintada, cromados, luz quente e uma vitrine que deixa os produtos visíveis. O público são estudantes de Linguagens Formais e Autômatos, e a única tarefa da tela é tornar uma transição formal legível enquanto ela acontece.

## Tokens normativos

| Token | Valor | Uso |
|---|---:|---|
| `--ink` | `#24150e` | fundo espresso |
| `--panel` | `#9e321c` | chapa esmaltada da máquina |
| `--paper` | `#fff2d1` | letreiros e áreas de leitura |
| `--mint` | `#77d7a8` | estado atual, ação segura |
| `--amber` | `#f7b733` | moedas e transição ativa |
| `--coral` | `#e85d3f` | atenção e estados finais |

Tipografia: `Bungee` para os letreiros retrô, `Space Grotesk` para interface e `IBM Plex Mono` para estados e função δ. Os valores são implementados apenas em `css/variables.css`, consumidos por `layout.css` e `components.css`.

## Assinatura

A vitrine de quatro refrigerantes fictícios é a assinatura: Fagulha Fizz, Nébula Nox, Solaris Splash e Violeta Volt. Fagulha Fizz é liberada ao aceitar. Todos os textos, arestas, estados e superfícies usam a mesma paleta de espresso, cereja, creme, âmbar, menta e uva.

## Acessibilidade

Contraste AA, controles nativos, foco bem visível, regiões de status ao vivo e remoção de animações não essenciais em `prefers-reduced-motion`.
