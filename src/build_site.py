#!/usr/bin/env python3
"""Ehitab playbooki ja generaatori HTML-i. Sisu tuleb founders-kit.js-ist.
    python3 build_site.py [väljundkaust] [--artifact]
Väljund: index.html (playbook), generator.html, styles.css."""
import pathlib, sys

HERE = pathlib.Path(__file__).parent
OUT = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 and not sys.argv[1].startswith('--') else HERE.parent / 'kit'
ART = '--artifact' in sys.argv
KIT = (HERE / 'founders-kit.js').read_text(encoding='utf-8')
CHAT = (HERE / 'founders-chat.js').read_text(encoding='utf-8')
FONTS = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=Source+Sans+3:wght@400;600;700&display=swap'
URL_MODELS = 'https://startupestonia.ee/model-documents/'
URL_CHANGES = 'https://startupestonia.ee/wp-content/uploads/2026/10/Startup-Estonia-Model-Document-Changes-2023-2026.pdf'
ARIREG = 'https://www.riigiteataja.ee/akt/106072023131'
VOS = 'https://www.riigiteataja.ee/akt/120062026018'
PKS = 'https://www.riigiteataja.ee/akt/107052025017'

def head(title, desc, standalone=True, first=False):
    meta = f'<meta name="description" content="{desc}">\n<link rel="stylesheet" href="{FONTS}">\n<link rel="stylesheet" href="styles.css">\n'
    if standalone:
        return ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
                '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
                f'<title>{title}</title>\n{meta}</head>\n<body>\n')
    return f'<title>{title}</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n{meta}'

NAV = '''<header class="top"><div class="wrap top-in">
<a class="brand" href="index.html"><svg viewBox="0 0 120 120" width="28" height="28" aria-hidden="true"><rect width="120" height="120" rx="1.4" fill="#FA5F20"/><g fill="#fff"><polygon points="13,13 42.3,13 107,105.5 107,107 77.7,107 13,14.5"/><polygon points="63.6,13 106,13 84.8,43"/><polygon points="14,107 56.4,107 35.2,77"/></g></svg><span>TECH <i>x</i> LEGAL <b>Playbook</b></span></a>
<nav class="nav" aria-label="Main"><a href="index.html#why">Reasons</a><a href="index.html#decisions">Decisions</a><a href="index.html#vesting">Vesting</a><a href="index.html#docs">Models</a><a href="index.html#law">Law</a></nav>
<a class="btn btn-sm" href="generator.html">Build your draft</a>
</div></header>'''

FOOT = '''<footer class="foot"><div class="wrap">
<p>TECH x LEGAL Advokaadibüroo OÜ · Playbook, November 2026. Based on the Startup Estonia and EstVCA model documents (September 2026 edition) and Estonian law as published in the Riigi Teataja.</p>
<p class="fine">This playbook and the draft agreement are general information. They are not legal advice and are not ready to sign. Have a lawyer check your agreement and your articles of association before you sign.</p>
</div></footer>'''

def wrap(body, standalone, extra_head='', title='', desc=''):
    h = head(title, desc, standalone)
    out = f'{h}<div class="site">\n{NAV}\n<main>\n{body}\n</main>\n{FOOT}\n</div>\n'
    if standalone: out += '</body>\n</html>\n'
    return out

