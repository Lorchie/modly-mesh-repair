# Mesh Repair — Modly Extension

Cleans up and optionally reduces polygon count on any 3D mesh (`.glb`) using [glTF-Transform](https://github.com/donmccurdy/glTF-Transform) and [meshoptimizer](https://github.com/zeux/meshoptimizer).

**Extension ID:** `mesh-repair`  
**Version:** 1.0.0  
**Author:** Lorchie  
**Runtime:** Node.js (CPU only)

---

## Pipeline

```
GLB input
  └─ 1. Load GLB
  └─ 2. Simplify (optional)  ──  reduces triangle count via meshoptimizer
  └─ 3. GLB export
```

---

## Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `simplify` | `false` | Enable polygon reduction |
| `target_faces` | `50 000` | Target triangle count when simplification is enabled (1 000 – 500 000) |

### Tuning tips

- If the mesh is already below `target_faces`, simplification is skipped automatically.
- Keep `target_faces` above 10 000 to preserve fine surface detail.

---

## When to use

| Use case | Result |
|----------|--------|
| Dense AI-generated mesh | Reduce face count for real-time or export |
| Mesh too heavy for downstream tools | Fast CPU decimation with quality preservation |

## When NOT to use

| Use case | Why |
|----------|-----|
| Non-manifold or broken geometry | meshoptimizer expects valid mesh topology |
| Organic meshes needing retopology | Use Instant Remesh instead |

---

## Requirements

Dependencies are bundled directly into `generator.js` — no installation required.

| Package | License | Description |
|---------|---------|-------------|
| [`@gltf-transform/core`](https://github.com/donmccurdy/glTF-Transform) | MIT | glTF 2.0 read/write |
| [`@gltf-transform/functions`](https://github.com/donmccurdy/glTF-Transform) | MIT | Mesh processing functions |
| [`meshoptimizer`](https://github.com/zeux/meshoptimizer) | MIT | High-performance mesh simplification |

---

## Project Structure

```
modly-mesh-repair/
├── manifest.json   # Modly manifest (node declaration, parameters)
├── generator.js    # Bundled processor (all deps included, no install needed)
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

glTF-Transform — [MIT](https://github.com/donmccurdy/glTF-Transform/blob/main/LICENSE)  
meshoptimizer — [MIT](https://github.com/zeux/meshoptimizer/blob/master/LICENSE.md)
