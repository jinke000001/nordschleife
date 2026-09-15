import { BufferGeometry, Float32BufferAttribute } from 'three';

import { roadPoint } from './karussell-shape.js';
export { roadPoint } from './karussell-shape.js';

export function createRoadGeometry(inner, outer, start = 0, end = 1, segments = 100) {
  const vertices = [];
  const indices = [];
  for (let i = 0; i <= segments; i++) {
    const t = start + (end - start) * i / segments;
    vertices.push(...roadPoint(t, inner), ...roadPoint(t, outer));
    if (i < segments) {
      const a = i * 2;
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}
