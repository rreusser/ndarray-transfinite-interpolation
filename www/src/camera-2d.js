'use strict';

var mouseChange = require('mouse-change')
var mouseWheel = require('mouse-wheel')
var identity = require('gl-mat4/identity')
var ortho = require('gl-mat4/ortho')
var lookAt = require('gl-mat4/lookAt')

module.exports = createCamera2d

function createCamera2d (regl, props) {
  var cameraState = {
    view: identity(new Float32Array(16)),
    projection: identity(new Float32Array(16)),
    eye: new Float32Array(props.eye || [0, 0, 5]),
    up: new Float32Array(props.up || [0, 1, 0]),
    center: new Float32Array(props.center ? [props.center[0], props.center[1], 0] : [0, 0, 0]),
    zoom: props.zoom || 1
  }

  cameraState.eye[0] = cameraState.center[0];
  cameraState.eye[1] = cameraState.center[1];

  var right = new Float32Array([1, 0, 0])
  var front = new Float32Array([0, 0, 1])

  var minDistance = Math.log('minDistance' in props ? props.minDistance : 0.1)
  var maxDistance = Math.log('maxDistance' in props ? props.maxDistance : 1000)

  var prevX, prevY, x0, y0;
  mouseChange(function (buttons, x, y) {
    x0 = x;
    y0 = y;
    if (buttons & 1 && x0 !== undefined) {
      var dx = x - prevX;
      var dy = y - prevY;
      var scale = window.innerHeight / cameraState.zoom * 0.5;
      cameraState.center[0] -= dx / scale;
      cameraState.center[1] += dy / scale;
      cameraState.eye[0] -= dx / scale;
      cameraState.eye[1] += dy / scale;
    }
    prevX = x
    prevY = y
  })

  window.addEventListener('wheel', function (e) {
    e.stopPropagation();
    e.preventDefault();
    return false;
  });

  mouseWheel(function (dx, dy) {
    var factor = Math.exp(-dy * 0.01);
    cameraState.zoom /= factor
  })

  function updateCamera () {
    lookAt(cameraState.view, cameraState.eye, cameraState.center, cameraState.up);
  }

  var injectContext = regl({
    context: Object.assign({}, cameraState, {
      projection: function ({viewportWidth, viewportHeight}) {
        var ar = viewportWidth / viewportHeight;
        return ortho(
          cameraState.projection,
          -1 * ar * cameraState.zoom,
          1 * ar * cameraState.zoom,
          -1 * cameraState.zoom,
          1 * cameraState.zoom,
          0.01,
          1000.0)
      }
    }),
    uniforms: Object.keys(cameraState).reduce(function (uniforms, name) {
      uniforms[name] = regl.context(name)
      return uniforms
    }, {})
  })

  function setupCamera (block) {
    updateCamera()
    injectContext(block)
  }

  Object.keys(cameraState).forEach(function (name) {
    setupCamera[name] = cameraState[name]
  })

  return setupCamera
}
