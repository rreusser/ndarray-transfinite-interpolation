'use strict';

const regl = window.regl({optionalExtensions: ['oes_element_index_uint']});

// A function to scale the range [0, 1] to [-1, 1]:
const s = (x) => 2 * x - 1;

const edges = [[
  // Bounding curves for constant-u slices:
  (v, w) => [-1, s(v), s(w)], // <-- lower bound in this dimension
  (v, w) => [1, s(v), s(w)]   // <-- upper bound in this dimension
], [
  // Bounding curves for constant-v slices:
  (u, w) => [s(u), -1, s(w)],
  (u, w) => [s(u), 0, s(w)], // <-- we're not limited to two slices per dimension
  (u, w) => [s(u), 1 + u * (1 - u) * w * (1 - w) * 4, s(w)], // <-- add a bulge on top
], [
  // Bounding curves for constant-w slices:
  (u, v) => [s(u), s(v), -1],
  (u, v) => [s(u), s(v), 1],
]];

// Create the draw command:
const A = tfi(zeros([17, 17, 17, 3], 'float32'), edges);
var lines = [createLines(regl, A, {
  stride: [
    [0, 4, 4],
    [4, 0, 4],
    [4, 4, 0]
  ],
  props: {
    lineWidth: 2,
    lineColor: [0, 0, 0, 0.3]
  }
})];

// Construct the edge lines by evaluating the edges:
const n = 17;
const attrs = {props: {lineWidth: 4, lineColor: [1, 0, 0, 1]}};
lines = lines.concat(flatten(edges.map(x => x.map(e => [
  createLines(regl, vectorFill(zeros([n, 3], 'float32'), (k) => e(0, k / (n - 1))), attrs),
  createLines(regl, vectorFill(zeros([n, 3], 'float32'), (k) => e(1, k / (n - 1))), attrs),
  createLines(regl, vectorFill(zeros([n, 3], 'float32'), (k) => e(k / (n - 1), 0)), attrs),
  createLines(regl, vectorFill(zeros([n, 3], 'float32'), (k) => e(k / (n - 1), 1)), attrs)
])), 2));

const camera = createCamera(regl, {
  center: [0, 0, 0],
  phi: 0,
  theta: Math.PI * 0.25,
  distance: 5
});

const drawLines = regl({
  frag: `
    precision mediump float;
    uniform vec4 color;
    void main () {
      gl_FragColor = vec4(color);
    }`,
  vert: `
    precision mediump float;
    uniform mat4 projection, view;
    attribute vec3 position;
    void main () {
      gl_Position = projection * view * vec4(position, 1.0);
    }`,
  primitive: 'lines',
  attributes: {
    position: {
      buffer: regl.prop('buffer'),
      stride: regl.prop('stride')
    },
  },
  uniforms: {
    color: regl.prop('lineColor')
  },
  lineWidth: regl.prop('lineWidth'),
  count: regl.prop('count'),
  elements: regl.prop('elements')
})

regl.frame(() => {
  regl.clear({color: [1, 1, 1, 1]})
  camera(() => drawLines(lines));
})

function createLines (regl, A, options) {
  var A0 = A.pick.apply(A, new Array(A.dimension - 1).fill(null).concat([0]));
  var elements = createGeometry(A0, options);
  var bytesPerEl = 4;
  var dimStride = A.stride[A.stride.length - 1] * bytesPerEl;

  return extend({
    buffer: new regl.buffer(A.data),
    stride: dimStride,
    count: elements.length,
    elements: new (regl.hasExtension('oes_element_index_uint') ? Uint32Array : Uint16Array)(elements),
  }, options.props || {});
}
