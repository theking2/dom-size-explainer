# dom-size-explainer

[![Made with Claude Code](https://img.shields.io/badge/Made%20with-Claude%20Code-blueviolet)](https://claude.ai/code)
# ⬡ DOM Size Explainer

A Chrome extension that explains **why** a DOM element has the dimensions it does — not just what they are.

![DOM Size Explainer panel screenshot](screenshot.png)

## What it does

Click any element on a page and get a plain-English breakdown of what's driving its width and height: layout context, explicit CSS rules, box model effects, constraints, and more.

## Features

- 🔍 **Click to inspect** — hover to highlight, click to analyze
- 📐 **Width & height explained** — separate reasoning for each axis
- 🧩 **Layout-aware** — detects flex, grid, block, inline, absolute, fixed
- 📏 **Box model** — explains `box-sizing`, padding, and border contributions
- 🚧 **Constraints** — surfaces `min-width`, `max-width`, `min-height`, `max-height`
- 🎯 **Explicit rules** — finds CSS width/height from stylesheets and inline styles, including `%`, `fit-content`, `min-content`, `max-content`
- 🔲 **Replaced elements** — handles `<img>`, `<video>`, `<canvas>`, `<svg>`, `<iframe>`
- 💬 **Fallback explanation** — always shows something, even for complex computed cases
- 🖱️ **Draggable panel** — lives on the page, not in the popup, so it stays visible while you interact

## Installation

1. Download or clone this repo
2. Go to `chrome://extensions/`
3. Enable **Developer mode** (toggle in the top right)
4. Click **Load unpacked** and select this folder

## Usage

1. Click the ⬡ extension icon in the toolbar
2. Click **"Inspect an Element"** — the popup closes and a floating panel appears on the page
3. Move your cursor over any element (it highlights purple)
4. Click it — the panel fills with an explanation
5. Click **"Pick Another Element"** to keep inspecting
6. Drag the panel anywhere out of the way

## How width is analyzed

The extension checks, in order:

| Check | What it means |
|---|---|
| Explicit CSS/inline `width` | An exact pixel, `%`, or keyword value is set |
| Flex child | Parent is `display:flex` — explains `flex-grow`, `flex-shrink`, `flex-basis` |
| Grid child | Parent is `display:grid` — shows template and column span |
| Block fill | `display:block` stretches to parent content width by default |
| Inline shrink | `display:inline*` wraps content |
| Absolute/fixed | Positioned elements — explains left+right stretching or shrink-to-content |
| `box-sizing` | Whether padding/border are inside or outside the stated width |
| `min-width` / `max-width` | Hard constraints |
| `float` | Floated elements shrink-wrap content |
| Fallback | Reports computed value if no single rule dominates |

## Files

```
manifest.json     Chrome extension manifest (MV3)
content.js        In-page floating panel + analysis logic
popup.html        Simple launcher popup
popup.js          Injects content.js and closes popup
background.js     Service worker (message relay)
icon.png          Extension icon
```

## Development

No build step required — it's plain vanilla JS. Just edit the files and click **"Reload"** on the `chrome://extensions/` page after changes.

## License

MIT
