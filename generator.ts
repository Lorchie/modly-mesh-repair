/* eslint-disable @typescript-eslint/no-require-imports */
import fs from 'fs';
import path from 'path';

interface Input  { filePath: string }
interface Params { [key: string]: unknown }
interface Context {
  log(message: string): void;
  progress(percent: number, label: string): void;
  workspaceDir: string;
}

function countFacesAndVerts(doc: any): { faces: number; verts: number } {
  let faces = 0;
  let verts = 0;
  for (const mesh of doc.getRoot().listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      const pos = prim.getAttribute('POSITION');
      if (pos) verts += pos.getCount();
      const indices = prim.getIndices();
      if (indices) faces += Math.round(indices.getCount() / 3);
      else if (pos) faces += Math.round(pos.getCount() / 3);
    }
  }
  return { faces, verts };
}

const processor = async (
  input: Input,
  params: Params,
  context: Context,
): Promise<{ filePath: string }> => {
  if (!input.filePath) throw new Error('mesh-repair: input.filePath is required');

  // Lazy requires — resolved from the extension's own node_modules
  const { NodeIO }                       = require('@gltf-transform/core');
  const { dedup, normals, simplify, weld } = require('@gltf-transform/functions');
  const { MeshoptSimplifier }            = require('meshoptimizer');

  await MeshoptSimplifier.ready;

  context.progress(10, 'Loading mesh…');
  const io  = new NodeIO();
  const doc = await io.read(input.filePath);

  const before = countFacesAndVerts(doc);
  context.log(`BEFORE — vertices: ${before.verts}, faces: ${before.faces}`);

  // --- Repairs (always applied) ---
  context.progress(30, 'Applying repairs…');
  await doc.transform(weld(), dedup());
  await doc.transform(normals({ overwrite: true }));

  // --- Simplification ---
  context.progress(60, 'Simplifying (if enabled)…');

  if (params['simplify'] === 'true' || params['simplify'] === true) {
    const targetFaces = Math.max(1000, Math.min(500000,
      Math.round(Number(params['target_faces'] ?? 50000)),
    ));

    const current = countFacesAndVerts(doc);
    if (current.faces > targetFaces) {
      const ratio = Math.min(1, targetFaces / current.faces);
      context.log(`Simplifying to ${targetFaces} triangles (ratio ${ratio.toFixed(4)})…`);
      await doc.transform(simplify({ simplifier: MeshoptSimplifier, ratio, error: 0.001, lockBorder: false }));
    } else {
      context.log(`Already ${current.faces} triangles — simplification skipped.`);
    }
  }

  // --- Report ---
  context.progress(80, 'Generating report…');
  const after = countFacesAndVerts(doc);
  context.log(`AFTER — vertices: ${after.verts}, faces: ${after.faces}`);
  context.log(`Summary — vertices removed: ${before.verts - after.verts}, faces removed: ${before.faces - after.faces}`);

  // --- Export GLB ---
  context.progress(90, 'Exporting GLB…');
  const outDir  = path.join(context.workspaceDir, 'Workflows');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `mesh-repair-${Date.now()}.glb`);
  await io.write(outPath, doc);

  context.progress(100, 'Repair complete.');
  context.log(`Output: ${outPath}`);
  return { filePath: outPath };
};

export = processor;
