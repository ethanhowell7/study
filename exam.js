/* Built from the professor's final-exam guide. Loaded after data.js and visuals.js. */
const BLUEPRINT = [
 {t:'Lab equipment', n:1, l:0, items:['Given pictures, name the lab equipment used this semester.'], how:['Play the "Name that equipment" game on the Lab skills page until you get 15/15.']},
 {t:'Safety', n:2, l:0, items:['Hazards of chemical classes (acids, oxidants, etc.)','General waste disposal','Proper lab attire','Safety-glasses policy','Response to chemical exposure','Bunsen burner precautions'], how:['Acids/bases = corrosive; oxidants (KMnO₄, H₂O₂, HNO₃) react with organics and can start fires; heavy metals (Pb²⁺, Ag⁺, Ba²⁺) = toxic; NH₃ / conc. HCl vapors = irritants, use the hood.','Glasses on at all times in the lab, even when not working, over prescription glasses.','Exposure: tell the TA, flush 15 min at the eyewash (hold eyes open) or sink; big spill → safety shower, remove contaminated clothing.']},
 {t:'Technique', n:2, l:0, items:['Analytical balances','Graduated cylinders','Burets','Titration','Centrifuges','Bunsen burners','pH probes'], how:['Know one or two "do" rules for each piece (see the Technique table on the Lab skills page).']},
 {t:'Mass, moles & volume', n:1, l:1, items:['Density from mass and volume','Unit conversions by unit cancellation','Atomic volume and volume ratios from atomic radii'], how:['V = (4/3)πr³; 1 pm = 10⁻¹⁰ cm.','Volume ratio = (r₁/r₂)³ — the 4/3π cancels.']},
 {t:'Emission & absorption', n:1, l:2, items:['Flame color + color wheel → λ, ν, E emitted','Solution color + color wheel → λ, ν, E absorbed'], how:['Flame: use the color you see. Solution: use the opposite color on the wheel.','ν = c/λ and E = hc/λ with λ in meters.']},
 {t:'Solubility rules', n:1, l:3, items:['Write the dissolution reaction of an ionic solid','Write the net precipitation reaction and name the spectator ions'], how:['Dissolution: (s) → ions (aq) with subscripts becoming coefficients; polyatomic ions stay together.','Precipitation: swap partners, use the rules to find the solid, keep only its ions.']},
 {t:'Qualitative analysis', n:1, l:4, items:['Given three ions, solubility rules and reagents: which ions precipitate and which stay in the supernatant at each stage','Formulas of the solids that form'], how:['At each step, test every ion still in solution against the reagent\'s anion. Insoluble → precipitate (write its formula); soluble → it moves on in the supernatant.']},
 {t:'Molecular geometry', n:2, l:5, items:['Draw the Lewis structure (octet rule, lone pairs, formal charges)','Bond angle, hybridization and shape about indicated atoms'], how:['ER/VE/SP/LP, then formal charges.','Count electron groups on each indicated atom separately.']},
 {t:'Solid state modeling', n:1, l:6, items:['Identify SC, BCC or FCC from a picture','Ionic solid picture → atoms per unit cell and formula'], how:['Corners only = SC; + body center = BCC; + face centers = FCC.','Count each ion with corner 1/8, edge 1/4, face 1/2, inside 1; reduce the ratio.']},
 {t:'Enthalpy & gas laws', n:1, l:7, items:['ΔT, exo/endo, and what is known about entropy','Relate phase changes to temperature and structure (pictures/diagram)','Ideal gas law calculations (P and V)'], how:['If a process is spontaneous and endothermic, ΔS must be positive. If exothermic, ΔS can\'t be determined from that alone.','PV = nRT with atm, L, K.']},
 {t:'Equilibrium', n:1, l:8, items:['Direction of shift for a stress','Equilibrium expression','K from initial concentrations (ICE table)','Missing concentration from K'], how:['ICE: Initial, Change (by coefficients), Equilibrium; plug equilibrium values into K.']},
 {t:'Titration', n:1, l:9, items:['Titrant : analyte stoichiometry','mmol of titrant and analyte','Mass, mass percent and molarity of analyte'], how:['Balanced equation → ratio; M × mL = mmol; × ratio; ÷ mL; × molar mass; ÷ sample mass.']},
 {t:'Acid-base studies', n:1, l:10, items:['[H₃O⁺] from pH','Weak vs. strong acid','Net Brønsted reaction from a substance and its solution pH'], how:['pH < 7: the substance donates H⁺ to water (makes H₃O⁺). pH > 7: it accepts H⁺ from water (makes OH⁻).']},
 {t:'Redox reactions', n:1, l:11, items:['From two reactants and an E° table: net reaction, E°cell, strong/weak oxidizing and reducing agents','From two couples: half-reactions in each compartment, net reaction, E°cell'], how:['Higher E° is reduced (cathode); lower E° is reversed (anode). Balance electrons, never multiply E°. E°cell = E°cathode − E°anode.']}
];

