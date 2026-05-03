# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common commands

- `npm install` / `npm ci` — install frontend dependencies. CI uses `npm ci`.
- `npm run dev` or `npm run dev:web` — run the Next.js web UI only at `http://localhost:3000`.
- `npm run dev:desktop` — sync Wails version metadata, then run the full Wails desktop app.
- `npm run lint` — run ESLint with Next.js core-web-vitals and TypeScript rules.
- `npm run build` — run a Next.js build.
- `npm run build:web` — build the static Next export and clean it for Wails embedding.
- `npm run build:desktop` — sync Wails metadata and run `wails build -clean`.
- `npm run build:desktop:win` — build Windows portable + NSIS installer with WebView2 download mode.
- `npm run build:desktop:linux` — build Linux desktop artifacts using the `webkit2_41` tag.
- `go test ./...` — run backend Go tests. There are currently no first-party test files or npm test script.
- `go test ./... -run TestName` — run a single Go test when backend tests are added.
- `npm run sync:wails-version` — copy `package.json` version into Wails metadata before desktop builds.
- `npm run release -- <patch|minor|major|X.Y.Z> [--no-push]` — bump version, commit, tag, and push unless `--no-push` is supplied.

Prerequisites are Node.js 20+, npm, Go 1.24, and Wails CLI v2.11.0. Linux desktop builds need GTK/WebKit build packages; Windows installer builds need NSIS.

## Architecture overview

This is a Wails desktop app with a statically exported Next.js 16 / React 19 frontend. `next.config.ts` sets `output: 'export'`; Wails embeds the exported `out/` directory through `main.go` and `wails.json` points Wails at the repository root as the frontend project.

The main user flow is: create or import a DayZ `config.cpp` project, edit structured project state in the UI, preview generated C++, then export one project or all projects as a zip.

Key seams:

- `app/page.tsx` composes the app shell: `Header`, `EditorPanel`, `PreviewPanel`, locale provider, context menu, and update dialog.
- `lib/store.ts` is the central Zustand store for projects, classes, child classes/retextures, slots, proxies, CfgMods, undo/redo history, import actions, and persistence. It persists only `configs` and `activeConfigId` to localStorage key `cfg-tools-storage` and contains versioned migrations.
- `lib/catalog.ts` defines the parameter catalog that drives editor sections, labels/descriptions, defaults, option lists, parameter types, and generated placement paths. `CFG_MODS_CATALOG` is separate from the item/class catalog.
- `components/editor-panel.tsx` renders catalog-driven forms and edits `lib/store.ts` state. Changes to catalog types or placement usually require checking this file and `lib/generator.ts` together.
- `lib/generator.ts` converts `ConfigData` into DayZ C++ config output. It emits `CfgPatches`, optional `CfgMods`, `CfgVehicles`, optional `CfgNonAIVehicles`, and optional `CfgSlots`; it also builds preview line maps for active class scrolling.
- `lib/cpp-importer.ts` parses imported C++ back into editable state. It is optimized for configs compatible with this app’s generator, with repairs for common syntax issues and aliases for known parameter names.
- `lib/config-export.ts` wraps generator output into file/zip blobs used by export buttons.
- `app.go` is the Wails backend. It exposes file reading, update checks against GitHub Releases, update install/open behavior, external URL opening, and locale preference persistence.
- `lib/desktop.ts` is the renderer-side wrapper around Wails `window.go.main.App` and runtime events. Use it instead of touching the Wails globals directly.
- `hooks/use-desktop-app-events.ts` wires desktop-only update notifications and `.cpp` drag-and-drop import events into the React app.
- `components/locale-provider.tsx` loads locale from browser localStorage and, in desktop mode, from the Go preferences file. It applies localized catalog labels/descriptions through `lib/i18n.ts`.
- `lib/wailsjs/` is generated Wails binding/runtime code; regenerate through Wails rather than editing it by hand.

## Development notes

- Use the `@/*` path alias for imports from the repository root, as configured in `tsconfig.json`.
- Web-only development (`npm run dev`) does not provide Wails APIs, file-drop import, desktop update checks, or desktop locale persistence. Use `npm run dev:desktop` for features crossing the Go/Wails bridge.
- Desktop artifacts are written under `build/bin/`.
- Import support expects `CfgPatches` and `CfgVehicles`; `CfgSlots` and `CfgNonAIVehicles` are optional. Unsupported or highly custom DayZ config structures may not round-trip cleanly.
- Release CI builds Windows and Linux desktop artifacts from `.github/workflows/ci.yml`; release automation is in `.github/workflows/release.yml` and `scripts/release.mjs`.