# ---------------------------------------------------------------- PLAYBOOK
PLAYBOOK = f'''
<section class="hero"><div class="wrap">
<p class="eyebrow">Playbook for founders · Estonian OÜ</p>
<h1>You and your friends are about to build something. Agree on the boring part first.</h1>
<p class="lede">Who owns what, who decides, and what happens if someone leaves. Most friendships survive a bad product. Few survive a vague share split. This playbook walks you through the choices, and gives you a plain-English agreement you can fill in together.</p>
<p class="cta-row"><a class="btn" href="generator.html">Answer the questions and get your draft</a><a class="btn btn-ghost" href="#why">Read the short version first</a></p>
</div></section>

<section class="sec" id="why"><div class="wrap">
<h2>Why do we need an agreement if we are friends?</h2>
<p class="sub">You do not write it because you distrust each other. You write it because later, when money, stress or a new idea shows up, you will not remember the same conversation the same way.</p>
<div class="tbl"><table class="plain-table">
<thead><tr><th>What goes wrong?</th><th>What does the agreement do?</th></tr></thead>
<tbody>
<tr><td>A founder quits after three months and keeps a third of the company.</td><td><b>Vesting.</b> Shares are earned over time. Leave early and the company takes back the part you have not earned.</td></tr>
<tr><td>You disagree about taking an investor. Nobody can break the tie.</td><td><b>Decision rules and a deadlock process.</b> You know in advance which votes decide what, and what happens if you are stuck.</td></tr>
<tr><td>One founder works full-time. Another keeps a day job and does evenings.</td><td><b>Roles and time.</b> The expected hours and the allowed side work are written down.</td></tr>
<tr><td>A founder sells their shares to a stranger you have never met.</td><td><b>First refusal and approval.</b> You get the first chance to buy, and a stranger can only come in if the board approves.</td></tr>
<tr><td>A founder leaves and starts a copy of the business next door.</td><td><b>Secrecy, non-compete and non-poaching.</b> Limited in time and place so that they are fair.</td></tr>
<tr><td>Code and designs belong to whoever wrote them, not to the company.</td><td><b>IP clause.</b> What you build for the company belongs to the company.</td></tr>
</tbody></table></div>
</div></section>

<section class="sec alt" id="how"><div class="wrap">
<h2>How does this work?</h2>
<ol class="steps">
<li><b>Talk first.</b><span>Sit down together with the 28 questions below. Do not look for the "right" answer. Look for the answer all of you can live with.</span></li>
<li><b>Fill in the questionnaire.</b><span>The <a href="generator.html">generator</a> turns your answers into a plain-English agreement you can read on screen.</span></li>
<li><b>Fix the company's articles.</b><span>In Estonia, some rules only work if they are also in the articles of association. The agreement lists what the articles must say.</span></li>
<li><b>Ask a lawyer to check it.</b><span>A lawyer reads one document, not a blank page. That is faster and cheaper.</span></li>
<li><b>Sign it.</b><span>With digital signatures or by hand. Keep one copy each.</span></li>
</ol>
</div></section>

<section class="sec" id="decisions"><div class="wrap">
<h2>What do you have to decide?</h2>
<p class="sub">Twenty-eight questions in eight groups. Each one has a suggested answer (marked with a star) taken from the Startup Estonia model, and a short note on why it matters. Open a question to read it.</p>
<div id="qlist" class="qgroups" aria-live="polite"></div>
<noscript><p>The list of questions needs JavaScript. You find the same list in the Word questionnaire.</p></noscript>
</div></section>

<section class="sec alt" id="vesting"><div class="wrap">
<h2>How does vesting work? Try it.</h2>
<p class="sub">Vesting is how you earn your shares over time. Move the sliders and see what a leaver would have earned.</p>
<div class="calc">
<div class="calc-in">
<label for="vy">Vesting period</label>
<select id="vy"><option value="4" selected>4 years</option><option value="3">3 years</option><option value="2">2 years</option></select>
<label for="vc">Cliff</label>
<select id="vc"><option value="12" selected>12 months</option><option value="6">6 months</option><option value="0">No cliff</option></select>
<label for="vs">Share of the company</label>
<select id="vs"><option value="10">10%</option><option value="20">20%</option><option value="25">25%</option><option value="33" selected>33%</option><option value="40">40%</option><option value="50">50%</option></select>
<label for="vm">Months worked: <output id="vmo">18</output></label>
<input id="vm" type="range" min="0" max="48" value="18" step="1">
</div>
<div class="calc-out">
<div class="bar" aria-hidden="true"><span id="vbar"></span></div>
<p class="big mono" id="vtxt"></p>
<table class="plain-table small-t"><thead><tr><th>If they leave now as a…</th><th>Company may take for free</th><th>Leaver keeps, or is paid for</th></tr></thead>
<tbody id="vtab"></tbody></table>
<p class="fine">Based on the model rules: unvested shares always come back for free. Bad Leaver also loses the vested shares. Good Leaver is paid fair value for the vested shares if the company or the other founders buy them.</p>
</div>
</div>
</div></section>

<section class="sec" id="leavers"><div class="wrap">
<h2>What happens to the shares when someone leaves?</h2>
<div class="tbl"><table class="plain-table">
<thead><tr><th>Type of leaver</th><th>Typical situation</th><th>Unvested shares</th><th>Vested shares</th></tr></thead>
<tbody>
<tr><td><b>Bad Leaver</b></td><td>Serious breach not fixed in 30 days, criminal conviction, serious damage, later breach of secrecy or non-compete. Misconduct found within 12 months after leaving also counts.</td><td>Company may take them for free.</td><td>Company may take them for free too. If it already paid for vested shares, it can ask for the money back.</td></tr>
<tr><td><b>Good Leaver</b></td><td>Illness, death, being let go without cause, or an agreed exit (an agreed exit counts as Good Leaver unless the exit agreement says otherwise).</td><td>Company may take them for free.</td><td>Company (or the other founders) may buy them at fair value.</td></tr>
<tr><td><b>Voluntary Leaver</b> <span class="tag">optional</span></td><td>Quits on their own without good reason. You choose whether to use this tier.</td><td>Company may take them for free.</td><td>A percentage you choose goes back for free, the rest at fair value.</td></tr>
</tbody></table></div>
<p class="fine">Source: Startup Estonia Founders' Agreement (2026 edition). The model has one more safeguard: the other founders can decide together that someone is not a Bad Leaver even if the wording fits.</p>
</div></section>

<section class="sec alt" id="docs"><div class="wrap">
<h2>Which Startup Estonia model do you need?</h2>
<p class="sub">Startup Estonia and the Estonian Private Equity and Venture Capital Association (EstVCA) publish free model documents, drafted by Estonian law firms. For owners' agreements there are three. They build on each other. Start with the lightest one that fits.</p>
<div class="tbl"><table class="plain-table">
<thead><tr><th></th><th>Founders' Agreement</th><th>Shareholders' Agreement without Supervisory Board</th><th>Shareholders' Agreement with Supervisory Board</th></tr></thead>
<tbody>
<tr><td><b>Who is it for?</b></td><td>Friends starting a company. No investors yet.</td><td>Founders plus first investors. The company is run by the management board and the shareholders.</td><td>Same, with a supervisory board (nõukogu) that oversees the management board.</td></tr>
<tr><td>Roles, time and who decides</td><td class="y">Yes</td><td class="y">Yes</td><td class="y">Yes, plus supervisory board approvals</td></tr>
<tr><td>Reverse vesting and leavers</td><td class="y">Yes</td><td class="y">Yes, and investors can approve changes</td><td class="y">Yes</td></tr>
<tr><td>Secrecy, non-compete, non-poaching</td><td class="y">Yes</td><td class="y">Yes</td><td class="y">Yes</td></tr>
<tr><td>Option pool for employees</td><td class="y">Yes</td><td class="y">Yes</td><td class="y">Yes</td></tr>
<tr><td>Right of first refusal, co-sale (tag-along), drag-along</td><td class="n">No</td><td class="y">Yes</td><td class="y">Yes</td></tr>
<tr><td>Information rights for investors</td><td class="n">No</td><td class="y">Yes: monthly reports, annual accounts, budget</td><td class="y">Yes</td></tr>
<tr><td>Anti-dilution, liquidation preference, preferred shares</td><td class="n">No</td><td class="y">Yes</td><td class="y">Yes</td></tr>
<tr><td>Investor put option</td><td class="n">No</td><td>Optional</td><td>Optional</td></tr>
</tbody></table></div>
<p class="fine">Compared from the 2026 editions of the three documents and their articles of association. Source: <a href="{URL_MODELS}" rel="noopener">Startup Estonia model documents</a>. What changed since 2023 is in <a href="{URL_CHANGES}" rel="noopener">the official change summary (PDF)</a>.</p>
<h3>What do the three have in common?</h3>
<ul class="check">
<li>Estonian law, and the Harju County Court as the first court.</li>
<li>Company and shareholders both sign.</li>
<li>Articles of association come as a separate document and form part of the agreement. Only the Estonian text of the articles is registered.</li>
<li>Four-year vesting with a one-year cliff as the standard, 90 days for the company to use its right to take back shares, fair value set by an expert if you disagree.</li>
<li>Non-compete and non-poaching run while you work for the company and 12 months after.</li>
<li>Secrecy lasts three years after you stop being a shareholder.</li>
</ul>
<p>This playbook and the generator are built around the Founders' Agreement, because it is the one you need before any investor arrives. When an investor comes, you move to a shareholders' agreement. Your founders' agreement does not disappear: its vesting, leaver and non-compete rules carry over.</p>
</div></section>

<section class="sec" id="law"><div class="wrap">
<h2>What does Estonian law add?</h2>
<p class="sub">A contract between friends is not enough in an Estonian OÜ. Some rules come from the Commercial Code, and some only work if they are written in the articles of association. These are the ones that catch people out. Each rule links to the official text in the Riigi Teataja.</p>
<div class="tbl"><table class="plain-table">
<thead><tr><th>Rule</th><th>What does it mean for you?</th><th>Source</th></tr></thead>
<tbody>
<tr><td>Transferring shares must be notarised.</td><td>A signed PDF is not enough to sell shares, unless the articles say a written agreement is enough. That is only possible if the share capital is at least €10,000 and fully paid in, and all shareholders vote for it.</td><td><a href="{ARIREG}" rel="noopener">Commercial Code § 149(4), (6)</a></td></tr>
<tr><td>Other shareholders have one month of first refusal on a sale to an outsider.</td><td>Unless the articles say otherwise. The agreement uses 30 days.</td><td><a href="{ARIREG}" rel="noopener">§ 149(2)</a></td></tr>
<tr><td>The articles can make a sale depend on a condition, like the board's approval.</td><td>If the condition is in the articles and someone sells without it, the sale is void. This is why the agreement and the articles must match.</td><td><a href="{ARIREG}" rel="noopener">§ 149(3)</a></td></tr>
<tr><td>On a capital increase, shareholders get first pick.</td><td>It can be switched off only by a vote of at least three-quarters, and the board must explain why in writing.</td><td><a href="{ARIREG}" rel="noopener">§ 193</a></td></tr>
<tr><td>Changing the articles needs two-thirds of the votes.</td><td>Even if you agree a lower majority for other things. The articles can set it higher.</td><td><a href="{ARIREG}" rel="noopener">§ 175</a></td></tr>
<tr><td>Written votes: silence counts as "no".</td><td>If someone does not answer by the deadline, they are counted as voting against.</td><td><a href="{ARIREG}" rel="noopener">§ 173(2)</a></td></tr>
<tr><td>The company can only buy its own shares within limits.</td><td>The shareholders must pass a resolution that sets the terms, the period (at most five years) and the minimum and maximum price. The company can hold shares worth at most one third of the share capital, and its net assets must stay high enough. If the company cannot buy, the other founders buy instead.</td><td><a href="{ARIREG}" rel="noopener">§ 162(2)</a></td></tr>
<tr><td>A court can reduce an unreasonably high contractual penalty.</td><td>A huge penalty may not survive. Pick numbers that match real damage.</td><td><a href="{VOS}" rel="noopener">Law of Obligations Act § 162</a></td></tr>
<tr><td>Partnership rules can apply to a group of people working together.</td><td>The model switches them off (§§ 580–618) so that each founder is responsible for their own obligations only.</td><td><a href="{VOS}" rel="noopener">§ 580</a></td></tr>
<tr><td>If shares are joint property, your spouse may need to agree.</td><td>A multi-party agreement about joint property without the spouse's consent is void unless the spouse approves it later.</td><td><a href="{PKS}" rel="noopener">Family Law Act § 31(1)</a></td></tr>
</tbody></table></div>
<p class="fine">The English texts come from the Riigi Teataja's own English translation (read on 9 November 2026). Only the Estonian text is binding.</p>
</div></section>

<section class="sec alt" id="traps"><div class="wrap">
<h2>Which ten traps do founders fall into?</h2>
<ol class="traps">
<li><b>Splitting the shares equally because it feels fair.</b> Equal shares are fine if everyone does the same amount of work for the same time. Write down why you chose the split.</li>
<li><b>No vesting.</b> Without it, a founder who leaves after a month keeps a full share. Investors will ask for vesting anyway.</li>
<li><b>Two founders at 50/50 with "more than half" decides.</b> You can never decide anything without both. Pick a deadlock rule.</li>
<li><b>Everyone can sign for the company.</b> Each management board member can usually bind the company alone. Set a spending limit.</li>
<li><b>Signing with a PDF and forgetting the notary.</b> A share transfer still needs a notary unless your articles say otherwise.</li>
<li><b>A "forever" non-compete.</b> A court may not accept it. Keep it to 6 to 12 months and to where you really work.</li>
<li><b>The business sentence is too vague.</b> It decides what counts as competing. Write it carefully.</li>
<li><b>Nobody owns the code.</b> If a friend wrote the first version before the company existed, make sure it is assigned to the company in writing.</li>
<li><b>Part-time founders and full-time founders on the same vesting.</b> Talk about it now. This kit does not slow down part-time vesting for you.</li>
<li><b>Treating the agreement as done once it is signed.</b> Look at it again when you hire your first person and when an investor appears.</li>
</ol>
</div></section>

<section class="sec" id="next"><div class="wrap narrow">
<h2>What do you do next?</h2>
<p>Open the <a href="generator.html">generator</a>, answer the questions together, and read the draft out loud. Where a sentence makes you uneasy, you have found a decision you have not made yet.</p>
<p class="cta-row"><a class="btn" href="generator.html">Build your draft</a></p>
<h3>Where does this come from?</h3>
<ul class="plain">
<li>The six Startup Estonia / EstVCA model documents on owners' agreements, 2026 edition: Founders' Agreement, its articles, and the two shareholders' agreements with their articles. Compared clause by clause. Also the 2023 Founders' Agreement and the official 2023 to 2026 change summary. <a href="{URL_MODELS}" rel="noopener">Source</a>.</li>
<li>Estonian law read from the Riigi Teataja on 9 November 2026 (English translation).</li>
<li>The plain-English wording is ours. It follows the structure and the choices of the models, not their legal text.</li>
<li>The Startup Estonia models state that they are a starting point and not legal advice.</li>
</ul>
<p class="fine"><b>Not checked:</b> we have not checked tax effects of giving or transferring shares, or the rules for foreign founders. Talk to an accountant and a lawyer. Two choices in the generator are our own additions and are labelled so: the deadlock rule, and leaving sickness and parental leave out of the leave-of-absence rule.</p>
</div></section>
'''

