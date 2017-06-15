export const clip = (n, m, M) => (
  n < M ? n > m ? n : m : M
);

export const comeCloser = (n, goal, factor, limit) => (
  (limit && Math.abs(goal - n) < limit) ? goal : n + (goal - n) / (factor || 10)
);

export const dist = (a, b) => {
  const dx = b[0] - a[0],
  dy = b[1] - a[1],
  dz = b[2] - a[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export const normalize = (v) => {
  const l = Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]);
  return [v[0] / l, v[1] / l, v[2] / l];
}

export const projection = (p, d, s) => {
  const f = (s || 1) / (1 - p[2] / d);
  return [p[0]*f, p[1]*f, p[2]];
}

export const rotateX = (p, a) => {
  const d = Math.sqrt(p[2] * p[2] + p[1] * p[1]),
    na = Math.atan2(p[2], p[1]) + a;
  return [p[0], d * Math.cos(na), d * Math.sin(na)];
}

export const rotateY = (p, a) => {
  const d = Math.sqrt(p[2] * p[2] + p[0] * p[0]),
    na = Math.atan2(p[0], p[2]) + a;
  return [d * Math.sin(na), p[1], d * Math.cos(na)];
}

export const rotateZ = (p, a) => {
  const d = Math.sqrt(p[1] * p[1] + p[0] * p[0]),
    na = Math.atan2(p[1], p[0]) + a;
  return [d * Math.cos(na), d * Math.sin(na), p[2]];
}

export const rotateMatrix = (p, m) => ([
  p[0] * m[0] + p[1] * m[3] + p[2] * m[6],
  p[0] * m[1] + p[1] * m[4] + p[2] * m[7],
  p[0] * m[2] + p[1] * m[5] + p[2] * m[8]
]);

export const rotate3dMatrix = (x, y, z, a) => {
  const c = 1 - Math.cos(a),
    s = Math.sin(a);

  return [
    1+c*(x*x-1), x*y*c+z*s, x*z*c-y*s,
    x*y*c-z*s, 1+c*(y*y-1), y*z*c+x*s,
    x*z*c+y*s, y*z*c-x*s, 1+c*(z*z-1)
  ];
}

const mul33 = (m, n) => {
  const m1 = m[0], m2 = m[1], m3 = m[2],
    m4 = m[3], m5 = m[4], m6 = m[5],
    m7 = m[6], m8 = m[7], m9 = m[8];
  
  const n1 = n[0], n2 = n[1], n3 = n[2],
    n4 = n[3], n5 = n[4], n6 = n[5],
    n7 = n[6], n8 = n[7], n9 = n[8];
  
  return [
    m1*n1+m4*n2+m7*n3, m2*n1+m5*n2+m8*n3, m3*n1+m6*n2+m9*n3,
    m1*n4+m4*n5+m7*n6, m2*n4+m5*n5+m8*n6, m3*n4+m6*n5+m9*n6,
    m1*n7+m4*n8+m7*n9, m2*n7+m5*n8+m8*n9, m3*n7+m6*n8+m9*n9
  ];
}

export function chainMul33(base) {
  for(var i = 1, l = arguments.length; i < l; i++)
    base = mul33(base, arguments[i]);
  return base;
}
