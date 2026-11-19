/* Interactive visuals, one per lab. VIS[n](el) fills the element. */
const VIS = (() => {
const sub = s => String(s);
const fx = (x, d = 3) => { const v = Number(Number(x).toPrecision(d)); return (Math.abs(v) >= 1e4 || (Math.abs(v) < 1e-3 && v !== 0)) ? v.toExponential(d - 1).replace(/e([+-]?\d+)/, (m, p) => ' × 10' + sup(+p)) : String(v); };
const sup = n => String(n).split('').map(c => ({'-':'⁻','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'}[c] || c)).join('');
const seg = (name, opts, cur) => `<div class="seg" role="group">${opts.map(([v, t]) => `<button data-${name}="${v}" aria-pressed="${String(v) === String(cur)}">${t}</button>`).join('')}</div>`;

/* ---------- 0: precision ladder + meniscus ---------- */
function v0(el) {
  el.innerHTML = `<div class="vgrid">
  <figure class="vcard"><figcaption>Precision ladder: pick the glassware by how the volume is written</figcaption>
   <div class="ladder">
    ${[['Beaker / flask','"about 50 mL"','±5%',18],['Graduated cylinder','"~5 mL" → 3 sig figs','±0.5–1%',45],['Volumetric pipet','"5.00 mL" (fixed volume)','±0.01 mL',85],['Buret','"5.00 mL", read to 0.01 mL','±0.01 mL',92]].map(r=>`<div class="lrow"><span class="lname">${r[0]}</span><span class="lbar"><i style="width:${r[3]}%"></i></span><span class="lnote">${r[1]} · ${r[2]}</span></div>`).join('')}
   </div><p class="vnote">Longer bar = more precise. Balance: 0.001 g.</p></figure>
  <figure class="vcard"><figcaption>Reading a meniscus: bottom of the curve, eye level</figcaption>
   <svg viewBox="0 0 300 220" class="svg" role="img" aria-label="Meniscus diagram">
    <rect x="110" y="10" width="80" height="200" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>
    <path d="M112 120 Q150 150 188 120 L188 208 L112 208 Z" fill="var(--blue)" opacity=".25"/>
    <path d="M112 120 Q150 150 188 120" fill="none" stroke="var(--blue)" stroke-width="2.5"/>
    ${[60,80,100,120,140,160,180].map((y,i)=>`<line x1="110" x2="${i%2?124:132}" y1="${y}" y2="${y}" stroke="currentColor"/>`).join('')}
    <line x1="20" x2="280" y1="135" y2="135" stroke="var(--red)" stroke-dasharray="5 4" stroke-width="2"/>
    <circle cx="20" cy="135" r="9" fill="none" stroke="var(--red)" stroke-width="2"/><circle cx="23" cy="135" r="3" fill="var(--red)"/>
    <text x="198" y="128" font-size="13" fill="currentColor">read here</text>
    <text x="10" y="160" font-size="12" fill="var(--red)">eye level</text>
   </svg><p class="vnote">Looking from above reads too low on a buret scale; from below, too high (parallax).</p></figure></div>`;
}

/* ---------- 1: mole map + water converter ---------- */
function v1(el) {
  el.innerHTML = `<figure class="vcard"><figcaption>The mole map: every Lab 1 calculation is a walk along these arrows</figcaption>
  <svg viewBox="0 0 760 170" class="svg" role="img" aria-label="Volume to grams to moles to particles" data-wide="1">
   ${[['Volume (mL)',20],['Mass (g)',210],['Moles (mol)',400],['Particles',590]].map(([t,x])=>`<rect x="${x}" y="55" width="150" height="60" rx="12" fill="var(--paper)" stroke="currentColor" stroke-width="2"/><text x="${x+75}" y="91" text-anchor="middle" font-size="17" font-weight="700" fill="currentColor">${t}</text>`).join('')}
   ${[[170,'× density','÷ density'],[360,'÷ molar mass','× molar mass'],[550,'× 6.022×10²³','÷ 6.022×10²³']].map(([x,a,b])=>`<path d="M${x+2} 72 L${x+38} 72" stroke="var(--red)" stroke-width="2.5" marker-end="url(#ar)"/><path d="M${x+38} 100 L${x+2} 100" stroke="var(--blue)" stroke-width="2.5" marker-end="url(#ab)"/><text x="${x+20}" y="40" text-anchor="middle" font-size="13" fill="var(--red)">${a}</text><text x="${x+20}" y="138" text-anchor="middle" font-size="13" fill="var(--blue)">${b}</text>`).join('')}
   <defs><marker id="ar" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" refX="9" refY="5.5" orient="auto"><path d="M0 0 L11 5.5 L0 11 Z" fill="var(--red)"/></marker><marker id="ab" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" refX="9" refY="5.5" orient="auto"><path d="M0 0 L11 5.5 L0 11 Z" fill="var(--blue)"/></marker></defs>
  </svg></figure>
  <figure class="vcard"><figcaption>Water converter (density 1.00 g/mL, 18.0 g/mol)</figcaption>
   <label class="inl">Grams of water <input type="number" id="w1" value="5.00" step="0.01" min="0"></label>
   <div class="readouts" id="w1o"></div></figure>`;
  const go = () => { const g = parseFloat(el.querySelector('#w1').value) || 0; const mol = g / 18.0;
    el.querySelector('#w1o').innerHTML = [['Volume', fx(g / 1.00) + ' mL'], ['Moles', fx(mol) + ' mol'], ['Molecules', fx(mol * 6.022e23)], ['Volume of 1 molecule', '2.99 × 10⁻²³ mL']].map(r => `<div><span>${r[0]}</span><b>${r[1]}</b></div>`).join(''); };
  el.querySelector('#w1').addEventListener('input', go); go();
}

/* ---------- 2: spectrum slider ---------- */
function wl2rgb(l) { let r=0,g=0,b=0;
  if(l<440){r=-(l-440)/40;b=1}else if(l<490){g=(l-440)/50;b=1}else if(l<510){g=1;b=-(l-510)/20}else if(l<580){r=(l-510)/70;g=1}else if(l<645){r=1;g=-(l-645)/65}else{r=1}
  return [r,g,b].map(v=>Math.round(255*Math.max(0,Math.min(1,v)))); }
const NAME = l => l<430?'violet':l<480?'blue':l<500?'blue-green':l<560?'green':l<580?'yellow-green':l<600?'yellow':l<630?'orange':'red';
const COMP = {violet:'yellow / yellow-green',blue:'orange / yellow-orange','blue-green':'red / orange-red',green:'red-violet (purple)', 'yellow-green':'violet',yellow:'violet / blue-violet',orange:'blue',red:'green / blue-green'};
function v2(el) {
  el.innerHTML = `<figure class="vcard"><figcaption>Drag the wavelength. Flame tests show the emitted color; solutions show the complement of the absorbed color.</figcaption>
   <div class="spectrum"></div>
   <input type="range" id="lam" min="400" max="700" value="430" aria-label="Wavelength in nm">
   <div class="duo2">
    <div class="swbox"><span class="sw" id="s1"></span><div><b>Absorbed / emitted: <span id="l1"></span></b><br><span id="l2"></span></div></div>
    <div class="swbox"><span class="sw" id="s2"></span><div><b>A solution absorbing this looks:</b><br><span id="l3"></span></div></div>
   </div>
   <div class="readouts" id="l4"></div></figure>
   <figure class="vcard"><figcaption>Absorbance ⇄ transmittance</figcaption>
    <input type="range" id="tt" min="1" max="100" value="25" aria-label="Percent transmittance">
    <div class="readouts" id="t1"></div>
    <div class="beam"><i id="t2"></i></div><p class="vnote">The bar is the light that gets through. A = −log T, so 10% T is A = 1, 1% T is A = 2.</p></figure>`;
  const s = el.querySelector('.spectrum'); s.style.background = 'linear-gradient(90deg,' + Array.from({length: 31}, (_, i) => `rgb(${wl2rgb(400 + i * 10)})`).join(',') + ')';
  const go = () => { const l = +el.querySelector('#lam').value, c = wl2rgb(l), n = NAME(l), E = 6.626e-34 * 3e8 / (l * 1e-9);
    el.querySelector('#s1').style.background = `rgb(${c})`; el.querySelector('#l1').textContent = `${l} nm (${n})`;
    el.querySelector('#l2').textContent = l < 500 ? 'short λ → high energy' : l > 620 ? 'long λ → low energy' : 'middle of the visible range';
    const cl = wl2rgb(l < 550 ? Math.min(700, l + 160) : Math.max(400, l - 180)); el.querySelector('#s2').style.background = `rgb(${cl})`; el.querySelector('#l3').textContent = COMP[n];
    el.querySelector('#l4').innerHTML = `<div><span>Energy E = hc/λ</span><b>${fx(E)} J</b></div><div><span>Frequency ν = c/λ</span><b>${fx(3e8 / (l * 1e-9))} Hz</b></div>`; };
  const gt = () => { const T = +el.querySelector('#tt').value / 100; el.querySelector('#t1').innerHTML = `<div><span>Transmittance T</span><b>${T.toFixed(2)} (${Math.round(T * 100)}%)</b></div><div><span>Absorbance A = −log T</span><b>${(-Math.log10(T)).toFixed(3)}</b></div>`; el.querySelector('#t2').style.width = (T * 100) + '%'; };
  el.querySelector('#lam').addEventListener('input', go); el.querySelector('#tt').addEventListener('input', gt); go(); gt();
}

/* ---------- 3: solubility grid ---------- */
const CAT = [['Na⁺','Na',1],['NH₄⁺','NH₄',1],['Mg²⁺','Mg',2],['Ca²⁺','Ca',2],['Sr²⁺','Sr',2],['Al³⁺','Al',3],['Fe³⁺','Fe',3],['Cu²⁺','Cu',2],['Ag⁺','Ag',1],['Pb²⁺','Pb',2]];
const AN = [['NO₃⁻','NO₃',1],['Cl⁻','Cl',1],['SO₄²⁻','SO₄',2],['OH⁻','OH',1],['CO₃²⁻','CO₃',2],['PO₄³⁻','PO₄',3]];
const gcd = (a, b) => b ? gcd(b, a % b) : a;
const SUB = n => n === 1 ? '' : String(n).split('').map(c => '₀₁₂₃₄₅₆₇₈₉'[+c]).join('');
function formula(c, a) { const g = gcd(c[2], a[2]), nc = a[2] / g, na = c[2] / g; const poly = s => /[A-Z].*[A-Z]|₄|₃/.test(s) && s.length > 2;
  const C = (nc > 1 && poly(c[1])) ? `(${c[1]})${SUB(nc)}` : c[1] + SUB(nc); const A = (na > 1 && (poly(a[1]) || a[1] === 'OH')) ? `(${a[1]})${SUB(na)}` : a[1] + SUB(na); return [C + A, nc, na]; }
function sol(ci, ai) { const c = CAT[ci][1], a = AN[ai][1];
  if (a === 'NO₃' || c === 'Na' || c === 'NH₄') return [false, 'Soluble: nitrates, Group 1 and NH₄⁺ compounds are always soluble.'];
  if (a === 'Cl') return (c === 'Ag' || c === 'Pb') ? [true, (c === 'Ag' ? 'AgCl, white. Breaks the ±1 rule.' : 'PbCl₂, white.')] : [false, 'Chlorides are soluble except Ag⁺, Hg₂²⁺, Pb²⁺.'];
  if (a === 'SO₄') return ['Ca','Sr','Pb','Ag'].includes(c) ? [true, c === 'Ag' || c === 'Ca' ? 'Slightly soluble; usually some solid forms.' : 'Insoluble sulfate (Sr²⁺, Ba²⁺, Pb²⁺, and Ca²⁺ slightly).'] : [false, 'Sulfates are soluble except Sr²⁺, Ba²⁺, Ca²⁺, Pb²⁺ (Ag⁺ slight).'];
  if (a === 'OH') return c === 'Sr' ? [false, 'Sr(OH)₂ is soluble (Group 2 exception).'] : [true, c === 'Ca' ? 'Ca(OH)₂ is only slightly soluble.' : c === 'Ag' ? 'Forms brown Ag₂O.' : c === 'Fe' ? 'Rust-brown, gelatinous Fe(OH)₃.' : c === 'Cu' ? 'Light-blue Cu(OH)₂.' : 'Hydroxides are insoluble except Group 1, NH₄⁺, Sr²⁺, Ba²⁺.'];
  if (a === 'CO₃') return [true, (c === 'Al' || c === 'Fe') ? 'Solid forms (really the hydroxide + CO₂ bubbles).' : 'Carbonates are insoluble except Group 1 and NH₄⁺.'];
  return [true, c === 'Ag' ? 'Yellow Ag₃PO₄.' : 'Phosphates are insoluble except Group 1 and NH₄⁺.']; }
function v3(el) {
  el.innerHTML = `<figure class="vcard"><figcaption>Tap a cell: will these two ions make a precipitate? Try to predict before you tap.</figcaption>
   <div class="scroll"><table class="solg"><thead><tr><th></th>${AN.map(a => `<th>${a[0]}</th>`).join('')}</tr></thead><tbody>
   ${CAT.map((c, i) => `<tr><th>${c[0]}</th>${AN.map((a, j) => `<td><button data-c="${i}" data-a="${j}" aria-label="${c[0]} with ${a[0]}">?</button></td>`).join('')}</tr>`).join('')}</tbody></table></div>
   <div class="row"><button class="btn ghost" id="sall">Reveal all</button><button class="btn ghost" id="shide">Hide all</button></div>
   <div class="out" id="sout">Pick a cell.</div><p class="vnote">Standard rules; your well plate may have used a slightly different ion set. Your own Y/N table wins.</p></figure>`;
  const show = (b, write) => { const i = +b.dataset.c, j = +b.dataset.a, [p, why] = sol(i, j); b.textContent = p ? 'Y' : 'N'; b.className = p ? 'yes' : 'no';
    if (!write) return; const c = CAT[i], a = AN[j]; let s = `<b>${c[0]} + ${a[0]}: ${p ? 'precipitate' : 'no precipitate'}</b><br>${why}`;
    if (p) { const [f, nc, na] = formula(c, a); s += `<br>Net ionic: <span>${nc > 1 ? nc : ''}${c[0]}(aq) + ${na > 1 ? na : ''}${a[0]}(aq) → ${f}(s)</span>`; }
    el.querySelector('#sout').innerHTML = s; };
  el.querySelector('.solg').addEventListener('click', e => { const b = e.target.closest('button'); if (b) show(b, true); });
  el.querySelector('#sall').onclick = () => el.querySelectorAll('.solg button').forEach(b => show(b, false));
  el.querySelector('#shide').onclick = () => el.querySelectorAll('.solg button').forEach(b => { b.textContent = '?'; b.className = ''; });
}

/* ---------- 4: qual flowchart ---------- */
function v4(el) {
  let has = {Ag: true, Fe: true, Ba: true};
  const draw = () => {
    const box = (x, y, w, h, t, on, col) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${on ? col : 'var(--paper)'}" stroke="currentColor" stroke-width="${on ? 2.5 : 1.2}" ${on ? '' : 'stroke-dasharray="5 4"'}/>` + t.map((s, k) => `<text x="${x + w / 2}" y="${y + 29 + k * 20}" text-anchor="middle" font-size="${k ? 13 : 15}" font-weight="${k ? 400 : 700}" fill="${on && col !== 'var(--paper)' ? '#111' : 'currentColor'}">${s}</text>`).join('');
    const arr = (x1, y1, x2, y2, lab) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="currentColor" stroke-width="2" marker-end="url(#qa)"/>${lab ? `<text x="${(x1 + x2) / 2 + 8}" y="${(y1 + y2) / 2}" font-size="13" font-weight="700" fill="var(--red)">${lab}</text>` : ''}`;
    const ions = ['Ag','Fe','Ba'].filter(k => has[k]).map(k => ({Ag:'Ag⁺',Fe:'Fe³⁺',Ba:'Ba²⁺'}[k])).join(', ') || 'no ions';
    const rowY = [20, 150, 280];
    const left = [['Unknown', ions], ['Supernatant', ['Fe³⁺','Ba²⁺'].filter((x, i) => has[['Fe','Ba'][i]]).join(', ') || 'nothing left'], ['Supernatant', has.Ba ? 'Ba²⁺' : 'nothing left']];
    const reag = ['+ 6 M HCl', '+ 7.5 M NH₃', '+ 6 M H₂SO₄'];
    const ppt = [['AgCl(s) — white', has.Ag ? 'ppt #1: Ag⁺ present' : 'no solid: no Ag⁺', has.Ag, '#f3f3f3'], ['Fe(OH)₃(s) — red-brown', has.Fe ? 'ppt #2: Fe³⁺ present' : 'no solid: no Fe³⁺', has.Fe, '#d9824a'], ['BaSO₄(s) — white', has.Ba ? 'Ba²⁺ present' : 'no solid: no Ba²⁺', has.Ba, '#f3f3f3']];
    const conf = [['Confirm Ag⁺', 'dissolve in NH₃; HNO₃ → white again', has.Ag, '#e3ebf7'], ['Confirm Fe³⁺', 'dissolve in HCl; SCN⁻ → blood red', has.Fe, '#f2b8b8'], ['Confirm Ba²⁺', 'the white sulfate is the test', has.Ba, '#e3ebf7']];
    let g = '<defs><marker id="qa" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0 0 L12 6 L0 12 Z" fill="currentColor"/></marker></defs>';
    rowY.forEach((y, r) => {
      g += box(10, y, 200, 70, [left[r][0], left[r][1]], true, 'var(--paper)');
      g += arr(212, y + 35, 286, y + 35) + `<text x="249" y="${y + 24}" text-anchor="middle" font-size="12.5" font-weight="700" fill="var(--red)">${reag[r]}</text>`;
      g += box(290, y, 220, 70, [ppt[r][0], ppt[r][1]], ppt[r][2], ppt[r][3]);
      g += arr(512, y + 35, 536, y + 35);
      g += box(540, y, 212, 70, [conf[r][0], conf[r][1]], conf[r][2], conf[r][3]);
      if (r < 2) g += arr(110, y + 72, 110, y + 126) + `<text x="120" y="${y + 104}" font-size="12" fill="currentColor">centrifuge, decant</text>`;
    });
    el.querySelector('svg').innerHTML = g; };
  el.innerHTML = `<figure class="vcard"><figcaption>Toggle which ions are in the unknown and watch what you'd observe at each step.</figcaption>
   <div class="row">${[['Ag','Ag⁺'],['Fe','Fe³⁺'],['Ba','Ba²⁺']].map(([k, t]) => `<button class="pill" data-ion="${k}" aria-pressed="true">${t}</button>`).join('')}</div>
   <svg viewBox="0 0 760 360" class="svg" role="img" aria-label="Qualitative analysis flowchart" data-wide="1"></svg>
   <p class="vnote">Dashed box = nothing forms at that step, which means that ion is absent. That's a real, gradable result.</p></figure>`;
  el.querySelector('.row').addEventListener('click', e => { const b = e.target.closest('[data-ion]'); if (!b) return; has[b.dataset.ion] = !has[b.dataset.ion]; b.setAttribute('aria-pressed', has[b.dataset.ion]); draw(); });
  draw();
}

/* ---------- 5: VSEPR shapes + Lewis counter ---------- */
const SH = [
 {k:'lin',n:'Linear',g:2,lp:0,ang:'180°',h:'sp',ex:'N₂O, C₂H₂, CO₂',b:[[-1,0],[1,0]],l:[]},
 {k:'tp',n:'Trigonal planar',g:3,lp:0,ang:'120°',h:'sp²',ex:'CH₂O, C₂H₄, CO₃²⁻',b:[[0,-1],[.87,.5],[-.87,.5]],l:[]},
 {k:'bent3',n:'Bent (3 groups)',g:3,lp:1,ang:'<120° (~119°)',h:'sp²',ex:'SO₂',b:[[.87,.5],[-.87,.5]],l:[[0,-1]]},
 {k:'td',n:'Tetrahedral',g:4,lp:0,ang:'109.5°',h:'sp³',ex:'CH₄, C₂H₆',b:[[0,-1],[.94,.33],[-.47,.55],[-.47,.15]],l:[],w:[2,3]},
 {k:'tpy',n:'Trigonal pyramidal',g:4,lp:1,ang:'~107°',h:'sp³',ex:'NH₃',b:[[.94,.33],[-.47,.55],[-.47,.15]],l:[[0,-1]],w:[1,2]},
 {k:'bent4',n:'Bent (4 groups)',g:4,lp:2,ang:'~104.5°',h:'sp³',ex:'H₂O',b:[[.8,.6],[-.8,.6]],l:[[.5,-.85],[-.5,-.85]]}];
const LEW = [['CO₂',24,16],['H₂O',12,8],['NH₃',14,8],['CH₄',16,8],['CH₂O',20,12],['SO₂',24,18],['N₂O',24,16],['HCN',18,10],['C₂H₄',20,12],['CO₃²⁻',32,24],['CHO₂⁻ (formate)',26,18],['SCN⁻',24,16],['NO₃⁻',32,24]];
function v5(el) {
  let cur = 'td';
  el.innerHTML = `<div class="vgrid"><figure class="vcard"><figcaption>VSEPR shapes: tap one</figcaption>${seg('sh', SH.map(s => [s.k, s.n]), cur)}<svg viewBox="-140 -118 280 226" class="svg" id="vs" role="img" aria-label="Molecular shape"></svg><div class="readouts" id="vso"></div></figure>
   <figure class="vcard"><figcaption>Lewis counter: ER, VE, SP, LP</figcaption><label class="inl">Molecule <select id="lw">${LEW.map((m, i) => `<option value="${i}">${m[0]}</option>`).join('')}</select></label><div class="readouts" id="lwo"></div>
   <p class="vnote">ER = 8 × (non-H atoms) + 2 × (H atoms). VE = valence electrons ± charge. SP = ½(ER − VE). LP = ½(VE − 2·SP).</p></figure></div>`;
  const draw = () => { const s = SH.find(x => x.k === cur), R = 95;
    let g = `<circle cx="0" cy="0" r="26" fill="var(--red)"/><text x="0" y="6" text-anchor="middle" font-size="18" font-weight="800" fill="#fff">A</text>`;
    s.b.forEach(([x, y], i) => { const wedge = s.w && s.w.includes(i); g = `<line x1="0" y1="0" x2="${x * R}" y2="${y * R}" stroke="currentColor" stroke-width="${wedge ? 9 : 5}" ${i === (s.w || [])[1] ? 'stroke-dasharray="4 4"' : ''} stroke-linecap="round"/>` + g + `<circle cx="${x * R}" cy="${y * R}" r="18" fill="var(--blue)"/><text x="${x * R}" y="${y * R + 5}" text-anchor="middle" font-size="14" font-weight="700" fill="#fff">X</text>`; });
    s.l.forEach(([x, y]) => { g += `<ellipse cx="${x * 58}" cy="${y * 58}" rx="${Math.abs(y) > .5 ? 16 : 26}" ry="${Math.abs(y) > .5 ? 26 : 16}" transform="rotate(${Math.atan2(y, x) * 180 / Math.PI + 90} ${x * 58} ${y * 58})" fill="var(--ok)" opacity=".35"/><circle cx="${x * 58 - 5}" cy="${y * 58}" r="3.5" fill="currentColor"/><circle cx="${x * 58 + 5}" cy="${y * 58}" r="3.5" fill="currentColor"/>`; });
    el.querySelector('#vs').innerHTML = g;
    el.querySelector('#vso').innerHTML = [['Electron groups', s.g], ['Lone pairs', s.lp], ['Electron geometry', ['', '', 'linear', 'trigonal planar', 'tetrahedral'][s.g]], ['Molecular shape', s.n], ['Bond angle', s.ang], ['Hybridization', s.h], ['Lab examples', s.ex]].map(r => `<div><span>${r[0]}</span><b>${r[1]}</b></div>`).join(''); };
  const lw = () => { const m = LEW[+el.querySelector('#lw').value], sp = (m[1] - m[2]) / 2; el.querySelector('#lwo').innerHTML = [['ER', m[1]], ['VE', m[2]], ['Shared pairs SP', sp], ['Lone pairs LP', (m[2] - 2 * sp) / 2]].map(r => `<div><span>${r[0]}</span><b>${r[1]}</b></div>`).join(''); };
  el.querySelector('.seg').addEventListener('click', e => { const b = e.target.closest('[data-sh]'); if (!b) return; cur = b.dataset.sh; el.querySelectorAll('[data-sh]').forEach(x => x.setAttribute('aria-pressed', x === b)); draw(); });
  el.querySelector('#lw').addEventListener('change', lw); draw(); lw();
}

/* ---------- 6: unit cells ---------- */
function v6(el) {
  let cur = 'fcc';
  el.innerHTML = `<figure class="vcard"><figcaption>Unit cells: count what's inside the cube</figcaption>${seg('uc', [['sc', 'Simple cubic'], ['bcc', 'Body-centered'], ['fcc', 'Face-centered']], cur)}
   <div class="vgrid"><svg viewBox="40 -12 285 262" class="svg" id="ucs" role="img" aria-label="Unit cell"></svg><div><div class="readouts" id="uco"></div>
   <div class="legend"><span><i style="background:var(--blue)"></i>corner (1/8 each)</span><span><i style="background:var(--red)"></i>body center (1)</span><span><i style="background:var(--ok)"></i>face (1/2 each)</span></div></div></div></figure>`;
  const P = (x, y, z) => [70 + x * 150 + z * 70, 220 - y * 150 - z * 60];
  const draw = () => { const C = []; for (const x of [0, 1]) for (const y of [0, 1]) for (const z of [0, 1]) C.push([x, y, z]);
    const edges = C.flatMap(a => C.filter(b => (a[0] !== b[0]) + (a[1] !== b[1]) + (a[2] !== b[2]) === 1 && a.join() < b.join()).map(b => [a, b]));
    let s = edges.map(([a, b]) => { const [x1, y1] = P(...a), [x2, y2] = P(...b); const back = a[2] && b[2] || (!a[0] && !b[0] && a[2] + b[2] > 0 && 0); return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="currentColor" stroke-width="1.6" opacity="${a[2] && b[2] ? .45 : .9}"/>`; }).join('');
    const atoms = [];
    if (cur === 'fcc') [[.5, .5, 0], [.5, .5, 1], [.5, 0, .5], [.5, 1, .5], [0, .5, .5], [1, .5, .5]].forEach(p => atoms.push([p, 'var(--ok)', 12]));
    if (cur === 'bcc') atoms.push([[.5, .5, .5], 'var(--red)', 18]);
    C.forEach(p => atoms.push([p, 'var(--blue)', cur === 'sc' ? 20 : 13]));
    atoms.sort((a, b) => b[0][2] - a[0][2]).forEach(([p, c, r]) => { const [x, y] = P(...p); s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="#fff" stroke-width="1.5" opacity=".92"/>`; });
    el.querySelector('#ucs').innerHTML = s;
    const d = {sc: ['8 × 1/8 = 1', 1, 6, '52%', 'a = 2r'], bcc: ['8 × 1/8 + 1 = 2', 2, 8, '68%', 'a = 4r/√3'], fcc: ['8 × 1/8 + 6 × 1/2 = 4', 4, 12, '74%', 'a = 2√2·r']}[cur];
    el.querySelector('#uco').innerHTML = [['Count', d[0]], ['Atoms per cell', d[1]], ['Coordination number', d[2]], ['Packing efficiency', d[3]], ['Edge vs. radius', d[4]]].map(r => `<div><span>${r[0]}</span><b>${r[1]}</b></div>`).join(''); };
  el.querySelector('.seg').addEventListener('click', e => { const b = e.target.closest('[data-uc]'); if (!b) return; cur = b.dataset.uc; el.querySelectorAll('[data-uc]').forEach(x => x.setAttribute('aria-pressed', x === b)); draw(); });
  draw();
}

/* ---------- 7: heating curve + Boyle ---------- */
function v7(el) {
  el.innerHTML = `<div class="vgrid"><figure class="vcard"><figcaption>Heating curve (Part C): flat = phase change</figcaption>
   <svg viewBox="0 0 360 240" class="svg" role="img" aria-label="Heating curve">
    <line x1="40" y1="210" x2="350" y2="210" stroke="currentColor"/><line x1="40" y1="210" x2="40" y2="15" stroke="currentColor"/>
    <polyline points="40,200 80,170 150,170 230,60 320,60 350,40" fill="none" stroke="var(--red)" stroke-width="4" stroke-linejoin="round"/>
    <line x1="40" y1="170" x2="80" y2="170" stroke="currentColor" stroke-dasharray="3 4" opacity=".5"/><line x1="40" y1="60" x2="230" y2="60" stroke="currentColor" stroke-dasharray="3 4" opacity=".5"/>
    <text x="34" y="174" text-anchor="end" font-size="12" fill="currentColor">0 °C</text><text x="34" y="64" text-anchor="end" font-size="12" fill="currentColor">~100 °C</text>
    <text x="115" y="160" text-anchor="middle" font-size="12.5" fill="var(--blue)" font-weight="700">ice melting</text><text x="275" y="50" text-anchor="middle" font-size="12.5" fill="var(--blue)" font-weight="700">water boiling</text>
    <text x="198" y="128" font-size="12" fill="currentColor">liquid warms</text>
    <text x="195" y="232" text-anchor="middle" font-size="12" fill="currentColor">time (heat added) →</text>
   </svg><p class="vnote">On the plateaus, heat breaks intermolecular attractions instead of raising T. Both are endothermic with ΔS &gt; 0; boiling has the bigger ΔS.</p></figure>
   <figure class="vcard"><figcaption>Boyle's law (Part D): drag the syringe</figcaption>
    <input type="range" id="bv" min="4" max="44" value="14" step="1" aria-label="Gas volume in mL">
    <svg viewBox="0 0 360 200" class="svg" id="bsv" role="img" aria-label="Pressure versus volume"></svg><div class="readouts" id="bo"></div></figure></div>
   <figure class="vcard"><figcaption>Exothermic or endothermic? Read the water.</figcaption><div class="duo2">
    <div class="thermo hot"><b>Water warms (ΔT &gt; 0)</b><br>System released heat → <b>exothermic, ΔH &lt; 0</b><br>CaCl₂, KOH dissolving; FeCl₃ + NaOH</div>
    <div class="thermo cold"><b>Water cools (ΔT &lt; 0)</b><br>System absorbed heat → <b>endothermic, ΔH &gt; 0</b><br>NH₄NO₃ (cold pack): spontaneous only because ΔS &gt; 0</div></div></figure>`;
  const P1 = 760, V1 = 14, k = P1 * V1;
  const go = () => { const V = +el.querySelector('#bv').value, P = k / V; const sx = v => 40 + (v - 4) / 40 * 300, sy = p => 180 - p / 2700 * 165;
    let path = ''; for (let v = 4; v <= 44; v += .5) path += (path ? 'L' : 'M') + sx(v).toFixed(1) + ' ' + sy(k / v).toFixed(1);
    el.querySelector('#bsv').innerHTML = `<line x1="40" y1="180" x2="345" y2="180" stroke="currentColor"/><line x1="40" y1="180" x2="40" y2="10" stroke="currentColor"/><path d="${path}" fill="none" stroke="var(--blue)" stroke-width="3"/><circle cx="${sx(V)}" cy="${sy(P)}" r="7" fill="var(--red)"/><text x="190" y="198" text-anchor="middle" font-size="12" fill="currentColor">volume (mL) — independent →</text><text x="14" y="95" font-size="12" fill="currentColor" transform="rotate(-90 14 95)" text-anchor="middle">pressure (torr)</text>`;
    el.querySelector('#bo').innerHTML = `<div><span>Volume</span><b>${V} mL</b></div><div><span>Pressure</span><b>${Math.round(P)} torr</b></div><div><span>P × V</span><b>${Math.round(P * V)} (constant)</b></div>`; };
  el.querySelector('#bv').addEventListener('input', go); go();
}

/* ---------- 8: Le Chatelier simulator ---------- */
const EQS = {
 fe: {t: 'Fe³⁺ (pale yellow) + SCN⁻ ⇌ FeSCN²⁺ (red)', L: '#f2e6b0', R: '#a3121c', st: [['Add Fe(NO₃)₃', 1, 'Added a reactant → shift right → deeper red.'], ['Add NaSCN', 1, 'Added a reactant → shift right → deeper red.'], ['Add AgNO₃', -1, 'Ag⁺ precipitates SCN⁻ (white AgSCN) → removed a reactant → shift left → red fades.'], ['Add NaNO₃', 0, 'Na⁺ and NO₃⁻ are spectators → no shift.']]},
 co: {t: 'CoCl₄²⁻ (blue) + 6H₂O ⇌ Co(H₂O)₆²⁺ (pink) + 4Cl⁻', L: '#2b55c9', R: '#e58fb0', st: [['Add 12 M HCl', -1, 'Added Cl⁻ (a product) → shift left → blue.'], ['Add water', 1, 'Added H₂O (a reactant here) → shift right → pink.'], ['Add AgNO₃', 1, 'Ag⁺ precipitates Cl⁻ as AgCl → removed a product → shift right → pink.'], ['Heat', -1, 'Heating favors the endothermic direction. It turns blue, so pink → blue is endothermic and blue → pink (as written) is exothermic.'], ['Cool (ice)', 1, 'Cooling favors the exothermic direction → pink.']]},
 bb: {t: 'HBB (yellow, 470 nm) + H₂O ⇌ BB⁻ (blue, 635 nm) + H₃O⁺', L: '#e8d43a', R: '#2a64c4', st: [['Raise pH (add base)', 1, 'Fewer H₃O⁺ (a product removed) → shift right → bluer; A₆₃₅ rises, A₄₇₀ falls.'], ['Lower pH (add acid)', -1, 'More H₃O⁺ (a product added) → shift left → yellower; A₄₇₀ rises.']]},
 mo: {t: 'HIn (red) + H₂O ⇌ In⁻ (yellow) + H₃O⁺  · methyl orange', L: '#d23a2a', R: '#f0c419', st: [['Add NaOH', 1, 'OH⁻ removes H₃O⁺ → shift right → yellow.'], ['Add HCl', -1, 'Added H₃O⁺ (a product) → shift left → red.']]}
};
function v8(el) {
  let sys = 'fe', pos = .5;
  const mix = (a, b, t) => { const h = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16)); const A = h(a), B = h(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`; };
  el.innerHTML = `<figure class="vcard"><figcaption>Le Châtelier simulator: pick a system, apply a stress, predict before you tap</figcaption>
   ${seg('sy', [['fe', 'Iron thiocyanate'], ['co', 'Cobalt chloride'], ['bb', 'Bromothymol blue'], ['mo', 'Methyl orange']], sys)}
   <p class="eqline" id="eqt"></p><div class="lc"><div class="tube"><i id="liq"></i></div><div><div class="arrowbig" id="arw">⇌</div><div class="row" id="stb"></div><div class="out" id="lco">Tap a stress.</div></div></div>
   <p class="vnote">Rule: <b>add</b> something → shift <b>away</b> from it. <b>Remove</b> something → shift <b>toward</b> it. Heat counts as a reactant on the endothermic side.</p></figure>`;
  const paint = () => { const E = EQS[sys]; el.querySelector('#liq').style.background = mix(E.L, E.R, pos); };
  const draw = () => { const E = EQS[sys]; pos = .5; el.querySelector('#eqt').textContent = E.t; el.querySelector('#arw').textContent = '⇌'; el.querySelector('#lco').textContent = 'Tap a stress.';
    el.querySelector('#stb').innerHTML = E.st.map((s, i) => `<button class="pill" data-st="${i}">${s[0]}</button>`).join('') + `<button class="pill" data-st="r">Reset</button>`; paint(); };
  el.querySelector('.seg').addEventListener('click', e => { const b = e.target.closest('[data-sy]'); if (!b) return; sys = b.dataset.sy; el.querySelectorAll('[data-sy]').forEach(x => x.setAttribute('aria-pressed', x === b)); draw(); });
  el.querySelector('#stb').addEventListener('click', e => { const b = e.target.closest('[data-st]'); if (!b) return; if (b.dataset.st === 'r') { draw(); return; }
    const s = EQS[sys].st[+b.dataset.st]; pos = s[1] === 0 ? pos : s[1] > 0 ? .92 : .08; el.querySelector('#arw').textContent = s[1] > 0 ? '→ shifts right' : s[1] < 0 ? '← shifts left' : '⇌ no shift'; el.querySelector('#lco').innerHTML = `<b>${s[0]}:</b> ${s[2]}`; paint(); });
  draw();
}

/* ---------- 9: titration curve ---------- */
function v9(el) {
  const Ka = 1.8e-5, na = 0.8320 * 7.00, Mb = 0.5012, V0 = 47, Kb = 1e-14 / Ka, veq = na / Mb;
  const pH = vb => { const nb = Mb * vb, V = V0 + vb; const wa = C => { const h = (-Ka + Math.sqrt(Ka * Ka + 4 * Ka * C)) / 2; return -Math.log10(h); };
    if (nb < na) { const left = na - nb; if (nb < 1e-6) return wa(na / V); const hh = 4.74 + Math.log10(nb / left); return left / na < 0.002 ? Math.max(hh, 14 + Math.log10(Math.sqrt(Kb * na / V))) : Math.max(hh, wa(na / V)); }
    const oh = (nb - na) / V + Math.sqrt(Kb * na / V); return 14 + Math.log10(oh); };
  el.innerHTML = `<figure class="vcard"><figcaption>Titration of 7.00 mL vinegar (0.832 M acetic acid) with 0.5012 M NaOH: drag the buret</figcaption>
   <input type="range" id="tv" min="0" max="17" step="0.05" value="0" aria-label="mL NaOH added">
   <div class="vgrid"><svg viewBox="0 0 380 250" class="svg" id="tcs" data-wide="1" role="img" aria-label="Titration curve"></svg>
   <div><div class="flask"><svg viewBox="0 0 120 140"><path d="M45 10 L75 10 L75 50 L110 125 Q112 132 104 132 L16 132 Q8 132 10 125 L45 50 Z" fill="none" stroke="currentColor" stroke-width="3"/><path id="fl" d="M30 85 L90 85 L110 125 Q112 132 104 132 L16 132 Q8 132 10 125 Z"/></svg></div><div class="readouts" id="tco"></div></div></div>
   <p class="vnote">Phenolphthalein turns pink above ~pH 8. Endpoint = first faint pink that lasts 30 s, right at the steep jump. Weak acid → equivalence pH is above 7 (about 8.9).</p></figure>`;
  const sx = v => 40 + v / 17 * 330, sy = p => 225 - p / 14 * 210;
  let curve = ''; for (let v = 0; v <= 17; v += .05) curve += (curve ? 'L' : 'M') + sx(v).toFixed(1) + ' ' + sy(pH(v)).toFixed(1);
  const go = () => { const v = +el.querySelector('#tv').value, p = pH(v), pink = p > 8.2;
    el.querySelector('#tcs').innerHTML = `<line x1="40" y1="225" x2="372" y2="225" stroke="currentColor"/><line x1="40" y1="225" x2="40" y2="10" stroke="currentColor"/>
     ${[0, 7, 14].map(t => `<text x="34" y="${sy(t) + 4}" text-anchor="end" font-size="11" fill="currentColor">${t}</text><line x1="40" x2="372" y1="${sy(t)}" y2="${sy(t)}" stroke="currentColor" opacity=".12"/>`).join('')}
     <line x1="${sx(veq)}" x2="${sx(veq)}" y1="10" y2="225" stroke="var(--red)" stroke-dasharray="4 4"/><text x="${sx(veq) + 4}" y="22" font-size="11.5" fill="var(--red)">equivalence ${veq.toFixed(2)} mL</text>
     <line x1="${sx(veq / 2)}" x2="${sx(veq / 2)}" y1="${sy(4.74)}" y2="225" stroke="var(--blue)" stroke-dasharray="3 4"/><text x="${sx(veq / 2) - 4}" y="${sy(4.74) - 6}" font-size="11" text-anchor="middle" fill="var(--blue)">½ eq: pH = pKₐ 4.74</text>
     <path d="${curve}" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="${sx(v)}" cy="${sy(p)}" r="7" fill="var(--red)"/>
     <text x="206" y="246" text-anchor="middle" font-size="11.5" fill="currentColor">mL NaOH added</text>`;
    el.querySelector('#fl').setAttribute('fill', pink ? (p > 10.5 ? '#c2185b' : '#f6a6c8') : 'rgba(180,200,230,.35)');
    el.querySelector('#tco').innerHTML = `<div><span>NaOH added</span><b>${v.toFixed(2)} mL</b></div><div><span>pH</span><b>${p.toFixed(2)}</b></div><div><span>mmol OH⁻ added</span><b>${(Mb * v).toFixed(3)}</b></div><div><span>Flask</span><b>${p > 10.5 ? 'dark pink: overshot' : pink ? 'faint pink: endpoint zone' : 'colorless'}</b></div>`; };
  el.querySelector('#tv').addEventListener('input', go); go();
}

/* ---------- 10: pH scale ---------- */
const PHS = [[2.0, '0.010 M HCl', 'strong acid'], [3.0, '0.0010 M HCl', 'strong acid, 10× diluted'], [3.4, '0.010 M acetic acid', 'weak acid: higher pH than HCl at the same concentration'], [4.0, '0.00010 M HCl', 'strong acid, 100× diluted'], [2.4, 'lemon juice / vinegar', 'household acids'], [7.0, 'pure water (298 K)', 'neutral: [H₃O⁺] = [OH⁻] = 1.0 × 10⁻⁷ M'], [8.3, 'baking soda', 'weak base'], [10.6, '0.010 M NH₃', 'weak base: lower pH than NaOH at the same concentration'], [11.0, '0.0010 M NaOH', 'strong base, 10× diluted'], [12.0, '0.010 M NaOH', 'strong base'], [12.5, 'bleach', 'basic (read the paper fast)']];
function v10(el) {
  const ord = PHS.map((p, i) => [p, i]).sort((a, b) => a[0][0] - b[0][0]);
  el.innerHTML = `<figure class="vcard"><figcaption>The pH scale with every Lab 10 solution: tap a name to see where it sits</figcaption>
   <div class="phbar"><div class="phgrad"></div>${ord.map(([p, i], k) => `<span class="phm" id="pm${i}" style="left:${p[0] / 14 * 100}%"><b>${k + 1}</b></span>`).join('')}
   <div class="phticks">${Array.from({length: 15}, (_, i) => `<span style="left:${i / 14 * 100}%">${i}</span>`).join('')}</div></div>
   <div class="phlist">${ord.map(([p, i], k) => `<button class="pill" data-i="${i}"><b>${k + 1}</b>&nbsp;${p[1]} · pH ${p[0]}</button>`).join('')}</div>
   <div class="out" id="pho">Tap a solution.</div>
   <div class="duo2"><div class="mini"><b>Strong vs. weak at 0.010 M</b><br>HCl pH 2.0 vs. acetic acid ~3.4<br>NaOH pH 12.0 vs. NH₃ ~10.6</div><div class="mini"><b>Dilution</b><br>Each 10× dilution moves a strong acid or base one pH unit toward 7, never past it.</div></div></figure>
   <figure class="vcard"><figcaption>Part D: 10.0 mL of 0.010 M HCl + 0.010 M NaOH</figcaption>
    <input type="range" id="pdv" min="0" max="15" step="0.5" value="0" aria-label="mL NaOH">
    <div class="readouts" id="pdo"></div></figure>`;
  el.querySelector('.phlist').addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (!b) return; const i = +b.dataset.i, p = PHS[i];
    el.querySelectorAll('.phm').forEach(m => m.classList.toggle('on', m.id === 'pm' + i)); el.querySelectorAll('.phlist .pill').forEach(x => x.setAttribute('aria-pressed', x === b));
    el.querySelector('#pho').innerHTML = `<b>${p[1]}: pH ≈ ${p[0]}</b> — ${p[2]}. [H₃O⁺] = 10<sup>−${p[0]}</sup> = ${fx(10 ** -p[0])} M`; });
  const go = () => { const vb = +el.querySelector('#pdv').value, na = 1e-4, nb = 1e-5 * vb, V = (10 + vb) / 1000; let p, w;
    if (Math.abs(na - nb) < 1e-9) { p = 7; w = 'equivalence: neutral'; } else if (na > nb) { p = -Math.log10((na - nb) / V); w = 'acidic (HCl left over)'; } else { p = 14 + Math.log10((nb - na) / V); w = 'basic (NaOH in excess)'; }
    el.querySelector('#pdo').innerHTML = `<div><span>NaOH added</span><b>${vb.toFixed(1)} mL</b></div><div><span>mol H⁺ − mol OH⁻</span><b>${fx(na - nb)}</b></div><div><span>pH</span><b>${p.toFixed(2)}</b></div><div><span>Mixture</span><b>${w}</b></div>`; };
  el.querySelector('#pdv').addEventListener('input', go); go();
}

/* ---------- 11: galvanic cell builder ---------- */
const MET = {Mg: ['Mg²⁺/Mg', -2.37], Zn: ['Zn²⁺/Zn', -0.76], Ni: ['Ni²⁺/Ni', -0.25], Pb: ['Pb²⁺/Pb', -0.13], Cu: ['Cu²⁺/Cu', 0.34], Ag: ['Ag⁺/Ag', 0.80]};
const ION = {Mg: 'Mg²⁺', Zn: 'Zn²⁺', Ni: 'Ni²⁺', Pb: 'Pb²⁺', Cu: 'Cu²⁺', Ag: 'Ag⁺'};
function v11(el) {
  let a = 'Zn', b = 'Ni';
  el.innerHTML = `<figure class="vcard"><figcaption>Galvanic cell builder: pick two metals</figcaption>
   <div class="row"><label class="inl">Metal 1 <select id="m1">${Object.keys(MET).map(k => `<option ${k === a ? 'selected' : ''}>${k}</option>`).join('')}</select></label><label class="inl">Metal 2 <select id="m2">${Object.keys(MET).map(k => `<option ${k === b ? 'selected' : ''}>${k}</option>`).join('')}</select></label></div>
   <svg viewBox="0 0 520 300" class="svg" id="gcs" data-wide="1" role="img" aria-label="Galvanic cell"></svg><div class="readouts" id="gco"></div>
   <p class="vnote">Convention: anode (oxidation) on the left. Electrons go through the wire anode → cathode. In the salt bridge, anions go to the anode and cations to the cathode.</p></figure>
   <figure class="vcard"><figcaption>Reduction potential ladder (strongest reducer at the bottom)</figcaption><div class="ladder2">${Object.entries(MET).sort((x, y) => y[1][1] - x[1][1]).map(([k, v]) => `<div><b>${v[0]}</b><span>${v[1] > 0 ? '+' : ''}${v[1].toFixed(2)} V</span><em>${(v[1] - 0.34 > 0 ? '+' : '') + (v[1] - 0.34).toFixed(2)} V vs. Cu</em></div>`).join('')}</div>
   <p class="vnote">Higher = stronger oxidizing agent (the ion). Lower = stronger reducing agent (the metal). Measured vs. Cu²⁺/Cu → add 0.34 V for SHE.</p></figure>`;
  const draw = () => { const s = el.querySelector('#gcs'); if (a === b) { s.innerHTML = `<text x="260" y="150" text-anchor="middle" font-size="16" fill="currentColor">Pick two different metals.</text>`; el.querySelector('#gco').innerHTML = ''; return; }
    const an = MET[a][1] < MET[b][1] ? a : b, ca = an === a ? b : a, E = MET[ca][1] - MET[an][1];
    const beaker = (x, m, lab, col) => `<path d="M${x} 150 L${x} 270 Q${x} 285 ${x + 15} 285 L${x + 135} 285 Q${x + 150} 285 ${x + 150} 270 L${x + 150} 150" fill="none" stroke="currentColor" stroke-width="3"/><rect x="${x + 3}" y="185" width="144" height="97" fill="var(--blue)" opacity=".15"/><rect x="${x + 60}" y="95" width="30" height="150" fill="${col}" stroke="currentColor"/><text x="${x + 75}" y="214" text-anchor="middle" font-size="14" font-weight="800" fill="currentColor">${m}</text><text x="${x + 75}" y="270" text-anchor="middle" font-size="13" fill="currentColor">${ION[m]}(aq)</text><text x="${x + 75}" y="300" text-anchor="middle" font-size="14" font-weight="800" fill="${lab === 'ANODE' ? 'var(--red)' : 'var(--blue)'}">${lab}</text>`;
    s.innerHTML = `<defs><marker id="ge" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0 0 L12 6 L0 12 Z" fill="var(--red)"/></marker><marker id="gi" markerUnits="userSpaceOnUse" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0 0 L12 6 L0 12 Z" fill="var(--ok)"/></marker></defs>
     ${beaker(30, an, 'ANODE', '#9aa3ad')}${beaker(340, ca, 'CATHODE', '#c58b52')}
     <path d="M105 95 L105 40 L415 40 L415 95" fill="none" stroke="currentColor" stroke-width="2.5"/><rect x="230" y="22" width="60" height="36" rx="6" fill="var(--paper)" stroke="currentColor" stroke-width="2"/><text x="260" y="46" text-anchor="middle" font-size="14" font-weight="800" fill="currentColor">${E.toFixed(2)} V</text>
     <line x1="125" y1="30" x2="215" y2="30" stroke="var(--red)" stroke-width="3" marker-end="url(#ge)"/><line x1="305" y1="30" x2="395" y2="30" stroke="var(--red)" stroke-width="3" marker-end="url(#ge)"/><text x="170" y="20" text-anchor="middle" font-size="12.5" fill="var(--red)" font-weight="700">e⁻ →</text><text x="350" y="20" text-anchor="middle" font-size="12.5" fill="var(--red)" font-weight="700">e⁻ →</text>
     <path d="M150 200 L150 130 L370 130 L370 200" fill="none" stroke="currentColor" stroke-width="16" opacity=".18" stroke-linejoin="round"/><text x="260" y="122" text-anchor="middle" font-size="12" fill="currentColor">salt bridge (KCl / KNO₃)</text>
     <line x1="300" y1="146" x2="215" y2="146" stroke="var(--ok)" stroke-width="2.5" marker-end="url(#gi)"/><text x="200" y="150" text-anchor="end" font-size="12" fill="var(--ok)" font-weight="700">Cl⁻ (anions)</text><text x="320" y="180" font-size="12" fill="var(--ok)" font-weight="700">K⁺ (cations)</text><line x1="220" y1="176" x2="305" y2="176" stroke="var(--ok)" stroke-width="2.5" marker-end="url(#gi)"/>`;
    const ne = {Ag: 1}[an] || 2, nc = {Ag: 1}[ca] || 2;
    el.querySelector('#gco').innerHTML = `<div><span>Anode (oxidation)</span><b>${an} → ${ION[an]} + ${ne}e⁻</b></div><div><span>Cathode (reduction)</span><b>${ION[ca]} + ${nc}e⁻ → ${ca}</b></div><div><span>E_cell = E_cathode − E_anode</span><b>${MET[ca][1].toFixed(2)} − (${MET[an][1].toFixed(2)}) = +${E.toFixed(2)} V</b></div><div><span>Reducing agent / oxidizing agent</span><b>${an} / ${ION[ca]}</b></div>`; };
  el.querySelector('#m1').onchange = e => { a = e.target.value; draw(); }; el.querySelector('#m2').onchange = e => { b = e.target.value; draw(); };
  draw();
}

return {0: v0, 1: v1, 2: v2, 3: v3, 4: v4, 5: v5, 6: v6, 7: v7, 8: v8, 9: v9, 10: v10, 11: v11};
})();
