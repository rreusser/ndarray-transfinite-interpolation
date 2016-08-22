/*function rail (u) {
  var un, theta;
  var u1 = 1 / 3;
  var u2 = 2 / 3;
  var s = 4 / Math.PI;
  if (u < u1) {
    un = u / u1;
    return [
      [-1 - s + s * un, 0, 0],
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ];
  } else if (u < u2) {
    un = (u - u1) / (u2 - u1);
    theta = un * Math.PI * 0.5;
    return [
      [-1 + Math.sin(theta), 1 - Math.cos(theta), 0],
      [Math.cos(theta), Math.sin(theta), 0],
      [-Math.sin(theta), Math.cos(theta), 0],
      [0, 0, 1]
    ]
  } else {
    un = (u - u2) / (1 - u2);
    return [
      [0, 1 + s * un, 0],
      [0, 1, 0],
      [-1, 0, 0],
      [0, 0, 1]
    ]
  }
}

function crossSection (u, v) {
  var un = 2 * u - 1;
  var vn = 2 * v - 1;
  var uc = un + circ(vn) * un;
  var vc = vn + circ(un) * vn;
  return [(un * un - 1) * (vn * vn - 1) * 0, uc * 0.2, vc * 0.2];
}

function extrusion (u, v, w) {
  var r = rail(u);
  var c = crossSection(v, w);
  return [
    r[0][0] + c[0] * r[1][0] + c[1] * r[2][0] + c[2] * r[3][0],
    r[0][1] + c[0] * r[1][1] + c[1] * r[2][1] + c[2] * r[3][1],
    r[0][2] + c[0] * r[1][2] + c[1] * r[2][2] + c[2] * r[3][2],
  ]
}

bounds =[
  [(v, w) => extrusion(0, v, w), (v, w) => extrusion(1, v, w)],
  [(u, w) => extrusion(u, 0, w), (u, w) => extrusion(u, 1, w)],
  [(u, v) => extrusion(u, v, 0), (u, v) => extrusion(u, v, 1)]
];*/
