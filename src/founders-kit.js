/* Founders' Agreement kit: questions and plain-English clauses.
   One source for three outputs: the Word questionnaire, the Word template and the interactive generator.
   Based on the Startup Estonia / EstVCA model documents (Sept 2026 edition) and Estonian law
   (Commercial Code = ÄS, Law of Obligations Act = VÕS, Family Law Act = PKS). Not legal advice. */
(function (root) {
'use strict';

const GROUPS = [
  ['basics', 'The basics'],
  ['time', 'Roles and time'],
  ['decide', 'Making decisions'],
  ['vesting', 'Earning your shares'],
  ['leave', 'What happens when someone leaves?'],
  ['sell', 'Selling and new owners'],
  ['protect', 'Protecting the company'],
  ['life', 'Real life'],
];

/* type: text | longtext | number | choice | yesno. Each question has a plain-English "why" and a suggested default. */
const QUESTIONS = [
  { id: 'companyName', g: 'basics', type: 'text', label: 'What is the company called?', def: '', ph: '[Company name] OÜ',
    why: 'The agreement is signed by the company and by each founder. If the company does not exist yet, set it up first: the agreement refers to its registry code.' },
  { id: 'regCode', g: 'basics', type: 'text', label: 'What is the registry code?', def: '', ph: '[registry code]',
    why: 'You find it in the Estonian Business Register (e-Business Register) once the company is registered.' },
  { id: 'business', g: 'basics', type: 'longtext', label: 'What does the company do, in one sentence?', def: '', ph: '[one sentence]',
    why: 'This sentence decides what counts as "competing" later. Too wide and nobody can do anything else; too narrow and a founder can start a nearly identical company. Write it carefully.' },
  { id: 'founders', g: 'basics', type: 'founders', label: 'Who are the founders, how many shares does each own, and what will each do?', def: [],
    why: 'Only people who work in the company are "Founders" in this agreement. Shares are listed as a percentage of all shares. Roles go into Schedule B.' },

  { id: 'time', g: 'time', type: 'choice', label: 'How much time will the founders put in?', def: 'full',
    opts: [['full', 'Everyone works on the company full-time'], ['part', 'Some or all of us work part-time (we write the hours in Schedule B)']],
    why: 'The model documents assume founders give substantially all their working time. If someone is part-time, say so now. Otherwise the others may feel cheated later. This kit does not slow down the vesting of a part-time founder: talk about that between yourselves.' },
  { id: 'otherWork', g: 'time', type: 'longtext', label: 'Does any founder keep another job or business? Who, and what?', def: '', ph: 'Leave empty if nobody does. Example: Mari keeps her part-time teaching job.',
    why: 'Anything not listed here needs the written OK of all the other founders. A written list is better than a quiet understanding.' },
  { id: 'holdco', g: 'time', type: 'choice', label: 'May a founder hold their shares through their own holding company?', def: 'no',
    opts: [['no', 'No, founders own their shares personally'], ['yes', 'Yes, with the founder personally guaranteeing the holding company']],
    why: 'A holding company can help with tax and planning later, but it makes the agreement more complex. Most early teams do not need it. Say no unless your accountant advises otherwise.' },

  { id: 'board', g: 'decide', type: 'choice', label: 'Who sits on the management board (the people who run the company day to day and can sign for it)?', def: 'all',
    opts: [['all', 'All founders'], ['one', 'One founder only']],
    why: 'In an Estonian OÜ the management board represents the company. Each board member can usually sign alone, which means each can bind the company by themselves. Fewer board members means fewer people who can sign by mistake.' },
  { id: 'boardName', g: 'decide', type: 'text', label: 'If one founder only: who?', def: '', ph: '[name]', showIf: { board: 'one' },
    why: 'That founder runs daily operations. The others keep control through the big decisions below.' },
  { id: 'majority', g: 'decide', type: 'choice', label: 'How strong must a vote be to decide the big things?', def: 'twothirds',
    opts: [['majority', 'More than half of the votes'], ['twothirds', 'At least two-thirds of the votes'], ['threequarters', 'At least three-quarters of the votes'], ['all', 'Everyone must agree']],
    why: 'With two founders at 50/50, "more than half" can never be reached unless both agree, so you are in a deadlock whenever you disagree. With three equal founders, two-thirds lets any two outvote the third. Three-quarters or "everyone" gives each founder a veto. The law itself requires at least two-thirds to change the articles (Commercial Code § 175).' },
  { id: 'spendLimit', g: 'decide', type: 'text', label: 'Above what amount (in euros) must all founders agree before the company spends or signs?', def: '', ph: '[amount] €, or leave empty for no limit',
    why: 'Without a limit, one board member can commit the company to any contract. A limit protects everyone, including the person signing.' },
  { id: 'founderPay', g: 'decide', type: 'choice', label: 'Who decides what founders are paid?', def: 'vote',
    opts: [['vote', 'It is a big decision: we vote on it'], ['none', 'Nobody is paid until we agree in writing']],
    why: 'Money is the most common reason friends fall out. Decide the process now, before there is any money to argue about.' },
  { id: 'deadlock', g: 'decide', type: 'choice', label: 'What do we do if we are stuck and cannot decide?', def: 'mediator',
    opts: [['mediator', 'Cool-off period, then a mediator, then court'], ['shootout', 'Cool-off period, then a mediator, then a "buy or sell" offer between founders'], ['none', 'Nothing special: we go to court']],
    why: 'The Startup Estonia models do not include a deadlock rule. This is our addition. A "buy or sell" offer (sometimes called a shotgun clause) is fair only if both sides can afford to buy; use it only if you can.' },

  { id: 'vestYears', g: 'vesting', type: 'choice', label: 'Over how many years do the founders earn their shares?', def: '4',
    opts: [['4', 'Four years (the standard)'], ['3', 'Three years'], ['2', 'Two years']],
    why: 'Nobody "gets" their shares on day one. You earn them by staying and working. Investors expect it, and it protects the people who stay if one founder walks away after six months. This is called "reverse vesting".' },
  { id: 'cliff', g: 'vesting', type: 'choice', label: 'Is there a "cliff", a first milestone before anything is earned?', def: '12',
    opts: [['12', 'Yes: nothing is earned for 12 months, then one big chunk, then month by month'], ['6', 'Yes: nothing for 6 months'], ['0', 'No cliff: shares are earned month by month from day one']],
    why: 'A cliff tests whether the team works together before anyone owns anything. The standard is 12 months. Without a cliff, a founder who leaves after two months still keeps two months of shares.' },
  { id: 'vestStart', g: 'vesting', type: 'text', label: 'Does the vesting clock start on a different date than the signing date?', def: '', ph: 'Leave empty to start at signing. Or write a date, e.g. 1 March 2026',
    why: 'If you have already worked together for a year, you can start the clock earlier so that earlier work counts. Write the date here.' },

  { id: 'quit', g: 'leave', type: 'choice', label: 'What if a founder simply quits?', def: 'good',
    opts: [['good', 'They keep what they have earned and give up the rest (a "Good Leaver")'], ['voluntary', 'They also give up some of what they earned (a "Voluntary Leaver")'], ['bad', 'They lose everything, as if they had done something wrong (a "Bad Leaver")']],
    why: 'The Startup Estonia model lets you pick how harshly to treat someone who walks away on their own. "Lose everything" is very harsh and a court may think so too. The middle option is common.' },
  { id: 'quitPct', g: 'leave', type: 'number', label: 'If "they also give up some of what they earned": what percentage of the earned shares?', def: '25', showIf: { quit: 'voluntary' },
    why: 'Typical values are 10 to 50 percent. The percentage is taken from the shares they had already earned.' },
  { id: 'buyer', g: 'leave', type: 'choice', label: 'Who buys the shares of a founder who leaves?', def: 'either',
    opts: [['either', 'The company, which may pass the right on to the remaining founders'], ['founders', 'The remaining founders directly']],
    why: 'In Estonia a company can only buy its own shares within strict limits: for example, it can hold shares worth at most one third of its share capital, and only if its net assets stay high enough (Commercial Code § 162). If the company cannot buy, the remaining founders step in.' },
  { id: 'absence', g: 'leave', type: 'choice', label: 'What if a founder is away for a long time (illness, parental leave, study)?', def: 'excl',
    opts: [['none', 'Nothing special: vesting just keeps running'], ['excl', 'If someone is away more than 56 days in a year, the others may pause their vesting, but not for sickness, pregnancy or parental leave'], ['model', 'Same, for any reason at all (the Startup Estonia default)']],
    why: 'The model lets the other founders pause vesting after 56 days of leave in a 12-month period. Pausing vesting during sickness or parental leave can raise discrimination and fairness problems, so our suggestion leaves those out. A lawyer should check your version.' },
  { id: 'penalty', g: 'leave', type: 'text', label: 'How much is the daily penalty if a leaver delays handing over the shares (in euros per day)?', def: '', ph: '[amount] €',
    why: 'A penalty only works if it is big enough to matter and small enough to be reasonable. A court can reduce a penalty that is unreasonably high (Law of Obligations Act § 162).' },

  { id: 'lockin', g: 'sell', type: 'choice', label: 'Can a founder sell their shares to an outsider?', def: 'lock',
    opts: [['lock', 'Not while still earning their shares, unless everyone agrees'], ['open', 'Yes, after the others have had the first chance to buy (and the board approved)']],
    why: 'Founders should not be able to bring in a stranger who becomes your new partner. Locking shares while they are still being earned is the standard protection.' },
  { id: 'pool', g: 'sell', type: 'number', label: 'What percentage of the shares do we reserve for future employees and advisors (the "option pool")?', def: '10',
    why: 'Early employees often get options instead of salary. Reserving 5 to 15 percent now avoids diluting only some founders later.' },

  { id: 'noCompete', g: 'protect', type: 'choice', label: 'After a founder leaves, can they start a competing business?', def: '12',
    opts: [['12', 'Not for 12 months (the Startup Estonia model)'], ['6', 'Not for 6 months'], ['none', 'Yes, no restriction after leaving (during the time they work in the company they still cannot compete)']],
    why: 'A long ban is harder to enforce and a court may not accept it. Keep it as short and narrow as protects the business.' },
  { id: 'territory', g: 'protect', type: 'text', label: 'Where does the non-compete apply?', def: '', ph: '[for example: Estonia and the European Union]', hideIf: { noCompete: 'none' },
    why: 'Only where the company really does business or plans to. A worldwide ban is hard to defend.' },
  { id: 'secrecy', g: 'protect', type: 'choice', label: 'For how long after someone stops being a shareholder must they keep company secrets secret?', def: '3',
    opts: [['2', '2 years'], ['3', '3 years (the Startup Estonia model)'], ['5', '5 years']],
    why: 'Secrets include customer lists, prices, code, plans and what is said in company meetings.' },
  { id: 'fine', g: 'protect', type: 'text', label: 'Penalty per breach of secrecy, non-compete or non-poaching (in euros)?', def: '', ph: '[amount] €',
    why: 'Pick an amount that matches real damage. A court can reduce an unreasonably high penalty.' },

  { id: 'married', g: 'life', type: 'yesno', label: 'Is any founder married or in a registered partnership?', def: 'no',
    why: 'If shares count as joint property of the spouses, the spouse may need to approve the agreement. Without approval it can be void (Family Law Act § 31). Shares bought before the marriage are usually not joint property, but check the facts with a lawyer.' },
];

/* ---------- helpers ---------- */
const E = (s) => String(s == null ? '' : s).trim();
const ph = (v, p) => (E(v) ? E(v) : '[' + p + ']');
function visible(q, a) {
  if (q.showIf) for (const k in q.showIf) if (a[k] !== q.showIf[k]) return false;
  if (q.hideIf) for (const k in q.hideIf) if (a[k] === q.hideIf[k]) return false;
  return true;
}
function defaults() {
  const a = {};
  QUESTIONS.forEach((q) => { a[q.id] = q.def; });
  a.founders = [{ name: '', pct: '', role: '' }, { name: '', pct: '', role: '' }];
  return a;
}

/* ---------- agreement builder ---------- */
// Returns an array of blocks: {t:'h1'|'h2'|'p'|'li'|'note'|'plain'|'table', ...}. Numbering is added by render functions.
function build(ans, mode) {
  const a = Object.assign(defaults(), ans || {});
  const tpl = mode === 'template';
  const F = (a.founders || []).filter((f) => E(f.name) || E(f.pct) || E(f.role));
  const founders = F.length ? F : [{ name: '[Founder 1]', pct: '[%]', role: '' }, { name: '[Founder 2]', pct: '[%]', role: '' }];
  const total = founders.reduce((s, f) => s + (parseFloat(f.pct) || 0), 0);
  const years = parseInt(a.vestYears, 10) || 4;
  const months = years * 12;
  const cliff = parseInt(a.cliff, 10) || 0;
  const cliffPct = cliff ? (cliff / months * 100) : 0;
  const fmt = (n) => (Math.round(n * 10) / 10).toString().replace(/\.0$/, '');
  const S = []; // sections: {id, title, plain, paras:[...]}; paragraph may be string or {note:..}
  const sec = (id, title, plain, paras) => S.push({ id, title, plain, paras: paras.filter(Boolean) });
  const R = {}; // section numbers by id, filled after numbering

  /* 1 */
  sec('who', 'Who are we and what are we building?',
    'This agreement is the set of ground rules between the founders and the company. You sign it once, at the start, while you still agree.',
    [
      `This agreement is between ${ph(a.companyName, 'Company name')} (registry code ${ph(a.regCode, 'registry code')}), called "the Company", and the people listed in Schedule A, called "the Founders". It is dated ${tpl ? '[date]' : '[date]'}.`,
      `The Company's business, in one sentence: ${ph(a.business, 'one sentence describing the business')} ("the Business").`,
      'Each Founder owns the shares shown in Schedule A.',
      'This agreement sets the rules between us. It does not replace the Company\'s articles of association. The articles must say the same things (Schedule C lists what they must say). If the agreement and the articles ever disagree, we follow this agreement between ourselves and change the articles to match.',
      'The notes that begin with "In plain words" help you understand each section. They are not part of the rules. If a note and a rule disagree, the rule wins.',
    ]);

  /* 2 */
  const timePara = a.time === 'part'
    ? 'Each Founder works for the Company for the hours written in Schedule B. If a Founder wants to work fewer hours, the other Founders must agree in writing.'
    : 'Each Founder works for the Company full-time, which means substantially all of their working time.';
  const otherWork = E(a.otherWork)
    ? `Other work or business needs the written OK of all the other Founders. Already allowed: ${E(a.otherWork)}`
    : 'Other work or business needs the written OK of all the other Founders. Nothing is allowed in advance.';
  const holdcoPara = a.holdco === 'yes'
    ? [
      'A Founder may hold their shares through their own holding company ("Founder HoldCo"), but only a company whose shares and voting rights are held 100% by that Founder.',
      'The Founder personally guarantees everything the Founder HoldCo owes under this agreement (this is a suretyship under the Law of Obligations Act), up to [amount] euros. All rules for a Founder also apply to the Founder HoldCo.',
      { note: 'Because this is a personal guarantee, each founder who uses a holding company should sign it by hand or with a qualified electronic signature, and should ask a lawyer first.' },
    ]
    : ['Each Founder owns their shares personally, not through a company.'];
  sec('jobs', 'Our jobs and our time',
    'Say who does what, and that the company comes first. Anything a founder might do on the side is written down.',
    [
      'Each Founder\'s main job and responsibilities are described in Schedule B.',
      timePara, otherWork,
      'If a Founder finds a business chance related to the Business, it goes through the Company, not around it.',
      'Deals between the Company and a Founder (or the Founder\'s family or companies) must be on market terms and in writing.',
    ].concat(holdcoPara));

  /* 3 */
  const majorityTxt = { majority: 'more than half of all votes', twothirds: 'at least two-thirds of all votes', threequarters: 'at least three-quarters of all votes', all: 'the votes of every shareholder (everyone must agree)' }[a.majority] || 'at least two-thirds of all votes';
  const spend = E(a.spendLimit) ? `Signing a contract or spending more than ${E(a.spendLimit)} euros in one go.` : null;
  const bigList = [
    'Changing the articles of association.',
    'Issuing new shares, options or convertible loans, or changing the share capital.',
    'Setting up or changing an option plan, or the size of the option pool.',
    'The Company buying or selling its own shares.',
    'Merging, splitting, transforming or closing down the Company.',
    'Selling all or most of the Company\'s assets, including its intellectual property, or giving anyone an exclusive licence over all or most of it.',
    'Paying out profit (dividends).',
    'Electing or removing members of the management board.',
    'Approving the annual report and choosing the auditor.',
  ];
  if (spend) bigList.push(spend);
  if (a.founderPay === 'vote') bigList.push('Deciding what any Founder is paid, and any other deal with a Founder or their family.');
  const boardTxt = a.board === 'one'
    ? `The management board has one member: ${ph(a.boardName, 'name')}. Only the shareholders can add or remove members.`
    : 'All the Founders are members of the management board. Only the shareholders can add or remove members.';
  const payTxt = a.founderPay === 'none'
    ? 'No Founder is paid by the Company until all Founders have agreed in writing how much, and from when.'
    : 'What a Founder is paid is one of the big decisions listed above.';
  const dead = {
    mediator: ['If we cannot decide, any Founder may call a cool-off by writing to the others. For 14 days we talk, with no vote. If we are still stuck, we hire a mediator whom we all accept (or, if we cannot agree on one, one chosen by the Estonian Private Equity and Venture Capital Association or a similar body). The mediator\'s costs are shared equally. If mediation fails, either side may go to court under section {disputes}.'],
    shootout: ['If we cannot decide, any Founder may call a cool-off by writing to the others. For 14 days we talk, with no vote. Then we hire a mediator we all accept, who has 30 days. If we are still stuck, any Founder (the "Offering Founder") may offer to buy all the shares of the other Founders at a price per share named in the offer. Within 30 days each other Founder must either accept and sell, or buy the Offering Founder\'s shares at that same price per share. If a Founder does neither, they are treated as selling. This only works if everyone can afford to buy, so use it only when that is true.'],
    none: ['This agreement has no special rule for deadlock. If we cannot decide, either side may go to court under section {disputes}.'],
  }[a.deadlock];
  sec('decisions', 'How do we decide?',
    'Day-to-day business is run by the management board. The big things need a stronger vote. Silence is a "No".',
    [
      boardTxt,
      'These matters are for the shareholders to decide. The management board cannot decide them alone:',
      { list: bigList },
      `A big decision passes if it gets ${majorityTxt}. The law may ask for more for some decisions (for example, two-thirds of the votes to change the articles, Commercial Code § 175). The higher number always applies.`,
      'We may vote without a meeting. The management board sends the draft decision to all shareholders in writing (email is fine) with a deadline. Anyone who does not answer by the deadline counts as voting against it (Commercial Code § 173).',
      payTxt,
    ].concat(dead));

  /* 4 */
  sec('shares', 'Shares, new shares and options',
    'Everyone gets first pick when new shares are issued, and nobody can quietly sell or pledge their shares.',
    [
      'When the Company issues new shares, options or convertible loans, every shareholder has the right to take their share of them first, in proportion to what they already own (Commercial Code § 193). The shareholders can switch this off for particular shares only by the vote the law requires. We agree to do so only for the option pool and for shares that come from a loan or investment all Founders have approved.',
      `We reserve up to ${fmt(parseFloat(a.pool) || 0)}% of the shares for employees, advisors and board members (the "Option Pool"). The shareholders decide the option plan. Unless the plan says otherwise, options are earned over four years: 25% after one year, the rest month by month over the next three years.`,
      'No shareholder may pledge or burden their shares without the written OK of all other shareholders.',
      'Nobody may receive or buy shares until they have signed the adherence form in Schedule D. That means they accept this agreement.',
    ]);

  /* 5 */
  const sell = [
    'To sell shares to anyone (another shareholder or an outsider), a shareholder needs: (a) written approval from the management board (more than half of the members; the board must approve if the rules of this section are followed); (b) first refusal for the other shareholders under this section; (c) the buyer signing the adherence form in Schedule D; and (d) payment in cash.',
    'First refusal: before selling, the seller must offer the shares to the other shareholders, in proportion to what they own, on the same terms and the same price. They have 30 days to say yes. If they do not take all the shares, the seller may sell the rest to the buyer, on terms no better for the buyer than those offered to the other shareholders, within 60 days after that.',
  ];
  if (a.lockin === 'lock') sell.push('A Founder may not sell any shares to an outsider while still earning them (see section {vesting}) unless all other Founders agree in writing.');
  sell.push('These need no approval and no first refusal: moving shares to the Company in the cases covered by section {leave}' + (a.holdco === 'yes' ? ', and moving all of a Founder\'s shares to or between that Founder\'s own holding companies' : '') + '.');
  sell.push({ note: 'In Estonia a transfer of shares in an OÜ must be notarised. The articles can allow a written agreement instead, but only if the share capital is at least 10,000 euros and fully paid in, and all shareholders vote for that article (Commercial Code § 149(4) and (6)). The law also gives the other shareholders one month of first refusal on a sale to an outsider unless the articles say otherwise (§ 149(2)).' });
  sec('selling', 'Selling shares', 'Founders cannot sell to a stranger without the others getting the first chance to buy.', sell);

  /* 6 */
  const cliffTxt = cliff
    ? `Nothing is earned during the first ${cliff} months. On the ${cliff}-month date, ${fmt(cliffPct)}% is earned at once. After that, the rest is earned in equal monthly steps until the end of year ${years}.`
    : `Shares are earned in equal monthly steps from the start until the end of year ${years}. There is no cliff.`;
  const startTxt = E(a.vestStart)
    ? `The clock starts on ${E(a.vestStart)}.`
    : 'The clock starts on the first day of the month in which this agreement is signed (if signed on days 1 to 15) or on the first day of the next month (if signed later).';
  sec('vesting', 'Earning your shares (vesting)',
    'Nobody owns their shares in full on day one. You earn them by working. If you leave early, the company can take back the part you have not earned yet.',
    [
      `The Founders earn their shares over ${years} years ("the Vesting Period"). ${startTxt}`,
      cliffTxt,
      '"Earned" shares are called vested shares. Shares not yet earned are unvested shares.',
      `Example: with ${years} years and ${cliff ? 'a ' + cliff + '-month cliff' : 'no cliff'}, a Founder who leaves after ${cliff ? cliff + 6 : 18} months has earned ${fmt(Math.min(100, (cliff ? cliff + 6 : 18) / months * 100))}% of their shares.`,
      'If a Founder stops working for the Company before the start date, all their shares count as unvested.',
    ]);

  /* 7 */
  const bad = [
    'a serious breach of their working relationship with the Company that they have not fixed within 30 days after the Company asked them to;',
    'a conviction for a criminal offence (traffic offences excluded);',
    'serious damage to the Company that they have not made good within 30 days after being asked;',
    'within 12 months after leaving, the Company finds out about something that happened before they left that would have made them a Bad Leaver;',
    'after leaving, a serious breach of the secrecy, non-compete or non-poaching rules in sections {secrets} and {nocompete}',
  ];
  if (a.quit === 'bad') bad.push('quitting on their own, unless this is because of a serious breach by the Company, or death, or permanent inability to work for health reasons.');
  const quitPct = fmt(parseFloat(a.quitPct) || 25);
  const goodTxt = a.quit === 'voluntary'
    ? 'A "Good Leaver" is a Founder who leaves in any other way that is neither Bad Leaver nor Voluntary Leaver. Examples: illness, death, being let go without cause. If the Company and the Founder agree on the exit, the Founder is a Good Leaver unless the exit agreement says otherwise.'
    : 'A "Good Leaver" is a Founder who leaves in any way that is not Bad Leaver. This includes quitting on their own, illness, death and being let go without cause. If the Company and the Founder agree on the exit, the Founder is a Good Leaver unless the exit agreement says otherwise.';
  const volTxt = a.quit === 'voluntary'
    ? ['A "Voluntary Leaver" is a Founder who quits on their own, unless this is because of a serious breach by the Company, or death, or permanent inability to work for health reasons, or the reasons that make a Bad Leaver.',
       `The Company may take from a Voluntary Leaver: all unvested shares for free, plus ${quitPct}% of the vested shares for free, plus the remaining vested shares at Fair Value.`]
    : [];
  const buyTxt = a.buyer === 'founders'
    ? 'The Founders who remain (not the Leaver) buy the shares directly, in proportion to their shares unless they agree otherwise in writing. The Company may also buy them if the law allows and the remaining Founders prefer it.'
    : 'The Company has the right to acquire the shares. The Company may pass this right on to the Founders who remain (not the Leaver), in proportion to their shares or as they agree in writing. No consent from anyone else is needed for that.';
  const ownShares = 'By signing, the shareholders approve the Company acquiring its own shares under this section for five years from today, so long as the Company holds no more than the law allows, for a price between 0 euros and the Fair Value (Commercial Code § 162(2)(1)). The law limits the Company to holding shares worth at most one third of the share capital, and the purchase must not reduce the Company\'s net assets below the share capital and the reserves that cannot be paid out (§ 162(2)). If the Company cannot buy, the remaining Founders buy instead.';
  sec('leave', 'What happens if someone leaves?',
    'This is the part that protects the people who stay. How much of a leaver\'s shares can be taken back, and at what price, depends on how they left.',
    [
      'A Founder "leaves" when they stop working for the Company in any role (employment, management board or service contract). From then on they are a "Former Founder". They stay bound by this agreement, but they are no longer a Founder for the rules about time and roles. The management board updates Schedule A without needing anyone\'s consent.',
      'A "Bad Leaver" is a Founder who leaves in circumstances where there is: ',
      { list: bad },
      'The other Founders may decide together that someone is not a Bad Leaver even if one of the above applies.',
      goodTxt,
    ].concat(volTxt).concat([
      'What the Company may take:',
      { list: [
        'From a Bad Leaver: all shares, vested and unvested, for free. If the Company had already paid for vested shares, the Bad Leaver must repay that money within 30 days after being asked.',
        'From a Good Leaver: all unvested shares for free, and the vested shares at Fair Value.',
      ] },
      'The Company (or the Founders who remain) must say whether it wants the shares by sending a written notice within 90 days after the Founder became a Leaver. It may take all or part of the shares; taking only part needs the consent of all other Founders. The Leaver then has at least 14 days after the notice (or after Fair Value is set, where the shares are bought at Fair Value) to hand over the shares. The shares may be handed over in several tranches up to a year apart.',
      buyTxt,
      ownShares,
      'Fair Value is first set in good faith by the Company. The Leaver has seven days to disagree in writing. If so, an independent expert decides. We pick the expert together within 14 days. If we cannot, the expert is chosen by the management board of the Estonian Private Equity and Venture Capital Association or a similar body in Estonia. If that fails within 14 days, a court chooses. The expert\'s decision is final.',
      `If a Leaver is late in handing over shares, they pay the Company ${ph(a.penalty, 'amount')} euros for each day of delay. If the Leaver holds shares through a holding company, both are liable. A court may reduce a penalty that is unreasonably high (Law of Obligations Act § 162).`,
    ]).concat(a.absence !== 'none' ? [
      a.absence === 'excl'
        ? 'If a Founder is away on leave for more than 56 days in total during any 12 months, the other Founders may pause that Founder\'s vesting for the extra days. This does not apply to leave because of sickness, pregnancy or parental leave. Paused vesting restarts where it stopped, and the Vesting Period is extended by the same time. The Founder on leave does not vote on this.'
        : 'If a Founder is away on leave for any reason for more than 56 days in total during any 12 months, the other Founders may pause that Founder\'s vesting for the extra days. Paused vesting restarts where it stopped, and the Vesting Period is extended by the same time. The Founder on leave does not vote on this.',
    ] : []));

  /* 8 */
  sec('secrets', 'Keeping secrets',
    'Customer lists, prices, code, plans and what is said in company meetings stay inside the company.',
    [
      '"Confidential Information" means the terms of this agreement and anything about the Company that a reasonable business person would treat as private. This covers finances, strategy, products, prices, customers, suppliers, contracts, code, IT systems, who owns the Company and what is said in meetings. It does not cover information that is already public (unless someone made it public by breaking this agreement), information a person already knew without a duty to keep it secret, or information they received lawfully from someone else.',
      'Nobody may use or share Confidential Information except for the Company\'s business. A person may share it with their lawyers, accountants and other advisors who also have to keep it secret, and where the law or an authority requires it.',
      `This lasts while a person is a shareholder and for ${a.secrecy} years after they stop being one. For a Founder who becomes a Former Founder, it lasts as long as they or their holding company hold shares, and for ${a.secrecy} years after that.`,
    ]);

  /* 9 */
  const nc = a.noCompete === 'none' ? 0 : parseInt(a.noCompete, 10);
  const ncParas = [];
  ncParas.push(`While a Founder works for the Company, they will not carry on, work for, advise or own a business that competes with the Company's Business in ${ph(a.territory, 'territory')}, unless all the other Founders agree in writing.${nc ? ` This continues for ${nc} months after they stop working for the Company, and for as long as they still control the Company plus ${nc} months after that.` : ' After they stop working for the Company, this rule no longer applies.'}`);
  ncParas.push('Holding shares only as a financial investment is allowed (up to 5% of a listed company), as long as it gives no management role or real influence.');
  ncParas.push(`During the same period, a Founder will not recruit or persuade the Company's employees, key contractors or board members to leave. Answering a public job advert is not a breach.`);
  ncParas.push(`If a Founder breaks these rules, the Company may ask them to stop at once, hand over any money they earned from the breach, pay ${ph(a.fine, 'amount')} euros for each breach, and pay for any further damage. A breach that continues for a month counts as a new breach.`);
  ncParas.push('We agree these rules are needed to protect the Company\'s secrets, customers, team and value. If a court finds any part too wide, it is cut back to what is allowed and the rest stays.');
  sec('nocompete', 'Not competing and not poaching',
    'A founder who leaves must not take the idea, the customers or the team to a copycat. The rules are limited in time and place so that they are fair.',
    ncParas);

  /* 10 */
  sec('ip', 'Who owns what we build?',
    'Code, designs, the brand and the data belong to the company, not to the person who happened to write them.',
    [
      'Everything a Founder creates for the Company (code, designs, brand, data, know-how) belongs to the Company. Each Founder will sign the Company\'s IP assignment (the Startup Estonia IP Assignment and License Agreement is a good starting point) for anything made before or after the Company was set up.',
      'If a Founder brings existing work or tools into the Company, they list them in Schedule B and state whether they are being given to the Company or only licensed to it.',
      'The Company makes sure employees and contractors who build things sign similar IP terms.',
    ]);

  /* 11 */
  sec('money', 'Money',
    'Nobody is forced to put in more money. But everyone agrees to help find it.',
    [
      'No shareholder has to give the Company a loan, new money or a guarantee. If revenue does not cover costs, the Founders will make reasonable efforts to raise equity or loans.',
      'Pay for Founders and dividends are decided as set out in the big decisions in section {decisions}.',
      'The Company runs its business in line with good industry practice and the law, and tries to keep its intellectual property safe and not infringe anyone else\'s.',
    ]);

  /* 12 */
  sec('disputes', 'Settling disagreements',
    'Talk first, then a mediator, then court. Estonian law applies.',
    [
      'If we disagree about this agreement, we first meet and try to solve it within 14 days after anyone writes to the others about it.',
      'If that fails, we try mediation as described in section {decisions} before going to court, unless an urgent court order is needed.',
      'Estonian law applies to this agreement. Disputes go to the Harju County Court (Harju Maakohus) as the first court.',
    ]);

  /* 13 */
  const spouse = a.married === 'yes'
    ? 'Each Founder who is married or in a registered partnership will give the other Founders a written consent from their spouse, in the form agreed between us, before signing. Without it, this agreement may be void as far as that Founder is concerned (Family Law Act § 31).'
    : 'Each Founder says that no spouse\'s consent is needed for them to sign this agreement. If that changes, they tell the others straight away.';
  sec('final', 'Housekeeping',
    'The legal small print. Short and standard, but it matters.',
    [
      'Each of us confirms that we are free to sign this agreement, that signing it does not break any other agreement or law, and that nobody has applied for our bankruptcy or liquidation.',
      spouse,
      'This agreement starts when everyone has signed. It lasts until (a) all parties agree in writing to end it, (b) the Company is liquidated, or (c) one person holds all shares. For a person who no longer holds shares, it ends once they have handed over everything they owe, except secrecy, non-compete and non-poaching, and anything owed for a breach before then.',
      'Changes need to be in writing and signed by all parties.',
      'Each of us is responsible for our own obligations only, not for each other\'s. The partnership rules of the Law of Obligations Act (§§ 580–618) do not apply to us. We also give up the legal right to cancel or withdraw from this agreement, except as the agreement itself says.',
      'Any contractual penalty is meant to push us to perform, not to replace performing. Before claiming a penalty, the Company or the other Founder must give a reasonable time (at most 30 days) to fix the breach, and loses the right if they do not say they will claim it within six months after finding out about the breach.',
      'Notices go by email to the addresses on the signature page. Nobody may transfer their rights or duties under this agreement without the others\' written consent, except together with their shares in line with this agreement.',
      'If a part of this agreement is invalid, we replace it with a valid one that comes as close as possible to what we wanted. This agreement is the whole deal between us on this subject and replaces earlier talks and drafts.',
      'This agreement can be signed with qualified electronic signatures (for example with Estonian ID-card or Smart-ID). Some parts (the personal guarantee, the approval for the Company to buy its own shares) need either a handwritten signature or a separate shareholders\' decision if the agreement is signed only in "reproducible" form. Ask your lawyer how to sign.',
    ]);

  /* number sections, resolve refs */
  S.forEach((s, i) => { R[s.id] = String(i + 1); });
  const resolve = (t) => t.replace(/\{(\w+)\}/g, (m, k) => (R[k] ? R[k] : m));
  const blocks = [];
  blocks.push({ t: 'title', text: "Founders' Agreement" });
  blocks.push({ t: 'sub', text: (tpl ? 'Plain-English template' : 'Plain-English draft') + ' for ' + ph(a.companyName, 'Company name') });
  blocks.push({ t: 'note', text: 'This is a draft built from the Startup Estonia and EstVCA model documents (Sept 2026) and Estonian law. It is not legal advice and it is not ready to sign. Have a lawyer check it, and make sure the articles of association match it (Schedule C).' });
  S.forEach((s, i) => {
    blocks.push({ t: 'h2', num: i + 1, text: s.title });
    blocks.push({ t: 'plain', text: s.plain });
    let n = 0;
    s.paras.forEach((p) => {
      if (typeof p === 'string') { n++; blocks.push({ t: 'p', num: (i + 1) + '.' + n, text: resolve(p) }); }
      else if (p.list) p.list.forEach((x) => blocks.push({ t: 'li', text: resolve(x) }));
      else if (p.note) blocks.push({ t: 'note', text: resolve(p.note) });
    });
  });
  /* schedules */
  blocks.push({ t: 'h2', text: 'Schedule A: Founders and shares' });
  blocks.push({ t: 'table', head: ['Founder', 'Share of all shares', 'Email'], rows: founders.map((f) => [ph(f.name, 'name'), ph(f.pct, '%') + (E(f.pct) ? '%' : ''), '[email]']).concat([['Option Pool (reserved)', fmt(parseFloat(a.pool) || 0) + '%', '']]) });
  if (total && Math.abs(total - 100) > 0.01) blocks.push({ t: 'note', text: 'The founders\' shares add up to ' + fmt(total) + '%, not 100%. Check the numbers before you sign. The Option Pool is counted on top.' });
  blocks.push({ t: 'h2', text: 'Schedule B: Who does what' });
  blocks.push({ t: 'table', head: ['Founder', 'Main responsibilities', 'Hours per week (if part-time)', 'Existing work brought in (give or licence)'], rows: founders.map((f) => [ph(f.name, 'name'), E(f.role) || '[describe]', a.time === 'part' ? '[hours]' : 'full-time', '[list or "none"]']) });
  blocks.push({ t: 'h2', text: 'Schedule C: What must the articles of association say?' });
  [
    'Shareholders have a pro-rata right to take new shares first, and it can be excluded only as set out in this agreement (Commercial Code § 193).',
    'A transfer of shares needs the approval of the management board (more than half of the members) as a condition for the transfer, and the board must approve if this agreement is followed (§ 149(3)). A transfer without it is void.',
    'Founders may move all their shares to their own holding company without approval (only if section 2 allows holding companies).',
    'A shareholder may not pledge or burden a share without the approval of all other shareholders.',
    'If the share capital is at least 10,000 euros and fully paid in, you may allow a written agreement (instead of a notary) for transferring shares. All shareholders must vote for it (§ 149(6)).',
    'The list of matters for the shareholders (section ' + R.decisions + ') and the required vote (' + majorityTxt + ').',
    'Notice for shareholder meetings (the model uses seven days) and written votes without a meeting.',
    'The size of the management board, and that each member may represent the Company.',
  ].forEach((x) => blocks.push({ t: 'li', text: x }));
  blocks.push({ t: 'note', text: 'Startup Estonia publishes model articles (in English and Estonian) that fit its Founders\' Agreement. Use them as a starting point. Only the Estonian text of the articles is registered.' });
  blocks.push({ t: 'h2', text: 'Schedule D: Adherence form (for a new owner)' });
  blocks.push({ t: 'p', text: 'I, [name, personal ID code or registry code, address, email], am getting or buying shares in ' + ph(a.companyName, 'Company name') + '. I have read the Founders\' Agreement dated [date] and the articles of association. I agree to be bound by the Agreement as a shareholder' + ' [and as a Founder, with the role in the attached Schedule B]. I promise to keep the Agreement secret as it requires. Date: [date]. Signature: ________.' });
  blocks.push({ t: 'h2', text: 'Signatures' });
  blocks.push({ t: 'table', head: ['Party', 'Signature', 'Date'], rows: [[ph(a.companyName, 'Company name') + ' (by a management board member)', '', '']].concat(founders.map((f) => [ph(f.name, 'Founder name'), '', ''])) });
  blocks.R = R;
  return blocks;
}

/* ---------- renderers ---------- */
function toMarkdown(blocks) {
  const out = [];
  blocks.forEach((b) => {
    if (b.t === 'title') out.push('# ' + b.text);
    else if (b.t === 'sub') out.push('*' + b.text + '*');
    else if (b.t === 'h2') out.push('## ' + (b.num ? b.num + '. ' : '') + b.text);
    else if (b.t === 'plain') out.push('> **In plain words:** ' + b.text);
    else if (b.t === 'p') out.push('**' + b.num + '** ' + b.text);
    else if (b.t === 'li') out.push('- ' + b.text);
    else if (b.t === 'note') out.push('> **Note:** ' + b.text);
    else if (b.t === 'table') {
      out.push('| ' + b.head.join(' | ') + ' |');
      out.push('|' + b.head.map(() => '---').join('|') + '|');
      b.rows.forEach((r) => out.push('| ' + r.join(' | ') + ' |'));
    }
  });
  return out.join('\n\n').replace(/\n\n(- )/g, '\n$1').replace(/\n\n(\|)/g, '\n$1');
}
function questionnaireMarkdown() {
  const out = ["# Founders' Agreement: the questionnaire", '*Answer these ' + QUESTIONS.length + ' questions together, as a team. Each one is a choice the agreement needs. A suggested answer is marked with a star. There are no wrong answers, but some answers are more expensive later than others.*'];
  GROUPS.forEach(([gid, gname], gi) => {
    out.push('## ' + (gi + 1) + '. ' + gname);
    QUESTIONS.filter((q) => q.g === gid).forEach((q) => {
      out.push('**' + q.label + '**');
      out.push('*Why does it matter?* ' + q.why);
      if (q.opts) q.opts.forEach((o) => out.push('- ' + (o[0] === String(q.def) ? '★ ' : '') + o[1]));
      else if (q.type === 'yesno') out.push('- ' + (q.def === 'yes' ? '★ ' : '') + 'Yes\n- ' + (q.def === 'no' ? '★ ' : '') + 'No');
      else if (q.type === 'founders') out.push('| Name | Share of all shares (%) | Main job |\n|---|---|---|\n|  |  |  |\n|  |  |  |\n|  |  |  |');
      else out.push('Your answer: ' + (q.ph ? '*(' + q.ph + ')*' : '________') + (q.def ? '  \nSuggested: ' + q.def : ''));
    });
  });
  return out.join('\n\n').replace(/\n\n(- )/g, '\n$1');
}

/* ---------- knowledge for the Q&A (used by the guides and as context for Claude) ---------- */
const LAW_NOTES = [
  'Commercial Code (Äriseadustik, ÄS) § 149(4): a transfer of shares in an OÜ must be notarised. § 149(6): if the share capital is at least 10,000 euros and fully paid in, the articles may allow a written agreement instead, if all shareholders vote for it.',
  'ÄS § 149(2): unless the articles say otherwise, the other shareholders have one month of first refusal when a share is sold to an outsider. § 149(3): the articles may make a sale depend on a condition (for example board approval); a sale without it is void.',
  'ÄS § 162(2): the company may buy its own shares only within five years after a shareholders\' resolution that sets terms, period and minimum and maximum price; it may hold shares worth at most one third of the share capital; and its net assets must stay above share capital plus reserves that cannot be paid out.',
  'ÄS § 173(2): in a written vote without a meeting, a shareholder who does not answer by the deadline is counted as voting against.',
  'ÄS § 175(1): changing the articles needs at least two-thirds of the votes, unless the articles require more.',
  'ÄS § 193: on a capital increase shareholders have first pick in proportion to their shares; it can be excluded only by a resolution with at least three-quarters of the votes, and the management board must explain in writing why.',
  'Law of Obligations Act (VÕS) § 162: a court can reduce a contractual penalty that is unreasonably high.',
  'Family Law Act (PKS) § 31(1): a multi-party transaction about joint property of spouses made without the spouse\'s consent is void unless the spouse approves it later.',
];
const SHA_ADDONS = [
  'A Shareholders\' Agreement (SHA) is for companies with investors. The Startup Estonia models come in two versions: without a supervisory board (nõukogu) and with one. Both build on the founders\' agreement and keep its vesting, leaver, secrecy and non-compete rules.',
  'What an SHA adds for investors: monthly reports, annual accounts and budgets; right of first refusal (ROFR) on share sales; co-sale (tag-along) right; drag-along (a majority can force everyone to sell to a buyer of 100%); anti-dilution protection; liquidation preference and preferred shares; and, optionally, an investor put option.',
  'In the SHA, a founder cannot sell shares to a third party during the vesting period without the investors\' approval (all investors or the Investor Majority, depending on the version). The Investor Majority also has rights relating to the company\'s call option over a leaver\'s shares, and consent for a founder to compete needs both the company and the Investor Majority.',
  'The SHA may let vesting speed up (acceleration) in some cases, and has a contractual penalty for breaking the share transfer rules. The actual signed SHA always governs. Read its leaver, transfer and consent sections before acting.',
  'With a supervisory board, the SHA adds approvals by the supervisory board and rules about how shareholders vote to elect it.',
];
function sectionRef(blocks, id) { return blocks.R && blocks.R[id] ? 'section ' + blocks.R[id] : 'the matching section'; }
function summarise(a) {
  const F = (a.founders || []).filter((f) => E(f.name) || E(f.pct));
  const bits = [
    'Company: ' + ph(a.companyName, 'name not given'),
    'Founders: ' + (F.length ? F.map((f) => (E(f.name) || '[name]') + ' ' + (E(f.pct) || '?') + '%' + (E(f.role) ? ' (' + E(f.role) + ')' : '')).join('; ') : 'not given'),
    'Vesting: ' + a.vestYears + ' years, cliff ' + (a.cliff === '0' ? 'none' : a.cliff + ' months'),
    'If someone quits on their own: ' + ({ good: 'Good Leaver', voluntary: 'Voluntary Leaver (gives up ' + (a.quitPct || 25) + '% of vested shares)', bad: 'Bad Leaver' }[a.quit] || a.quit),
    'Who buys a leaver\'s shares: ' + ({ either: 'the Company, which may pass the right to the remaining founders', founders: 'the remaining founders directly' }[a.buyer] || a.buyer),
    'Vote needed for big decisions: ' + ({ majority: 'more than half', twothirds: 'two-thirds', threequarters: 'three-quarters', all: 'everyone' }[a.majority] || a.majority),
    'Deadlock rule: ' + a.deadlock,
    'Selling to outsiders: ' + (a.lockin === 'lock' ? 'locked while vesting' : 'allowed after first refusal and board approval'),
    'Non-compete after leaving: ' + (a.noCompete === 'none' ? 'none' : a.noCompete + ' months in ' + ph(a.territory, 'territory not given')),
    'Secrecy after leaving: ' + a.secrecy + ' years',
    'Leave of absence rule: ' + a.absence,
    'Holding companies allowed: ' + a.holdco,
    'Option pool: ' + (a.pool || 0) + '%',
  ];
  return bits.join('\n');
}
function contextFor(ans) {
  const a = Object.assign(defaults(), ans || {});
  const blocks = build(a);
  const draft = toMarkdown(blocks).replace(/\*\*/g, '').replace(/^> /gm, '').replace(/^#+ /gm, '');
  return 'THE USER\'S ANSWERS (choices they made):\n' + summarise(a) + '\n\nTHE DRAFT AGREEMENT (this is the document the user is asking about):\n' + draft +
    '\n\nESTONIAN LAW NOTES (the only law you may cite):\n- ' + LAW_NOTES.join('\n- ') +
    '\n\nSHA ADD-ONS (generic; the actual signed SHA governs):\n- ' + SHA_ADDONS.join('\n- ');
}
function leaveParams(ans) {
  const a = Object.assign(defaults(), ans || {});
  const years = parseInt(a.vestYears, 10) || 4;
  return { years, months: years * 12, cliff: parseInt(a.cliff, 10) || 0, quit: a.quit, quitPct: parseFloat(a.quitPct) || 25, buyer: a.buyer,
    secrecy: a.secrecy, nc: a.noCompete === 'none' ? 0 : parseInt(a.noCompete, 10), territory: ph(a.territory, 'territory'), lock: a.lockin === 'lock',
    absence: a.absence, deadlock: a.deadlock, majority: a.majority, married: a.married === 'yes', holdco: a.holdco === 'yes' };
}
function vestedFraction(p, m) {
  if (m >= p.months) return 1;
  if (p.cliff && m < p.cliff) return 0;
  return m / p.months;
}

const API = { GROUPS, QUESTIONS, build, toMarkdown, questionnaireMarkdown, defaults, visible, LAW_NOTES, SHA_ADDONS, contextFor, summarise, leaveParams, vestedFraction, sectionRef };
if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.FoundersKit = API;
})(typeof window !== 'undefined' ? window : globalThis);
