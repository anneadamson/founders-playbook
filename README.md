# Founders' Playbook

A plain-English playbook for friends starting a company in Estonia (an OÜ), a generator that turns 28 answers into a draft founders' agreement, and a Q&A chat that answers questions about that draft (for example: "I am leaving the company. What is the process, and what must I think about?").

Made by TECH x LEGAL Advokaadibüroo OÜ.

> **Status: draft, not legal advice.** The playbook and the agreement text are general information. A lawyer has not yet reviewed the legal claims. Do not sign the output without a lawyer checking it and your articles of association.

## What is in here

| Path | What |
|---|---|
| `src/founders-kit.js` | The content: questions, agreement text (`build`), Estonian law notes (`LAW_NOTES`), generic shareholders' agreement add-ons (`SHA_ADDONS`). One source for everything else. |
| `src/founders-chat.js` | The Q&A chat. Seven quick guides answer from the user's own draft (no model needed). Free-text questions use Claude through the Artifact `sample` capability. |
| `src/build_site.py` | Builds the HTML pages from the two files above. |
| `kit/` | Built output: `index.html` (playbook), `generator.html`, `styles.css`, the two scripts. Open `kit/index.html` in a browser. It needs no server. |
| `docs/` | The agreement template and the questionnaire as Markdown and Word. |
| `tools/md-word.js` | Markdown to Word, in the TECH x LEGAL style. |

## Build

```
python3 src/build_site.py            # writes kit/
python3 src/build_site.py out --artifact   # artifact variant, writes out/
npm install && npm run docx         # regenerates the Word files from docs/*.md
```

`docx` is pinned to an exact version (9.13.0).

## The Q&A chat

- **Quick questions** work anywhere. They are answered from the user's answers and the section numbers of the generated draft.
- **Free-text questions** need `window.claude.use('sample')`, which exists only when the page is opened inside claude.ai as a published Artifact, and the viewer has allowed it. Elsewhere (for example plain GitHub Pages) the text box is switched off and the page says so. The page declares `capabilities: {sample: {}}` when published.
- The model sees only the generated draft, the user's answers, `LAW_NOTES` and `SHA_ADDONS`. It is told to cite section numbers, not to invent clauses, and to end with a not-legal-advice line.
- The shareholders' agreement points are generic. A signed agreement always governs.

## Where it is published

The playbook and generator are also published as a Claude Artifact. This repository is the source: publish `kit/` (or the `--artifact` build) again to update it.

## Sources

Structure and choices follow the Startup Estonia and EstVCA model documents (2026 edition) and Estonian law as published in the Riigi Teataja. **The model documents' text is not copied** into this repository; the agreement text here is new and written in plain English.

Estonian law referenced: Commercial Code (ÄS) §§ 149, 162, 173, 175, 193; Law of Obligations Act (VÕS) §§ 158, 162, 580; Family Law Act (PKS) § 31(1).

## Not checked

Tax effects of giving or transferring shares, and rules for foreign founders. Talk to an accountant and a lawyer.
