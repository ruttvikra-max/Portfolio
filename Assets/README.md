# Hero assets — free DIY pipeline (Route 1)

Goal: produce two web-ready 3D models — the **espresso machine** and the **dark-roast mug** —
using **free** tools, then drop them here so the GLBs can be optimized and wired into the hero.

Two stages: **(1) make a clean source image → (2) convert that image to a GLB.**

---

## Stage 1 — Generate the source image (free image tool)

Pick ONE (all have free tiers):
- **Ideogram** — ideogram.ai (great with styles, easy)
- **Leonardo.ai** — free daily credits, strong product/3D looks
- **Bing / Copilot Image Creator** — free, DALL·E 3

Generate the **machine** and the **mug** as **two separate images**.

**Machine prompt:** (cream/kraft body, Option-1 soft-clay style, isolated)
```
A single classic espresso coffee machine, premium soft-clay 3D product render
(rounded, matte, friendly toy-like model, high-end claymation prop look). Cream
and warm-beige body (#F5ECD2, #C7AD9E) with dark charcoal-slate accents
(#29303D) and a warm amber-orange portafilter handle and indicator light
(#F2921D). Three-quarter front angle, centered, the whole machine in frame with
group head and drip tray. Soft even studio lighting, gentle soft shadow, plain
seamless light-grey background. Only the machine, no cups or beans or other
props. No text, no watermark.
```

**Mug prompt:**
```
A ceramic coffee mug filled with coffee, soft clay 3D render, smooth rounded
matte surfaces, friendly toy-like proportions. Dark charcoal-slate glazed
ceramic (#29303D) with a cream interior rim (#F5ECD2), filled with warm
amber-orange coffee (#F2921D), a few soft wisps of steam. Three-quarter angle,
centered, full mug with handle visible. Soft even studio lighting, gentle soft
shadow, plain seamless light background. No text, no watermark, isolated single
product.
```

**Settings:** square (1:1), highest free resolution.

**What makes a GOOD source image for 3D (important):**
- Whole object in frame, **not cropped**; centered.
- **Three-quarter angle** (not flat front, not top-down) — gives the 3D tool real depth to work with.
- **Plain, even background** that contrasts the object; soft shadow, no busy scene.
- One object only. Generate a few, pick the cleanest, most symmetrical one.

Save the two chosen images here:
```
Assets/source/machine.png
Assets/source/mug.png
```

---

## Stage 2 — Convert image → GLB (free image-to-3D tool)

Pick ONE (both free, both export GLB):
- **Tripo3D** — tripo3d.ai (generous free credits, good on objects)
- **Meshy** — meshy.ai (free monthly credits, texture + PBR)

For EACH image (machine, then mug):
1. Choose **Image to 3D**, upload the PNG (use the tool's "remove background" if offered).
2. Texturing: **ON**. PBR: **ON** if available.
3. Topology: **quad** if asked; polycount **medium** (don't max it — I'll decimate for web anyway).
4. Symmetry: **auto**.
5. Generate, then **Export / Download as GLB** (glTF binary `.glb`).
   - On free tiers, confirm GLB download is allowed (Tripo/Meshy both allow it).

Save the downloaded files here:
```
Assets/3d/machine-raw.glb
Assets/3d/mug-raw.glb
```
("raw" = before my web optimization; keep the originals.)

---

---

## Avatar (soft-clay 3D, stylized likeness of you)

Same two stages, with one addition: the avatar needs a **photo of you** as a reference
so it resembles you. The prompt drives the style/pose; your photo drives the face.

**Stage 1 — image (use a reference-capable tool):**
- Best free options for likeness: **Gemini image ("nano banana")** or **ChatGPT image**;
  **Leonardo.ai** (image guidance) also works.
- Upload a **clear, front-facing, well-lit photo** of yourself, then use this prompt.
- IMPORTANT: **A-pose, full-body, hands empty (no mug)** — this rigs cleanly for the sip.
  We attach the mug + author the drinking motion in 3D; the site frames it waist-up.
```
A stylized full-body character of a person in a relaxed A-pose (arms slightly
away from the body, hands open and empty, legs straight), premium soft-clay 3D
render (rounded, matte, friendly toy-like, high-end claymation look) — same clay
style as the coffee machine and mug. Warm friendly expression, simple casual
outfit in muted warm tones (cream/kraft #F5ECD2, #C7AD9E). Not holding anything.
Front three-quarter angle, whole body centered and fully in frame, soft even
studio lighting, gentle soft shadow, plain seamless light-grey background.
Single character, no text, no watermark.
```
  → save as `Assets/source/avatar.png`

**Stage 2 — image → 3D with rigging (Tripo3D / Meshy):**
- Image → 3D as usual, but **turn ON rigging** (auto humanoid skeleton). If the tool
  offers a pose option, pick **A-pose**. Texture ON.
- Free-tier note: rigging/animation may be limited or watermarked on free plans — if so,
  just export the **rigged (or even un-rigged) GLB**; I can rig/author the sip in-engine.
- Don't worry about a "drink" animation clip — I'll author the actual sip in Three.js by
  raising the arm and attaching the mug. You just provide a clean A-pose GLB.
  → save as `Assets/3d/avatar-raw.glb`

---

## When you're done
Drop the files in the paths above and tell me **"assets dropped."** Then I will:
1. Inspect + report each GLB's size and poly count.
2. Optimize for web (decimate + Draco/meshopt, target < 800 KB each).
3. Wire them into the Tier-2 hero (lighting, framing, the click-to-brew interaction).

You only do Stages 1–2. Everything web-side is on me.
