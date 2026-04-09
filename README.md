# Mesh Repair — Modly Extension

Automatically repairs common defects in 3D meshes (`.glb`), with optional polygon reduction powered by [meshoptimizer](https://github.com/zeux/meshoptimizer).

**Extension ID:** `mesh-repair`  
**Version:** 1.0.0  
**Author:** Lorchie  
**Runtime:** Node.js (CPU only)

---

## Pipeline

```
GLB input
  └─ 1. Weld     ──  merges duplicate vertices
  └─ 2. Dedup    ──  removes redundant accessors and data
  └─ 3. Normals  ──  recomputes smooth vertex normals
  └─ 4. Simplify (optional)  ──  reduces triangle count via meshoptimizer
  └─ 5. GLB export
```

---

## Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `simplify` | `false` | Enable polygon reduction after repairs |
| `target_faces` | `50 000` | Target triangle count when simplification is enabled (1 000 – 500 000) |

- Weld, dedup and normals are always applied — simplification is optional.
- If the mesh is already below `target_faces`, simplification is skipped automatically.

---

## Project Structure

```
modly-mesh-repair/
├── manifest.json   # Modly manifest
├── generator.js    # Bundled processor (all deps included)
└── .gitignore
```

---

## Credits

| Resource | Link |
|----------|------|
| glTF-Transform | [github.com/donmccurdy/glTF-Transform](https://github.com/donmccurdy/glTF-Transform) |
| meshoptimizer | [github.com/zeux/meshoptimizer](https://github.com/zeux/meshoptimizer) |

---

## License

meshoptimizer — [MIT](https://github.com/zeux/meshoptimizer/blob/master/LICENSE.md)  
glTF-Transform — [MIT](https://github.com/donmccurdy/glTF-Transform/blob/main/LICENSE)
