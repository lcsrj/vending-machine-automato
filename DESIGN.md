# Design — Vending Machine AFD

## Intenção

Uma máquina de refrigerantes de fliperama dos anos 1980: chapa pintada, cromados, luz quente e uma vitrine que deixa os produtos visíveis. O público são estudantes de Linguagens Formais e Autômatos, e a única tarefa da tela é tornar uma transição formal legível enquanto ela acontece.

## Tokens normativos

| Token | Valor | Uso |
|---|---:|---|
| `--ink` | `#24150e` | fundo espresso |
| `--panel` | `#9e321c` | chapa esmaltada da máquina |
| `--paper` | `#fff2d1` | letreiros e áreas de leitura |
| `--mint` | `#77d7a8` | estado atual e aceitação |
| `--amber` | `#f7b733` | moedas, botões e transição ativa |
| `--coral` | `#e85d3f` | atenção e estados finais |

Tipografia: `Bungee` para os letreiros retrô, `Space Grotesk` para interface e `IBM Plex Mono` para estados e função δ. Os valores são implementados apenas em `css/variables.css`, consumidos por `layout.css` e `components.css`.

## Assinatura

A vitrine de quatro garrafas fictícias é a assinatura: Fagulha Fizz (30¢), Nébula Nox (35¢), Solaris Splash (40¢) e Violeta Volt (45¢). Cada garrafa é reconhecível pela silhueta, rótulo, tampa e líquido da paleta; ela é um botão de seleção, não um cartão decorativo. Ao alcançar a rota de crédito indicada, a garrafa selecionada cai na área de retirada. O verde fica reservado a aceitação e estado atual; rótulos e textos de apoio usam creme ou âmbar. Todos os textos, arestas, estados e superfícies usam a mesma paleta de espresso, cereja, creme, âmbar, menta e uva.

## Acessibilidade

Contraste AA, controles nativos, foco bem visível, regiões de status ao vivo e remoção de animações não essenciais em `prefers-reduced-motion`.
