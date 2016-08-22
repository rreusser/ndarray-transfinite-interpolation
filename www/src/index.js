'use strict';

const regl = window.regl({optionalExtensions: ['oes_element_index_uint']});

function circ (x) {return Math.sqrt(Math.max(0, 2 - x * x)) - 1;}

var r21 = 0.2;
var rcen = r21 + (Math.sqrt(2) - 1);

var edges = [[
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

// Create the draw command:
var drawGrid = draw(regl,
  tfi(zeros([5, 81, 41, 3], 'float32'), edges), {
  stride: [
    [0, 10, 10],
    [2, 0, 10],
    [2, 10, 0]
  ]
});

// Construct the edge lines by evaluating the edges:
var n = 81;
var drawEdge = [];
edges.forEach(x => x.forEach((e) => {
  drawEdge = drawEdge.concat([
    draw(regl, vectorFill(zeros([n, 3], 'float32'), (k) => e(0, k / (n - 1)))),
    draw(regl, vectorFill(zeros([n, 3], 'float32'), (k) => e(1, k / (n - 1)))),
    draw(regl, vectorFill(zeros([n, 3], 'float32'), (k) => e(k / (n - 1), 0))),
    draw(regl, vectorFill(zeros([n, 3], 'float32'), (k) => e(k / (n - 1), 1)))
  ]);
}));

var camera = createCamera(regl, {
  center: [0, 0.5, 0],
  phi: 0,
  theta: Math.PI * 0.25,
  distance: 5
});

regl.frame(() => {
  regl.clear({color: [1, 1, 1, 1]})
  camera(() => {
    drawGrid({lineWidth: 2, lineColor: [0, 0, 0, 0.3]});
    drawEdge.forEach(e => e({lineWidth: 4, lineColor: [1, 0, 0, 1]}));
  })
})

function draw (regl, A, options) {
  var A0 = A.pick.apply(A, new Array(A.dimension - 1).fill(null).concat([0]));
  var elements = createGeometry(A0, options);
  return drawLines(regl, A, elements);
}

function drawLines (regl, A, elements) {
  var buffer = regl.buffer(A.data);
  var byteSize = 4;
  var dimStride = A.stride[A.stride.length - 1] * byteSize;
  var draw, drawProps;

  draw = regl({
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
      color: regl.context('lineColor')
    },
    lineWidth: regl.context('lineWidth'),
    count: regl.prop('count'),
    elements: regl.prop('elements')
  })

  drawProps = {
    buffer: buffer,
    count: elements.length,
    stride: dimStride,
    elements: new (regl.hasExtension('oes_element_index_uint') ? Uint32Array : Uint16Array)(elements),
  };

  var setupMesh = regl({
    context: {
      lineWidth: regl.prop('lineWidth'),
      lineColor: regl.prop('lineColor')
    }
  });

  return function (props) {
    setupMesh(props, () => {
      draw(drawProps);
    });
  }
}
