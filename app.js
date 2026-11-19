{
const $ = s => document.querySelector(s);
const store = {get(k, d) { try { const v = localStorage.getItem('ch102.' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem('ch102.' + k, JSON.stringify(v)); } catch (e) {} }};
let ans = store.get('ans', {});
const qid = q => QUIZ.indexOf(q);
const labName = L => L.n ? `Lab ${L.n}` : 'Lab skills';

function mastery(n) { const qs = QUIZ.filter(q => q.l === n); const right = qs.filter(q => ans[qid(q)] === q.a).length; return {tot: qs.length, right}; }
function drawBoard() {
  $('#board').innerHTML = LABS.map(L => { const m = mastery(L.n), p = m.tot ? Math.round(m.right / m.tot * 100) : 0;
    return `<a class="tile" href="#lab-${L.n}"><span class="no">${L.n || 'S'}</span><span class="nm">${L.t}</span><span class="meter"><i style="width:${p}%"></i></span><span class="mtxt">${m.right}/${m.tot} quiz right</span></a>`; }).join('');
  const right = QUIZ.filter(q => ans[qid(q)] === q.a).length, done = Object.keys(ans).length;
  $('#stats').textContent = done ? `${right} of ${QUIZ.length} quiz questions right so far (${done} answered).` : `${QUIZ.length} quiz questions, 11 calculation drills, ${CARDS.length} flashcards.`;
}

/* ---------- lab page ---------- */
const tbl = t => `<div class="tbl"><table><thead><tr>${t.h.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${t.r.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>${t.cap ? `<p class="cap">${t.cap}</p>` : ''}`;
function drawLab(n) {
  const L = LABS.find(x => x.n === n) || LABS[1];
  let left = `<h3>Key ideas</h3><ul class="facts">${L.big.map(b => `<li>${b}</li>`).join('')}</ul>`;
  if (L.tables) left += `<h3>Results & reference</h3>` + L.tables.map(tbl).join('');
  if (L.sig) left += `<h3>Sig fig examples</h3>` + tbl({h: ['Number', 'Sig figs'], r: L.sig});
  if (L.proc) left += `<h3>What you did in lab</h3><ol class="proc">${L.proc.map(p => `<li>${p}</li>`).join('')}</ol>`;
  let right = `<h3>Equations</h3><div class="eqs">${L.eq.map(e => `<div class="eq">${e}</div>`).join('')}</div>`;
  if (L.worked) right += `<h3>Worked examples</h3><p class="cap">Try it first, then open.</p>` + L.worked.map(w => `<details class="wk"><summary>${w[0]}</summary><div>${w[1]}</div></details>`).join('');
  if (FROMYOU[L.n]) right += `<div class="box you"><b class="lab">From your own prelabs and postlabs</b><ul class="facts">${FROMYOU[L.n].map(t => `<li>${t}</li>`).join('')}</ul></div>`;
  if (L.traps) right += `<div class="box trap"><b class="lab">Exam traps</b><ul class="facts">${L.traps.map(t => `<li>${t}</li>`).join('')}</ul></div>`;
  if (L.safety) right += `<div class="box safe"><b class="lab">Safety & waste</b><ul class="facts">${L.safety.map(t => `<li>${t}</li>`).join('')}</ul></div>`;
  if (L.policy) right += `<div class="box"><b class="lab">Course rules</b><ul class="facts">${L.policy.map(t => `<li>${t}</li>`).join('')}</ul></div>`;
  const qs = QUIZ.filter(q => q.l === L.n), m = mastery(L.n);
  const prev = LABS[L.n - 1], next = LABS[L.n + 1];
  $('#v-lab').innerHTML = `<div class="labhead"><div><span class="k">${labName(L)}</span><h2>${L.t}</h2><p class="one">${ONE[L.n]}</p></div><div class="sub">${m.right}/${m.tot} quiz right</div></div>
   ${examBox(L.n)}<h3>Study this lab in 3 steps</h3><ol class="steps">${STEPS[L.n].map(s => `<li>${s}</li>`).join('')}</ol>
   <div class="visual" id="vis"></div>
   ${L.purpose ? `<p class="one"><b>Purpose of the lab:</b> ${L.purpose}</p>` : ''}
   <div class="grid2"><div>${left}</div><div>${right}</div></div>
   <h3>Check yourself (${qs.length} questions)</h3><div id="labq"></div>
   <div class="pager">${prev ? `<a class="btn ghost" href="#lab-${prev.n}">← ${labName(prev)}</a>` : '<span></span>'}${next ? `<a class="btn" href="#lab-${next.n}">${labName(next)}: ${next.t} →</a>` : `<a class="btn" href="#formulas">Next: formulas →</a>`}</div>`;
  try { VIS[L.n]($('#vis')); } catch (e) { $('#vis').innerHTML = '<p class="sub">This diagram could not load.</p>'; console.error(e); }
  $('#labq').innerHTML = qs.map((q, i) => qHTML(q, i, 'quiz')).join('');
}
document.addEventListener('click', e => { const b = e.target.closest('#labq button[data-k]'); if (!b || b.disabled) return; answer(b, '#labq'); });

function examBox(n) { const B = BLUEPRINT.filter(b => b.l === n); if (!B.length) return '';
  return `<div class="box exam"><b class="lab">On the final</b>${B.map(b => `<p style="margin:6px 0 2px"><b>${b.t}</b> · ${b.n} question${b.n > 1 ? 's' : ''}</p><ul class="facts">${b.items.map(i => `<li>${i}</li>`).join('')}</ul>${b.how.length ? `<p style="margin:6px 0 2px"><b>How to answer</b></p><ul class="facts">${b.how.map(i => `<li>${i}</li>`).join('')}</ul>` : ''}`).join('')}
   <div class="row" style="margin-bottom:0"><a class="pill" href="#write" data-wf="${n}">Write-it practice for this lab</a><a class="pill" href="#drills">Calculation drills</a></div></div>`; }
function drawBlueprint() { $('#bpn').textContent = BLUEPRINT.reduce((s, b) => s + b.n, 0); $('#bp').innerHTML = BLUEPRINT.map(b => `<tr><td><b>${b.t}</b></td><td>${b.n}</td><td>${b.items.join('; ')}</td><td><a href="#lab-${b.l}">Study →</a></td></tr>`).join(''); }

/* ---------- write-it practice ---------- */
let wf = 'all';
document.addEventListener('click', e => { const a = e.target.closest('[data-wf]'); if (a) wf = +a.dataset.wf; });
function drawWrite() { const labs = [...new Set(WRITE.map(w => w[0]))].sort((x, y) => x - y);
  $('#wfilter').innerHTML = [['all', 'All'], ...labs.map(n => [n, 'Lab ' + n])].map(([v, t]) => `<button class="pill" data-w="${v}" aria-pressed="${String(wf) === String(v)}">${t}</button>`).join('');
  $('#wlist').innerHTML = WRITE.filter(w => wf === 'all' || w[0] === wf).map((w, i) => `<div class="q"><span class="tag">Lab ${w[0]} · ${LABS[w[0]].t}</span><p class="stem">${w[1]}</p><button class="btn ghost" data-rv>Show answer</button><div class="exp" hidden>${w[2]}</div></div>`).join(''); }
$('#wfilter').addEventListener('click', e => { const b = e.target.closest('[data-w]'); if (!b) return; wf = b.dataset.w === 'all' ? 'all' : +b.dataset.w; drawWrite(); });
$('#wlist').addEventListener('click', e => { const b = e.target.closest('[data-rv]'); if (!b) return; const x = b.nextElementSibling; x.hidden = !x.hidden; b.textContent = x.hidden ? 'Show answer' : 'Hide answer'; });
$('#wall').addEventListener('click', () => document.querySelectorAll('#wlist .exp').forEach(x => { x.hidden = false; x.previousElementSibling.textContent = 'Hide answer'; }));
$('#whide').addEventListener('click', () => document.querySelectorAll('#wlist .exp').forEach(x => { x.hidden = true; x.previousElementSibling.textContent = 'Show answer'; }));

/* ---------- quiz ---------- */
let qf = 'all', missOnly = false;
function qHTML(q, i, mode) { const id = qid(q), pick = mode === 'mock' ? mockAns[i] : ans[id], L = LABS.find(x => x.n === q.l);
  return `<div class="q" data-i="${i}" data-id="${id}"><span class="tag">${labName(L)} · ${L.t}</span><p class="stem">${q.q}</p><div class="opts">${q.o.map((o, k) => { let c = ''; if (pick !== undefined) { if (k === q.a) c = 'right'; else if (k === pick) c = 'wrong'; } return `<button data-k="${k}" class="${c}" ${pick !== undefined ? 'disabled' : ''}>${o}</button>`; }).join('')}</div>${pick !== undefined ? `<div class="exp"><b>${pick === q.a ? 'Right.' : 'Not quite.'}</b> ${q.e}</div>` : ''}</div>`; }
function answer(b, scope) { const box = b.closest('.q'), id = +box.dataset.id; ans[id] = +b.dataset.k; store.set('ans', ans); box.outerHTML = qHTML(QUIZ[id], +box.dataset.i, 'quiz'); drawBoard(); if (scope === '#qlist') qscore(); }
function qscore() { const qs = QUIZ.filter(x => qf === 'all' || x.l === +qf), d = qs.filter(x => ans[qid(x)] !== undefined); $('#qscore').textContent = d.length ? `${d.filter(x => ans[qid(x)] === x.a).length} / ${d.length} right` : ''; }
function drawQuiz() {
  $('#qfilter').innerHTML = [['all', 'All labs'], ...LABS.map(L => [L.n, L.n ? 'Lab ' + L.n : 'Skills'])].map(([v, t]) => `<button class="pill" data-f="${v}" aria-pressed="${String(qf) === String(v)}">${t}</button>`).join('');
  let qs = QUIZ.filter(q => qf === 'all' || q.l === +qf); if (missOnly) qs = qs.filter(q => ans[qid(q)] !== undefined && ans[qid(q)] !== q.a);
  $('#qlist').innerHTML = qs.length ? qs.map((q, i) => qHTML(q, i, 'quiz')).join('') : `<p class="sub">${missOnly ? 'Nothing missed here yet.' : 'No questions.'}</p>`; qscore(); }
$('#qfilter').addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (!b) return; qf = b.dataset.f === 'all' ? 'all' : +b.dataset.f; drawQuiz(); });
$('#missOnly').addEventListener('click', e => { missOnly = !missOnly; e.currentTarget.setAttribute('aria-pressed', missOnly); drawQuiz(); });
$('#qreset').addEventListener('click', () => { ans = {}; store.set('ans', ans); drawQuiz(); drawBoard(); });
$('#qlist').addEventListener('click', e => { const b = e.target.closest('button[data-k]'); if (!b || b.disabled) return; answer(b, '#qlist'); });

