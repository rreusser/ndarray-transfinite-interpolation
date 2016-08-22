'use strict';

window.tfi = require('../../');

window.regl = require('regl');
window.zeros = require('ndarray-scratch').zeros;
window.createGeometry = require('ndarray-grid-connectivity');
window.vectorFill = require('ndarray-vector-fill');
window.extend = require('util-extend');
window.createCamera = require('./camera');
