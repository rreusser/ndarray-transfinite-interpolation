'use strict';

const circ  = x => Math.sqrt(Math.max(0, 2 - x * x)) - 1;
const c = x => Math.cos(x * Math.PI);
const s = x => Math.sin(x * Math.PI);
const amp = v => 1 + (0.5 - 0.5 * Math.cos(v * Math.PI * 8)) * 0.15;

const edges = [[
  v => [-1, s(v), c(v)],
  v => [0, Math.sqrt(2) * s(v) * amp(v), Math.sqrt(2) * c(v) * amp(v)],
  v => [1, s(v), c(v)]
], [
  u => [2 * u - 1, 0, 1 + circ(2 * u - 1)],
  u => [2 * u - 1, 0, -1 - circ(2 * u - 1)],
]];

const A = tfi(zeros([41, 81, 3], 'float32'), edges);

drawMesh3d(regl(), A, edges, {
  stride: [4, 4],
  camera: {
    center: [0, 0.5, 0],
    phi: Math.PI * 0.03,
    theta: -Math.PI * 0.1,
    distance: 5
  }
});