/* ---------- mock ---------- */
let mock = [], mockAns = {};
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function newMock() { const by = {}; QUIZ.forEach(q => (by[q.l] = by[q.l] || []).push(q)); let p = []; Object.values(by).forEach(a => p.push(...shuffle(a).slice(0, 2)));
  p = shuffle(p.concat(shuffle(QUIZ.filter(q => !p.includes(q))).slice(0, 30 - p.length))); mock = p; mockAns = {}; drawMock(); }
function mscore() { const n = Object.keys(mockAns).length, r = mock.filter((q, i) => mockAns[i] === q.a).length; $('#mscore').textContent = !n ? '' : n === mock.length ? `Final: ${r} / ${mock.length} (${Math.round(r / mock.length * 100)}%)` : `${r} / ${n} so far`; }
function drawMock() { $('#mlist').innerHTML = mock.map((q, i) => `<div style="font-weight:800;margin-top:18px">Question ${i + 1}</div>` + qHTML(q, i, 'mock')).join(''); mscore(); }
$('#mockGo').addEventListener('click', newMock);
$('#mlist').addEventListener('click', e => { const b = e.target.closest('button[data-k]'); if (!b || b.disabled) return; const box = b.closest('.q'), i = +box.dataset.i; mockAns[i] = +b.dataset.k; box.outerHTML = qHTML(mock[i], i, 'mock'); mscore(); });
/* ---------- drills ---------- */
const R=(a,b,d=2)=>+(a+Math.random()*(b-a)).toFixed(d);
const pick=a=>a[Math.floor(Math.random()*a.length)];
const f3=x=>{const v=Number(x.toPrecision(4));return Math.abs(v)>=1e4||(Math.abs(v)<1e-3&&v!==0)?v.toExponential(3).replace('e','×10^'):String(v)};
const DRILLS=[
 {id:'tit',t:'Lab 9 · Vinegar titration',gen(){const M=R(.48,.52,4),V=7.00,vb=R(10.5,12.8,2),m=R(6.98,7.10,3);const mm=M*vb;const asks=[['molarity of acetic acid (M)',mm/V,`${M} × ${vb} = ${f3(mm)} mmol ÷ 7.00 mL = <b>${f3(mm/V)} M</b>`],['mass percent acetic acid (%)',mm/1000*60.05/m*100,`${M} × ${vb} = ${f3(mm)} mmol = ${f3(mm/1000)} mol × 60.05 g/mol = ${f3(mm/1000*60.05)} g ÷ ${m} g × 100 = <b>${f3(mm/1000*60.05/m*100)}%</b>`]];const a=pick(asks);
   return {p:`7.00 mL of vinegar (mass ${m} g) needs ${vb} mL of ${M} M NaOH to reach a faint pink endpoint. Find the ${a[0]}.`,v:a[1],s:a[2]}}},
 {id:'abs',t:'Lab 2 · Absorbance and transmittance',gen(){if(Math.random()<.5){const T=R(.05,.9,2);return {p:`A sample transmits ${Math.round(T*100)}% of the light (T = ${T}). What is its absorbance?`,v:-Math.log10(T),s:`A = −log(${T}) = <b>${f3(-Math.log10(T))}</b>`}}const A=R(.1,1.2,2);return {p:`Absorbance is ${A}. What fraction of light is transmitted (T, as a decimal)?`,v:10**-A,s:`T = 10<sup>−${A}</sup> = <b>${f3(10**-A)}</b>`}}},
 {id:'phot',t:'Lab 2 · Photon energy',gen(){const l=Math.round(R(400,700,0));return {p:`What is the energy (J) of one photon of ${l} nm light? (h = 6.626 × 10⁻³⁴ J·s, c = 3.0 × 10⁸ m/s). Type it like 4.2e-19.`,v:6.626e-34*3e8/(l*1e-9),s:`E = hc/λ = (6.626×10⁻³⁴)(3.0×10⁸)/(${l}×10⁻⁹) = <b>${f3(6.626e-34*3e8/(l*1e-9))} J</b>`}}},
 {id:'boyle',t:'Lab 7 · Boyle\'s law',gen(){const P1=Math.round(R(740,770,0)),V1=pick([4,9,14,24]),V2=pick([14,19,24,34,44].filter(v=>v!==V1));return {p:`A trapped gas is at ${P1} torr and ${V1} mL. The syringe is pulled to ${V2} mL at constant temperature. New pressure (torr)?`,v:P1*V1/V2,s:`P₂ = P₁V₁/V₂ = ${P1} × ${V1} / ${V2} = <b>${f3(P1*V1/V2)} torr</b>`}}},
 {id:'ph',t:'Lab 10 · Strong acid / base pH',gen(){const c=pick([0.010,0.0010,0.00010,0.050,0.0025,0.020]);if(Math.random()<.5)return {p:`pH of ${c} M HCl?`,v:-Math.log10(c),s:`pH = −log(${c}) = <b>${f3(-Math.log10(c))}</b>`};return {p:`pH of ${c} M NaOH?`,v:14+Math.log10(c),s:`pOH = −log(${c}) = ${f3(-Math.log10(c))}; pH = 14 − pOH = <b>${f3(14+Math.log10(c))}</b>`}}},
 {id:'mix',t:'Lab 10 · HCl + NaOH mixture',gen(){const vb=pick([2,3,4,6,8,12,14,15]);const na=1e-4,nb=0.010*vb/1000,V=(10+vb)/1000;let v,s;if(na>nb){v=-Math.log10((na-nb)/V);s=`HCl 1.0×10⁻⁴ mol − NaOH ${f3(nb)} mol = ${f3(na-nb)} mol H₃O⁺ in ${(10+vb).toFixed(1)} mL → ${f3((na-nb)/V)} M → pH = <b>${f3(v)}</b>`}else{v=14+Math.log10((nb-na)/V);s=`NaOH ${f3(nb)} mol − HCl 1.0×10⁻⁴ mol = ${f3(nb-na)} mol OH⁻ in ${(10+vb).toFixed(1)} mL → ${f3((nb-na)/V)} M → pOH ${f3(-Math.log10((nb-na)/V))} → pH = <b>${f3(v)}</b>`}
   return {p:`10.0 mL of 0.010 M HCl plus ${vb.toFixed(1)} mL of 0.010 M NaOH. pH of the mixture?`,v,s}}},
 {id:'cell',t:'Lab 11 · Cell potentials',gen(){const E={'Zn²⁺/Zn':-0.76,'Pb²⁺/Pb':-0.13,'Ag⁺/Ag':0.80,'Mg²⁺/Mg':-2.37};const k=pick(Object.keys(E));if(Math.random()<.5){const m=+(E[k]-0.34).toFixed(2);return {p:`${k} reads ${m>0?'+':''}${m.toFixed(2)} V measured against Cu²⁺/Cu. What is its potential vs. SHE (V)?`,v:E[k],s:`E(SHE) = ${m.toFixed(2)} + 0.34 = <b>${E[k].toFixed(2)} V</b>`}}
   const e=E[k],hi=Math.max(e,0.34),lo=Math.min(e,0.34);return {p:`Galvanic cell of ${k} (E° = ${e.toFixed(2)} V) with Cu²⁺/Cu (E° = +0.34 V). E_cell (V)?`,v:hi-lo,s:`Cathode = more positive (${hi===0.34?'Cu²⁺/Cu':k}). E_cell = ${hi.toFixed(2)} − (${lo.toFixed(2)}) = <b>${(hi-lo).toFixed(2)} V</b>`}}},
 {id:'cell6',t:'Lab 6 · Unit cell atom density',gen(){const c=pick([['simple cubic',1],['body-centered cubic',2],['face-centered cubic',4]]),a=R(2.5,5.5,1);return {p:`Your ${c[0]} model has an edge of ${a} cm. Atom density (spheres/cm³)?`,v:c[1]/a**3,s:`${c[0]} has ${c[1]} sphere${c[1]>1?'s':''} per cell. V = ${a}³ = ${f3(a**3)} cm³ → ${c[1]} / ${f3(a**3)} = <b>${f3(c[1]/a**3)} spheres/cm³</b>`}}},
 {id:'lew',t:'Lab 5 · Shared pairs',gen(){const m=pick([['CO₂',24,16],['H₂O',12,8],['NH₃',14,8],['CH₄',16,8],['CH₂O',20,12],['SO₂',24,18],['N₂O',24,16],['HCN',18,10],['C₂H₄',20,12],['CO₃²⁻',32,24],['NO₃⁻',32,24],['SCN⁻',24,16]]);return {p:`How many shared pairs (SP) in ${m[0]}?`,v:(m[1]-m[2])/2,s:`ER = ${m[1]}, VE = ${m[2]} → SP = ½(${m[1]} − ${m[2]}) = <b>${(m[1]-m[2])/2}</b>; LP = ½(${m[2]} − ${m[1]-m[2]}) = ${(m[2]-(m[1]-m[2]))/2}`}}},
 {id:'disp',t:'Lab 1 · Density by displacement',gen(){const n=12,m=R(50,65,2),v0=R(49.5,50.5,1),dv=R(18,26,1);return {p:`12 marbles have a mass of ${m} g. Water rises from ${v0} mL to ${(v0+dv).toFixed(1)} mL. Density of the marbles (g/mL)?`,v:m/dv,s:`V = ${(v0+dv).toFixed(1)} − ${v0} = ${dv.toFixed(1)} mL → ${m} / ${dv.toFixed(1)} = <b>${f3(m/dv)} g/mL</b>`}}},
 {id:'dt',t:'Lab 7 · ΔT and sign',gen(){const a=R(20,24,1),d=R(-9,9,1)||2.4,b=+(a+d).toFixed(1);return {p:`Water starts at ${a} °C and ends at ${b} °C after a salt dissolves. ΔT (°C)? Then decide: exo or endo?`,v:b-a,s:`ΔT = ${b} − ${a} = <b>${(b-a).toFixed(1)} °C</b> → water ${b>a?'warmed, so the dissolving was <b>exothermic</b> (ΔH < 0)':'cooled, so the dissolving was <b>endothermic</b> (ΔH > 0)'}`}}}
];
DRILLS.push({id:'caoh',t:'Lab 9 · Ca(OH)₂ titration (2:1)',gen(){const M=R(.30,.35,3),v=R(10,14,2),V=pick([5.00,7.00,10.00]);const mm=M*v*2;return {p:`${v} mL of ${M} M Ca(OH)₂ neutralizes ${V.toFixed(2)} mL of acetic acid. Molarity of the acid (M)?`,v:mm/V,s:`2HC₂H₃O₂ + Ca(OH)₂ → 2:1. mmol Ca(OH)₂ = ${M} × ${v} = ${f3(M*v)} → × 2 = ${f3(mm)} mmol acid ÷ ${V.toFixed(2)} mL = <b>${f3(mm/V)} M</b>`}}});
DRILLS.push(...EXTRA_DRILLS(R, pick, f3));
const dstate = {};
function drawDrills() { $('#drills').innerHTML = DRILLS.map(d => { dstate[d.id] = dstate[d.id] || d.gen(); const s = dstate[d.id]; return `<div class="drill" data-d="${d.id}"><h3>${d.t}</h3><p class="pr">${s.p}</p><div class="row"><input inputmode="decimal" aria-label="Answer for ${d.t}" placeholder="Your answer"><button class="btn" data-a="check">Check</button><button class="btn ghost" data-a="show">Show solution</button><button class="btn ghost" data-a="new">New numbers</button></div><div class="fb"></div></div>`; }).join(''); }
function parseNum(t) { t = t.trim().replace(/\s/g, '').replace(/[×x]10\^?/i, 'e').replace(/[−–]/g, '-').replace('%', ''); return parseFloat(t); }
$('#drills').addEventListener('click', e => { const b = e.target.closest('button[data-a]'); if (!b) return; const box = b.closest('.drill'), id = box.dataset.d, fb = box.querySelector('.fb');
  if (b.dataset.a === 'new') { dstate[id] = DRILLS.find(d => d.id === id).gen(); box.querySelector('.pr').innerHTML = dstate[id].p; box.querySelector('input').value = ''; fb.className = 'fb'; fb.innerHTML = ''; return; }
  const s = dstate[id]; if (b.dataset.a === 'show') { fb.className = 'fb'; fb.innerHTML = s.s; return; }
  const v = parseNum(box.querySelector('input').value); if (isNaN(v)) { fb.className = 'fb no'; fb.textContent = 'Type a number first.'; return; }
  const ok = Math.abs(v - s.v) <= Math.max(Math.abs(s.v) * 0.01, 0.006); fb.className = 'fb ' + (ok ? 'ok' : 'no'); fb.innerHTML = (ok ? '<b>Right.</b> ' : '<b>Not quite.</b> ') + s.s; });