# ---------------------------------------------------------------- GENERATOR
GENERATOR = '''
<section class="hero hero-s"><div class="wrap">
<p class="eyebrow"><a href="index.html">Playbook</a> / Generator</p>
<h1>Answer the questions. Read your draft.</h1>
<p class="lede">The draft on the right changes as you answer. Nothing leaves your browser. Copy the text into Word when you are happy with it.</p>
</div></section>
<section class="gen"><div class="wrap gen-in">
<form id="form" class="gen-form" onsubmit="return false" autocomplete="off"></form>
<div class="gen-out">
<div class="tabs" role="tablist" aria-label="Draft or questions"><button type="button" class="tab on" role="tab" id="tab-draft" aria-selected="true" aria-controls="pane-draft">Your draft</button><button type="button" class="tab" role="tab" id="tab-ask" aria-selected="false" aria-controls="pane-ask">Ask about your agreement</button></div>
<div id="pane-draft" role="tabpanel" aria-labelledby="tab-draft">
<div class="gen-bar"><button type="button" class="btn btn-sm" id="copy">Copy the draft</button><button type="button" class="btn btn-ghost btn-sm" id="reset">Start over</button><span id="status" class="fine" role="status"></span></div>
<div id="warn"></div>
<article id="doc" class="doc" aria-live="polite"></article>
</div>
<div id="pane-ask" role="tabpanel" aria-labelledby="tab-ask" hidden>
<p class="ask-intro">Ask about <b>your</b> draft, using the answers you gave on the left. For example: <i>I am leaving the company. What is the process and what must I think about?</i></p>
<div id="chat" class="chat"></div>
</div>
</div>
</div></section>
'''

