# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Klecks is the open-source web-based painting app behind [Kleki](https://kleki.com). It supports standalone mode (full app) and embed mode (for drawing communities like 2draw.net).

## Build Commands

```bash
npm ci                    # Install dependencies
npm run lang:build        # REQUIRED before running - generates language files
npm run start             # Dev server at localhost:1234
npm run build             # Production build (standalone) → /dist/
npm run build:embed       # Production build (embed) → /dist/
npm run build:help        # Help page build → /dist/
```

**Important**: Always run `npm run lang:build` before `npm run start` or `npm run build`. Use `npm run lang:build -- --missing` to list untranslated keys.

## Architecture

**Entry Points**:
- Standalone: `src/index.html` → `src/app/script/main-standalone.ts`
- Embed: `src/embed.ts` → `src/app/script/main-embed.ts` (exposes `window.Klecks` API)

**Main Application**: `KlApp` at `src/app/script/app/kl-app.ts` orchestrates all systems.

**Core Namespaces**:
- `klecks/` - Core painting engine (brushes, canvas, filters, history, storage, UI)
- `bb/` - Utility library (bitbof's custom utilities for color, input, math, transforms)
- `fx-canvas/` - WebGL filter system with GLSL shaders

**Key Modules** in `src/app/script/klecks/`:
- `brushes/` - 7 brush implementations (pen, blend, sketchy, pixel, chemy, smudge, eraser)
- `canvas/kl-canvas.ts` - Layer management and composition
- `filters/` - Image filters (blur, curves, distort, noise, tilt-shift, etc.)
- `history/` - Undo/redo with tile-based memory optimization
- `storage/` - IndexedDB persistence, PSD import/export (via ag-psd), recovery
- `ui/` - Components, tool tabs, modals, easel (canvas viewport)

## Tech Stack

- TypeScript (strict mode)
- Parcel 2.16.1 (bundler)
- SCSS for styles
- GLSL shaders for WebGL filters
- No test framework configured
- No linter configured

## Translation System

Translation files in `src/languages/` (JSON5 format). Base file is `_base-en.json5`.

```bash
npm run lang:add <code>   # Create new translation (e.g., lang:add it)
npm run lang:build        # Build after any translation changes
```

## Docker

```bash
docker-compose build && docker-compose up -d
# Accessible at http://localhost:5050
```
