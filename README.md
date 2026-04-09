# Mesh Repair — Modly Extension

Automatically analyzes and repairs common defects in 3D meshes (`.glb`),
with optional polygon count simplification powered by [meshoptimizer](https://github.com/zeux/meshoptimizer).

**Extension ID:** `mesh-repair`  
**Version:** 1.0.0  
**Author:** Guillaume  
**Runtime:** Node.js (CPU only)

---

## Pipeline

```
GLB input
  └─ 1. Weld  ──  merges duplicate vertices
  └─ 2. Dedup  ──  removes redundant accessors and data
  └─ 3. Normals  ──  recomputes smooth vertex normals
  └─ 4. Simplify (optional)  ──  reduces triangle count via meshoptimizer
  └─ 5. GLB export via @gltf-transform
```

---

## Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `simplify` | `false` | Enable polygon reduction after repairs |
| `target_faces` | `50 000` | Target triangle count when simplification is enabled (1 000 – 500 000) |

### Notes

- Weld, dedup and normals are always applied — simplification is optional on top.
- If the mesh is already below `target_faces`, simplification is skipped automatically.

---

## Requirements

Dependencies are installed automatically by `setup.py` in an isolated environment.

| Package | Version | License | Description |
|---------|---------|---------|-------------|
| [`@gltf-transform/core`](https://github.com/donmccurdy/glTF-Transform) | ^3.9.0 | MIT | glTF 2.0 read/write core library |
| [`@gltf-transform/functions`](https://github.com/donmccurdy/glTF-Transform) | ^3.9.0 | MIT | Mesh processing functions (weld, dedup, normals, simplify) |
| [`meshoptimizer`](https://github.com/zeux/meshoptimizer) | ^0.22.0 | MIT | High-performance mesh simplification by Arseny Kapoulkine |

---

## Project Structure

```
modly-mesh-repair/
├── manifest.json     # Modly manifest (node declaration, parameters)
├── generator.ts      # TypeScript source of the processor
├── setup.py          # Installation script called by Modly
├── package.json      # npm dependencies
└── tsconfig.json     # TypeScript configuration
```

> `generator.js` and `node_modules/` are generated locally and excluded from the repository.

---

## Credits

| Resource | Link |
|----------|------|
| glTF-Transform | [github.com/donmccurdy/glTF-Transform](https://github.com/donmccurdy/glTF-Transform) |
| meshoptimizer | [github.com/zeux/meshoptimizer](https://github.com/zeux/meshoptimizer) |

---

## License

This extension is distributed as part of the Modly ecosystem.  
meshoptimizer is released under the [MIT License](https://github.com/zeux/meshoptimizer/blob/master/LICENSE.md).  
glTF-Transform is released under the [MIT License](https://github.com/donmccurdy/glTF-Transform/blob/main/LICENSE).