/* ---------- equipment pictures ---------- */
const g = (s) => `<svg viewBox="0 0 100 120" class="eq-svg" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${s}</g></svg>`;
const ticks = (x, y0, y1, n, w = 8) => Array.from({length: n}, (_, i) => `<line x1="${x}" x2="${x + (i % 2 ? w * .6 : w)}" y1="${y0 + (y1 - y0) * i / (n - 1)}" y2="${y0 + (y1 - y0) * i / (n - 1)}"/>`).join('');
const EQUIP = [
 ['Beaker', g(`<path d="M24 22 L26 106 Q26 110 31 110 L69 110 Q74 110 74 106 L76 22"/><path d="M18 20 L26 24"/><path d="M27 70 Q50 74 73 70" opacity=".5"/>${ticks(28, 40, 90, 6)}`), 'wide mouth, spout, rough volumes only'],
 ['Erlenmeyer flask', g(`<path d="M41 14 L41 46 L19 104 Q17 110 24 110 L76 110 Q83 110 81 104 L59 46 L59 14"/><path d="M38 14 L62 14"/>`), 'cone shape; used for titrations (swirl without splashing)'],
 ['Volumetric flask', g(`<path d="M45 8 L45 62 Q20 70 20 88 Q20 110 50 110 Q80 110 80 88 Q80 70 55 62 L55 8"/><path d="M43 30 L57 30" stroke="var(--red)"/>`), 'long neck with ONE line; makes an exact volume of solution'],
 ['Graduated cylinder', g(`<path d="M38 8 L38 104 L62 104 L62 8"/><path d="M30 110 L70 110 L66 104 L34 104 Z"/><path d="M36 8 L40 6"/>${ticks(38, 18, 96, 12)}`), 'approximate volumes ("~5 mL"), 3 sig figs'],
 ['Buret', g(`<path d="M45 4 L45 92 L55 92 L55 4"/><rect x="42" y="92" width="16" height="7" rx="1"/><path d="M58 95 L68 95"/><path d="M48 99 L50 116 L52 99"/>${ticks(45, 10, 86, 14, 6)}`), 'long tube + stopcock; read to 0.01 mL; delivers titrant'],
 ['Volumetric pipet', g(`<path d="M50 4 L50 42"/><ellipse cx="50" cy="60" rx="10" ry="18"/><path d="M50 78 L50 112 L49 116"/><path d="M45 20 L55 20" stroke="var(--red)"/>`), 'bulb in the middle, ONE line; delivers one exact volume (TD)'],
 ['Plastic (Beral) pipet', g(`<ellipse cx="50" cy="24" rx="13" ry="17"/><path d="M46 40 L46 100 L50 114 L54 100 L54 40"/>`), 'disposable dropper for drops of reagent'],
 ['Test tube', g(`<path d="M40 10 L40 96 Q40 110 50 110 Q60 110 60 96 L60 10"/><path d="M36 10 L64 10"/><path d="M41 80 Q50 84 59 80" opacity=".5"/>`), 'small reactions; centrifuge tubes look similar but have a cone tip'],
 ['Well plate', g(`<rect x="8" y="34" width="84" height="52" rx="5"/>${[0, 1, 2].map(r => [0, 1, 2, 3].map(c => `<circle cx="${22 + c * 19}" cy="${48 + r * 13}" r="5"/>`).join('')).join('')}`), 'many tiny reactions at once (Labs 3, 4, 8)'],
 ['Bunsen burner', g(`<path d="M30 110 L70 110 L64 98 L36 98 Z"/><path d="M45 98 L45 52 L55 52 L55 98"/><path d="M36 92 L22 92"/><path d="M50 50 Q38 34 50 12 Q62 34 50 50 Z" stroke="var(--blue)"/><path d="M50 46 Q44 38 50 28 Q56 38 50 46 Z" stroke="var(--blue)"/>`), 'flame tests; hottest = tip of inner blue cone'],
 ['Nichrome wire loop', g(`<path d="M50 112 L50 72" stroke-width="7"/><path d="M50 72 L50 24"/><circle cx="50" cy="16" r="7"/>`), 'dip in solution, hold in flame (Lab 2)'],
 ['Centrifuge', g(`<rect x="14" y="58" width="72" height="44" rx="6"/><path d="M18 58 Q50 26 82 58"/><circle cx="50" cy="80" r="5"/><path d="M26 92 L40 92"/>`), 'spins tubes to pack precipitate; balance it'],
 ['Analytical balance', g(`<rect x="12" y="88" width="76" height="20" rx="3"/><rect x="18" y="30" width="64" height="58" rx="2" stroke-dasharray="4 3"/><path d="M34 76 L66 76"/><path d="M50 76 L50 88"/><rect x="30" y="96" width="18" height="6" rx="1"/>`), 'glass draft shield; reads 0.001 g; close the doors'],
 ['pH probe', g(`<path d="M44 20 L44 92 Q44 100 50 100 Q56 100 56 92 L56 20"/><circle cx="50" cy="100" r="7"/><path d="M50 20 Q50 6 70 6"/><path d="M42 30 L58 30"/>`), 'glass bulb at the tip; calibrate 4/7/10, rinse, keep wet'],
 ['Wash bottle', g(`<path d="M30 46 L30 104 Q30 110 36 110 L64 110 Q70 110 70 104 L70 46 Q70 38 60 38 L40 38 Q30 38 30 46 Z"/><path d="M44 38 L44 30 L56 30 L56 38"/><path d="M50 30 L50 18 L76 10 L80 12"/>`), 'squirts DI water to rinse'],
 ['Hot plate / stir plate', g(`<rect x="10" y="56" width="80" height="34" rx="5"/><rect x="18" y="48" width="64" height="8" rx="2"/><circle cx="30" cy="74" r="6"/><circle cx="70" cy="74" r="6"/><path d="M40 40 L60 40" stroke-width="5"/>`), 'heats and spins a stir bar (Labs 7, 9)'],
 ['Spectrophotometer + cuvette', g(`<rect x="10" y="44" width="80" height="50" rx="6"/><rect x="58" y="34" width="12" height="22" rx="1"/><rect x="18" y="56" width="30" height="16" rx="2"/>`), 'shines light through the cuvette; reads absorbance'],
 ['Watch glass', g(`<path d="M12 70 Q50 92 88 70"/><path d="M12 70 Q50 86 88 70" opacity=".5"/>`), 'shallow dish; covers a beaker or holds solid'],
 ['Salt bridge / Multi-EChem cell', g(`<rect x="10" y="60" width="80" height="44" rx="4"/><circle cx="26" cy="82" r="9"/><circle cx="74" cy="82" r="9"/><path d="M26 70 Q26 40 50 40 Q74 40 74 70" stroke-width="6" opacity=".5"/>`), 'two half-cells joined by a KNO₃ bridge (Lab 11)']
];
const TECH = [
 ['Analytical balance','Close the doors; tare first; weigh on paper/boat, never directly on the pan; never weigh hot objects; use the same balance for a series; record the actual mass; clean spills.'],
 ['Graduated cylinder','For approximate volumes ("about 5 mL"); read the bottom of the meniscus at eye level; 3 sig figs.'],
 ['Buret','Condition with the titrant (2 × ~5 mL); remove the air bubble from the tip; read to 0.01 mL; start near 0.00 mL; read the bottom of the meniscus at eye level.'],
 ['Titration','Stir or swirl constantly; add in smaller amounts near the endpoint; rinse the walls with DI water; endpoint = faint pink for 30 s; dark pink = overshot, repeat; trials should agree within 0.50 mL.'],
 ['Centrifuge','Balance with an equal-volume tube directly opposite; close the lid; never stop the rotor by hand; wait until it stops before opening.'],
 ['Bunsen burner','Tie back hair; check the hose; light with a striker; adjust air for a blue flame with an inner cone; never leave it unattended; keep flammables away; if it blows out, shut the gas at the bench valve.'],
 ['pH probe','Calibrate with pH 4, 7 and 10 buffers; rinse with DI water between solutions; don\'t touch or bang the glass bulb; keep it wet; store in pH 7 buffer.']
];

