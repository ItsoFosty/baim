"""Render the published PDF for browsers without an inline PDF viewer.

Requires PyMuPDF and Pillow. Run again whenever the PDF changes.
"""
from pathlib import Path
import html
import re
import pymupdf

root = Path(__file__).resolve().parents[1]
pdf = pymupdf.open(root / 'docs/chapter-one-visual-storyboard.pdf')
output = root / 'docs/storyboard-pages'
output.mkdir(exist_ok=True)
figures = []
for number, page in enumerate(pdf, 1):
    name = f'page-{number:02}.webp'
    pixmap = page.get_pixmap(matrix=pymupdf.Matrix(1.5, 1.5), alpha=False)
    pixmap.pil_save(output / name, format='WEBP', quality=90)
    label = f'Page {number} / Страница {number}'
    text = html.escape(page.get_text())
    figures.append(f'''    <figure id="page-{number}">
      <img src="./storyboard-pages/{name}" width="{pixmap.width}" height="{pixmap.height}" loading="{'eager' if number == 1 else 'lazy'}" alt="{label}">
      <figcaption>{label} / {len(pdf)}</figcaption>
      <details><summary>Page text / <span lang="bg">Текст на страницата</span></summary><pre>{text}</pre></details>
    </figure>''')
viewer = root / 'docs/chapter1-storyboard.html'
source = viewer.read_text()
source, count = re.subn(r'  <main>.*?</main>', lambda _: '  <main>\n' + '\n'.join(figures) + '\n  </main>', source, flags=re.S)
assert count == 1
viewer.write_text(source)
print(f'Published {len(pdf)} inline storyboard pages')