$('#drills').addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.matches('input')) e.target.closest('.drill').querySelector('[data-a=check]').click(); });

/* ---------- formulas ---------- */
function drawFormulas() { $('#fgrid').innerHTML = LABS.map(L => `<section><h3>${labName(L)} · ${L.t}</h3><div class="eqs">${L.eq.map(e => `<div class="eq">${e}</div>`).join('')}</div><p class="cap" style="margin:8px 0 0"><a href="#lab-${L.n}">Open ${labName(L)} →</a></p></section>`).join(''); }

/* ---------- flashcards ---------- */
let known = store.get('known', []), deck = [], ci = 0, flip = false;
function buildDeck() { deck = shuffle(CARDS.map((c, i) => i).filter(i => !known.includes(i))); ci = 0; flip = false; if (!deck.length) { known = []; store.set('known', known); deck = shuffle(CARDS.map((c, i) => i)); } drawCard(); }
function drawCard() { const c = CARDS[deck[ci]]; $('#card').innerHTML = flip ? `<div>${c[1]}</div><span class="hint">tap to flip back</span>` : `<div class="term">${c[0]}</div><span class="hint">tap to see the answer</span>`; $('#cinfo').textContent = `Card ${ci + 1} of ${deck.length} · ${known.length} marked known`; }
const flipC = () => { flip = !flip; drawCard(); }, nextC = d => { ci = (ci + d + deck.length) % deck.length; flip = false; drawCard(); };
$('#card').addEventListener('click', flipC);
document.addEventListener('keydown', e => { if ($('#v-cards').hidden || e.target.matches('input,select')) return; if (e.key === ' ') { e.preventDefault(); flipC(); } if (e.key === 'ArrowRight') nextC(1); if (e.key === 'ArrowLeft') nextC(-1); });
$('#cNext').addEventListener('click', () => nextC(1)); $('#cPrev').addEventListener('click', () => nextC(-1));
$('#cKnow').addEventListener('click', () => { known.push(deck[ci]); store.set('known', known); deck.splice(ci, 1); if (!deck.length) { buildDeck(); return; } ci %= deck.length; flip = false; drawCard(); });

