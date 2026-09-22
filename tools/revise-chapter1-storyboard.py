"""Rebuild the reviewed PDF from the preserved upload. Requires PyMuPDF.

Run: python tools/revise-chapter1-storyboard.py
Preserves supplied illustrations; edits document text, not raster artwork.
"""
from pathlib import Path
import html
import pymupdf as fitz

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'assets_src/chapter1/storyboards/reference/chapter-one-visual-storyboard-uploaded.pdf'
OUTPUT = ROOT / 'docs/chapter-one-visual-storyboard.pdf'
doc = fitz.open(SOURCE)
BG = (244/255, 239/255, 228/255)
INK = '#263e3e'
archive = fitz.Archive('/usr/share/fonts/truetype/dejavu')
css = """@font-face {font-family: review; src:url(DejaVuSans.ttf);}
@font-face {font-family: review; src:url(DejaVuSans-Bold.ttf); font-weight:bold;}
* {margin:0;padding:0;} body {font-family:review;color:#263e3e;}
"""

def put(page, rect, text, size=14, bold=False, color=INK):
    content = f'<div style="font-size:{size}px;line-height:1.27;color:{color};font-weight:{"bold" if bold else "normal"}">{html.escape(text).replace(chr(10), "<br>")}</div>'
    spare, scale = page.insert_htmlbox(fitz.Rect(rect), content, css=css, archive=archive, scale_low=0.85)
    assert spare >= 0, (page.number + 1, text)

def replace(n, rect, text, size=14, bold=False, fill=BG):
    page = doc[n-1]
    if rect[0] == 48 and rect[1] == 668:
        fill = (.91,.88,.82)
    page.add_redact_annot(fitz.Rect(rect), fill=fill)
    page.apply_redactions(images=0, graphics=0)
    put(page, rect, text, size, bold)

replace(1, (814,478,1150,580), '6 canonical quests\n11 story beats + 3 outcomes\n9 items across campaign routes\nBulgarian + English summaries', 17)
replace(1, (814,600,1150,665), 'Script v1.0 + approved completion plan, 16 September 2026. Location references and draft concepts. No countdown or puzzle dead ends; an incomplete campaign can lose.', 12)
replace(2, (36,58,1150,96), 'Six quests. Three election outcomes.', 29, True)
replace(2, (168,179,800,201), 'Opening → registration and box recovery → election result', 14)
replace(2, (168,249,800,271), 'Bills → Aunt Docheva → posters → Mayor’s stamp → Clerk', 14)
replace(2, (168,459,810,480), 'Posted campaign + receipt from Tony or Kiro → Mayor', 14)
replace(2, (36,588,1164,690), '', 14, fill=(.91,.88,.82))
put(doc[1], (54,602,1146,635), 'FINALE GATE   Registered candidate + Journalist has receipt + ballot box delivered', 17, True)
put(doc[1], (54,645,1146,685), 'Support affects the result, not entry. Both supporters guarantee a win; campaign quality sets the margin. Incomplete campaigns can lose. See page 17.', 13)

# Kiosk and clerk retain distinct identities. Replace whole text blocks to keep
# proper typesetting and avoid accidental edits to illustrated signs.
for b in list(doc[3].get_text('blocks')):
    if 'Penka' in b[4] or 'Пенка' in b[4]:
        text = ' '.join(b[4].split()).replace('Aunt Penka', 'Aunt Docheva').replace('Penka', 'Aunt Docheva').replace('Леля Пенка', 'Леля Дочева').replace('Пенка', 'Леля Дочева')
        size = 28 if b[1] < 95 else (17 if 160 < b[1] < 230 else 12)
        replace(4, (b[0],b[1]-1,1164 if b[0]>=770 else 736,b[3]+5),text,size,b[1]<95)
replace(6, (770,242,1164,287), 'Баба Стоянка не иска обещания. Иска вода от фонтана. Старците знаят проблема, а в механата има олио.', 14)
replace(6, (48,668,1150,691), 'OUTCOME / Baba support secured. Fountain repaired. This support affects the result; it does not gate election entry.', 12)
replace(8, (770,161,1164,232), 'The Journalist checks Mitko’s actions. A receipt from Tony or Kiro lists the Mayor’s Mehana expenses as fountain maintenance.', 17)
replace(8, (770,436,1164,470), 'Show Tony’s receipt, or ask Kiro for the same expense record after the Journalist requests evidence.', 13)
replace(8, (36,566,736,631), 'Receipt → fountain expense contradiction → Municipality. If Tony’s support is missing, Kiro supplies the same record; evidence is never duplicated.\nБез подкрепата на Тони: след искането на журналистката Киро предоставя същия документ.', 12)
replace(12, (770,374,1164,420), 'Deliver the ballot box. Crowd composition and reactions reflect the supporters actually earned.', 14)
replace(12, (770,521,1164,585), 'Voting resolves to convincing victory, narrow victory or loss. Both supporters guarantee a win; campaign quality determines its margin. See page 17.', 14)
replace(12, (48,668,1150,694), 'OUTCOME / Registration + evidence + delivered box enable voting. Support and campaign quality determine one of three results.', 12)
replace(13, (36,58,1150,96), 'The result changes. The debt remains.', 29, True)
replace(13, (36,99,736,120), 'Резултатът се променя. Дългът остава.', 14)
replace(13, (770,161,1164,234), 'Victory: creditors address Mitko as Mr. Mayor. Loss: the incumbent stays in office; Mitko still faces his creditors. The closing scene reflects the saved result.', 17)
replace(13, (770,242,1164,315), 'При победа Митко става кмет, но дългът остава. При загуба досегашният кмет запазва поста. Финалът отразява резултата и свършеното през деня.', 14)
replace(13, (770,363,1164,392), 'Show celebration, relief or defeat according to the result.', 13)
replace(13, (770,418,1164,466), 'Creditors arrive in every outcome. Use the existing new-office joke only after a victory.', 14)
replace(13, (770,491,1164,540), 'Show water only if repaired. Save the exact outcome and close Chapter 1; resolved endings stay resolved.', 14)
replace(13, (48,668,1150,694), 'OUTCOME / Save convincing victory, narrow victory or loss. Mitko becomes Mayor only in the two winning branches.', 12)
replace(14, (36,98,1150,121), 'Nine items across campaign routes; oil and water serve supporter quests. No separate stamp or release-form puzzle.', 14)
replace(14, (302,181,450,202), 'Apartment',14)
replace(14, (463,181,680,202), 'Aunt Docheva’s kiosk',14)
replace(14, (302,393,450,415), 'Aunt Docheva',14)
replace(14, (302,446,450,468), 'Aunt Docheva',14)
replace(14, (302,499,450,521), 'Tony / Kiro fallback',13)
replace(16, (770,174,1164,205), 'Story: script v1 + approved completion plan (16 September 2026); three-outcome revision.', 13)
replace(16, (36,615,1164,692), '', 14, fill=(.91,.88,.82))
put(doc[15], (54,628,1146,680), 'ENDING CONTRACT   Convincing victory / narrow victory / loss. Both supporters guarantee a win. Save the exact result; end Chapter 1. No Chapter 2 or Parliament material follows.', 16)
replace(16, (770,397,1164,463), 'Quotes retain the existing script. Outcome rules and the Kiro evidence fallback follow the approved completion plan. No new topical dialogue was authored.', 14)

