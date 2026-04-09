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

## Open Source Credits

This project relies on the following open source libraries:

| Library | Version | License | Description |
|---|---|---|---|
| [@gltf-transform/core](https://github.com/donmccurdy/glTF-Transform) | ^3.9.0 | MIT | glTF 2.0 read/write core library by Don McCurdy |
| [@gltf-transform/functions](https://github.com/donmccurdy/glTF-Transform) | ^3.9.0 | MIT | Mesh processing functions (weld, dedup, normals…) |
| [meshoptimizer](https://github.com/zeux/meshoptimizer) | ^0.22.0 | MIT | High-performance mesh optimization and simplification by Arseny Kapoulkine |
| [TypeScript](https://github.com/microsoft/TypeScript) | ^5.7.0 | Apache-2.0 | Typed superset of JavaScript by Microsoft |

---
