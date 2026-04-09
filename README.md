# Mesh Repair

A **Modly** extension that automatically analyzes and repairs common defects in 3D meshes (GLB/GLTF), with optional polygon count simplification.

## Features

- Merge duplicate vertices (`weld`)
- Remove redundant data (`dedup`)
- Recompute normals (`normals`)
- Simplify mesh to a target triangle count (optional, via `meshoptimizer`)
- Export as `.glb`

## Tech Stack

- **Runtime**: Node.js
- **Source language**: TypeScript
- **3D library**: `@gltf-transform/core` + `@gltf-transform/functions`
- **Simplification**: `meshoptimizer`
- **Setup**: Python (installation script called by Modly)

---

## Project Structure

```
mesh-repair/
├── manifest.json     # Modly manifest (node declaration, parameters)
├── generator.ts      # TypeScript source of the processor
├── setup.py          # Installation script called by Modly
├── package.json      # npm dependencies
├── tsconfig.json     # TypeScript configuration
└── .gitignore
```

> `generator.js` and `node_modules/` are generated locally and excluded from the repository.

---

## How It Works in Modly

### Installation (automatic)

Modly calls `setup.py` when the extension is installed:

```bash
python setup.py '<json_args>'
```

This script:
1. Runs `npm install` to install dependencies
2. Compiles `generator.ts` → `generator.js` via `npx tsc`

### Execution

Modly runs `generator.js` with:
- **Input**: `{ filePath: string }` — path to the source mesh
- **Params**: user parameters defined in `manifest.json`
- **Context**: Modly object exposing `log()`, `progress()`, `workspaceDir`

The processor returns `{ filePath: string }` — path to the repaired GLB.

### Processing Pipeline

```
Load mesh (NodeIO)
        ↓
BEFORE report (vertices, faces)
        ↓
weld()  — merge duplicate vertices
dedup() — remove redundant data
normals({ overwrite: true }) — recompute normals
        ↓
[Optional] simplify() to target_faces triangles
        ↓
AFTER report + removal summary
        ↓
Export GLB → {workspaceDir}/Workflows/mesh-repair-{timestamp}.glb
```

---

## Node Parameters

| Parameter      | Type   | Default | Description                                           |
|----------------|--------|---------|-------------------------------------------------------|
| `simplify`     | select | `false` | Enable mesh simplification                            |
| `target_faces` | int    | `50000` | Target triangle count (min: 1,000 — max: 500,000)    |

> Repairs (weld, dedup, normals) are **always applied**, regardless of the `simplify` parameter.

---

## Local Development

### Prerequisites

- Node.js 18+
- Python 3.8+ (for `setup.py`)
- npm

### Install

```bash
npm install
```

### Build

```bash
npx tsc
```

Compiles `generator.ts` → `generator.js`.

### Watch mode

```bash
npx tsc --watch
```

---

## Manual Testing

Create a `test.js` file at the root:

```js
const processor = require('./generator.js');

processor(
  { filePath: './my-mesh.glb' },
  { simplify: 'true', target_faces: 20000 },
  {
    log: (msg) => console.log('[LOG]', msg),
    progress: (pct, label) => console.log(`[${pct}%]`, label),
    workspaceDir: '.',
  }
).then(console.log).catch(console.error);
```

```bash
node test.js
```

---

## Dependencies

| Package                     | Version | Role                            |
|-----------------------------|---------|---------------------------------|
| `@gltf-transform/core`      | ^3.9.0  | GLB/GLTF read & write           |
| `@gltf-transform/functions` | ^3.9.0  | Transforms (weld, dedup, …)     |
| `meshoptimizer`             | ^0.22.0 | Mesh simplification algorithm   |

---

## Troubleshooting

**`Cannot find module '@gltf-transform/core'`**
→ Run `npm install` in the extension folder.

**`generator.js` not found**
→ Run `npx tsc` to compile the TypeScript source.

**Mesh still defective after repair**
→ Heavily degraded meshes may not be fully repairable by weld/dedup alone. Check the BEFORE/AFTER logs to diagnose.

**Simplification skipped**
→ The mesh already has fewer triangles than `target_faces`. This is expected — a log entry will confirm it.
