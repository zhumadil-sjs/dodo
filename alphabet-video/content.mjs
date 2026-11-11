// Drehbuch für das Lehrvideo "Das deutsche Alphabet".
//
// Jede Szene hat `beats`: Sätze, die die Stimme spricht. Beat Nr. k blendet das
// k-te Bildelement der Szene ein. Ein Beat kann ein String oder {pause: Sek.}
// sein (stille Pause, z. B. für den Quiz-Countdown).
//
// Wort-Notation: "die L[ie]be ❤️ |i"
//   - optionaler Artikel (der/die/das) am Anfang
//   - [..] = farbig hervorgehobene Buchstaben
//   - letztes Token = Emoji
//   - "|x" = optionales Laut-Etikett unter dem Wort
//
// Text in eckigen Klammern im gesprochenen Text ([excited] usw.) sind
// ElevenLabs-v4-Regieanweisungen und werden in den Untertiteln ausgeblendet.

export const LETTERS = [
  { L: 'A', name: 'Ah', say: 'Ah', words: ['der [A]pfel 🍎', 'das [A]uto 🚗', 'die [A]meise 🐜'] },
  { L: 'B', name: 'Beh', say: 'Beh', words: ['der [B]all ⚽', 'der [B]aum 🌳', 'das [B]rot 🍞'] },
  { L: 'C', name: 'Tseh', say: 'Zeh', words: ['das [C]afé ☕ |k', 'der [C]omputer 💻 |k', 'der [C]lown 🤡 |k'],
    tip: 'C allein ist selten – meist in Fremdwörtern, oft wie K.',
    tipSay: 'Das C allein ist selten. Es kommt meist in Fremdwörtern vor – und klingt dann oft wie ein K.' },
  { L: 'D', name: 'Deh', say: 'Deh', words: ['der [D]elfin 🐬', 'die [D]ose 🥫', 'der [D]rache 🐉'] },
  { L: 'E', name: 'Eh', say: 'Eh', words: ['der [E]lefant 🐘', 'die [E]nte 🦆', 'die [E]rde 🌍'] },
  { L: 'F', name: 'Eff', say: 'Eff', words: ['der [F]isch 🐟', 'die [F]eder 🪶', 'das [F]ahrrad 🚲'] },
  { L: 'G', name: 'Geh', say: 'Geh', words: ['die [G]itarre 🎸', 'die [G]abel 🍴', 'das [G]eschenk 🎁'] },
  { L: 'H', name: 'Hah', say: 'Hah', words: ['der [H]und 🐕', 'das [H]aus 🏠', 'das [H]erz ❤️'],
    tip: 'Am Wortanfang hört man das H – wie ein warmer Hauch.',
    tipSay: 'Am Wortanfang hört man das H – wie ein warmer Hauch.' },
  { L: 'I', name: 'Ih', say: 'Ih', words: ['der [I]gel 🦔', 'die [I]nsel 🏝️', 'die [I]dee 💡'] },
  { L: 'J', name: 'Jott', say: 'Jott', words: ['die [J]acke 🧥', 'das [J]ahr 📅', 'der [J]unge 👦'],
    tip: 'J klingt weich – wie am Anfang von „ja“.',
    tipSay: 'Das J klingt weich, wie am Anfang von: ja!' },
  { L: 'K', name: 'Kah', say: 'Kah', words: ['die [K]atze 🐈', 'der [K]uchen 🍰', 'die [K]erze 🕯️'] },
  { L: 'L', name: 'Ell', say: 'Ell', words: ['der [L]öwe 🦁', 'der [L]öffel 🥄', 'die [L]eiter 🪜'] },
  { L: 'M', name: 'Emm', say: 'Emm', words: ['die [M]aus 🐭', 'der [M]ond 🌙', 'die [M]ilch 🥛'] },
  { L: 'N', name: 'Enn', say: 'Enn', words: ['die [N]ase 👃', 'das [N]est 🪺', 'die [N]udeln 🍝'] },
  { L: 'O', name: 'Oh', say: 'Oh', words: ['die [O]range 🍊', 'das [O]hr 👂', 'die [O]ma 👵'] },
  { L: 'P', name: 'Peh', say: 'Peh', words: ['die [P]izza 🍕', 'der [P]inguin 🐧', 'die [P]uppe 🪆'] },
  { L: 'Q', name: 'Kuh', say: 'Kuh', words: ['die [Qu]alle 🪼', 'das [Qu]adrat 🟥', 'das [Qu]iz ❓'],
    tip: 'Q kommt fast immer mit U: qu = kw.',
    tipSay: 'Das Q kommt fast immer zusammen mit U. Q-U spricht man wie K und W zusammen.' },
  { L: 'R', name: 'Err', say: 'Err', words: ['die [R]ose 🌹', 'das [R]adio 📻', 'der [R]egen 🌧️'],
    tip: 'Das deutsche R kommt meist hinten aus dem Hals.',
    tipSay: 'Das deutsche R kommt meistens hinten aus dem Hals – ein bisschen wie ein leises Gurgeln.' },
  { L: 'S', name: 'Ess', say: 'Ess', words: ['die [S]onne ☀️', 'das [S]ofa 🛋️', 'der [S]alat 🥗'],
    tip: 'Vor einem Vokal klingt S weich und summend – wie eine Biene.',
    tipSay: 'Achtung: Vor einem Vokal klingt das S weich und summend – wie eine Biene.' },
  { L: 'T', name: 'Teh', say: 'Teh', words: ['die [T]omate 🍅', 'der [T]isch 🪑', 'das [T]elefon 📞'] },
  { L: 'U', name: 'Uh', say: 'Uh', words: ['die [U]hr ⏰', 'der [U]hu 🦉', 'die [U]-Bahn 🚇'] },
  { L: 'V', name: 'Fau', say: 'Fau', words: ['der [V]ogel 🐦 |f', 'der [V]ater 👨 |f', 'das [V]eilchen 🌸 |f'],
    tip: 'V klingt meist wie F – in Fremdwörtern wie W: Vase, Video.',
    tipSay: 'Das V klingt meistens wie F. Nur in Fremdwörtern wie Vase oder Video klingt es wie W.' },
  { L: 'W', name: 'Veh', say: 'Weh', words: ['das [W]asser 💧', 'die [W]olke ☁️', 'der [W]al 🐋'],
    tip: 'Obere Zähne berühren leicht die Unterlippe.',
    tipSay: 'Das W ist weich – die oberen Zähne berühren leicht die Unterlippe.' },
  { L: 'X', name: 'Iks', say: 'Iks', words: ['das Ta[x]i 🚕 |ks', 'die He[x]e 🧙 |ks', 'das [X]ylofon 🎶 |ks'],
    tip: 'X klingt immer wie ks.',
    tipSay: 'Das X klingt immer wie K und S zusammen.' },
  { L: 'Y', name: 'Ypsilon', say: 'Ypsilon', words: ['das [Y]oga 🧘 |j', 'die P[y]ramide 🔺 |ü', 'das Hand[y] 📱 |i'],
    tip: 'Y hat drei Gesichter: j · ü · i – mehr dazu später!',
    tipSay: 'Das Ypsilon hat drei Gesichter – mehr dazu später!' },
  { L: 'Z', name: 'Tzett', say: 'Zett', words: ['das [Z]ebra 🦓', 'die [Z]itrone 🍋', 'der [Z]ug 🚆'],
    tip: 'Z klingt immer wie ts.',
    tipSay: 'Das Z klingt immer wie T und S zusammen.' },
];