# A designed outcome sheet extends the supplied treatment without inventing
# replacement character art. Shared illustration remains explicitly provisional.
page = doc.new_page(width=1200, height=760)
page.draw_rect(page.rect, color=None, fill=BG)
put(page, (36,26,1164,48), 'OUTCOME BRANCHES / РАЗКЛОНЕНИЯ НА ФИНАЛА', 12, True, '#b76b35')
put(page, (36,60,1164,101), 'One election. Three possible results.', 30, True)
put(page, (36,104,1164,129), 'Едни избори. Три възможни резултата.', 15)
reference = fitz.open(SOURCE)
page.show_pdf_page(fitz.Rect(36,151,374,343), reference, 11, clip=fitz.Rect(36,138,736,533))
put(page, (399,151,1158,208), 'COMMON ENTRY / ОБЩО УСЛОВИЕ', 16, True)
put(page, (399,184,1158,272), 'Registered candidate + receipt delivered to the Journalist + ballot box delivered. Supporter quests remain available before voting. Kiro supplies the receipt if Tony’s route is unfinished.\nРегистрация + документ при журналистката + доставена урна. Подкрепата влияе на резултата, без да блокира изборите.', 15)
put(page, (399,285,1158,348), 'DESIGN GUARANTEE: completing both supporter quests cannot produce a loss. Exact score thresholds still require balancing and tests.\nГАРАНЦИЯ: подкрепата и на Баба, и на Тони осигурява победа.', 14, True)
cards = [
 ('01 / CONVINCING VICTORY', 'УБЕДИТЕЛНА ПОБЕДА', 'A strong campaign earns a clear mandate.\nStaging: broad celebration; Mitko stands confidently; the Mayor concedes angrily.\nSave: convincing victory. Creditors address the new Mayor.', 'Силната кампания носи ясна победа. Следват общо празнуване и появата на кредиторите.'),
 ('02 / NARROW VICTORY', 'КРЕХКА ПОБЕДА', 'Enough support to win, with a smaller margin. A completed campaign still wins when meters reduce its margin.\nStaging: tense count, then relief.\nSave: narrow victory. The debt remains.', 'Гласовете стигат за победа с малка преднина. Напрежението отстъпва на облекчение.'),
 ('03 / LOSS', 'ЗАГУБА', 'An incomplete campaign can lose. Explain the missing support and campaign weaknesses.\nStaging: incumbent celebrates; Mitko faces his creditors.\nSave: loss; do not grant the mayoral role.', 'Незавършената кампания може да загуби. Финалът показва причините; Митко не става кмет.')]
for i,(title,bg,body,summary) in enumerate(cards):
    x = 36 + i*380
    page.draw_rect(fitz.Rect(x,371,x+368,684),color=None,fill=(.91,.88,.82))
    put(page,(x+16,388,x+350,412),title,15,True)
    put(page,(x+16,418,x+350,445),bg,14,True)
    put(page,(x+16,460,x+350,590),body,14)
    put(page,(x+16,600,x+350,675),summary,13)

for i in range(len(doc)):
    replace(i+1,(36,724,1164,751),'ДРУГАРЯТ КАНДИДАТ / COMRADE CANDIDATE     •     REVIEWED PLAN / 16 SEPT 2026     •     STORYBOARD DRAFT',10)
    put(doc[i], (1128,724,1164,751), f'{i+1:02}', 12, True)
doc.set_metadata({'title':'Comrade Candidate — Chapter 1 Storyboard — Three Outcomes','subject':'Revised 16 September 2026; planned story, provisional staging','author':'Comrade Candidate production'})
doc.save(OUTPUT, garbage=4, deflate=True)
print(f'Wrote {OUTPUT} ({len(doc)} pages)')
import runpy
runpy.run_path(str(ROOT / 'tools/build-storyboard-preview.py'), run_name='__main__')