/* ---------- write-it practice ---------- */
const WRITE = [
 [3,'Write the dissolution reaction of Na₃PO₄(s).','Na₃PO₄(s) → 3Na⁺(aq) + PO₄³⁻(aq)'],
 [3,'Write the dissolution reaction of (NH₄)₂SO₄(s).','(NH₄)₂SO₄(s) → 2NH₄⁺(aq) + SO₄²⁻(aq)'],
 [3,'Write the dissolution reaction of Al₂(SO₄)₃(s).','Al₂(SO₄)₃(s) → 2Al³⁺(aq) + 3SO₄²⁻(aq)'],
 [3,'Write the dissolution reaction of Cu(ClO₄)₂(s).','Cu(ClO₄)₂(s) → Cu²⁺(aq) + 2ClO₄⁻(aq)'],
 [3,'AgNO₃(aq) + NaCl(aq): net reaction and spectators?','Ag⁺(aq) + Cl⁻(aq) → AgCl(s). Spectators: Na⁺, NO₃⁻.'],
 [3,'BaCl₂(aq) + Na₂SO₄(aq): net reaction and spectators?','Ba²⁺(aq) + SO₄²⁻(aq) → BaSO₄(s). Spectators: Na⁺, Cl⁻.'],
 [3,'CaCl₂(aq) + Na₃PO₄(aq): net reaction and spectators?','3Ca²⁺(aq) + 2PO₄³⁻(aq) → Ca₃(PO₄)₂(s). Spectators: Na⁺, Cl⁻.'],
 [3,'FeCl₃(aq) + NaOH(aq): net reaction and spectators?','Fe³⁺(aq) + 3OH⁻(aq) → Fe(OH)₃(s). Spectators: Na⁺, Cl⁻.'],
 [3,'KNO₃(aq) + NaCl(aq)?','No reaction: every possible product is soluble (all Group 1 and nitrate compounds).'],
 [4,'Solution has Ag⁺, Fe³⁺, Ba²⁺. Add HCl, then NH₃, then H₂SO₄. What precipitates at each step and what stays?','HCl: AgCl(s); Fe³⁺, Ba²⁺ stay. NH₃: Fe(OH)₃(s); Ba²⁺ stays. H₂SO₄: BaSO₄(s); nothing left.'],
 [4,'Solution has Pb²⁺, Mg²⁺, Na⁺. Add NaCl, then NaOH, then Na₂CO₃.','NaCl: PbCl₂(s); Mg²⁺, Na⁺ stay. NaOH: Mg(OH)₂(s); Na⁺ stays. Na₂CO₃: nothing (Na⁺ compounds are soluble).'],
 [4,'Solution has Ag⁺, Ca²⁺, Cu²⁺. Add NaCl, then Na₂SO₄, then NaOH.','NaCl: AgCl(s). Na₂SO₄: CaSO₄(s). NaOH: Cu(OH)₂(s).'],
 [4,'Solution has Sr²⁺, Fe³⁺, K⁺. Add H₂SO₄, then NH₃ (OH⁻).','H₂SO₄: SrSO₄(s); Fe³⁺, K⁺ stay. NH₃: Fe(OH)₃(s); K⁺ stays in the supernatant.'],
 [5,'Lewis structure of CO₂: bonds, lone pairs, formal charges?','ER 24, VE 16, SP 4, LP 4. O=C=O, two lone pairs on each O, all formal charges 0. C: 2 groups, linear, 180°, sp.'],
 [5,'Lewis structure of NH₃ and shape about N?','ER 14, VE 8, SP 3, LP 1. Three N–H bonds, one lone pair on N; FC 0. 4 groups: trigonal pyramidal, ~107°, sp³.'],
 [5,'Lewis structure of NO₃⁻ with formal charges?','ER 32, VE 24, SP 4, LP 8. One N=O and two N–O. FC: N +1, single-bonded O −1 each, double-bonded O 0 (sum −1). Three resonance forms. Trigonal planar, 120°, sp².'],
 [5,'Lewis structure of SO₂ (octet rule) and shape about S?','ER 24, VE 18, SP 3, LP 6. O=S–O with one lone pair on S. FC: S +1, single-bonded O −1, double-bonded O 0. Two resonance forms. 3 groups: bent, ~119°, sp².'],
 [5,'NH₄⁺: structure and formal charge on N?','ER 16, VE 8, SP 4, LP 0. Four N–H bonds; FC on N = 5 − 4 − 0 = +1. Tetrahedral, 109.5°, sp³.'],
 [5,'HCN: structure and shape about C?','ER 18, VE 10, SP 4, LP 1. H–C≡N with one lone pair on N; FC all 0. C: 2 groups, linear, 180°, sp.'],
 [5,'CH₃COOH (acetic acid): shape, angle, hybridization about each C and the O–H oxygen?','CH₃ carbon: 4 groups, tetrahedral, 109.5°, sp³. Carbonyl C (C=O): 3 groups, trigonal planar, 120°, sp². O of O–H: 2 bonds + 2 LP, bent, ~104.5°, sp³.'],
 [5,'CH₃OH: shape about C and about O?','C: tetrahedral, 109.5°, sp³. O: 2 bonds + 2 lone pairs, bent, ~104.5°, sp³.'],
 [6,'Picture: atoms only at the 8 corners. Type and atoms per cell?','Simple cubic: 8 × 1/8 = 1 atom, CN 6.'],
 [6,'Picture: atoms at the corners and one in the center. Type?','Body-centered cubic: 8 × 1/8 + 1 = 2 atoms, CN 8.'],
 [6,'Picture: atoms at the corners and the center of each face. Type?','Face-centered cubic: 8 × 1/8 + 6 × 1/2 = 4 atoms, CN 12.'],
 [6,'Ionic cell: X at corners and face centers; M at the 12 edge centers and the body center. Formula?','X: 8(1/8) + 6(1/2) = 4. M: 12(1/4) + 1 = 4. Ratio 4:4 → MX (like NaCl).'],
 [6,'Ionic cell: A at corners and face centers; 8 B ions fully inside. Formula?','A = 4, B = 8 → AB₂ (like CaF₂).'],
 [6,'Ionic cell: M at the 8 corners; X in the body center. Formula?','M = 1, X = 1 → MX (like CsCl). Not BCC, because the center ion is a different ion.'],
 [7,'A salt dissolves on its own and the water goes from 22.5 °C to 17.3 °C. ΔT, exo/endo, entropy?','ΔT = −5.2 °C → endothermic (ΔH > 0). It happened spontaneously, so ΔG < 0, which requires ΔS > 0.'],
 [7,'A reaction raises the temperature from 21.0 °C to 30.4 °C. ΔT, exo/endo, entropy?','ΔT = +9.4 °C → exothermic (ΔH < 0). ΔS can\'t be determined from this alone (exothermic reactions can be spontaneous with either sign of ΔS).'],
 [7,'Pictures show ice → liquid water. What happens to temperature and structure?','Temperature stays at 0 °C during melting (flat part of the heating curve). Molecules go from a fixed, ordered lattice to close but moving; heat breaks attractions. Endothermic, ΔS > 0.'],
 [7,'Liquid → gas: temperature and structure?','Temperature stays flat at the boiling point (~100 °C for water) until all is gas. Molecules move far apart, attractions overcome. Endothermic, ΔS ≫ 0.'],
 [8,'Write K for Fe³⁺(aq) + SCN⁻(aq) ⇌ FeSCN²⁺(aq).','K = [FeSCN²⁺] / ([Fe³⁺][SCN⁻])'],
 [8,'Write K for CoCl₄²⁻ + 6H₂O(l) ⇌ Co(H₂O)₆²⁺ + 4Cl⁻.','K = [Co(H₂O)₆²⁺][Cl⁻]⁴ / [CoCl₄²⁻] (liquid water left out).'],
 [8,'Write K for 2NO₂(g) ⇌ N₂O₄(g).','K = [N₂O₄] / [NO₂]²'],
 [8,'Initial [Fe³⁺] = 1.00×10⁻³ M, [SCN⁻] = 2.00×10⁻⁴ M, no FeSCN²⁺. At equilibrium [FeSCN²⁺] = 1.50×10⁻⁴ M. Find K.','ICE: x = 1.50×10⁻⁴. Fe³⁺ = 8.5×10⁻⁴, SCN⁻ = 5.0×10⁻⁵. K = 1.50×10⁻⁴ / (8.5×10⁻⁴ × 5.0×10⁻⁵) = 3.5×10³.'],
 [10,'HF solution has pH 2.6. Write the Brønsted reaction.','HF(aq) + H₂O(l) ⇌ H₃O⁺(aq) + F⁻(aq) (acidic → donates H⁺ to water; weak, so ⇌).'],
 [10,'NH₃ solution has pH 11. Write the Brønsted reaction.','NH₃(aq) + H₂O(l) ⇌ NH₄⁺(aq) + OH⁻(aq)'],
 [10,'NaHCO₃ (baking soda) solution has pH 8.3. Brønsted reaction?','HCO₃⁻(aq) + H₂O(l) ⇌ H₂CO₃(aq) + OH⁻(aq) (Na⁺ is a spectator).'],
 [10,'NH₄Cl solution has pH 5.1. Brønsted reaction?','NH₄⁺(aq) + H₂O(l) ⇌ NH₃(aq) + H₃O⁺(aq) (Cl⁻ is a spectator).'],
 [10,'NaC₂H₃O₂ solution has pH 8.9. Brønsted reaction?','C₂H₃O₂⁻(aq) + H₂O(l) ⇌ HC₂H₃O₂(aq) + OH⁻(aq)'],
 [10,'0.010 M HCl has pH 2.0. Brønsted reaction?','HCl(aq) + H₂O(l) → H₃O⁺(aq) + Cl⁻(aq) (strong: single arrow, ionizes completely).'],
 [10,'Bleach (NaOCl) has pH 12.5. Brønsted reaction?','OCl⁻(aq) + H₂O(l) ⇌ HOCl(aq) + OH⁻(aq)'],
 [11,'Zn(s) + Cu²⁺(aq). Net reaction and E°cell? (Zn²⁺/Zn −0.76, Cu²⁺/Cu +0.34)','Cu²⁺ is reduced (higher E°). Zn + Cu²⁺ → Zn²⁺ + Cu. E° = 0.34 − (−0.76) = +1.10 V. Oxidizing agent Cu²⁺, reducing agent Zn.'],
 [11,'Zn(s) + Ag⁺(aq). Net reaction and E°cell? (Ag⁺/Ag +0.80)','Zn → Zn²⁺ + 2e⁻; Ag⁺ + e⁻ → Ag (× 2). Net: Zn + 2Ag⁺ → Zn²⁺ + 2Ag. E° = 0.80 − (−0.76) = +1.56 V (not multiplied).'],
 [11,'Al(s) + Cu²⁺(aq). Net reaction and E°cell? (Al³⁺/Al −1.66)','2Al → 2Al³⁺ + 6e⁻; 3Cu²⁺ + 6e⁻ → 3Cu. Net: 2Al + 3Cu²⁺ → 2Al³⁺ + 3Cu. E° = 0.34 − (−1.66) = +2.00 V.'],
 [11,'Cu(s) + Zn²⁺(aq): does a reaction occur?','No. Zn²⁺/Zn (−0.76) is below Cu²⁺/Cu (+0.34), so Zn²⁺ is too weak an oxidizer to oxidize Cu. (The reverse, Zn + Cu²⁺, does react.)'],
 [11,'Battery from Pb²⁺/Pb (−0.13) and Ag⁺/Ag (+0.80): half-reaction in each compartment, net, E°.','Anode (Pb compartment): Pb → Pb²⁺ + 2e⁻. Cathode (Ag compartment): Ag⁺ + e⁻ → Ag (× 2). Net: Pb + 2Ag⁺ → Pb²⁺ + 2Ag. E° = 0.80 − (−0.13) = +0.93 V.'],
 [11,'From the table Ag⁺ +0.80, Cu²⁺ +0.34, Zn²⁺ −0.76, Mg²⁺ −2.37: strongest and weakest oxidizing and reducing agents?','Strongest oxidizing agent: Ag⁺ (most +). Weakest oxidizing agent: Mg²⁺. Strongest reducing agent: Mg (most −). Weakest reducing agent: Ag.'],
 [1,'Na has r = 186 pm, Cs has r = 265 pm. How many times bigger is a Cs atom by volume?','(265/186)³ = 2.89 times. V(Na) = (4/3)π(186×10⁻¹⁰ cm)³ = 2.70×10⁻²³ cm³.'],
 [2,'A compound gives a red flame. The color wheel puts red at 650 nm. ν and E of the emitted light?','ν = 3.00×10⁸ / 650×10⁻⁹ = 4.62×10¹⁴ Hz; E = hν = 3.06×10⁻¹⁹ J. (Flame: use the color you see.)'],
 [2,'A solution looks blue. The wheel puts orange (opposite blue) at 600 nm. λ, ν, E absorbed?','Absorbed = orange, 600 nm. ν = 5.00×10¹⁴ Hz; E = 3.31×10⁻¹⁹ J.']
];