GEN_JS = '''
(function(){
var K=window.FoundersKit, ans=K.defaults(), form=document.getElementById('form'), doc=document.getElementById('doc'), warn=document.getElementById('warn');
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function save(){try{localStorage.setItem('founders-kit-v1',JSON.stringify(ans));}catch(e){}}
function load(){try{var s=localStorage.getItem('founders-kit-v1');if(s){var o=JSON.parse(s);for(var k in o)ans[k]=o[k];}}catch(e){}}
load();
function foundersHtml(){
  var h='<div class="frows">';
  ans.founders.forEach(function(f,i){
    h+='<div class="frow"><label class="sr" for="fn'+i+'">Name</label><input id="fn'+i+'" data-f="'+i+'" data-k="name" placeholder="Name" value="'+esc(f.name)+'">'+
    '<label class="sr" for="fp'+i+'">Share %</label><input id="fp'+i+'" data-f="'+i+'" data-k="pct" inputmode="decimal" placeholder="%" value="'+esc(f.pct)+'">'+
    '<label class="sr" for="fr'+i+'">Main job</label><input id="fr'+i+'" data-f="'+i+'" data-k="role" placeholder="Main job" value="'+esc(f.role)+'">'+
    (ans.founders.length>2?'<button type="button" class="x" data-del="'+i+'" aria-label="Remove founder '+(i+1)+'">&times;</button>':'<span></span>')+'</div>';
  });
  h+='</div>'+(ans.founders.length<5?'<button type="button" class="btn btn-ghost btn-sm" id="addf">Add a founder</button>':'');
  return h;
}
function qHtml(q){
  var id='q_'+q.id, h='<div class="q" data-q="'+q.id+'"><label class="ql" for="'+id+'">'+esc(q.label)+'</label>';
  if(q.type==='founders') h+=foundersHtml();
  else if(q.type==='choice'){h+='<div class="opts" role="radiogroup" aria-labelledby="'+id+'l">';
    q.opts.forEach(function(o,i){var oid=id+'_'+i;h+='<label class="opt" for="'+oid+'"><input type="radio" name="'+id+'" id="'+oid+'" value="'+esc(o[0])+'"'+(String(ans[q.id])===o[0]?' checked':'')+'><span>'+esc(o[1])+(o[0]===String(q.def)?' <em class="star">suggested</em>':'')+'</span></label>';});h+='</div>';}
  else if(q.type==='yesno') h+='<div class="opts"><label class="opt" for="'+id+'_y"><input type="radio" name="'+id+'" id="'+id+'_y" value="yes"'+(ans[q.id]==='yes'?' checked':'')+'><span>Yes</span></label><label class="opt" for="'+id+'_n"><input type="radio" name="'+id+'" id="'+id+'_n" value="no"'+(ans[q.id]!=='yes'?' checked':'')+'><span>No</span></label></div>';
  else if(q.type==='longtext') h+='<textarea id="'+id+'" rows="3" placeholder="'+esc(q.ph||'')+'">'+esc(ans[q.id]||'')+'</textarea>';
  else h+='<input id="'+id+'" type="'+(q.type==='number'?'number':'text')+'"'+(q.type==='number'?' min="0" max="100" step="1"':'')+' placeholder="'+esc(q.ph||'')+'" value="'+esc(ans[q.id]||'')+'">';
  h+='<details class="why"><summary>Why does it matter?</summary><p>'+esc(q.why)+'</p></details></div>';
  return h;
}
function renderForm(keepFocus){
  var h='';
  K.GROUPS.forEach(function(g,gi){
    h+='<fieldset class="grp"><legend>'+(gi+1)+'. '+esc(g[1])+'</legend>';
    K.QUESTIONS.filter(function(q){return q.g===g[0];}).forEach(function(q){ if(K.visible(q,ans)) h+=qHtml(q); });
    h+='</fieldset>';
  });
  form.innerHTML=h;
}
function renderDoc(){
  var blocks=K.build(ans), h='', i=0, inList=false;
  blocks.forEach(function(b){
    if(b.t!=='li'&&inList){h+='</ul>';inList=false;}
    if(b.t==='title') h+='<h2 class="dt">'+esc(b.text)+'</h2>';
    else if(b.t==='sub') h+='<p class="ds">'+esc(b.text)+'</p>';
    else if(b.t==='h2') h+='<h3>'+(b.num?b.num+'. ':'')+esc(b.text)+'</h3>';
    else if(b.t==='plain') h+='<p class="pw"><b>In plain words:</b> '+esc(b.text)+'</p>';
    else if(b.t==='p') h+='<p><b>'+b.num+'</b> '+esc(b.text)+'</p>';
    else if(b.t==='li'){if(!inList){h+='<ul>';inList=true;}h+='<li>'+esc(b.text)+'</li>';}
    else if(b.t==='note') h+='<p class="nt"><b>Note.</b> '+esc(b.text)+'</p>';
    else if(b.t==='table'){h+='<div class="tw"><table><thead><tr>'+b.head.map(function(x){return '<th>'+esc(x)+'</th>';}).join('')+'</tr></thead><tbody>'+b.rows.map(function(r){return '<tr>'+r.map(function(x){return '<td>'+esc(x)+'</td>';}).join('')+'</tr>';}).join('')+'</tbody></table></div>';}
  });
  if(inList) h+='</ul>';
  doc.innerHTML=h;
  var tot=0,any=false;ans.founders.forEach(function(f){var n=parseFloat(f.pct);if(!isNaN(n)){tot+=n;any=true;}});
  warn.innerHTML=(any&&Math.abs(tot-100)>0.01)?'<p class="warnbox">The founders\\' shares add up to '+(Math.round(tot*10)/10)+'%, not 100%. Check the numbers.</p>':'';
}
function refresh(){save();renderDoc();}
form.addEventListener('input',function(e){
  var t=e.target;
  if(t.dataset&&t.dataset.f!==undefined){ans.founders[+t.dataset.f][t.dataset.k]=t.value;refresh();return;}
  var q=t.closest('[data-q]'); if(!q) return; var id=q.getAttribute('data-q');
  if(t.type==='radio'){ans[id]=t.value; var qd=K.QUESTIONS.filter(function(x){return x.id===id;})[0];
     var dep=K.QUESTIONS.some(function(x){return (x.showIf&&x.showIf[id])||(x.hideIf&&x.hideIf[id]);});
     if(dep){renderForm();}}
  else ans[id]=t.value;
  refresh();
});
form.addEventListener('click',function(e){
  var t=e.target;
  if(t.id==='addf'){ans.founders.push({name:'',pct:'',role:''});renderForm();refresh();}
  if(t.dataset&&t.dataset.del!==undefined){ans.founders.splice(+t.dataset.del,1);renderForm();refresh();}
});
document.getElementById('reset').addEventListener('click',function(){ans=K.defaults();try{localStorage.removeItem('founders-kit-v1');}catch(e){}renderForm();renderDoc();document.getElementById('status').textContent='Cleared.';});
document.getElementById('copy').addEventListener('click',function(){
  var txt=K.toMarkdown(K.build(ans)).replace(/\\*\\*/g,'').replace(/^> /gm,'').replace(/^#+ /gm,'');
  var st=document.getElementById('status');
  function done(){st.textContent='Copied. Paste it into Word.';}
  function sel(){var r=document.createRange();r.selectNodeContents(doc);var s=getSelection();s.removeAllRanges();s.addRange(r);st.textContent='Selected. Press Ctrl+C or Cmd+C to copy.';}
  try{navigator.clipboard.writeText(txt).then(done,sel);}catch(x){sel();}
});
function tab(which){
  var d=which==='draft';
  document.getElementById('pane-draft').hidden=!d; document.getElementById('pane-ask').hidden=d;
  [['tab-draft',d],['tab-ask',!d]].forEach(function(t){var b=document.getElementById(t[0]);b.classList.toggle('on',t[1]);b.setAttribute('aria-selected',t[1]?'true':'false');});
}
document.getElementById('tab-draft').addEventListener('click',function(){tab('draft');});
document.getElementById('tab-ask').addEventListener('click',function(){tab('ask');});
renderForm();renderDoc();
if(window.FoundersChat) window.FoundersChat.mount({root:document.getElementById('chat'),getAnswers:function(){return ans;}});
})();
'''