const UMLAUTS = [
  { L: 'Ä', lower: 'ä', name: 'Äh', say: 'Ä', words: ['der B[ä]r 🐻', 'der K[ä]se 🧀', 'die [Ä]pfel 🍎'],
    tip: 'Ä klingt fast wie E. Oft kommt es von A: Apfel → Äpfel.',
    tipSay: 'Das Ä klingt fast wie ein E. Oft kommt es von A: ein Apfel – zwei Äpfel.' },
  { L: 'Ö', lower: 'ö', name: 'Öh', say: 'Ö', words: ['das [Ö]l 🫒', 'das Br[ö]tchen 🥖', 'der K[ö]nig 👑'],
    tip: 'Trick: Lippen rund wie bei O – und dabei E sagen.',
    tipSay: 'Trick: Forme die Lippen rund wie bei O – und sag dabei E. So entsteht das Ö.' },
  { L: 'Ü', lower: 'ü', name: 'Üh', say: 'Ü', words: ['die T[ü]r 🚪', 'die Br[ü]cke 🌉', 'das Gem[ü]se 🥦'],
    tip: 'Trick: Lippen rund wie bei U – und dabei I sagen.',
    tipSay: 'Trick: Forme die Lippen rund wie bei U – und sag dabei I. So entsteht das Ü.' },
  { L: 'ẞ', lower: 'ß', name: 'Eszett', say: 'Eszett', words: ['die Stra[ß]e 🛣️ |s', 'der Fu[ß] 🦶 |s', 'hei[ß] 🔥 |s'],
    tip: 'ß = scharfes S. Nur nach langem Vokal oder au, ei, eu.',
    tipSay: 'Das Eszett steht nur nach einem langen Vokal oder nach A-U, E-I und E-U. Kein deutsches Wort beginnt mit Eszett.',
    intro: 'Eszett. Das ist ein scharfes S.' },
];

function letterScene(o, chapter, idx, total) {
  const first = o.words[0];
  const firstClean = first.replace(/[\[\]]/g, '').replace(/\s*\|.*$/, '').replace(/\s\S+$/, '');
  const rest = o.words.slice(1).map(w => w.replace(/[\[\]]/g, '').replace(/\s*\|.*$/, '').replace(/\s\S+$/, ''));
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const beats = [
    o.intro || `${o.say}.`,
    `${o.say} wie ${firstClean}.`,
    `${cap(rest[0])}.`,
    `${cap(rest[1])}.`,
  ];
  if (o.tipSay) beats.push(o.tipSay);
  return {
    id: `letter-${o.L === 'ẞ' ? 'sz' : o.L.toLowerCase().replace('ä', 'ae').replace('ö', 'oe').replace('ü', 'ue')}`,
    type: 'letter', chapter, L: o.L, lower: o.lower || o.L.toLowerCase(), name: o.name,
    words: o.words, tip: o.tip, idx, total, beats,
  };
}