/* ---------- extra quiz questions ---------- */
QUIZ.push(
{l:0,q:"When must safety glasses be worn in the lab room?",o:["Only while handling chemicals","At all times in the lab, even when not working","Only when the TA says so","Only during heating"],a:1,e:"Policy: on at all times in the labroom, worn over prescription glasses."},
{l:0,q:"KMnO₄, H₂O₂ and HNO₃ belong to which hazard class?",o:["Flammables","Oxidants (oxidizers)","Inert salts","Bases"],a:1,e:"Oxidizers react vigorously with organic material and can start fires; KMnO₄ and HNO₃ are also corrosive."},
{l:0,q:"Which is the correct response to a chemical splash on your arm?",o:["Wipe it with a paper towel","Rinse at the sink for 15 minutes and tell the TA","Neutralize with another chemical","Wait to see if it burns"],a:1,e:"Flush with lots of water for 15 minutes; large spills on the body go to the safety shower."},
{l:0,q:"Which is NOT a Bunsen burner precaution?",o:["Tie back long hair","Never leave a lit burner unattended","Keep flammable solvents nearby for quick use","If the flame goes out, shut off the gas at the bench valve"],a:2,e:"Flammables must be kept away from flames."},
{l:0,q:"Which is correct pH probe technique?",o:["Wipe the bulb dry with a towel between readings","Rinse with DI water between solutions and store in pH 7 buffer","Calibrate with only one buffer","Let it dry out overnight"],a:1,e:"Calibrate with pH 4, 7, 10; rinse with DI water; keep the bulb wet; store in buffer."},
{l:0,q:"Which piece of glassware has a single line and makes an exact volume of solution?",o:["Beaker","Erlenmeyer flask","Volumetric flask","Graduated cylinder"],a:2,e:"A volumetric flask is filled to its one calibration line on the long neck."},
{l:0,q:"Which is correct analytical balance technique?",o:["Weigh a hot crucible right away","Pour the solid directly on the pan","Close the doors and use weigh paper or a boat","Switch balances between trials"],a:2,e:"Doors closed, never chemicals directly on the pan, never hot objects, same balance for a series."},
{l:1,q:"Atom A has r = 100 pm and atom B r = 200 pm. V(B) / V(A) = ?",o:["2","4","8","16"],a:2,e:"Volume scales with r³: (200/100)³ = 8."},
{l:1,q:"Volume of a Na atom (r = 186 pm), in cm³?",o:["2.70 × 10⁻²³ cm³","1.86 × 10⁻⁸ cm³","6.44 × 10⁻²⁴ cm³","2.70 × 10⁻¹⁷ cm³"],a:0,e:"V = (4/3)π(1.86 × 10⁻⁸ cm)³ = 2.70 × 10⁻²³ cm³ (1 pm = 10⁻¹⁰ cm)."},
{l:2,q:"A solution appears blue. Using the color wheel, the light it absorbs is mostly:",o:["Blue","Orange","Green","Violet"],a:1,e:"A solution shows the complement of the absorbed color; orange is opposite blue."},
{l:2,q:"A flame is orange (≈ 600 nm on the wheel). Energy of the emitted photon?",o:["3.31 × 10⁻¹⁹ J","5.00 × 10¹⁴ J","1.99 × 10⁻²⁵ J","6.00 × 10⁻⁷ J"],a:0,e:"E = hc/λ = (6.626 × 10⁻³⁴)(3.00 × 10⁸)/(600 × 10⁻⁹). 5.00 × 10¹⁴ is the frequency in Hz."},
{l:3,q:"Dissolution reaction of Ca(NO₃)₂(s)?",o:["Ca(NO₃)₂ → Ca²⁺ + N₂ + 3O₂","Ca(NO₃)₂(s) → Ca²⁺(aq) + 2NO₃⁻(aq)","Ca(NO₃)₂(s) → Ca⁺(aq) + NO₃²⁻(aq)","Ca(NO₃)₂(s) → Ca²⁺(aq) + N₂O₆²⁻(aq)"],a:1,e:"Polyatomic ions stay intact; the subscript 2 becomes a coefficient."},
{l:4,q:"Pb²⁺, Mg²⁺ and Na⁺ are treated with NaCl, then NaOH. What remains in the final supernatant?",o:["Pb²⁺","Mg²⁺","Na⁺","Nothing"],a:2,e:"PbCl₂ precipitates first, then Mg(OH)₂; Na⁺ compounds are always soluble."},
{l:5,q:"In CH₃COOH, the shape about the C=O carbon is:",o:["Tetrahedral, 109.5°, sp³","Trigonal planar, 120°, sp²","Linear, 180°, sp","Bent, 104.5°, sp³"],a:1,e:"That carbon has 3 electron groups (C–C, C=O, C–O) and no lone pairs."},
{l:5,q:"Formal charge on N in NO₃⁻ (one N=O, two N–O)?",o:["0","+1","−1","+2"],a:1,e:"FC = 5 − 4 bonds − 0 = +1; the two single-bonded oxygens are −1 each."},
{l:6,q:"Ionic cell: X at the corners and face centers, M at the edge centers and body center. Formula?",o:["MX","MX₂","M₂X","M₄X"],a:0,e:"X = 8(1/8) + 6(1/2) = 4; M = 12(1/4) + 1 = 4 → 1:1."},
{l:7,q:"A process is exothermic and spontaneous. What do you know about ΔS?",o:["It must be positive","It must be negative","It can't be determined from this alone","It must be zero"],a:2,e:"With ΔH < 0, ΔG can be negative with either sign of ΔS (depending on T)."},
{l:7,q:"1.00 atm, 2.50 L, 298 K. Moles of gas?",o:["0.102 mol","9.78 mol","1.02 mol","0.0102 mol"],a:0,e:"n = PV/RT = (1.00)(2.50)/(0.0821 × 298) = 0.102 mol."},
{l:7,q:"While ice melts on a heating curve, the temperature:",o:["Rises steadily","Stays constant while particles leave their fixed lattice","Drops","Jumps to 100 °C"],a:1,e:"Heat breaks attractions during a phase change instead of raising T."},
{l:8,q:"K = 3.5 × 10³ for Fe³⁺ + SCN⁻ ⇌ FeSCN²⁺. [Fe³⁺] = 8.5 × 10⁻⁴ M, [FeSCN²⁺] = 1.5 × 10⁻⁴ M. [SCN⁻] = ?",o:["5.0 × 10⁻⁵ M","2.0 × 10⁻² M","4.5 × 10² M","1.8 × 10⁻⁷ M"],a:0,e:"[SCN⁻] = [FeSCN²⁺] / (K[Fe³⁺]) = 1.5 × 10⁻⁴ / (3.5 × 10³ × 8.5 × 10⁻⁴)."},
{l:8,q:"Initial [Fe³⁺] = 1.00 × 10⁻³, [SCN⁻] = 2.00 × 10⁻⁴; equilibrium [FeSCN²⁺] = 1.50 × 10⁻⁴. K = ?",o:["1.5 × 10⁻⁴","3.5 × 10³","7.5 × 10²","0.75"],a:1,e:"Equilibrium: Fe³⁺ 8.5 × 10⁻⁴, SCN⁻ 5.0 × 10⁻⁵; K = 1.50 × 10⁻⁴ / (8.5 × 10⁻⁴ × 5.0 × 10⁻⁵)."},
{l:10,q:"NH₄Cl solution has pH 5.1. The net Brønsted reaction is:",o:["NH₄⁺ + H₂O ⇌ NH₃ + H₃O⁺","NH₄⁺ + OH⁻ → NH₃ + H₂O","Cl⁻ + H₂O ⇌ HCl + OH⁻","NH₃ + H₂O ⇌ NH₄⁺ + OH⁻"],a:0,e:"Acidic solution → NH₄⁺ donates H⁺ to water; Cl⁻ is a spectator."},
{l:10,q:"Baking soda solution (pH 8.3). Net Brønsted reaction?",o:["HCO₃⁻ + H₂O ⇌ H₂CO₃ + OH⁻","HCO₃⁻ + H₂O ⇌ CO₃²⁻ + H₃O⁺","Na⁺ + H₂O ⇌ NaOH + H⁺","H₂CO₃ ⇌ H₂O + CO₂"],a:0,e:"Basic → HCO₃⁻ accepts H⁺ from water, making OH⁻."},
{l:11,q:"Battery: Pb²⁺/Pb (−0.13 V) and Ag⁺/Ag (+0.80 V). Half-reaction in the Pb compartment?",o:["Pb²⁺ + 2e⁻ → Pb","Pb → Pb²⁺ + 2e⁻","Ag⁺ + e⁻ → Ag","Ag → Ag⁺ + e⁻"],a:1,e:"Lower E° = anode = oxidation. E°cell = 0.80 − (−0.13) = 0.93 V."},
{l:11,q:"Net reaction for Al(s) + Cu²⁺(aq)?",o:["Al + Cu²⁺ → Al³⁺ + Cu","2Al + 3Cu²⁺ → 2Al³⁺ + 3Cu","3Al + 2Cu²⁺ → 3Al³⁺ + 2Cu","Al³⁺ + Cu → Al + Cu²⁺"],a:1,e:"Balance electrons: 2 × 3e⁻ = 3 × 2e⁻ = 6e⁻."}
);
CARDS.push(["Safety glasses policy","Worn at all times in the lab room, over prescription glasses."],["Oxidizer hazard","React with organics, can cause fires (KMnO₄, H₂O₂, HNO₃)."],["Atomic volume ratio","(r₁/r₂)³"],["Brønsted rule from pH","pH < 7: donates H⁺ to water → H₃O⁺. pH > 7: accepts H⁺ from water → OH⁻."],["ICE table","Initial, Change (by coefficients), Equilibrium; plug equilibrium values into K."],["Entropy from a spontaneous endothermic process","ΔS must be positive."]);

