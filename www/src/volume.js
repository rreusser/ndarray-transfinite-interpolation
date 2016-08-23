'use strict';

const regl = window.regl({optionalExtensions: ['oes_element_index_uint']});

const r21 = 0.2;
const rcen = r21 + (Math.sqrt(2) - 1);
function circ (x) {return Math.sqrt(Math.max(0, 2 - x * x)) - 1;}

const edges = [[
  (v, w) => [Math.cos(v * Math.PI), Math.sin(v * Math.PI), 2 * w - 1],
  (v, w) => [(1 + r21) * Math.cos(v * Math.PI) - circ(2 * w - 1) * (2 * v - 1), (1 + r21) * Math.sin(v * Math.PI), 2 * w - 1]
], [
  (u, w) => [1 + (1 - u) * r21 + (1 - u) * circ(2 * w - 1), 0, 2 * w - 1],
  (u, w) => [0, 1 + r21 * (1 - u) + (1 - u) * circ(2 * w - 1), 2 * w - 1],
  (u, w) => [-1 - (1 - u) * r21 - (1 - u) * circ(2 * w - 1), 0, 2 * w - 1],
], [
  (u, v) => [(1 + (1 - u) * r21) * Math.cos(v * Math.PI), (1 + (1 - u) * r21) * Math.sin(v * Math.PI), -1],
  (u, v) => {
    var fac = 0.25 * (0.5 - 0.5 * Math.cos(v * Math.PI * 8));
    return [(1 + rcen - u * rcen + (1 - u) * fac) * Math.cos(v * Math.PI), (1 + rcen - u * rcen + (1 - u) * fac) * Math.sin(v * Math.PI), 0]
  },
  (u, v) => [(1 + (1 - u) * r21) * Math.cos(v * Math.PI), (1 + (1 - u) * r21) * Math.sin(v * Math.PI), 1],
]];

const A = tfi(zeros([5, 41, 41, 3], 'float32'), edges);

drawMesh3d(regl, A, edges, {
  stride: [
    [0, 5, 10],
    [2, 0, 10],
    [2, 5, 0]
  ],
  lineRes: 41,
  camera: {
    center: [0.0, 0.5, 0.0],
    phi: Math.PI * 0.15,
    theta: Math.PI * 0.35,
    distance: 4
  }
});
