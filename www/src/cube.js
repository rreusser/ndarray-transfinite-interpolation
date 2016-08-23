'use strict';

const regl = window.regl({optionalExtensions: ['oes_element_index_uint']});

const edges = [[
  (v, w) => [0, v, w],
  (v, w) => [1, v, w]
], [
  (u, w) => [u, 0, w],
  (u, w) => [u, 1, w],
], [
  (u, v) => [u, v, 0],
  (u, v) => [u, v, 1],
]];

const A = tfi(zeros([17, 17, 17, 3], 'float32'), edges);

drawMesh3d(regl, A, edges, {
  stride: [4, 4, 4],
  camera: {
    center: [0.5, 0.5, 0.5],
    phi: Math.PI * 0.15,
    theta: Math.PI * 0.15,
    distance: 2.5
  }
});
