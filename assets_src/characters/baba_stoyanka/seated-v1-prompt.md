# Baba Stoyanka Seated Cutout V1

Generated with the built-in image-generation tool, then converted from chroma green to alpha with the
imagegen skill's `remove_chroma_key.py` helper.

References:

- `assets/chapter1/scenes/village_square/background.png` for scene lighting, rendering, and placement
- `assets_src/characters/bai-mitko-model-sheet-v1.png` for the approved character style

Prompt:

```text
Use case: illustration-story
Asset type: high-resolution 2D point-and-click adventure NPC cutout
Primary request: Create Baba Stoyanka, a fictional elderly Bulgarian village woman, seated alone on a
bus-stop bench, as a clean full-body seated character cutout for the game Comrade Candidate.
Input images: Image 1 is the village-square runtime background and establishes the hand-painted rendering,
warm daylight, linework, and the exact bus-stop setting; Image 2 is the approved Bai Mitko model sheet and
establishes the fresh elastic 1990s cartoon-adventure character style, bold ink contours, expressive
asymmetry, and painted texture. Do not reproduce Bai Mitko.
Subject: Baba Stoyanka has a small but immovable triangular silhouette, compact elderly build, sharp nose,
skeptical narrowed eyes, deeply characterful face, dark floral headscarf tied under the chin, worn muted
burgundy cardigan over a cream blouse, long dark skirt, thick socks, practical black shoes, and a small net
shopping bag resting beside one leg. Her posture is rigid and authoritative even while seated; hands folded
over a plain wooden walking stick; expression says she has outlived every reform and is pricing the
candidate's dignity. Fictional character only.
Composition/framing: one isolated character, three-quarter view facing slightly right, fully visible from
headscarf through shoes and including the small bag and stick, seated pose aligned to a bench but do not
draw the bench. Generous padding around the entire silhouette. No cropping.
Scene/backdrop: perfectly flat solid #00ff00 chroma-key background for removal. One uniform green color
only; no floor plane, no texture, no gradient, no scenery.
Style/medium: high-resolution hand-painted 2D cartoon adventure sprite, bold dark ink outlines, warped
expressive shapes, painterly color and texture, strong readable silhouette, consistent with both references.
Not pixel art.
Lighting/mood: warm outdoor daylight matching Image 1, deadpan and playful rather than grim.
Constraints: no bench, no background objects, no cast shadow, no contact shadow, no text, no logos, no
watermark. Keep the subject fully separated from the green background with crisp edges. Do not use #00ff00
anywhere in clothing or props. Do not depict a real person.
Avoid: realism, anime, generic mobile-game art, flat vector style, muddy rendering, extra people, duplicated
limbs, cropped feet, floating props.
```

Runtime placement:

- layer: `layer.square.baba_stoyanka_seated`
- left: `315`
- top: `265`
- z-index: `90`