const CH = [
  null,
  { num: 1, title: 'Das ABC', sub: 'Von A bis Z', icon: '🔤' },
  { num: 2, title: 'Umlaute & ß', sub: 'Ä · Ö · Ü · ß', icon: '✨' },
  { num: 3, title: 'Lang oder kurz?', sub: 'Vokale richtig sprechen', icon: '📏' },
  { num: 4, title: 'Doppellaute', sub: 'ei · ie · au · eu · äu', icon: '🎵' },
  { num: 5, title: 'Buchstaben-Teams', sub: 'sch · st · sp · ch · ck · tz · ng …', icon: '🤝' },
  { num: 6, title: 'Knifflige Buchstaben', sub: 'S · Z · ß · V · W · J · Y · C …', icon: '🧩' },
  { num: 7, title: 'Buchstabieren & Quiz', sub: 'Jetzt bist du dran!', icon: '🏆' },
];
const NUMWORD = ['', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben'];

function chapterScene(n) {
  const c = CH[n];
  return {
    id: `chapter-${n}`, type: 'chapter', chapter: `Kapitel ${n} · ${c.title}`, ...c,
    beats: [`Kapitel ${NUMWORD[n]}:`, `${c.title.replace('&', 'und').replace('ß', 'Eszett')}.`],
  };
}

const chap = n => `Kapitel ${n} · ${CH[n].title}`;

export const SCENES = [
  {
    id: 'intro', type: 'title', chapter: '',
    title: 'Das deutsche Alphabet', subtitle: 'Buchstaben · Laute · Regeln',
    chips: ['A–Z', 'Ä Ö Ü ß', 'ie · ei', 'sch · sp · st', 'ch · ck · tz', 'Quiz'],
    beats: [
      '[excited] Hallo und herzlich willkommen!',
      'Heute lernen wir das deutsche Alphabet – alle Buchstaben, die Umlaute und das Eszett.',
      '[warmly] Danach entdecken wir die wichtigsten Laute und Regeln: von I-E und E-I bis S-C-H, S-P und S-T.',
      'Zu jedem Buchstaben gibt es Beispielwörter. Sprich einfach laut mit! [excited] Los geht\'s!',
    ],
  },
  {
    id: 'overview', type: 'overview', chapter: 'Überblick',
    beats: [
      'Das deutsche Alphabet hat sechsundzwanzig Buchstaben – von A bis Z.',
      'Dazu kommen drei Umlaute: Ä, Ö und Ü – und ein ganz besonderer Buchstabe: das Eszett.',
      'Schauen wir sie uns einzeln an!',
    ],
  },

  chapterScene(1),
  ...LETTERS.map((o, i) => letterScene(o, chap(1), i, 26)),

  chapterScene(2),
  ...UMLAUTS.map((o, i) => letterScene(o, chap(2), 26 + i, 30)),

  chapterScene(3),
  {
    id: 'dehnungs-h', type: 'compare', chapter: chap(3), title: 'Vokal + h = lang', note: 'Das h bleibt stumm! 🤫',
    cols: [
      { head: 'ah', words: ['die B[ah]n 🚆'] },
      { head: 'eh', words: ['g[eh]en 🚶'] },
      { head: 'ih', words: ['[ih]r 👥'] },
      { head: 'oh', words: ['der S[oh]n 👦'] },
      { head: 'uh', words: ['die K[uh] 🐄'] },
    ],
    beats: [
      'Steht ein H nach einem Vokal, hört man das H nicht. Es macht den Vokal nur lang.',
      'A-H: die Bahn.', 'E-H: gehen.', 'I-H: ihr.', 'O-H: der Sohn.', 'U-H: die Kuh.',
      'Das H bleibt also stumm!',
    ],
  },
  {
    id: 'doppelvokale', type: 'rule', chapter: chap(3), chars: 'aa ee oo', sound: 'lang', ipa: '[aː] [eː] [oː]',
    words: ['das H[aa]r 💇', 'der T[ee] 🍵', 'das B[oo]t ⛵'],
    beats: ['Zwei gleiche Vokale nebeneinander? Dann ist der Laut lang.', 'Das Haar.', 'Der Tee.', 'Das Boot.'],
  },
  {
    id: 'ie', type: 'rule', chapter: chap(3), chars: 'ie', sound: 'langes i', ipa: '[iː]',
    words: ['die L[ie]be ❤️', 'der Br[ie]f ✉️', 'sp[ie]len 🎲'], note: 'Das e hört man nicht!',
    beats: ['I und E zusammen klingen wie ein langes I.', 'Die Liebe.', 'Der Brief.', 'Spielen.', 'Das E hört man dabei nicht!'],
  },
  {
    id: 'lang-kurz', type: 'compare', chapter: chap(3), title: 'Lang oder kurz?', pairs: true,
    note: 'Auch ck und tz zählen als „doppelt“.',
    cols: [
      { head: 'lang', sub: 'ein Konsonant danach', words: ['der [O]fen 🔥', 'die M[ie]te 💶', 'die H[ü]te 🎩'] },
      { head: 'kurz', sub: 'Doppelkonsonant danach', words: ['[o]ffen 🔓', 'die M[i]tte 🎯', 'die H[ü]tte 🛖'] },
    ],
    beats: [
      'Lang oder kurz? Achte auf die Konsonanten danach!',
      'Nach einem langen Vokal steht meist nur ein Konsonant: der Ofen, die Miete, die Hüte.',
      'Nach einem kurzen Vokal steht oft ein doppelter Konsonant: offen, die Mitte, die Hütte.',
      'Auch C-K und T-Z zählen als doppelt.',
    ],
  },
  {
    id: 'e-am-ende', type: 'rule', chapter: chap(3), chars: '-e', sound: 'leises e', ipa: '[ə]',
    words: ['die Katz[e] 🐈', 'die Blum[e] 🌷', 'der Nam[e] 🏷️'], note: 'Nicht stumm wie im Englischen!',
    beats: ['Ein E am Wortende wird immer gesprochen – kurz und leise.', 'Die Katze.', 'Die Blume.', 'Der Name.', 'Es ist also nicht stumm wie im Englischen!'],
  },

  chapterScene(4),
  {
    id: 'ei', type: 'rule', chapter: chap(4), chars: 'ei', sound: 'ai', ipa: '[aɪ̯]',
    words: ['das [Ei]s 🍦', 'dr[ei] 3️⃣', 'das [Ei] 🥚'], note: 'Auch ai klingt so: Mai, Hai 🦈',
    beats: ['E-I spricht man wie: ai.', 'Das Eis.', 'Drei.', 'Das Ei.', 'Auch A-I klingt genauso: der Mai, der Hai.'],
  },
  {
    id: 'ie-ei', type: 'compare', chapter: chap(4), title: 'ie oder ei?', pairs: true,
    note: 'Ein Buchstabe vertauscht – ein ganz anderes Wort!',
    cols: [
      { head: 'ie', sub: 'langes i', words: ['die B[ie]ne 🐝', 'das L[ie]d 🎵', 'W[ie]n 🏰'] },
      { head: 'ei', sub: 'klingt wie ai', words: ['die B[ei]ne 🦵', 'das L[ei]d 😢', 'der W[ei]n 🍷'] },
    ],
    beats: [
      'Vorsicht, Verwechslungsgefahr! I-E und E-I sehen fast gleich aus.',
      'I-E ist ein langes I: die Biene, das Lied, Wien.',
      'E-I klingt wie ai: die Beine, das Leid, der Wein.',
      'Ein Buchstabe vertauscht – und schon ist es ein ganz anderes Wort!',
    ],
  },
  {
    id: 'au', type: 'rule', chapter: chap(4), chars: 'au', sound: 'au', ipa: '[aʊ̯]',
    words: ['das H[au]s 🏠', 'das [Au]to 🚗', 'der B[au]m 🌳'],
    beats: ['A-U klingt einfach wie: au – wie wenn man sich weh tut. Au!', 'Das Haus.', 'Das Auto.', 'Der Baum.'],
  },
  {
    id: 'eu-aeu', type: 'rule', chapter: chap(4), chars: 'eu äu', sound: 'oi', ipa: '[ɔʏ̯]',
    words: ['h[eu]te 📆', 'der [Eu]ro 💶', 'die H[äu]ser 🏘️', 'die B[äu]me 🌲'], note: 'äu kommt von au: Haus → Häuser',
    beats: ['E-U und Ä-U klingen gleich: wie oi.', 'Heute.', 'Der Euro.', 'Die Häuser.', 'Die Bäume.', 'Ä-U kommt oft von A-U: das Haus – die Häuser.'],
  },

  chapterScene(5),
  {
    id: 'sch', type: 'rule', chapter: chap(5), chars: 'sch', sound: 'sch', ipa: '[ʃ]',
    words: ['die [Sch]ule 🏫', 'der Fi[sch] 🐟', 'die [Sch]okolade 🍫'], note: 'Drei Buchstaben – ein Laut. Psst: schhh! 🤫',
    beats: ['Drei Buchstaben, ein Laut: S-C-H klingt wie sch – wie wenn man jemanden leise macht: Schhh!', 'Die Schule.', 'Der Fisch.', 'Die Schokolade.'],
  },
  {
    id: 'st', type: 'rule', chapter: chap(5), chars: 'st', sound: 'scht', ipa: '[ʃt]', label: 'am Wortanfang',
    words: ['der [St]ern ⭐', 'die [St]adt 🏙️', 'der [St]uhl 🪑'], note: 'Aber in der Mitte / am Ende: normales st – Fen[st]er, i[st]',
    beats: ['S-T am Wortanfang spricht man wie: scht.', 'Der Stern.', 'Die Stadt.', 'Der Stuhl.', 'Aber: In der Mitte oder am Ende bleibt es ein normales S-T – wie in Fenster oder in ist.'],
  },
  {
    id: 'sp', type: 'rule', chapter: chap(5), chars: 'sp', sound: 'schp', ipa: '[ʃp]', label: 'am Wortanfang',
    words: ['der [Sp]ort ⚽', 'die [Sp]inne 🕷️', 'der [Sp]iegel 🪞'], note: 'In der Wortmitte meist normal: die We[sp]e',
    beats: ['Genauso bei S-P am Wortanfang: Das klingt wie schp.', 'Der Sport.', 'Die Spinne.', 'Der Spiegel.', 'In der Wortmitte bleibt es meist ein normales S-P: die Wespe.'],
  },
  {
    id: 'ch-ach', type: 'rule', chapter: chap(5), chars: 'ch', sound: 'ach-Laut', ipa: '[x]', label: 'nach a · o · u · au',
    words: ['das Bu[ch] 📖', 'die Na[ch]t 🌙', 'au[ch] ➕'], note: 'Rau, hinten im Hals – wie ein leises Schnarchen.',
    beats: ['Das C-H hat zwei Klänge. Nach A, O, U und A-U kommt der ach-Laut – rau, hinten im Hals.', 'Das Buch.', 'Die Nacht.', 'Auch.'],
  },
  {
    id: 'ch-ich', type: 'rule', chapter: chap(5), chars: 'ch', sound: 'ich-Laut', ipa: '[ç]', label: 'nach e · i · ä · ö · ü · ei · eu · l · n · r',
    words: ['i[ch] 🙋', 'die Mil[ch] 🥛', 'lei[ch]t 🪶'], note: 'Weich und vorne – wie eine fauchende Katze.',
    beats: ['Nach E, I, Ä, Ö, Ü, nach E-I und E-U und nach Konsonanten kommt der ich-Laut – weich und vorne, wie eine fauchende Katze.', 'Ich.', 'Die Milch.', 'Leicht.'],
  },
  {
    id: 'ach-ich', type: 'compare', chapter: chap(5), title: 'Hör den Unterschied!', pairs: true,
    note: 'Der Umlaut macht den Laut weich!',
    cols: [
      { head: 'ach', sub: 'nach a · o · u', words: ['das Bu[ch] 📖', 'die Na[ch]t 🌙', 'das Lo[ch] 🕳️'] },
      { head: 'ich', sub: 'nach ü · ä · ö', words: ['die Bü[ch]er 📚', 'die Nä[ch]te 🌃', 'die Lö[ch]er 🧀'] },
    ],
    beats: ['Hör genau hin!', 'Buch, Nacht, Loch – das ist der ach-Laut.', 'Bücher, Nächte, Löcher – das ist der ich-Laut.', 'Der Umlaut macht den Laut weich!'],
  },
  {
    id: 'chs', type: 'rule', chapter: chap(5), chars: 'chs', sound: 'ks', ipa: '[ks]',
    words: ['se[chs] 6️⃣', 'der Fu[chs] 🦊', 'wa[chs]en 🌱'], note: 'Klingt genau wie x!',
    beats: ['C-H-S klingt wie ks – genau wie das X.', 'Sechs.', 'Der Fuchs.', 'Wachsen.'],
  },
  {
    id: 'ck', type: 'rule', chapter: chap(5), chars: 'ck', sound: 'k', ipa: '[k]',
    words: ['der Zu[ck]er 🍬', 'das Glü[ck] 🍀', 'die Ja[ck]e 🧥'], note: 'ck steht nur nach einem kurzen Vokal.',
    beats: ['C-K klingt einfach wie ein K.', 'Der Zucker.', 'Das Glück.', 'Die Jacke.', 'Merke: C-K steht nur nach einem kurzen Vokal.'],
  },
  {
    id: 'tz', type: 'rule', chapter: chap(5), chars: 'tz', sound: 'ts', ipa: '[ts]',
    words: ['die Ka[tz]e 🐈', 'die Mü[tz]e 🧢', 'si[tz]en 💺'], note: 'tz steht nur nach einem kurzen Vokal.',
    beats: ['T-Z klingt wie ts – genau wie das Z.', 'Die Katze.', 'Die Mütze.', 'Sitzen.', 'Auch T-Z steht nur nach einem kurzen Vokal.'],
  },
  {
    id: 'pf', type: 'rule', chapter: chap(5), chars: 'pf', sound: 'pf', ipa: '[pf]',
    words: ['der A[pf]el 🍎', 'das [Pf]erd 🐴', 'der Ko[pf] 🙂'], note: 'Lippen zu – und dann pusten!',
    beats: ['P-F: Man spricht beide Buchstaben, schnell hintereinander. Erst die Lippen zu, dann pusten!', 'Der Apfel.', 'Das Pferd.', 'Der Kopf.'],
  },
  {
    id: 'qu', type: 'rule', chapter: chap(5), chars: 'qu', sound: 'kw', ipa: '[kv]',
    words: ['[qu]aken 🐸', 'be[qu]em 🛋️', 'die [Qu]elle ⛲'],
    beats: ['Q-U klingt wie K und W zusammen.', 'Quaken – wie ein Frosch.', 'Bequem.', 'Die Quelle.'],
  },
  {
    id: 'ng', type: 'rule', chapter: chap(5), chars: 'ng', sound: 'ein Laut', ipa: '[ŋ]',
    words: ['si[ng]en 🎤', 'der Ri[ng] 💍', 'la[ng] 📏'], note: 'Kein g hörbar!',
    beats: ['N-G ist ein einziger Laut, ganz hinten im Mund. Ein G hört man nicht!', 'Singen.', 'Der Ring.', 'Lang.'],
  },
  {
    id: 'ung', type: 'rule', chapter: chap(5), chars: '-ung', sound: 'ung', ipa: '[ʊŋ]',
    words: ['die Zeit[ung] 📰', 'die Wohn[ung] 🏢', 'die Üb[ung] 📝'], note: 'Super-Tipp: Wörter auf -ung sind immer „die“!',
    beats: ['Die Endung U-N-G hörst du sehr oft.', 'Die Zeitung.', 'Die Wohnung.', 'Die Übung.', 'Super-Tipp: Wörter auf U-N-G sind immer feminin. Es heißt immer: die!'],
  },
  {
    id: 'nk', type: 'rule', chapter: chap(5), chars: 'nk', sound: 'ngk', ipa: '[ŋk]',
    words: ['die Ba[nk] 🏦', 'tri[nk]en 🍹', 'da[nk]e 🙏'],
    beats: ['Bei N-K klingt das N wie bei N-G – und danach kommt ein K.', 'Die Bank.', 'Trinken.', 'Danke.'],
  },
  {
    id: 'ph', type: 'rule', chapter: chap(5), chars: 'ph', sound: 'f', ipa: '[f]',
    words: ['das Al[ph]abet 🔤', 'die [Ph]ysik ⚛️', 'die Stro[ph]e 📜'], note: 'Kommt aus dem Griechischen.',
    beats: ['P-H klingt wie F. Das kommt aus dem Griechischen.', 'Das Alphabet.', 'Die Physik.', 'Die Strophe.'],
  },
  {
    id: 'th', type: 'rule', chapter: chap(5), chars: 'th', sound: 't', ipa: '[t]',
    words: ['das [Th]eater 🎭', 'das [Th]ema 📌', 'die Apo[th]eke 💊'], note: 'Nicht wie im Englischen!',
    beats: ['T-H klingt im Deutschen einfach wie T – nicht wie im Englischen!', 'Das Theater.', 'Das Thema.', 'Die Apotheke.'],
  },
  {
    id: 'tion', type: 'rule', chapter: chap(5), chars: '-tion', sound: 'tsion', ipa: '[tsi̯oːn]',
    words: ['die Informa[tion] ℹ️', 'die Lek[tion] 📘', 'die Sta[tion] 🚉'], note: 'Wörter auf -tion: immer „die“!',
    beats: ['Die Endung T-I-O-N spricht man: tsion.', 'Die Information.', 'Die Lektion.', 'Die Station.', 'Auch hier gilt: immer feminin – die!'],
  },
  {
    id: 'tsch', type: 'rule', chapter: chap(5), chars: 'tsch', sound: 'tsch', ipa: '[tʃ]',
    words: ['Deu[tsch] 🇩🇪', '[tsch]üss 👋', 'kla[tsch]en 👏'], note: 'Vier Buchstaben – ein Laut!',
    beats: ['Vier Buchstaben, ein Laut: T-S-C-H – wie in Deutsch!', 'Deutsch.', 'Tschüss!', 'Klatschen.'],
  },

  chapterScene(6),
  {
    id: 's-weich-scharf', type: 'compare', chapter: chap(6), title: 'Das S: weich oder scharf?',
    cols: [
      { head: 's', sub: 'weich · summend · vor Vokal', words: ['die [S]onne ☀️ |z', 'die Ro[s]e 🌹 |z', 'le[s]en 👓 |z'] },
      { head: 's · ss · ß', sub: 'scharf · zischend', words: ['das Hau[s] 🏠 |s', 'das Wa[ss]er 💧 |s', 'der Fu[ß] 🦶 |s'] },
    ],
    beats: [
      'Das S hat zwei Stimmen.',
      'Vor einem Vokal klingt es weich und summend – wie das englische Z: Sonne, Rose, lesen.',
      'Am Wortende, bei Doppel-S und beim Eszett klingt es scharf und zischend: Haus, Wasser, Fuß.',
    ],
  },
  {
    id: 's-z', type: 'compare', chapter: chap(6), title: 'S klingt wie [z] – Z klingt wie [ts]!', pairs: true,
    cols: [
      { head: 'S', sub: 'weich, summend', words: ['die [S]ahne 🍨 |z', '[s]eit ⏳ |z', 'der [S]aal 🏟️ |z'] },
      { head: 'Z', sub: 'ts – mit kurzem t davor', words: ['der [Z]ahn 🦷 |ts', 'die [Z]eit ⏱️ |ts', 'die [Z]ahl 🔢 |ts'] },
    ],
    beats: [
      'Und jetzt aufgepasst: Das deutsche S klingt oft wie ein englisches Z – aber das deutsche Z klingt wie T-S!',
      'Sahne, seit, Saal – weich und summend.',
      'Zahn, Zeit, Zahl – mit einem kurzen T davor: ts!',
    ],
  },
  {
    id: 'sz-ss', type: 'compare', chapter: chap(6), title: 'ß oder ss?',
    note: 'Beide klingen gleich scharf!',
    cols: [
      { head: 'ß', sub: 'nach langem Vokal / Doppellaut', words: ['die Stra[ß]e 🛣️', 'gro[ß] 🦒', 'der Fu[ß] 🦶'] },
      { head: 'ss', sub: 'nach kurzem Vokal', words: ['das Wa[ss]er 💧', 'der Ku[ss] 💋', 'der Flu[ss] 🏞️'] },
    ],
    beats: [
      'Beide klingen gleich scharf. Aber wann schreibt man was?',
      'Nach einem langen Vokal oder Doppellaut schreibt man Eszett: Straße, groß, Fuß.',
      'Nach einem kurzen Vokal schreibt man Doppel-S: Wasser, Kuss, Fluss.',
    ],
  },
  {
    id: 'v', type: 'compare', chapter: chap(6), title: 'V: wie F oder wie W?',
    cols: [
      { head: 'v = f', sub: 'deutsche Wörter', words: ['der [V]ogel 🐦 |f', '[v]ier 4️⃣ |f', '[v]oll 🫙 |f'] },
      { head: 'v = w', sub: 'Fremdwörter', words: ['die [V]ase 🏺 |w', 'das [V]ideo 🎬 |w', 'das Kla[v]ier 🎹 |w'] },
    ],
    beats: ['Das V hat zwei Klänge.', 'In deutschen Wörtern klingt es wie F: der Vogel, vier, voll.', 'In Fremdwörtern klingt es wie W: die Vase, das Video, das Klavier.'],
  },
  {
    id: 'w', type: 'rule', chapter: chap(6), chars: 'w', sound: 'wie engl. v', ipa: '[v]',
    words: ['der [W]ind 🌬️', 'die [W]urst 🌭', 'die [W]oche 🗓️'], note: 'Nie wie das englische „w“!',
    beats: ['Und das W? Es klingt wie ein englisches V – nie wie das englische W!', 'Der Wind.', 'Die Wurst.', 'Die Woche.'],
  },
  {
    id: 'j', type: 'rule', chapter: chap(6), chars: 'j', sound: 'wie engl. y', ipa: '[j]',
    words: ['[j]a ✅', '[j]ung 🧒', 'der [J]oghurt 🥣'], note: 'Wie das „y“ in „yes“.',
    beats: ['Das J klingt wie das Y im englischen yes.', 'Ja!', 'Jung.', 'Der Joghurt.'],
  },
  {
    id: 'y', type: 'compare', chapter: chap(6), title: 'Y – drei Gesichter',
    cols: [
      { head: 'y = j', sub: 'oft am Anfang', words: ['das [Y]oga 🧘', 'die [Y]acht 🛥️'] },
      { head: 'y = ü', sub: 'griechische Wörter', words: ['der T[y]p 🕺', 'die G[y]mnastik 🤸'] },
      { head: 'y = i', sub: 'englische Wörter', words: ['das Hand[y] 📱', 'die Part[y] 🎉'] },
    ],
    beats: [
      'Das Ypsilon hat drei Gesichter.',
      'Am Wortanfang klingt es oft wie J: das Yoga, die Yacht.',
      'In griechischen Wörtern klingt es wie Ü: der Typ, die Gymnastik.',
      'Und am Ende englischer Wörter wie I: das Handy, die Party.',
    ],
  },
  {
    id: 'c', type: 'compare', chapter: chap(6), title: 'C – das Chamäleon 🦎',
    note: 'cc: Bro[cc]oli 🥦 = k · A[cc]essoire 👜 = ks',
    cols: [
      { head: 'c = k', sub: 'vor a · o · u', words: ['das [C]afé ☕', 'die [C]ola 🥤'] },
      { head: 'c = ts', sub: 'oft vor e · i · ä', words: ['[C]elsius 🌡️', 'der [C]äsar 🏛️'] },
      { head: 'c = s', sub: 'englische Wörter', words: ['die [C]ity 🌆', 'der [C]ent 🪙'] },
    ],
    beats: [
      'Das C ist ein Chamäleon – es passt sich an!',
      'Vor A, O und U klingt es wie K: das Café, die Cola.',
      'Vor E, I und Ä klingt es oft wie ts: Celsius, Cäsar.',
      'In englischen Wörtern klingt es wie S: die City, der Cent.',
      'Und das Doppel-C? In Broccoli klingt es wie K – in Accessoire wie K-S.',
    ],
  },
  {
    id: 'auslaut', type: 'compare', chapter: chap(6), title: 'Am Wortende wird es hart!', pairs: true,
    note: 'b → p   ·   d → t   ·   g → k',
    cols: [
      { head: 'hart', sub: 'am Wortende', words: ['der Hun[d] 🐕 |t', 'der Ta[g] ☀️ |k', 'der Kor[b] 🧺 |p'] },
      { head: 'weich', sub: 'mit Endung', words: ['die Hun[d]e 🐕 |d', 'die Ta[g]e 📆 |g', 'die Kör[b]e 🧺 |b'] },
    ],
    beats: [
      'Am Wortende werden B, D und G hart: B klingt wie P, D wie T und G wie K.',
      'Der Hund, der Tag, der Korb.',
      'Aber im Plural sind sie wieder weich: die Hunde, die Tage, die Körbe.',
      'Also: B wird P, D wird T, G wird K – aber nur am Ende!',
    ],
  },
  {
    id: 'ig', type: 'rule', chapter: chap(6), chars: '-ig', sound: 'ich', ipa: '[ɪç]', label: 'am Wortende',
    words: ['der Kön[ig] 👑', 'der Hon[ig] 🍯', 'zwanz[ig] 2️⃣0️⃣'],
    beats: ['Am Wortende klingt I-G wie: ich.', 'Der König.', 'Der Honig.', 'Zwanzig.'],
  },
  {
    id: 'er', type: 'rule', chapter: chap(6), chars: '-er', sound: 'kurzes a', ipa: '[ɐ]', label: 'am Wortende',
    words: ['der Lehr[er] 👨‍🏫', 'die Mutt[er] 👩', 'ab[er] 🤔'], note: 'Auch r nach langem Vokal wird weich: Uh[r], Tü[r]',
    beats: ['Ein E-R am Wortende klingt fast wie ein kurzes A.', 'Der Lehrer.', 'Die Mutter.', 'Aber.', 'Auch ein R nach einem langen Vokal wird ganz weich: die Uhr, die Tür.'],
  },

  chapterScene(7),
  {
    id: 'spell-berlin', type: 'spell', chapter: chap(7), word: 'BERLIN', emoji: '🐻',
    names: ['Beh', 'Eh', 'Err', 'Ell', 'Ih', 'Enn'],
    beats: ['Jetzt üben wir Buchstabieren! Wie schreibt man Berlin?', 'Beh. Eh. Err. Ell. Ih. Enn.', 'Berlin!'],
  },
  {
    id: 'spell-muenchen', type: 'spell', chapter: chap(7), word: 'MÜNCHEN', emoji: '🥨',
    names: ['Emm', 'Üh', 'Enn', 'Tseh', 'Hah', 'Eh', 'Enn'],
    beats: ['Und wie schreibt man München?', 'Emm. Ü. Enn. Zeh. Hah. Eh. Enn.', 'München!'],
  },
  {
    id: 'spell-fussball', type: 'spell', chapter: chap(7), word: 'FUßBALL', emoji: '⚽',
    names: ['Eff', 'Uh', 'Eszett', 'Beh', 'Ah', 'Ell', 'Ell'],
    beats: ['Und jetzt mit Eszett: Fußball!', 'Eff. Uh. Eszett. Beh. Ah. Ell. Ell.', 'Fußball!'],
  },
  ...[
    { word: 'Eichhörnchen', emoji: '🐿️', prompt: '[excited] Quiz-Zeit! Lies dieses Wort laut.',
      parts: [['Ei', 'ai'], ['ch', 'ich'], ['hörn', ''], ['ch', 'ich'], ['en', '']],
      explain: 'E-I klingt wie ai – und das C-H ist hier zweimal der weiche ich-Laut.' },
    { word: 'Spielzeug', emoji: '🧸', prompt: 'Nächstes Wort! Lies laut.',
      parts: [['Sp', 'schp'], ['ie', 'langes i'], ['l', ''], ['z', 'ts'], ['eu', 'oi'], ['g', 'k']],
      explain: 'S-P wird schp, I-E ist lang, Z klingt wie ts, E-U wie oi – und das G am Ende klingt wie K.' },
    { word: 'Schmetterling', emoji: '🦋', prompt: 'Und dieses Wort?',
      parts: [['Sch', 'sch'], ['m', ''], ['e', 'kurz'], ['tt', ''], ['er', ''], ['li', ''], ['ng', 'ein Laut']],
      explain: 'S-C-H am Anfang, das Doppel-T macht das E kurz, und N-G ist ein einziger Laut.' },
    { word: 'Frühstück', emoji: '🥐', prompt: 'Weiter geht\'s!',
      parts: [['Fr', ''], ['üh', 'langes ü'], ['st', 'scht'], ['ü', 'kurz'], ['ck', 'k']],
      explain: 'Ü-H ist ein langes Ü. Und S-T am Anfang von Stück klingt wie scht.' },
    { word: 'Straßenbahn', emoji: '🚋', prompt: 'Fast geschafft!',
      parts: [['St', 'scht'], ['ra', ''], ['ß', 'scharf'], ['en', ''], ['b', ''], ['ah', 'langes a'], ['n', '']],
      explain: 'S-T wird scht, das Eszett ist scharf, und A-H ist lang.' },
    { word: 'Zwiebel', emoji: '🧅', prompt: 'Das letzte Wort!',
      parts: [['Z', 'ts'], ['w', 'v'], ['ie', 'langes i'], ['b', ''], ['el', '']],
      explain: 'Z klingt wie ts, W wie ein englisches V, und I-E ist ein langes I.' },
  ].map((q, i) => ({
    id: `quiz-${i + 1}`, type: 'quiz', chapter: chap(7), qn: i + 1, qtotal: 6, ...q,
    beats: [q.prompt, { pause: 3.4 }, `${q.word}!`, q.explain],
  })),
  {
    id: 'recap', type: 'recap', chapter: 'Wiederholung',
    beats: [
      'Zum Schluss noch einmal das ganze Alphabet. Sprich mit!',
      LETTERS.map(l => l.say).join(', ') + '.',
      'Und dazu: Ä, Ö, Ü – und Eszett!',
    ],
  },
  {
    id: 'outro', type: 'outro', chapter: '',
    beats: [
      '[excited] Super gemacht! Du kennst jetzt das deutsche Alphabet und die wichtigsten Laute.',
      '[warmly] Übe jeden Tag ein bisschen: Lies laut, buchstabiere deinen Namen und hör genau hin.',
      'Bis zum nächsten Mal – tschüss!',
    ],
  },
];

// Für Szenen mit gleichmäßig verteilter Unter-Animation (Buchstabieren, Wiederholung).
export const ALL_LETTERS = LETTERS;
export const ALL_UMLAUTS = UMLAUTS;
