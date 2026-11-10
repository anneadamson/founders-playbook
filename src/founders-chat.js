/* Q&A panel for the Founders' Agreement generator.
   1) Quick questions: instant guides built from the user's own answers (no AI, no network).
   2) Free text: asked to Claude through the page's "sample" capability, with the agreement as context.
   Not legal advice. */
(function (root) {
'use strict';
const K = root.FoundersKit;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pct = (n) => (Math.round(n * 10) / 10).toString().replace(/\.0$/, '');

const CHIPS = [
  ['leave', 'I am leaving the company. What is the process?'],
  ['removed', 'The others want me out. What happens?'],
  ['sell', 'I want to sell my shares. What do I need?'],
  ['investor', 'An investor wants to join. What changes?'],
  ['sha', 'What changes if we sign a shareholders\' agreement (SHA)?'],
  ['stuck', 'We cannot agree. What now?'],
  ['away', 'I will be away for months. What about my shares?'],
];
const DISCLAIMER = 'This is general information based on your draft, not legal advice. Ask a lawyer before you act.';

function sec(a, id) { const b = K.build(a); return b.R && b.R[id] ? b.R[id] : '?'; }

/* ---------- deterministic guides: each returns HTML ---------- */
function list(items) { return '<ul>' + items.map((x) => '<li>' + x + '</li>').join('') + '</ul>'; }
function ol(items) { return '<ol>' + items.map((x) => '<li>' + x + '</li>').join('') + '</ol>'; }

function leaverRows(p, m, s) {
  const v = K.vestedFraction(p, m);
  const vested = v * s, unv = (1 - v) * s;
  const rows = [];
  rows.push(['Bad Leaver', pct(s) + '% of the company (all your shares)', 'nothing']);
  rows.push(['Good Leaver', pct(unv) + '% (unvested)', pct(vested) + '% (vested), paid at Fair Value if the company or the founders buy it']);
  if (p.quit === 'voluntary') rows.push(['Voluntary Leaver', pct(unv + vested * p.quitPct / 100) + '% (unvested and ' + pct(p.quitPct) + '% of vested)', pct(vested * (1 - p.quitPct / 100)) + '% (the rest of vested), at Fair Value']);
  return { v, rows };
}

function leaveGuide(a) {
  const p = K.leaveParams(a);
  const nrs = { leave: sec(a, 'leave'), vesting: sec(a, 'vesting'), secrets: sec(a, 'secrets'), nocompete: sec(a, 'nocompete'), selling: sec(a, 'selling'), ip: sec(a, 'ip'), disputes: sec(a, 'disputes') };
  const F = (a.founders || []).filter((f) => (f.name || '').trim() || (f.pct || '').trim());
  const opts = (F.length ? F : [{ name: 'Your shares', pct: '30' }]).map((f, i) => '<option value="' + esc(f.pct || '0') + '">' + esc(f.name || 'Founder ' + (i + 1)) + ' (' + esc(f.pct || '?') + '%)</option>').join('');
  const how = p.quit === 'good' ? 'You keep what you have earned (Good Leaver).' : p.quit === 'voluntary' ? 'You give up the unearned part and ' + pct(p.quitPct) + '% of what you have earned (Voluntary Leaver).' : 'You lose all your shares (Bad Leaver). This is the harshest choice.';
  return '<h4>If you are leaving: the short version</h4>' +
    '<p>Your draft deals with this in section ' + nrs.leave + ' (and the earning rules in section ' + nrs.vesting + '). How you leave decides what happens to your shares.</p>' +
    '<h5>1. How are you leaving?</h5>' + list([
      '<b>You quit on your own:</b> ' + how,
      '<b>You and the company agree on the exit:</b> you are a Good Leaver unless the exit agreement says otherwise. Put the leaver status in writing in that agreement.',
      '<b>You are let go without cause, or leave because of illness:</b> Good Leaver.',
      '<b>Serious breach you did not fix within 30 days, a criminal conviction (not traffic), or serious damage you did not make good:</b> Bad Leaver. If the company finds this out within 12 months after you leave, you can be reclassified.',
    ]) +
    '<h5>2. What happens to your shares? Try your numbers</h5>' +
    '<div class="lcalc"><label>Whose shares?<select data-l="s">' + opts + '</select></label><label>Months since the vesting start date<input type="number" min="0" max="120" value="18" data-l="m"></label></div>' +
    '<div data-l="out"></div>' +
    '<h5>3. What is the process, and how long does it take?</h5>' + ol([
      'The day you stop working for the company is the <b>trigger date</b>.',
      'Within <b>90 days</b> the company (or the founders who remain) must send you a written notice if it wants your shares. If it does nothing, it loses that right.',
      'You hand over the shares at least <b>14 days</b> after the notice (or after Fair Value is set, if you are paid). It can be done in several steps up to a year apart.',
      'Fair Value: the company sets it in good faith. You have <b>7 days</b> to disagree in writing. Then an independent expert decides; you and the company pick the expert within 14 days.',
      p.buyer === 'founders' ? 'The remaining founders buy the shares directly.' : 'The company buys, and may pass the right on to the remaining founders. The company can hold shares worth at most one third of its share capital, so the other founders may have to buy instead.',
      'A share transfer in an OÜ is signed in front of a notary, unless your articles allow a written agreement.',
    ]) +
    '<h5>4. What you must keep doing after you leave</h5>' + list([
      'Keep company secrets for <b>' + p.secrecy + ' years</b> after you stop being a shareholder (section ' + nrs.secrets + ').',
      p.nc ? 'No competing business for <b>' + p.nc + ' months</b> in ' + esc(p.territory) + ', and no recruiting the team (section ' + nrs.nocompete + ').' : 'No non-compete after you leave, but you may not recruit the team or break the secrecy rules.',
      'What you built for the company belongs to the company (section ' + nrs.ip + '). Make sure the IP assignment is signed.',
    ]) +
    '<h5>5. What to think about before you give notice</h5>' + list([
      '<b>Your other contracts.</b> A work or service contract has its own notice period. This agreement does not replace it.',
      '<b>Your management board seat.</b> Stepping down needs a formal step and a change in the Business Register. Ask a lawyer how.',
      '<b>Money you owe the company or it owes you:</b> loans, guarantees, unpaid pay, expenses.',
      '<b>Hand over:</b> accounts, passwords, code, customer contacts, company equipment.',
      '<b>Put it in writing.</b> Tell the other founders in writing, and ask for written confirmation of your leaver status.',
      '<b>Tax.</b> Selling or handing back shares can have tax effects. Talk to an accountant first.',
      p.married ? '<b>Your spouse.</b> If your shares are joint property, the spouse may need to approve the transfer (Family Law Act § 31).' : '',
    ].filter(Boolean)) +
    '<h5>6. If there is also a shareholders\' agreement (SHA) with investors</h5>' + list([
      'Investors may have to approve a share transfer, and their majority has rights over the company\'s call option.',
      'They may have first refusal and co-sale rights on any shares you sell.',
      'The signed SHA governs. Read its leaver, transfer and non-compete sections before you act.',
    ]) +
    '<p class="fine">' + DISCLAIMER + '</p>';
}

function removedGuide(a) {
  const p = K.leaveParams(a);
  const n = sec(a, 'leave'), d = sec(a, 'disputes');
  return '<h4>If the other founders want you out</h4>' +
    '<p>Under your draft (section ' + n + ') a founder is not removed from the shares just because the others want it. What happens depends on <b>why</b> the working relationship ends.</p>' + list([
      '<b>Without cause:</b> you are a Good Leaver. The unearned shares go back for free. You keep what you earned, or are paid Fair Value if the company or founders buy it.',
      '<b>For cause:</b> Bad Leaver only if there is a serious breach not fixed within 30 days after being asked, a criminal conviction (not traffic), or serious damage not made good in 30 days. The others bear the burden of showing that.',
      '<b>The others can decide together that you are not a Bad Leaver</b> even if the wording fits. You cannot force that.',
      '<b>Agreed exit:</b> counts as Good Leaver unless the exit agreement says otherwise. Read that agreement carefully before you sign.',
    ]) +
    '<h5>What you can do</h5>' + ol([
      'Ask for the reason in writing and check it against the Bad Leaver list in section ' + n + '.',
      'If you disagree about <b>Fair Value</b>, you have 7 days to say so in writing. An independent expert then decides.',
      'If you disagree about whether you are a Bad Leaver, talk first, then mediation, then the Harju County Court (section ' + d + ').',
      'Check the working or service contract: removal as management board member and ending the contract follow their own rules.',
    ]) +
    '<p class="fine">' + DISCLAIMER + '</p>';
}

function sellGuide(a) {
  const p = K.leaveParams(a);
  const n = sec(a, 'selling');
  return '<h4>If you want to sell your shares</h4>' +
    '<p>Your draft deals with this in section ' + n + '. You need all of these:</p>' + ol([
      'Written approval from the management board (more than half of the members). The board must approve if the rules are followed.',
      '<b>First refusal:</b> offer the shares to the other shareholders first, on the same terms and price. They have 30 days. If they do not take everything, you may sell the rest to the buyer within 60 days after that, on terms no better for the buyer.',
      p.lock ? '<b>No selling to outsiders while you are still earning your shares</b>, unless all other founders agree in writing.' : 'No special lock-in in your draft, but the vesting rules still apply to shares you have not yet earned.',
      'The buyer signs the adherence form (Schedule D), so they accept the agreement.',
      'The price is paid in cash.',
      'A notary signs the transfer, unless your articles allow a written agreement (share capital at least 10,000 euros and fully paid in).',
    ]) +
    '<h5>Think about</h5>' + list([
      'Unearned shares cannot be sold as if they were yours: they go back to the company if you leave.',
      'Tax: talk to an accountant before you sell.',
      p.married ? 'Your spouse may need to approve if the shares are joint property.' : '',
      'With investors (SHA): their approval, first refusal and co-sale rights usually apply too.',
    ].filter(Boolean)) +
    '<p class="fine">' + DISCLAIMER + '</p>';
}

function investorGuide(a) {
  const d = sec(a, 'decisions'), sh = sec(a, 'shares');
  return '<h4>If an investor wants to join</h4>' + ol([
    'Issuing new shares is a <b>big decision</b> (section ' + d + '). It needs ' + ({ majority: 'more than half', twothirds: 'two-thirds', threequarters: 'three-quarters', all: 'everyone' }[a.majority] || 'two-thirds') + ' of the votes.',
    'Every shareholder has <b>first pick</b> of new shares in proportion to what they own (section ' + sh + '; Commercial Code § 193). Excluding that needs at least three-quarters of the votes.',
    'Changing the articles needs at least two-thirds of the votes (§ 175). Expect the investor to ask for changes.',
    'Your founders\' agreement does not disappear. The investor will ask you to sign a <b>shareholders\' agreement (SHA)</b> that keeps your vesting, leaver and non-compete rules and adds investor rights.',
    'Check the <b>option pool</b> (' + (a.pool || 0) + '% now). Investors often ask for it to be set up or enlarged before they put money in.',
  ]) + '<h5>What the investor will usually add</h5>' + list(K.SHA_ADDONS.slice(1, 2)) +
    '<p class="fine">' + DISCLAIMER + '</p>';
}

function shaGuide() {
  return '<h4>What changes with a shareholders\' agreement (SHA)?</h4>' + list(K.SHA_ADDONS) +
    '<h5>Things to think about as a founder</h5>' + list([
      'Which of your founders\' agreement rules does the SHA replace? The SHA usually replaces it. Do not keep two agreements that disagree.',
      'Who is the <b>Investor Majority</b>, and what can it block? Look at the list of matters that need its consent.',
      'Drag-along: can a majority force you to sell? At what price and under which conditions?',
      'Leaver rules: do investors get a say in what happens to a leaver\'s shares?',
      'Anti-dilution and liquidation preference change what you receive when the company is sold. Ask for a worked example with numbers.',
    ]) + '<p class="fine">' + DISCLAIMER + '</p>';
}

function stuckGuide(a) {
  const d = sec(a, 'decisions'), dis = sec(a, 'disputes');
  const rule = { mediator: 'Cool-off of 14 days with no vote, then a mediator you all accept, then court.', shootout: 'Cool-off of 14 days, then a mediator (30 days), then a "buy or sell" offer: one founder names a price per share, and each other founder either sells at that price or buys the offering founder out at it.', none: 'Your draft has no special rule: you go to court.' }[a.deadlock];
  return '<h4>If you cannot agree</h4><p>Your rule (section ' + d + '): ' + rule + '</p>' + list([
    'Big decisions need ' + ({ majority: 'more than half', twothirds: 'two-thirds', threequarters: 'three-quarters', all: 'everyone' }[a.majority] || 'two-thirds') + ' of the votes (section ' + d + '). Day-to-day matters belong to the management board.',
    'Written votes: if someone does not answer by the deadline, they count as voting against (Commercial Code § 173).',
    'Courts: the first court is the Harju County Court, and Estonian law applies (section ' + dis + ').',
  ]) + '<p class="fine">' + DISCLAIMER + '</p>';
}

function awayGuide(a) {
  const v = sec(a, 'vesting'), l = sec(a, 'leave');
  const rule = { none: 'Your draft has no leave rule: vesting simply keeps running.', excl: 'If a founder is away more than 56 days in total in any 12 months, the others may pause their vesting for the extra days. Sickness, pregnancy and parental leave are excluded.', model: 'If a founder is away more than 56 days in total in any 12 months, the others may pause their vesting for the extra days, for any reason.' }[a.absence];
  return '<h4>If you will be away for months</h4><p>' + rule + '</p>' + list([
    'Paused vesting restarts where it stopped and the vesting period is extended by the same time (section ' + l + ').',
    'The founder on leave does not vote on pausing their own vesting.',
    'Your working relationship has to continue: if it ends, the leaver rules apply instead (section ' + l + ').',
    'Talk to the others <b>before</b> you go and write down what you agree. A pause for parental leave or illness may raise fairness and discrimination issues. Ask a lawyer.',
  ]) + '<p class="fine">' + DISCLAIMER + '</p>';
}

const GUIDES = { leave: leaveGuide, removed: removedGuide, sell: sellGuide, investor: investorGuide, sha: shaGuide, stuck: stuckGuide, away: awayGuide };

/* ---------- minimal markdown for model answers ---------- */
function mdLite(t) {
  const lines = esc(t).split('\n'); let h = '', open = '';
  const close = () => { if (open) { h += '</' + open + '>'; open = ''; } };
  lines.forEach((l) => {
    let m;
    if ((m = l.match(/^\s*[-*] (.*)/))) { if (open !== 'ul') { close(); h += '<ul>'; open = 'ul'; } h += '<li>' + m[1] + '</li>'; }
    else if ((m = l.match(/^\s*\d+[.)] (.*)/))) { if (open !== 'ol') { close(); h += '<ol>'; open = 'ol'; } h += '<li>' + m[1] + '</li>'; }
    else if ((m = l.match(/^#{1,4} (.*)/))) { close(); h += '<h5>' + m[1] + '</h5>'; }
    else if (!l.trim()) { close(); }
    else { close(); h += '<p>' + l + '</p>'; }
  });
  close();
  return h.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
}

function systemPrompt() {
  return [
    'You are a plain-English assistant inside a founders\' agreement tool made by TECH x LEGAL, an Estonian law firm. You answer questions about THIS draft founders\' agreement for a young business founder who is not a lawyer.',
    'RULES:',
    '1. Base every answer on THE DRAFT AGREEMENT and THE USER\'S ANSWERS below. Name the section numbers you rely on (for example "section 7.5").',
    '2. If the draft does not cover the question, say so plainly and say what is missing. Never invent a clause or a number.',
    '3. For law, use only the ESTONIAN LAW NOTES below. Do not cite any other statute, case or country. If the question is about tax, employment law, immigration, foreign law or anything else outside the notes, say that a lawyer or accountant must check it.',
    '4. Separate three things when they matter: what the agreement says, what the law adds, and what nobody has decided yet.',
    '5. If the user mentions a shareholders\' agreement (SHA) with investors, explain only the generic points in SHA ADD-ONS and say the signed SHA governs.',
    '6. For "I am leaving / I am being removed / I want to sell" questions, give a short numbered process, then a "Things to think about" list, then ask for the missing facts you would need (for example how many months since the vesting start, and how the exit is agreed).',
    '7. Write plain English in short sentences. No legal jargon without a short explanation. Keep the answer under 350 words unless the question needs more.',
    '8. Never promise an outcome and never tell the user to sign or not sign anything.',
    '9. End every answer with this exact line: "' + DISCLAIMER + '"',
  ].join('\n');
}

/* ---------- mount ---------- */
function mount(opts) {
  const root_ = opts.root, getAnswers = opts.getAnswers;
  root_.innerHTML = '<div class="chat-chips" id="chips"></div><div class="chat-log" id="chatlog" aria-live="polite"></div>' +
    '<form class="chat-form" id="chatform" autocomplete="off"><label class="sr" for="chatq">Your question</label><textarea id="chatq" rows="2" placeholder="Ask anything about your draft, for example: I want to leave in March. What do I have to do?"></textarea><button class="btn btn-sm" id="chatgo" type="submit">Ask</button></form>' +
    '<p class="fine" id="chatnote"></p>';
  const chips = root_.querySelector('#chips'), log = root_.querySelector('#chatlog'), form = root_.querySelector('#chatform'), q = root_.querySelector('#chatq'), note = root_.querySelector('#chatnote');
  let sample = null, history = [], busy = false;
  const PH = q.placeholder;
  chips.innerHTML = CHIPS.map((c) => '<button type="button" class="chip" data-g="' + c[0] + '">' + esc(c[1]) + '</button>').join('');
  function setNote() {
    note.textContent = sample ? 'Quick questions are answered from your draft. Free-text questions are answered by Claude using your draft as context. ' + DISCLAIMER : 'Quick questions work here. Free-text questions need Claude: open this page inside claude.ai to use them. ' + DISCLAIMER;
    q.placeholder = sample ? PH : 'Free-text questions need Claude. Use the quick questions above.';
    q.disabled = !sample; root_.querySelector('#chatgo').disabled = !sample;
  }
  setNote();
  try { if (root.claude && root.claude.use) root.claude.use('sample').then((s) => { sample = s; setNote(); }, () => {}); } catch (e) {}
  function add(kind, html) { const d = document.createElement('div'); d.className = 'msg ' + kind; d.innerHTML = html; log.appendChild(d); d.scrollIntoView({ block: 'nearest' }); return d; }
  function wireLeave(el) {
    const a = getAnswers(), p = K.leaveParams(a), out = el.querySelector('[data-l=out]'), selS = el.querySelector('[data-l=s]'), inM = el.querySelector('[data-l=m]');
    if (!out) return;
    function draw() {
      const s = parseFloat(selS.value) || 0, m = Math.max(0, parseInt(inM.value, 10) || 0), r = leaverRows(p, m, s);
      out.innerHTML = '<p><b>' + m + ' of ' + p.months + ' months:</b> ' + pct(r.v * 100) + '% of your shares are earned.' + (p.cliff && m < p.cliff ? ' You are still before the ' + p.cliff + '-month cliff, so nothing is earned yet.' : '') + '</p>' +
        '<div class="tw"><table><thead><tr><th>If you leave as a…</th><th>Company may take for free</th><th>You keep, or are paid for</th></tr></thead><tbody>' + r.rows.map((x) => '<tr><td>' + esc(x[0]) + '</td><td>' + esc(x[1]) + '</td><td>' + esc(x[2]) + '</td></tr>').join('') + '</tbody></table></div>' +
        '<p class="fine">Shown as a share of the whole company. Which row applies depends on how you leave (step 1).</p>';
    }
    selS.addEventListener('input', draw); inM.addEventListener('input', draw); draw();
  }
  chips.addEventListener('click', (e) => {
    const b = e.target.closest('[data-g]'); if (!b) return;
    const id = b.getAttribute('data-g'), a = getAnswers();
    add('me', esc(CHIPS.filter((c) => c[0] === id)[0][1]));
    const el = add('bot', GUIDES[id](a));
    if (id === 'leave') wireLeave(el);
  });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = q.value.trim(); if (!text || !sample || busy) return;
    busy = true; q.value = ''; add('me', esc(text));
    const el = add('bot', '<p class="fine">Thinking…</p>');
    const ctx = K.contextFor(getAnswers());
    const first = systemPrompt() + '\n\n' + ctx + '\n\nCONVERSATION SO FAR AND THE NEW QUESTION FOLLOW.';
    const msgs = [];
    history.slice(-3).forEach((h) => { msgs.push({ role: 'user', content: h.q }); msgs.push({ role: 'assistant', content: h.a }); });
    msgs.push({ role: 'user', content: text });
    if (msgs[0].role === 'user') msgs[0] = { role: 'user', content: first + '\n\nQuestion: ' + msgs[0].content };
    try {
      const r = await sample(msgs, { cache: false, modelTier: 'default', onText: (t) => { el.innerHTML = mdLite(t.text); log.scrollTop = log.scrollHeight; } });
      el.innerHTML = mdLite(r.text);
      history.push({ q: text, a: r.text });
    } catch (err) {
      const c = err && err.code;
      el.innerHTML = '<p>' + esc(c === 'not_granted' ? 'Claude is switched off for this page. Use the quick questions instead.' : c === 'rate_limited' ? 'Too many questions in a short time. Wait a moment and try again.' : 'Claude could not answer this time. Try again, or use the quick questions.') + '</p>';
    }
    busy = false;
  });
}

root.FoundersChat = { mount, GUIDES, CHIPS, systemPrompt };
if (typeof module !== 'undefined' && module.exports) module.exports = root.FoundersChat;
})(typeof window !== 'undefined' ? window : globalThis);
