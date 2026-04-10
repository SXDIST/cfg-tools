# cfg-tools

> Desktop tooling for building, editing, importing, and exporting DayZ `config.cpp` files through a visual workflow.

[![Desktop Release](https://img.shields.io/github/actions/workflow/status/SXDIST/cfg-tools/release.yml?label=release&logo=github)](https://github.com/SXDIST/cfg-tools/actions/workflows/release.yml)
[![Latest Release](https://img.shields.io/github/v/release/SXDIST/cfg-tools?display_name=tag&logo=github)](https://github.com/SXDIST/cfg-tools/releases/latest)
[![Windows](https://img.shields.io/badge/platform-Windows-0078D6?logo=windows)](https://github.com/SXDIST/cfg-tools/releases/latest)
[![Linux](https://img.shields.io/badge/platform-Linux-FCC624?logo=linux&logoColor=black)](https://github.com/SXDIST/cfg-tools/releases/latest)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org/)
[![Wails](https://img.shields.io/badge/Wails-2.11-DF0000)](https://wails.io/)

`cfg-tools` is a Wails-based desktop app with a Next.js frontend. It is designed for DayZ modding workflows where editing raw config files by hand becomes slow, repetitive, and error-prone.

Instead of manually maintaining nested config structures, you work with projects, classes, parameters, slots, proxies, and variants in the UI, while the app generates the final `config.cpp` for you.

## Quick Start

### Download a release

Get the latest desktop build from GitHub Releases:

- Windows: portable `.exe` or installer `.exe`
- Linux: `.tar.gz`

Release page:

- <https://github.com/SXDIST/cfg-tools/releases/latest>

### Run locally in development

```bash
npm install
npm run dev:desktop
```

### Build locally

```bash
npm run build:desktop:win
# or
npm run build:desktop:linux
```

## At a Glance

- Built for DayZ modders who want faster config iteration
- Visual editor for classes, parameters, slots, proxies, and variants
- Live `config.cpp` preview with lightweight syntax highlighting
- Existing config import flow for continuing work instead of starting over
- Desktop release notifications powered by GitHub Releases
- Multi-platform release pipeline for Windows and Linux

## Why This Exists

Hand-editing DayZ configs usually breaks down in the same places:

- repetitive item setup across multiple classes
- nested structures like `DamageSystem`, `AnimEvents`, and container blocks
- syntax mistakes in braces, semicolons, arrays, and inherited classes
- poor reuse when creating slots, proxies, and class variants
- difficulty importing an existing config and continuing work safely

`cfg-tools` addresses that by turning the config into structured application state and generating the final C++ output from that state.

## What You Can Do

- Create and manage multiple projects locally
- Add, duplicate, reorder, and delete config classes
- Configure item parameters through categorized forms
- Edit `CfgSlots` and `CfgNonAIVehicles` visually
- Build child classes / retextures from the UI
- Preview the generated `config.cpp` with lightweight syntax highlighting
- Export the current config as `.cpp`
- Export all projects as a `.zip`
- Import an existing `config.cpp`
- Import `.cpp` files via drag-and-drop in the desktop runtime
- Receive desktop update notifications when a newer GitHub release is available

## Feature Overview

| Area | What it does |
|---|---|
| Project management | Create, duplicate, rename, and remove multiple DayZ config projects |
| Class editor | Add, reorder, and edit config classes through a visual workflow |
| Parameter system | Configure class parameters from categorized forms instead of hand-editing raw C++ |
| Config generation | Generate a structured `config.cpp` from application state |
| Import pipeline | Import an existing `config.cpp` and continue editing it in the UI |
| Slots and proxies | Edit `CfgSlots` and `CfgNonAIVehicles` without manually building nested sections |
| Variants / retextures | Create child classes and visual variants directly from the editor |
| Live preview | Inspect the generated output before export |
| Export | Export the current config or package multiple projects into a ZIP |
| Desktop runtime | Use drag-and-drop import, release notifications, and update handoff from the desktop app |

## Who It Is For

`cfg-tools` is aimed at people who already know what a DayZ config needs to contain, but do not want to spend their time fighting raw file structure.

It fits best when you need to:

- iterate quickly on item configs
- manage multiple related classes in one place
- reduce syntax mistakes in generated output
- import an existing config and keep editing it visually
- ship repeatable desktop tooling to a modding workflow

## Product Flow

```text
Create or import project
        ↓
Edit classes, parameters, slots, proxies, variants
        ↓
Preview generated config.cpp
        ↓
Export one config or package multiple projects
```

## Stack

### Desktop shell

- Wails
- Go/Wails bridge for safe renderer <-> desktop communication
- Native Wails packaging for release builds

### Frontend

- Next.js 16 (App Router)
- React 19
- TypeScript
- Zustand for app state, history, and persistence
- Tailwind CSS 4
- shadcn/ui-style component layer
- Lightweight generated `config.cpp` preview

### Supporting libraries

- `jszip` and `file-saver` for exports
- `uuid` for internal IDs

## Architecture

The app is intentionally split into a few clear responsibilities:

- [`lib/store.ts`](/home/targaryen/repos/cfg-tools/lib/store.ts)  
  Central Zustand store for projects, classes, slots, proxies, undo/redo, and persistence.

- [`lib/generator.ts`](/home/targaryen/repos/cfg-tools/lib/generator.ts)  
  Converts the current app state into a DayZ `config.cpp`.

- [`lib/cpp-importer.ts`](/home/targaryen/repos/cfg-tools/lib/cpp-importer.ts)  
  Parses imported config text and reconstructs editable state.

- [`lib/catalog.ts`](/home/targaryen/repos/cfg-tools/lib/catalog.ts)  
  Parameter catalog that drives the editor UI.

- [`app.go`](/home/targaryen/repos/cfg-tools/app.go)  
  Wails backend, release checks, update handoff, locale persistence, and desktop bindings.

- [`lib/desktop.ts`](/home/targaryen/repos/cfg-tools/lib/desktop.ts)  
  Renderer-side wrapper around desktop-only capabilities.

## Import Model

The importer is designed first for configs that are compatible with the app's own generator, but it also attempts to recover from a range of common issues:

- missing semicolons
- some malformed class declarations
- some broken parameter naming
- some missing closing braces

### Expected structure

- `CfgPatches`
- `CfgVehicles`
- optional `CfgSlots`
- optional `CfgNonAIVehicles`

### Important limitations

- highly custom or exotic configs may not import cleanly
- unsupported syntax can still fail hard
- successful imports always create a new internal project with fresh IDs

## Desktop Runtime Features

Some features only exist when the app runs inside the desktop runtime:

- drag-and-drop `.cpp` import from the OS
- GitHub release update checks
- release handoff for updating the app

### Update behavior

When a newer GitHub release is detected, the desktop app shows an update dialog.

- Installed Windows build: downloads and launches the latest installer when possible
- Portable Windows build: opens the latest GitHub release / asset page
- Linux build: opens the latest GitHub release / asset page

## Persistence

Projects are stored locally through Zustand persistence.

- data is user-local
- clearing local storage removes saved projects
- desktop preferences such as locale are stored separately in the app config directory

## Development

### Prerequisites

- Node.js 20+
- npm

Check your environment:

```bash
node -v
npm -v
```

### Install dependencies

```bash
npm install
```

### Run the web UI only

Useful for frontend work when desktop APIs are not needed.

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### Run the full desktop app in development

Recommended for normal feature work.

```bash
npm run dev:desktop
```

This gives you:

- the Wails desktop window
- Go/Wails bridge access
- drag-and-drop import behavior
- desktop update/runtime integration

## Build Commands

### Web build

```bash
npm run build
```

### Desktop build

Build using the default Wails config:

```bash
npm run build:desktop
```

### Platform-specific desktop builds

#### Windows

Builds:

- portable `.exe`
- installer `.exe` via NSIS

Command:

```bash
npm run build:desktop:win
```

#### Linux

Builds:

- `.tar.gz`

Command:

```bash
npm run build:desktop:linux
```

### Build output

Desktop artifacts are written to:

```text
build/bin/
```

## GitHub Releases

The repository includes a release workflow that builds and publishes both Windows and Linux desktop artifacts.

### Current release matrix

- Windows: portable + installer
- Linux: `tar.gz`

Workflow file:

- [`.github/workflows/release.yml`](/home/targaryen/repos/cfg-tools/.github/workflows/release.yml)

### Distributed artifacts

- Windows portable `.exe`
- Windows installer `.exe`
- Linux `.tar.gz`

## Project Structure

```text
app/                    Next.js app entry and layout
components/             Feature-level UI
components/ui/          Reusable UI primitives
hooks/                  Desktop/runtime hooks
lib/catalog.ts          Parameter catalog for the editor
lib/store.ts            Zustand app state and persistence
lib/generator.ts        config.cpp generation
lib/cpp-importer.ts     config.cpp import/parsing
lib/desktop.ts          Renderer bridge for Wails-only features
app.go                  Wails backend methods and desktop integration
main.go                 Wails application bootstrap
```

## Troubleshooting

### Import failed

Check:

- that the file contains `CfgPatches` and `CfgVehicles`
- that braces and semicolons are not severely broken
- that the config is not relying on unsupported custom structure

### Drag-and-drop import does not work

Make sure you are running the desktop app, not only the web dev server.

- works in the Wails desktop runtime
- does not work in plain `npm run dev`

### Frontend build issues

Try a clean reinstall:

```bash
rm -rf node_modules
npm install
npm run build
```

### Desktop packaging issues

Use the platform-native build when possible.

- Windows artifacts are best built on Windows
- Linux artifacts are best built on Linux

This matters especially for release pipelines and installer generation.

## Contribution Workflow

1. Create a branch for your work.
2. Make the required changes.
3. Validate locally:

```bash
npm run lint
npm run build
```

4. If you touched desktop packaging, also verify the relevant desktop build command:

```bash
npm run build:desktop:win
# or
npm run build:desktop:linux
```

5. Open a pull request with a clear description of the change.

## License

There is currently no dedicated `LICENSE` file in the repository.

If this project is intended for public distribution, add an explicit license before publishing or accepting external contributions.
