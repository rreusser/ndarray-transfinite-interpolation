'use strict';

module.exports = function drawMesh2d (regl, mesh, edges, options) {
  options = options || {};

  var lines = [createLines(regl, mesh, {
    stride: options.stride || [1, 1],
    props: {lineWidth: 2, lineColor: [0, 0, 0, 0.3]}
  })];

  const n = mesh.shape[0];
  const attrs = {props: {lineWidth: 4, lineColor: [1, 0, 0, 1]}};
  lines = lines.concat(flatten(edges.map(x => x.map(e => [
    createLines(regl, vectorFill(zeros([mesh.shape[0], 3], 'float32'), (k) => e(k / (mesh.shape[0] - 1))), attrs),
    createLines(regl, vectorFill(zeros([mesh.shape[1], 3], 'float32'), (k) => e(k / (mesh.shape[1] - 1))), attrs),
  ])), 2));

  options.camera = options.camera || {};
  const camera = createCamera2d(regl, {
    center: options.camera.center || [0.5, 0.5],
    zoom: options.camera.zoom || 1.2
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
}