PB_JS = '''
(function(){
var K=window.FoundersKit, el=document.getElementById('qlist');
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
var h='';
K.GROUPS.forEach(function(g,gi){
  h+='<div class="qg"><h3>'+(gi+1)+'. '+esc(g[1])+'</h3>';
  K.QUESTIONS.filter(function(q){return q.g===g[0];}).forEach(function(q){
    h+='<details><summary>'+esc(q.label)+'</summary><p>'+esc(q.why)+'</p>';
    if(q.opts){h+='<ul>';q.opts.forEach(function(o){h+='<li>'+(o[0]===String(q.def)?'<b>★ ':'')+esc(o[1])+(o[0]===String(q.def)?'</b>':'')+'</li>';});h+='</ul>';}
    h+='</details>';
  });
  h+='</div>';
});
el.innerHTML=h;
function calc(){
  var y=+document.getElementById('vy').value, c=+document.getElementById('vc').value, s=+document.getElementById('vs').value, m=+document.getElementById('vm').value;
  var total=y*12; document.getElementById('vmo').textContent=m;
  var vested=0; if(m>=total) vested=1; else if(c&&m<c) vested=0; else if(c&&m>=c) vested=m/total; else vested=m/total;
  var p=Math.round(vested*1000)/10, unv=Math.round((100-p)*10)/10;
  document.getElementById('vbar').style.width=p+'%';
  document.getElementById('vtxt').textContent=m+' of '+total+' months worked: '+p+'% earned, '+unv+'% not yet earned';
  function pc(x){return Math.round(x*s)/100;}
  var rows=[['Bad Leaver','all '+s+'% of the company ('+ '100% of their shares)','nothing (the company may take all shares)'],
            ['Good Leaver','the unvested part: '+pc(unv)+'% of the company','the vested part ('+pc(p)+'% of the company), or fair value in cash if the company buys it'],
            ['Voluntary Leaver (25% penalty example)','the unvested part and a quarter of the vested part: '+(Math.round((unv+0.25*p)*s)/100)+'% of the company','the rest of the vested part ('+(Math.round(0.75*p*s)/100)+'% of the company), or fair value in cash if bought']];
  document.getElementById('vtab').innerHTML=rows.map(function(r){return '<tr><td>'+esc(r[0])+'</td><td>'+esc(r[1])+'</td><td>'+esc(r[2])+'</td></tr>';}).join('');
}
['vy','vc','vs','vm'].forEach(function(i){document.getElementById(i).addEventListener('input',calc);});
calc();
})();
'''

