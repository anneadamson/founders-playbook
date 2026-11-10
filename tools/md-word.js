// Markdown -> Word, TECH x LEGAL kujunduses.
//
//   node md-word.js valjund.docx fail1.md [fail2.md ...]
//
// Mitu faili lahevad uhte dokumenti, igauks oma lehelt. Sisukord tuleb
// automaatselt, kui faile on rohkem kui uks.
//
// Kujundus: Arial, tint 1A1A1A, aktsent FA5F20, paisetaust FBEAE1,
// joon D9D9D9. Sama, mis TXL Wordi dokumentidel.

const fs = require('fs');
const path = require('path');
const D = (() => {
  const kohad = [process.env.DOCX_PATH, 'docx',
                 path.join(__dirname, 'node_modules', 'docx'),
                 path.join(process.cwd(), 'node_modules', 'docx')].filter(Boolean);
  for (const k of kohad) { try { return require(k); } catch (e) {} }
  console.error('docx paketti ei leidnud. Tee uks neist:');
  console.error('  npm install docx            (siinsamas kaustas)');
  console.error('  DOCX_PATH=/tee/docx node md-word.js ...');
  process.exit(1);
})();
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle,
  TableOfContents, PageBreak, LevelFormat, convertInchesToTwip,
} = D;

const INK = '1A1A1A', ACC = 'FA5F20', FILL = 'FBEAE1', LINE = 'D9D9D9', MUTED = '55524E';
const F = 'Arial';
const LEHT_LAIUS = 11906, VEERIS = 1134;
const SISU = LEHT_LAIUS - 2 * VEERIS;   // 9638 DXA

// ---------- inline: **rasve**, `kood`, *kaldkiri* ----------
function runid(tekst, baas = {}) {
  const out = [];
  // [NURKSULUD] = lahtine koht, oranž ja rasvane — vt AGENTS.md
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*\s][^*]*\*|\[[A-ZÕÄÖÜ0-9][^\]]*\])/g;
  let viimane = 0, m;
  const lisa = (t, lisaks) => {
    if (!t) return;
    out.push(new TextRun({ text: t, font: F, size: 20, color: INK, ...baas, ...lisaks }));
  };
  while ((m = re.exec(tekst)) !== null) {
    lisa(tekst.slice(viimane, m.index));
    const s = m[0];
    if (s.startsWith('**')) lisa(s.slice(2, -2), { bold: true });
    else if (s.startsWith('`')) lisa(s.slice(1, -1), { font: 'Consolas', size: 18, color: '7A3410' });
    else if (s.startsWith('[')) lisa(s, { bold: true, color: ACC });
    else lisa(s.slice(1, -1), { italics: true });
    viimane = re.lastIndex;
  }
  lisa(tekst.slice(viimane));
  return out.length ? out : [new TextRun({ text: '', font: F, size: 20 })];
}

const JOON = { bottom: { style: BorderStyle.SINGLE, size: 6, color: LINE, space: 6 } };