/* ---------- extra drills (merged into DRILLS by app.js) ---------- */
const EXTRA_DRILLS = (R, pick, f3) => [
 {id:'avol',t:'Mass & volume · atomic volume ratio',gen(){const A={Li:152,Na:186,K:227,Rb:248,Cs:265,Mg:160,Ca:197,Al:143,Fe:126,Cu:128,Ag:144};const k=Object.keys(A);let a=pick(k),b=pick(k);while(b===a)b=pick(k);if(A[a]<A[b])[a,b]=[b,a];return {p:`${a} has r = ${A[a]} pm and ${b} has r = ${A[b]} pm. How many times larger is the volume of ${a}?`,v:(A[a]/A[b])**3,s:`V ∝ r³, so ratio = (${A[a]}/${A[b]})³ = <b>${f3((A[a]/A[b])**3)}</b>`}}},
 {id:'avol2',t:'Mass & volume · volume of one atom',gen(){const A={Li:152,Na:186,K:227,Cs:265,Mg:160,Al:143,Cu:128,Ag:144};const k=pick(Object.keys(A)),r=A[k]*1e-10;return {p:`Volume (cm³) of one ${k} atom, r = ${A[k]} pm? (1 pm = 10⁻¹⁰ cm; type like 2.7e-23)`,v:4/3*Math.PI*r**3,s:`r = ${A[k]}×10⁻¹⁰ cm → V = (4/3)π(${f3(r)})³ = <b>${f3(4/3*Math.PI*r**3)} cm³</b>`}}},
 {id:'wheel',t:'Emission & absorption · color wheel',gen(){const W=[['red',650,'green',520],['orange',600,'blue',470],['yellow',570,'violet',410],['green',520,'red',650],['blue',470,'orange',600],['violet',410,'yellow',570]];const w=pick(W);const flame=Math.random()<.5;const lam=flame?w[1]:w[3];const ask=pick(['energy (J)','frequency (Hz)']);const nu=3e8/(lam*1e-9),E=6.626e-34*nu;
   return {p:flame?`A flame is ${w[0]}. Color wheel: ${w[0]} ≈ ${w[1]} nm. Find the ${ask} of the emitted light (type like 3.3e-19).`:`A solution looks ${w[0]}. Color wheel: ${w[2]} (opposite ${w[0]}) ≈ ${w[3]} nm. Find the ${ask} of the absorbed light.`,v:ask[0]==='e'?E:nu,s:`${flame?'Flame → use the color seen':'Solution → use the opposite color'}: λ = ${lam} nm = ${lam}×10⁻⁹ m. ν = c/λ = <b>${f3(nu)} Hz</b>; E = hν = <b>${f3(E)} J</b>`}}},
 {id:'gas',t:'Gas laws · PV = nRT',gen(){const P=R(.80,1.20,2),V=R(.5,5,2),T=Math.round(R(273,330,0));const ask=pick(['n','V']);if(ask==='n')return {p:`A gas at ${P} atm fills ${V} L at ${T} K. Moles of gas?`,v:P*V/(0.0821*T),s:`n = PV/RT = (${P})(${V}) / (0.0821 × ${T}) = <b>${f3(P*V/(0.0821*T))} mol</b>`};const n=R(.05,.3,3);return {p:`${n} mol of gas at ${P} atm and ${T} K. Volume (L)?`,v:n*0.0821*T/P,s:`V = nRT/P = (${n})(0.0821)(${T}) / ${P} = <b>${f3(n*0.0821*T/P)} L</b>`}}},
 {id:'ice',t:'Equilibrium · K from an ICE table',gen(){const fe=R(.8,2,2)*1e-3,scn=R(1.5,3,2)*1e-4,x=+(scn*R(.4,.8,2)).toPrecision(3);const K=x/((fe-x)*(scn-x));return {p:`Fe³⁺ + SCN⁻ ⇌ FeSCN²⁺. Initial [Fe³⁺] = ${f3(fe)} M, [SCN⁻] = ${f3(scn)} M. At equilibrium [FeSCN²⁺] = ${f3(x)} M. Find K.`,v:K,s:`x = ${f3(x)}. [Fe³⁺] = ${f3(fe)} − x = ${f3(fe-x)}; [SCN⁻] = ${f3(scn)} − x = ${f3(scn-x)}. K = ${f3(x)} / (${f3(fe-x)} × ${f3(scn-x)}) = <b>${f3(K)}</b>`}}},
 {id:'ice2',t:'Equilibrium · missing concentration',gen(){const K=Math.round(R(150,900,0)),fe=R(1,9,2)*1e-4,scn=R(1,9,2)*1e-4;const c=K*fe*scn;return {p:`K = ${K} for Fe³⁺ + SCN⁻ ⇌ FeSCN²⁺. At equilibrium [Fe³⁺] = ${f3(fe)} M and [SCN⁻] = ${f3(scn)} M. [FeSCN²⁺] = ?`,v:c,s:`[FeSCN²⁺] = K[Fe³⁺][SCN⁻] = ${K} × ${f3(fe)} × ${f3(scn)} = <b>${f3(c)} M</b>`}}},
 {id:'redox',t:'Redox · two couples → E°cell and net reaction',gen(){const T=[['Ag⁺','Ag',1,.80],['Cu²⁺','Cu',2,.34],['Pb²⁺','Pb',2,-.13],['Ni²⁺','Ni',2,-.25],['Fe²⁺','Fe',2,-.44],['Zn²⁺','Zn',2,-.76],['Al³⁺','Al',3,-1.66],['Mg²⁺','Mg',2,-2.37]];let a=pick(T),b=pick(T);while(b===a)b=pick(T);const ca=a[3]>b[3]?a:b,an=ca===a?b:a;const l=(x,y)=>{const gg=(p,q)=>q?gg(q,p%q):p;return x*y/gg(x,y)};const L=l(ca[2],an[2]),mc=L/ca[2],ma=L/an[2],co=n=>n>1?n:'';const E=ca[3]-an[3];
   return {p:`Couples ${a[0]}/${a[1]} (E° = ${a[3].toFixed(2)} V) and ${b[0]}/${b[1]} (E° = ${b[3].toFixed(2)} V). E°cell (V)?`,v:E,s:`Cathode (higher E°, reduction): ${ca[0]} + ${ca[2]}e⁻ → ${ca[1]}. Anode (oxidation, flipped): ${an[1]} → ${an[0]} + ${an[2]}e⁻. Net (× to ${L}e⁻): ${co(ma)}${an[1]} + ${co(mc)}${ca[0]} → ${co(ma)}${an[0]} + ${co(mc)}${ca[1]}. E°cell = ${ca[3].toFixed(2)} − (${an[3].toFixed(2)}) = <b>${E.toFixed(2)} V</b>`}}},
 {id:'cellct',t:'Solid state · ions per cell → formula',gen(){const C=[['corners + face centers',4],['corners only',1],['corners + body center',2],['12 edge centers + body center',4],['8 positions fully inside',8],['body center only',1]];const opts=[[0,3,'MX (NaCl type)'],[1,5,'MX (CsCl type)'],[0,4,'MX₂ (CaF₂ type)']];const o=pick(opts);return {p:`Ionic unit cell: M ions at ${C[o[0]][0]}, X ions at ${C[o[1]][0]}. How many X per M (X/M)?`,v:C[o[1]][1]/C[o[0]][1],s:`M = ${C[o[0]][1]}, X = ${C[o[1]][1]} → ratio ${C[o[1]][1]}:${C[o[0]][1]} → <b>${o[2]}</b>`}}}
];

