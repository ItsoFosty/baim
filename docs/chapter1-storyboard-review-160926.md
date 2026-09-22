# Chapter 1 visual storyboard review — 16 September 2026

Reviewed `chapter-one-visual-storyboard.pdf` (16 pages) against the current content,
runtime asset manifest, and `chapter1-completion-plan-160926.md`. This is a review,
not a change to approved story decisions or artwork.

Follow-up: the user approved revising the PDF to the three-outcome plan. The
published PDF now incorporates that reconciliation; the differences below refer
to the original upload, preserved under
`assets_src/chapter1/storyboards/reference/`. The local viewer uses the revised
17-page PDF. Rebuild with `python tools/revise-chapter1-storyboard.py` (PyMuPDF,
Pillow and system DejaVu Sans fonts required). The viewer displays rendered PDF
pages directly, with expandable page text and an optional PDF download, so it
also works when the browser's native PDF viewer is unavailable or disabled.
`python tools/build-storyboard-preview.py` refreshes these previews after any
other PDF edit; the revision script runs it automatically.

## Story alignment

The PDF is substantially aligned with the intended script, but it is ahead of the
playable implementation. Its strongest improvement is the connected chain:
public campaign → evidence → Mayor's accidental validation → registration →
archive classification → container exchange → election objections and payoff.

| PDF pages | Current status and remaining work |
| --- | --- |
| 3–5: opening, kiosk, posting | Opening information, bills-for-papers and visible poster state exist. Creditor/TV staging needs presentation work. Posting must still introduce the journalist and enable municipal access. |
| 6: fountain | Repair chain and visible water are implemented. Dedicated action poses and reactions remain presentation work. |
| 7: Tony | Accordion/water challenge and competition glass exist. Receipt reward and staged action sequence remain. |
| 8–9: evidence and registration | Current journalist is the older late interview. Early evidence handover, Mayor confrontation and accidental diploma validation remain. The diploma quest should finish at registration, not paper creation. |
| 10–11: archive and exchange | The current prototype still uses the cellar recovery route. Cabinet strap action, ledger rule and jar substitution remain. |
| 12–13: election and creditors | Existing outcome logic is not the illustrated staged finale. Election room, objections, crowd presentation and creditor callback remain. |

### Differences requiring reconciliation before implementation

1. **Election outcome:** the PDF makes Baba and Tony mandatory and guarantees a
   narrow victory. The approved completion plan preserves convincing victory,
   narrow victory and loss; both supporters guarantee a win, but incomplete
   campaigns can still reach the election. Recommendation: treat the PDF as the
   fully completed campaign's winning path and retain the approved outcome rules
   unless the user chooses to revise them.
2. **Receipt access:** retain the approved Kiro fallback for campaigns that do not
   win Tony's support. The PDF describes only Tony's route.
3. **Seal:** the PDF explicitly makes stamping a Mayor action, not a collectible
   puzzle. The runtime currently lets Mitko collect/use the seal. Keep the newly
   approved table and seal artwork; adapt their interaction/staging when the
   complete Mayor sequence is ready. The table does not need another redraw.
4. **Names:** keep Aunt Docheva for the kiosk operator, distinguishing her from
   Clerk Penka, as already agreed. Correct the PDF's “Стойанка” to “Стоянка”.

## Remaining art, in production order

These are missing runtime deliverables or required variants, not a request to
regenerate existing approved rooms and characters. Draft PDF illustrations are
composition references, not ready-to-import sprites or layered backgrounds.

| Priority | Deliverable | Purpose |
| --- | --- | --- |
| 1 | Journalist character cutout/model reference, talking and evidence-reading poses | Early square appearance and municipality confrontation |
| 1 | Mayor character cutout/model reference, talking, stamping and objection/reaction poses | Registration reversal and finale |
| 1 | Municipal expense receipt: scene prop, inventory icon, readable examination presentation | Connect Tony/Kiro, fountain expenses and journalist |
| 1 | Diploma before/after validation and campaign-pamphlet inventory icons | Make existing and upcoming quest states readable |
| 2 | Archive cabinet closed/open states compatible with the existing municipality | Strap puzzle; reuse/adapt the existing cabinet asset |
| 2 | Ledger, pickle jar and empty ballot box; shelf states before/after substitution; inventory icons | Classification and exchange puzzle |
| 3 | Election-room background and separate voting table, curtain/booth and box placement | Finish the currently unillustrated runtime election scene |
| 3 | Election crowd poses/arrangements and creditor ending staging | Reuse approved characters; add only missing roles/poses |
| 4 | Aunt Docheva kiosk portrait/cutout | Show the existing speaking kiosk operator |

Action animation work is separate from static illustrations: Mitko posting,
playing accordion, replacing his own drink with water, drinking, oiling/operating
the valve, handing over papers, pulling the cabinet with the strap, exchanging
containers and delivering the box. NPC reactions include Tony's distraction and
the Mayor's stamp action. Use reviewed sprite-sheet exports consistent with the
existing animation pipeline. Review existing clips before requesting new ones.

Keep the approved apartment, square, mehana and municipality art, Mitko design,
existing NPC cutouts, seated Old Men, glass, oil, water jug, and stamp table. The
fountain already has runtime water effects; a new full background is unnecessary.

## Why the PDF works better

The previous storyboard was one generated twelve-panel image based on the older
prototype. It illustrated oil-as-a-gift, self-service stamping, cellar recovery
and the late interview. That made it a weaker guide to the intended script.

The PDF combines controlled page layout, readable bilingual typesetting, generous
image sizes, existing location references, and focused later-scene concepts.
Each beat explains the obstacle, player action and resulting change. Props and
earlier choices have explicit later payoffs. Its images also use character acting
and composition to communicate the event, especially the Mayor's stamp scene.

The earlier approach compressed story editing, image generation and page design
into one deliverable without a sufficient editorial pass. That was an execution
choice, not a demonstrated limitation of the available image tools. Future
storyboards should use separately reviewed frames placed in a designed document
with real text, after checking the story dependencies.

The PDF still needs production work: early pages mainly show room references,
not the described actions; pages 10–11 reuse the archive illustration; that image
shows ballots in a box that should still be empty (the PDF itself flags this).
Later character designs and room compositions are explicitly provisional and
must be reconciled with approved game assets. A dedicated jar-swap frame and
creditor closing frame would make the story treatment more complete.

## Recommended next implementation

Finish the receipt → journalist → Mayor → registered diploma chain first, with
its minimum required art. Then implement cabinet/ledger/jar exchange, followed by
the staged election and ending. Preserve old saves and stable IDs; replace each
prototype route only once its complete replacement is playable and tested.

No gameplay or art files were changed by this review; tests were not rerun for
this documentation-only addition.
