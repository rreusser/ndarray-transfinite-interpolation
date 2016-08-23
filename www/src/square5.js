'use strict';

const edges = [
  [v => [0, v, 0], v => [1, v, 0]],
  [u => [u, 0, 0], u => [u, 1, 0]]
];

const mapping = [
  u => u * u * u,
  [0, 0.15, 0.2, 0.35, 0.4, 0.55, 0.6, 0.75, 0.8, 0.95, 1]
];

const A = tfi(zeros([11, 11, 3], 'float32'), edges, null, mapping);

drawMesh2d(regl(), A, edges, {
  stride: [1, 1],
  center: [0.5, 0.5]
});