// ---------- plokk ----------
function teisenda(md, pealkiriTase = 1) {
  const read = md.split('\n');
  const osad = [];
  let i = 0;

  const tabeliRida = r => /^\s*\|.*\|\s*$/.test(r);
  const lahuRida = r => /^\s*\|[\s:|-]+\|\s*$/.test(r);
  const lahters = r => r.trim().replace(/^\||\|$/g, '').split('|').map(x => x.trim());

  while (i < read.length) {
    const r = read[i];

    if (!r.trim()) { i++; continue; }

    // koodiplokk
    if (/^\s*```/.test(r)) {
      i++;
      const kood = [];
      while (i < read.length && !/^\s*```/.test(read[i])) kood.push(read[i++]);
      i++;
      kood.forEach((rida, n) => osad.push(new Paragraph({
        children: [new TextRun({ text: rida || ' ', font: 'Consolas', size: 17, color: '3A3734' })],
        shading: { type: ShadingType.CLEAR, fill: 'F7F5F3' },
        spacing: { before: n === 0 ? 120 : 0, after: n === kood.length - 1 ? 160 : 0 },
        indent: { left: 170 },
      })));
      continue;
    }

    // tabel
    if (tabeliRida(r) && i + 1 < read.length && lahuRida(read[i + 1])) {
      const pais = lahters(r);
      i += 2;
      const kere = [];
      while (i < read.length && tabeliRida(read[i])) kere.push(lahters(read[i++]));
      const n = pais.length;
      const lai = Math.floor(SISU / n);
      const laiused = Array(n).fill(lai);
      laiused[n - 1] = SISU - lai * (n - 1);
      const lahter = (t, on_pais, ci) => new TableCell({
        width: { size: laiused[ci], type: WidthType.DXA },
        shading: on_pais ? { type: ShadingType.CLEAR, fill: FILL } : undefined,
        margins: { top: 60, bottom: 60, left: 100, right: 100 },
        children: [new Paragraph({
          children: runid(t, on_pais ? { bold: true, color: ACC } : {}),
          spacing: { before: 0, after: 0 },
        })],
      });
      osad.push(new Table({
        columnWidths: laiused,
        width: { size: SISU, type: WidthType.DXA },
        borders: ['top', 'bottom', 'left', 'right', 'insideHorizontal', 'insideVertical']
          .reduce((a, k) => (a[k] = { style: BorderStyle.SINGLE, size: 4, color: LINE }, a), {}),
        rows: [new TableRow({ children: pais.map((t, c) => lahter(t, true, c)), tableHeader: true })]
          .concat(kere.map(rr => new TableRow({
            children: Array.from({ length: n }, (_, c) => lahter(rr[c] ?? '', false, c)),
          }))),
      }));
      osad.push(new Paragraph({ text: '', spacing: { after: 140 } }));
      continue;
    }

    // joon
    if (/^\s*---+\s*$/.test(r)) {
      osad.push(new Paragraph({ border: JOON, spacing: { before: 80, after: 160 } }));
      i++; continue;
    }

    // pealkiri
    const h = r.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const tase = Math.min(h[1].length + pealkiriTase - 1, 4);
      const suurus = [30, 24, 21, 19][tase - 1];
      osad.push(new Paragraph({
        heading: [HeadingLevel.HEADING_1, HeadingLevel.HEADING_2,
                  HeadingLevel.HEADING_3, HeadingLevel.HEADING_4][tase - 1],
        children: [new TextRun({
          text: h[2].replace(/\*\*/g, ''), font: F, size: suurus, bold: true,
          color: tase <= 2 ? ACC : INK,
        })],
        spacing: { before: tase === 1 ? 240 : 220, after: 110 },
        border: tase === 1 ? JOON : undefined,
      }));
      i++; continue;
    }

    // tsitaat
    if (/^\s*>\s?/.test(r)) {
      const read2 = [];
      while (i < read.length && /^\s*>\s?/.test(read[i])) read2.push(read[i++].replace(/^\s*>\s?/, ''));
      read2.forEach(t => osad.push(new Paragraph({
        children: runid(t, { italics: true, color: MUTED }),
        indent: { left: 340 },
        border: { left: { style: BorderStyle.SINGLE, size: 12, color: ACC, space: 10 } },
        spacing: { before: 60, after: 60 },
      })));
      osad.push(new Paragraph({ text: '', spacing: { after: 100 } }));
      continue;
    }

    // loetelu
    const b = r.match(/^(\s*)[-*·]\s+(.*)$/);
    const nr = r.match(/^(\s*)(\d+)\.\s+(.*)$/);
    if (b || nr) {
      const tase = Math.min(Math.floor(((b || nr)[1].length) / 2), 2);
      let tekst = b ? b[2] : nr[3];
      // jargmised taandrea jatkud
      while (i + 1 < read.length && /^\s{2,}\S/.test(read[i + 1]) &&
             !/^(\s*)([-*·]|\d+\.)\s/.test(read[i + 1])) {
        tekst += ' ' + read[++i].trim();
      }
      osad.push(new Paragraph({
        children: runid(tekst),
        numbering: { reference: b ? 'txl-tapp' : 'txl-number', level: tase },
        spacing: { before: 30, after: 30 },
      }));
      i++; continue;
    }

    // tavaline loik, kokku kuni tyhja reani
    const lohk = [r.trim()];
    while (i + 1 < read.length && read[i + 1].trim() &&
           !/^(#{1,4}\s|\s*[-*·]\s|\s*\d+\.\s|\s*>|\s*```|\s*\|)/.test(read[i + 1]) &&
           !/^\s*---+\s*$/.test(read[i + 1])) {
      lohk.push(read[++i].trim());
    }
    osad.push(new Paragraph({
      children: runid(lohk.join(' ')),
      spacing: { before: 60, after: 120 }, alignment: AlignmentType.LEFT,
    }));
    i++;
  }
  return osad;
}

// ---------- kokku ----------
const [valjund, ...sisendid] = process.argv.slice(2);
if (!valjund || !sisendid.length) {
  console.error('kasutus: node md-word.js valjund.docx fail1.md [fail2.md ...]');
  process.exit(1);
}

const mitu = sisendid.length > 1;
const lapsed = [];

if (mitu) {
  lapsed.push(new Paragraph({
    children: [new TextRun({ text: 'Sisukord', font: F, size: 30, bold: true, color: ACC })],
    spacing: { after: 160 }, border: JOON,
  }));
  lapsed.push(new TableOfContents('Sisukord', { hyperlink: true, headingStyleRange: '1-3' }));
  lapsed.push(new Paragraph({ children: [new PageBreak()] }));
}

sisendid.forEach((f, n) => {
  if (n > 0) lapsed.push(new Paragraph({ children: [new PageBreak()] }));
  const md = fs.readFileSync(f, 'utf8');
  lapsed.push(...teisenda(md));
});

const doc = new Document({
  creator: 'TECH x LEGAL Advokaadibüroo OÜ',
  title: path.basename(valjund, '.docx'),
  styles: {
    default: {
      document: { run: { font: F, size: 20, color: INK } },
    },
    paragraphStyles: [1, 2, 3, 4].map(t => ({
      id: `Heading${t}`, name: `Heading ${t}`, basedOn: 'Normal', next: 'Normal',
      quickFormat: true,
      run: { font: F, bold: true, size: [30, 24, 21, 19][t - 1], color: t <= 2 ? ACC : INK },
      paragraph: { spacing: { before: 240, after: 110 }, outlineLevel: t - 1 },
    })),
  },
  numbering: {
    config: [
      { reference: 'txl-tapp', levels: [0, 1, 2].map(l => ({
          level: l, format: LevelFormat.BULLET, text: ['•', '–', '·'][l],
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 300 + l * 280, hanging: 200 } } },
        })) },
      { reference: 'txl-number', levels: [0, 1, 2].map(l => ({
          level: l, format: LevelFormat.DECIMAL, text: `%${l + 1}.`,
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 300 + l * 280, hanging: 220 } } },
        })) },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: LEHT_LAIUS, height: 16838 },
        margin: { top: VEERIS, bottom: VEERIS, left: VEERIS, right: VEERIS },
      },
    },
    children: lapsed,
  }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(valjund, buf);
  console.log('ok', valjund, '|', sisendid.length, 'faili |', lapsed.length, 'plokki');
});