/* ---------- exam day ---------- */
const NIGHT = ['Print the one-sided exam sheet at 100% and add anything your class did differently.', 'Take one mock exam; redo every miss with "Missed only".', 'Run each calculation drill until you get it right twice in a row.', 'Pack a scientific calculator and your NCSU ID.', 'Sleep. A rested brain beats one more hour of cramming.'];
const TOP = ['Flame test color = emitted light; a solution looks the complement of what it absorbs.', 'A = −log T; E = hc/λ (shorter λ → more energy).', 'All nitrates, Group 1 and NH₄⁺ compounds are soluble.', 'Insoluble chlorides: Ag⁺, Hg₂²⁺, Pb²⁺.', 'Net ionic: drop spectators, balance charges in the precipitate formula.', 'Qual order: HCl (AgCl white) → NH₃ (Fe(OH)₃ red-brown) → H₂SO₄ (BaSO₄ white).', 'Confirm Fe³⁺ with SCN⁻ (blood red); confirm Ag⁺ by dissolving in NH₃ and re-precipitating with HNO₃.', 'SP = ½(ER − VE); ER = 8(non-H) + 2(H).', 'VSEPR: count electron groups (a double bond = 1); lone pairs shrink angles (107°, 104.5°).', 'Higher bond order = shorter bond; equal resonance forms = equal bond lengths.', 'Unit cells: SC 1/6/52%, BCC 2/8/68%, FCC 4/12/74%.', 'NaCl 4:4 CN 6; CsCl 1:1 CN 8 (not BCC); CaF₂ 4:8.', 'Water warms = exothermic (ΔH < 0); water cools = endothermic.', 'ΔG = ΔH − TΔS; endothermic + spontaneous needs ΔS > 0.', 'Boyle: P₁V₁ = P₂V₂; add 4 mL for the hose; inverse relationship.', 'Le Châtelier: add → shift away, remove → shift toward; spectators do nothing.', 'Cobalt turns blue when heated → blue → pink is exothermic.', 'Titration: mmol base = M × mL → mmol acid (× 2 for Ca(OH)₂) → ÷ mL.', 'Endpoint = faint pink 30 s; equivalence = steepest point; weak acid → equivalence pH > 7.', 'Strong acid pH = −log C; each 10× dilution → 1 pH unit toward 7.', 'At 0.010 M: HCl pH 2 vs acetic acid ~3.4; NaOH 12 vs NH₃ ~10.6.', 'OIL RIG; the reducing agent is oxidized.', 'Activity: reducers Mg > Zn > Cu; oxidizers MnO₄⁻ > Cu²⁺ > Mg²⁺.', 'E_cell = E_cathode − E_anode; vs Cu → add 0.34 V. Electrons go anode → cathode in the wire.', 'Flush eyes 15 min; heavy metals never go down the sink; 9 of 11 labs to pass.', 'Safety glasses on at all times in the lab; oxidizers (KMnO₄, H₂O₂, HNO₃) are a fire hazard with organics.', 'Atomic volume V = (4/3)πr³; volume ratio = (r₁/r₂)³.', 'Color wheel: flame → color seen; solution → opposite color; then ν = c/λ, E = hc/λ.', 'ICE table → equilibrium concentrations → K; missing concentration = rearrange K.', 'Brønsted from pH: pH < 7 → HA + H₂O ⇌ H₃O⁺ + A⁻; pH > 7 → B + H₂O ⇌ BH⁺ + OH⁻.', 'Redox: higher E° is reduced (cathode); balance electrons; never multiply E°.'];
function drawExam() { const c = store.get('chk', []); $('#chk1').innerHTML = NIGHT.map((t, i) => `<li><input type="checkbox" id="c${i}" ${c.includes(i) ? 'checked' : ''}><label for="c${i}">${t}</label></li>`).join(''); $('#top25').innerHTML = TOP.map(t => `<li>${t}</li>`).join(''); }
$('#chk1').addEventListener('change', e => { const c = [...document.querySelectorAll('#chk1 input')].map((x, i) => x.checked ? i : -1).filter(i => i >= 0); store.set('chk', c); });