CSS = r'''/* Playbook: brand document palette (01-mina/stiil-ja-toon.md), Newsreader + Source Sans 3 + IBM Plex Mono. */
:root{
  --paper:#FFFFFF; --surface:#F6F5F3; --surface2:#EFEDEA; --line:#E0DDD8; --line2:#C8C3BC;
  --ink:#171512; --ink2:#463F38; --muted:#6C645B;
  --accent:#D1500F; --mark:#FA5F20; --on-mark:#171512; --accent-soft:#FDEEE7;
  --ok:#136354; --ok-soft:#E2F2EE; --no:#A3231B; --no-soft:#FBE8E6; --warn:#A85A10; --warn-soft:#F8EED9;
  --display:"Newsreader",Georgia,"Times New Roman",serif; --body:"Source Sans 3","Segoe UI",Arial,sans-serif; --mono:"IBM Plex Mono",Consolas,"Courier New",monospace;
  color-scheme: light;
}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){
  --paper:#12100E; --surface:#1B1917; --surface2:#24211E; --line:#2E2A26; --line2:#463F38;
  --ink:#F2EFEB; --ink2:#C6BFB7; --muted:#978E84; --accent:#FF7D45; --accent-soft:#331C11;
  --ok:#4FB8A1; --ok-soft:#10241F; --no:#E8695F; --no-soft:#2C1513; --warn:#D99845; --warn-soft:#2A2012; color-scheme: dark;}}
:root[data-theme="dark"]{
  --paper:#12100E; --surface:#1B1917; --surface2:#24211E; --line:#2E2A26; --line2:#463F38;
  --ink:#F2EFEB; --ink2:#C6BFB7; --muted:#978E84; --accent:#FF7D45; --accent-soft:#331C11;
  --ok:#4FB8A1; --ok-soft:#10241F; --no:#E8695F; --no-soft:#2C1513; --warn:#D99845; --warn-soft:#2A2012; color-scheme: dark;}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--paper);color:var(--ink);font-family:var(--body);font-size:17px;line-height:1.6;-webkit-font-smoothing:antialiased}
a{color:var(--accent);text-underline-offset:3px} a:hover{color:var(--ink)}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.wrap{max-width:1120px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
.narrow{max-width:760px}
h1,h2,h3{font-family:var(--display);font-weight:500;line-height:1.14;margin:0;text-wrap:balance;letter-spacing:-.01em}
h1{font-size:clamp(2rem,5vw,3.4rem);max-width:22ch}
h2{font-size:clamp(1.5rem,2.8vw,2rem);margin-bottom:.7rem}
h3{font-size:1.3rem;margin:1.8rem 0 .6rem}
p{margin:0 0 1rem;max-width:70ch}
.top{position:sticky;top:env(safe-area-inset-top,0px);z-index:5;background:var(--paper);border-bottom:1px solid var(--line)}
.top-in{display:flex;align-items:center;gap:1.2rem;padding-block:.65rem;flex-wrap:wrap}
.brand{display:flex;align-items:center;gap:.6rem;text-decoration:none;color:var(--ink);font-weight:700;letter-spacing:.06em;font-size:.9rem}
.brand i{font-style:normal;color:var(--accent)} .brand b{font-weight:400;color:var(--muted);letter-spacing:.02em;margin-left:.3rem}
.nav{display:flex;gap:1.1rem;flex-wrap:wrap;margin-left:auto;font-size:.95rem} .nav a{color:var(--ink2);text-decoration:none} .nav a:hover{color:var(--accent);text-decoration:underline}
.btn{display:inline-block;background:var(--mark);color:var(--on-mark);font-weight:700;text-decoration:none;padding:.7rem 1.15rem;border-radius:2px;border:1px solid var(--mark);font-family:var(--body);font-size:1rem;cursor:pointer}
.btn:hover{background:var(--ink);border-color:var(--ink);color:var(--paper)}
.btn-sm{padding:.45rem .85rem;font-size:.9rem}
.btn-ghost{background:transparent;color:var(--ink);border:1px solid var(--line2);font-weight:600} .btn-ghost:hover{background:var(--surface2);border-color:var(--ink);color:var(--ink)}
.hero{padding-block:clamp(2.6rem,7vw,4.6rem) clamp(2rem,5vw,3rem);border-bottom:1px solid var(--line)}
.hero-s{padding-block:clamp(1.8rem,4vw,2.8rem) 1.6rem} .hero-s h1{font-size:clamp(1.7rem,4vw,2.5rem)}
.eyebrow{font-family:var(--mono);font-size:.78rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:1rem} .eyebrow a{color:var(--muted)}
.lede{font-size:1.18rem;color:var(--ink2);max-width:60ch;margin-top:1.1rem}
.cta-row{display:flex;gap:.8rem;flex-wrap:wrap;align-items:center;margin-top:1.4rem}
.sec{padding-block:clamp(2.2rem,5vw,3.4rem)} .alt{background:var(--surface)} .sub{color:var(--ink2)}
.tbl{overflow-x:auto;margin:1rem 0}
.plain-table{border-collapse:collapse;width:100%;min-width:620px;font-size:.97rem}
.plain-table th,.plain-table td{text-align:left;vertical-align:top;padding:.7rem .8rem;border-top:1px solid var(--line)}
.plain-table thead th{border-top:1px solid var(--ink);border-bottom:1px solid var(--ink);font-family:var(--mono);font-size:.74rem;letter-spacing:.07em;text-transform:uppercase;color:var(--muted);font-weight:500}
.plain-table td.y{color:var(--ok);font-weight:600} .plain-table td.n{color:var(--muted)}
.small-t{min-width:0;font-size:.9rem}
.tag{font-family:var(--mono);font-size:.68rem;background:var(--accent-soft);color:var(--accent);padding:1px 6px;border-radius:2px;letter-spacing:.05em;text-transform:uppercase}
.steps{list-style:none;margin:1rem 0 0;padding:0;counter-reset:s}
.steps li{counter-increment:s;display:grid;grid-template-columns:3rem minmax(0,1fr);column-gap:.4rem;padding:.85rem 0;border-top:1px solid var(--line)}
.steps li::before{content:counter(s);font-family:var(--mono);color:var(--accent);font-size:1.1rem}
.steps b,.steps span{grid-column:2} .steps span{color:var(--ink2)}
.traps{margin:1rem 0 0;padding-left:1.4rem} .traps li{padding:.5rem 0;border-top:1px solid var(--line)} .traps li::marker{font-family:var(--mono);color:var(--accent)}
.check,.plain{list-style:none;margin:0 0 1rem;padding:0}
.check li,.plain li{padding:.5rem 0 .5rem 1.6rem;border-top:1px solid var(--line);position:relative}
.check li::before{content:"";position:absolute;left:.15rem;top:1rem;width:.5rem;height:.5rem;background:var(--ok)}
.plain li::before{content:"";position:absolute;left:.15rem;top:1.1rem;width:.6rem;height:2px;background:var(--muted)}
.qgroups{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,22rem),1fr));gap:1rem 2.4rem} .qg h3{margin-top:0}
details{border-top:1px solid var(--line);padding:.65rem 0} details:last-child{border-bottom:1px solid var(--line)}
summary{cursor:pointer;font-weight:600;list-style:none;padding-right:1.5rem;position:relative}
summary::-webkit-details-marker{display:none} summary::after{content:"+";position:absolute;right:0;font-family:var(--mono);color:var(--accent)}
details[open] summary::after{content:"\2212"} details p{margin:.5rem 0;color:var(--ink2)} details ul{margin:.2rem 0 .6rem;padding-left:1.2rem;color:var(--ink2)}
.calc{display:grid;grid-template-columns:minmax(0,18rem) minmax(0,1fr);gap:2rem;margin-top:1rem;align-items:start}
.calc-in{display:grid;gap:.3rem;border:1px solid var(--ink);padding:1.1rem;background:var(--paper)}
.calc-in label{font-size:.82rem;color:var(--muted);font-family:var(--mono);text-transform:uppercase;letter-spacing:.06em;margin-top:.6rem}
select,input[type=text],input[type=number],input:not([type]),textarea{width:100%;font:inherit;color:var(--ink);background:var(--paper);border:1px solid var(--line2);padding:.5rem .6rem;border-radius:2px}
input[type=range]{width:100%;accent-color:var(--mark)}
.bar{height:1.2rem;background:var(--surface2);border:1px solid var(--line2);margin-bottom:.8rem} .bar span{display:block;height:100%;width:50%;background:var(--mark);transition:width .2s}
.big{font-size:1.15rem;font-weight:500} .mono{font-family:var(--mono);font-variant-numeric:tabular-nums}
.fine{font-size:.88rem;color:var(--muted);max-width:none}
.foot{border-top:1px solid var(--ink);padding-block:2rem;font-size:.95rem}
/* generator */
.gen{padding-block:1.6rem 3rem}
.gen-in{display:grid;grid-template-columns:minmax(0,26rem) minmax(0,1fr);gap:2.4rem;align-items:start}
.gen-form{min-width:0}
.grp{border:0;border-top:1px solid var(--ink);padding:.6rem 0 1.2rem;margin:0 0 1rem} .grp legend{font-family:var(--display);font-size:1.25rem;padding:0 .4rem 0 0}
.q{padding:.8rem 0;border-top:1px solid var(--line)} .q:first-of-type{border-top:0}
.ql{display:block;font-weight:600;margin-bottom:.45rem}
.opts{display:grid;gap:.35rem} .opt{display:flex;gap:.55rem;align-items:flex-start;padding:.45rem .55rem;border:1px solid var(--line);cursor:pointer;font-size:.97rem}
.opt:has(input:checked){border-color:var(--accent);background:var(--accent-soft)} .opt input{margin-top:.28rem;accent-color:var(--mark)}
.star{font-style:normal;font-family:var(--mono);font-size:.66rem;background:var(--ok-soft);color:var(--ok);padding:1px 5px;border-radius:2px;text-transform:uppercase;letter-spacing:.05em;margin-left:.3rem}
.frows{display:grid;gap:.45rem;margin-bottom:.5rem} .frow{display:grid;grid-template-columns:minmax(0,1.4fr) 4.2rem minmax(0,1.4fr) 1.6rem;gap:.4rem;align-items:center}
.x{border:0;background:transparent;color:var(--muted);font-size:1.3rem;cursor:pointer;line-height:1}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.gen-out{min-width:0;position:sticky;top:calc(env(safe-area-inset-top,0px) + 4.2rem);max-height:calc(100vh - 6rem);overflow:auto;border:1px solid var(--ink);background:var(--paper)}
.gen-bar{position:sticky;top:0;display:flex;gap:.6rem;align-items:center;flex-wrap:wrap;padding:.6rem .8rem;background:var(--surface);border-bottom:1px solid var(--line)}
.doc{padding:1.2rem 1.4rem 2rem;font-size:.98rem}
.doc h2.dt{font-size:1.7rem;margin-bottom:.2rem} .doc .ds{color:var(--muted);margin-bottom:1rem}
.doc h3{font-size:1.15rem;margin:1.6rem 0 .4rem;border-top:1px solid var(--line);padding-top:.8rem}
.doc p{max-width:none;margin-bottom:.7rem} .doc ul{margin:.2rem 0 .8rem;padding-left:1.3rem}
.pw{background:var(--accent-soft);padding:.5rem .7rem;font-size:.92rem;color:var(--ink2)}
.nt{background:var(--warn-soft);padding:.5rem .7rem;font-size:.92rem}
.warnbox{margin:.6rem .8rem;padding:.5rem .7rem;background:var(--no-soft);color:var(--no);font-weight:600}
.tw{overflow-x:auto;margin-bottom:1rem} .doc table{border-collapse:collapse;min-width:420px;width:100%;font-size:.9rem} .doc th,.doc td{border:1px solid var(--line2);padding:.35rem .5rem;text-align:left;vertical-align:top}
.tabs{display:flex;gap:.2rem;border-bottom:1px solid var(--line);padding:.4rem .8rem 0}
.tab{font:inherit;font-weight:600;font-size:.92rem;background:none;border:1px solid transparent;border-bottom:0;padding:.5rem .9rem;color:var(--muted);cursor:pointer}
.tab.on{color:var(--ink);background:var(--paper);border-color:var(--line);margin-bottom:-1px}
.tab:focus-visible,.chip:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.ask-intro{margin:.8rem .8rem .4rem;font-size:.95rem;color:var(--ink2)}
.chat{padding:.2rem .8rem 1rem}
.chat-chips{display:flex;flex-wrap:wrap;gap:.4rem;margin:.4rem 0 .8rem}
.chip{font:inherit;font-size:.86rem;padding:.35rem .7rem;border:1px solid var(--line2);background:var(--paper);color:var(--ink);cursor:pointer;border-radius:999px}
.chip:hover{border-color:var(--accent);color:var(--accent)}
.chat-log{display:flex;flex-direction:column;gap:.6rem;max-height:60vh;overflow-y:auto;margin-bottom:.7rem}
.msg{padding:.6rem .8rem;font-size:.93rem;max-width:100%}
.msg.me{align-self:flex-end;background:var(--accent-soft);max-width:85%}
.msg.bot{border:1px solid var(--line);background:var(--paper)}
.msg h4,.msg h5{margin:.6rem 0 .3rem;font-size:1rem} .msg p{margin:0 0 .5rem;max-width:none} .msg ul,.msg ol{margin:.2rem 0 .6rem;padding-left:1.25rem} .msg li{margin-bottom:.25rem}
.msg table{border-collapse:collapse;width:100%;min-width:360px;font-size:.86rem} .msg th,.msg td{border:1px solid var(--line2);padding:.3rem .45rem;text-align:left;vertical-align:top}
.msg .lcalc{display:flex;flex-wrap:wrap;gap:.6rem;align-items:end;margin:.4rem 0}
.msg .lcalc label{font-size:.85rem;display:flex;flex-direction:column;gap:.2rem} .msg .lcalc input{width:6.5rem}
.chat-form{display:flex;gap:.5rem;align-items:flex-end} .chat-form textarea{flex:1;min-width:0;font:inherit;padding:.5rem;border:1px solid var(--line2);background:var(--paper);color:var(--ink);resize:vertical}
.chat-form textarea:disabled{opacity:.6}
@media (max-width:820px){
  .calc,.gen-in{grid-template-columns:minmax(0,1fr)} .gen-out{position:static;max-height:none}
  .nav{margin-left:0;order:3;width:100%} .btn-sm{margin-left:auto}
}
@media (prefers-reduced-motion:no-preference){a,.btn{transition:color .15s,background .15s,border-color .15s}}
'''

def build():
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / 'styles.css').write_text(CSS, encoding='utf-8')
    (OUT / 'founders-kit.js').write_text(KIT, encoding='utf-8')
    (OUT / 'founders-chat.js').write_text(CHAT, encoding='utf-8')
    idx = wrap(PLAYBOOK + f'<script src="founders-kit.js"></script>\n<script>{PB_JS}</script>', not ART,
               title="Founders' Playbook", desc="A plain-English playbook for friends starting a company in Estonia: the decisions, vesting, leavers, the Startup Estonia models and Estonian law.")
    (OUT / 'index.html').write_text(idx, encoding='utf-8')
    gen = wrap(GENERATOR + f'<script src="founders-kit.js"></script>\n<script src="founders-chat.js"></script>\n<script>{GEN_JS}</script>', True,
               title="Founders' Agreement Generator", desc="Answer 28 questions and read your plain-English founders' agreement draft.")
    (OUT / 'generator.html').write_text(gen, encoding='utf-8')
    print('valmis', OUT)

if __name__ == '__main__':
    build()
