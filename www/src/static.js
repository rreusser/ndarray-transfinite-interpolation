'use strict';

window.tfi = require('../../');

window.regl = require('regl');
window.zeros = require('ndarray-scratch').zeros;
window.createGeometry = require('ndarray-grid-connectivity');
window.vectorFill = require('ndarray-vector-fill');
window.extend = require('util-extend');
window.createCamera = require('./camera');
window.createCamera2d = require('./camera-2d');
window.flatten = require('flatten');
window.drawMesh2d = require('./draw-mesh-2d');
window.drawMesh3d = require('./draw-mesh-3d');
window.ndarray = require('ndarray');