/* ---------- Lab skills visual: equipment game + technique + precision ---------- */
(() => {
  const base = VIS[0];
  VIS[0] = el => {
    el.innerHTML = `<figure class="vcard"><figcaption>Name that equipment: the final shows pictures and asks for names</figcaption>
      ${'<div class="seg" role="group"><button data-em="g" aria-pressed="true">Gallery</button><button data-em="q" aria-pressed="false">Quiz me</button></div>'}<div id="eqx"></div></figure>
      <figure class="vcard"><figcaption>Technique: what the exam can ask about each piece</figcaption><div class="tbl"><table><thead><tr><th>Equipment</th><th>Best practice</th></tr></thead><tbody>${TECH.map(t => `<tr><td><b>${t[0]}</b></td><td>${t[1]}</td></tr>`).join('')}</tbody></table></div></figure><div id="eqbase"></div>`;
    base(el.querySelector('#eqbase'));
    let mode = 'g', order = [], qi = 0, score = 0;
    const box = el.querySelector('#eqx');
    const gal = () => { box.innerHTML = `<div class="eqgrid">${EQUIP.map(e => `<div class="eqcard">${e[1]}<b>${e[0]}</b><span>${e[2]}</span></div>`).join('')}</div>`; };
    const shuf = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    const quiz = () => { if (qi >= order.length) { box.innerHTML = `<div class="out"><b>Score: ${score} / ${order.length}</b>. ${score === order.length ? 'Perfect.' : 'Go again until it\'s perfect.'}</div><div class="row"><button class="btn" id="eqre">Again</button></div>`; box.querySelector('#eqre').onclick = () => { order = shuf(EQUIP.map((e, i) => i)).slice(0, 15); qi = 0; score = 0; quiz(); }; return; }
      const e = EQUIP[order[qi]]; const wrong = shuf(EQUIP.filter((x, i) => i !== order[qi])).slice(0, 3).map(x => x[0]); const opts = shuf([e[0], ...wrong]);
      box.innerHTML = `<div class="eqq"><div class="eqcard big">${e[1]}</div><div><p class="sub">Picture ${qi + 1} of ${order.length} · score ${score}</p><div class="opts">${opts.map(o => `<button data-o="${o}">${o}</button>`).join('')}</div><div id="eqfb"></div></div></div>`;
      box.querySelectorAll('[data-o]').forEach(b => b.onclick = () => { const ok = b.dataset.o === e[0]; if (ok) score++; box.querySelectorAll('[data-o]').forEach(x => { x.disabled = true; if (x.dataset.o === e[0]) x.classList.add('right'); else if (x === b) x.classList.add('wrong'); });
        box.querySelector('#eqfb').innerHTML = `<div class="exp"><b>${ok ? 'Right.' : 'It\'s a ' + e[0].toLowerCase() + '.'}</b> ${e[2]}.</div><div class="row"><button class="btn" id="eqn">Next</button></div>`; box.querySelector('#eqn').onclick = () => { qi++; quiz(); }; }); };
    el.querySelector('.seg').addEventListener('click', ev => { const b = ev.target.closest('[data-em]'); if (!b) return; mode = b.dataset.em; el.querySelectorAll('[data-em]').forEach(x => x.setAttribute('aria-pressed', x === b)); if (mode === 'g') gal(); else { order = shuf(EQUIP.map((e, i) => i)).slice(0, 15); qi = 0; score = 0; quiz(); } });
    gal();
  };
})();

