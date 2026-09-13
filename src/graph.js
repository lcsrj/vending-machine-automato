import { automaton } from './automaton-definition.js';

const points = {
  q0:[80,300], q5:[220,100], q10:[220,240], q15:[360,100], q20:[360,240], q25:[500,370],
  q30:[670,65], q35:[670,155], q40:[670,285], q45:[860,210], q50:[860,365]
};

function pathFor(from, to, index) {
  const [x1, y1] = points[from]; const [x2, y2] = points[to];
  const dx = x2 - x1; const dy = y2 - y1;
  const length = Math.hypot(dx, dy); const ux = dx / length; const uy = dy / length;
  const offset = index === 25 ? 18 : index === 10 ? 0 : -18;
  const px = -uy * offset; const py = ux * offset;
  return { d: `M ${x1 + ux * 28 + px} ${y1 + uy * 28 + py} L ${x2 - ux * 31 + px} ${y2 - uy * 31 + py}`, lx: (x1+x2)/2 + px, ly: (y1+y2)/2 + py - 8 };
}

export function graphMarkup(snapshot) {
  const last = snapshot.lastTransition;
  const edges = Object.entries(automaton.transitions).flatMap(([from, row]) => Object.entries(row).map(([coin, to]) => ({ from, to, coin: Number(coin) })));
  return `<svg class="automaton-graph" viewBox="0 0 960 450" role="img" aria-label="Grafo do autômato, estado atual ${snapshot.state}">
    <defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z"/></marker></defs>
    <text class="graph-start" x="10" y="305">início</text><path class="start-arrow" d="M 42 300 L 50 300" marker-end="url(#arrow)"/>
    ${edges.map(({from,to,coin}) => { const p=pathFor(from,to,coin); const active=last?.from===from&&last?.to===to&&last?.input===coin; return `<g class="edge ${active?'is-active':''}"><path d="${p.d}" marker-end="url(#arrow)"/><text x="${p.lx}" y="${p.ly}">${coin}¢</text></g>`; }).join('')}
    ${automaton.states.map((state) => { const [x,y]=points[state]; const final=automaton.finalStates.includes(state); return `<g class="state ${state===snapshot.state?'is-current':''} ${final?'is-final':''}" data-state="${state}"><circle cx="${x}" cy="${y}" r="28"/>${final?`<circle cx="${x}" cy="${y}" r="22"/>`:''}<text x="${x}" y="${y+5}">${state}</text></g>`; }).join('')}
  </svg>`;
}
