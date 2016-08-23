'use strict';

const edges = [[
  v => [0, v, 0],
  v => [1, v, 0]
], [
  u => [u, 0, 0],
  u => [u, 1, 0],
]]

const A = tfi(zeros([11, 11, 3], 'float32'), edges);

drawMesh2d(regl(), A, edges, {
  stride: [1, 1]
});