/* exam-focused study steps */
STEPS[0] = ['Play "Name that equipment" (Quiz me) until you get 15/15.', 'Read the Technique table: one or two rules for each piece.', 'Do the Lab skills quiz: safety is 2 questions, technique is 2.'];
STEPS[1] = ['Run the atomic volume drills: V = (4/3)πr³ and ratio = (r₁/r₂)³.', 'Do one density-by-displacement drill.', 'Check unit cancellation on every answer.'];
STEPS[2] = ['Do the color wheel drill until flame vs. solution is automatic.', 'Remember: flame uses the color seen; solution uses the opposite color.', 'Convert nm to m before ν = c/λ and E = hc/λ.'];
STEPS[3] = ['Write the dissolution reactions in Write-it practice.', 'Tap through the solubility grid, predicting each cell.', 'Write 4 net precipitation reactions and name the spectators.'];
STEPS[4] = ['Toggle ions in the flowchart and say what precipitates at each step.', 'Do the four qual schemes in Write-it practice (new ion sets).', 'Write each precipitate formula with balanced charges.'];
STEPS[5] = ['Do every Lewis structure in Write-it practice on paper, with lone pairs and formal charges.', 'Flip through the VSEPR shapes; say angle and hybridization.', 'Practice multi-center molecules (acetic acid, methanol) atom by atom.'];
STEPS[6] = ['Toggle SC / BCC / FCC and name each from the picture.', 'Do the ionic-cell formula questions in Write-it practice.', 'Run the ions-per-cell drill.'];
STEPS[7] = ['Do the ΔT / entropy questions in Write-it practice.', 'Read the heating curve: what happens to structure on each flat part.', 'Run the PV = nRT drill.'];
STEPS[8] = ['Predict each stress in the simulator before tapping.', 'Write K expressions (Write-it practice).', 'Do both ICE drills: K from initial values, and the missing concentration.'];
STEPS[9] = ['Slide through the titration curve.', 'Memorize the chain: ratio → mmol → molarity → mass → mass %.', 'Do both titration drills (NaOH and Ca(OH)₂) twice.'];
STEPS[10] = ['Do the Brønsted reactions in Write-it practice.', 'Click the pH scale: strong vs. weak at the same concentration.', 'Run the pH drills.'];
STEPS[11] = ['Build cells in the simulator; name anode, cathode, half-reactions.', 'Do the redox items in Write-it practice.', 'Run the two-couple E°cell drill until the net reaction is automatic.'];