/* ---------- routing ---------- */
const VIEWS = ['home', 'lab', 'formulas', 'drills', 'write', 'quiz', 'mock', 'cards', 'exam'];
function route() { const h = (location.hash || '#home').slice(1); let v = h, n = null;
  if (h === 'blueprint-top') { VIEWS.forEach(x => { $('#v-' + x).hidden = x !== 'home'; }); drawBoard(); drawBlueprint(); document.getElementById('blueprint-top').scrollIntoView(); return; }
  const m = h.match(/^lab-(\d+)$/); if (m && +m[1] <= 11) { v = 'lab'; n = +m[1]; } if (!VIEWS.includes(v)) v = 'home';
  VIEWS.forEach(x => { $('#v-' + x).hidden = x !== v; });
  document.querySelectorAll('nav.tabs a').forEach(a => { const t = a.getAttribute('href').slice(1); a.setAttribute('aria-current', (t === h || (v === 'lab' && t === 'lab-1')) ? 'page' : 'false'); });
  if (v === 'lab') drawLab(n); if (v === 'home') { drawBoard(); drawBlueprint(); } if (v === 'write') drawWrite(); if (v === 'quiz') drawQuiz(); if (v === 'drills') drawDrills(); if (v === 'formulas') drawFormulas();
  if (v === 'mock' && !mock.length) newMock(); if (v === 'cards' && !deck.length) buildDeck(); if (v === 'exam') drawExam();
  window.scrollTo(0, 0); }
addEventListener('hashchange', route); route();
}
