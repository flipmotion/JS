import {
  clip,
  projection,
  rotateX,
  rotateY,
  rotateZ,
  rotateMatrix,
  rotate3dMatrix,
  chainMul33,
} from './Utils';

const c = document.getElementById('draw'), ctx = c.getContext('2d');

function onResize() {
  c.width = c.clientWidth;
  c.height = c.clientHeight;
}

window.addEventListener('resize', onResize);

onResize();

const drawCubes = (function() {
  const v = [
  [-1,-1,-1],
  [-1,-1, 1],
  [ 1,-1, 1],
  [ 1,-1,-1],
  [ 1, 1,-1],
  [-1, 1,-1],
  [-1, 1, 1],
  [ 1, 1, 1],
  ], e = [];
  const eFull = '0-1 1-2 2-3 3-0 4-5 5-6 6-7 7-4 0-5 1-6 2-7 3-4'.split(' ');

  for(let i = eFull.length, ea; i--;) e.push([+(ea=eFull[i].split('-'))[0], +ea[1]]);
    const offset = Math.PI * .25, s1 = .5 / Math.sqrt(3), s2 = s1 / Math.sqrt(3), s3 = s2 / Math.sqrt(3);
  const draws = [{
    color: '#2ecc71',
    transform: (p, m) => projection(rotateX(rotateMatrix(p, m), offset), perspective, cubeSize * s1),
  }, {
    color: '#e74c3c',
    transform: (p, m) => projection(rotateY(rotateMatrix(p, m), offset), perspective, cubeSize * s2),
  }, {
    color: '#f1c40f',
    transform: (p, m) => projection(rotateZ(rotateMatrix(p, m), offset), perspective, cubeSize * s3)
  }];

  return (ctx) => {
    let allLines = [], i, l, d;
    for(d = draws.length; d--;) {
      const draw = draws[d];
      let points = [];

      for(i = 0, l = v.length; i < l; i++)
        points.push(draw.transform(v[i], rotMatrix));

      for(i = e.length; i--;) {
        let edge = e[i], p1 = points[edge[0]], p2 = points[edge[1]];
        let z = (p1[2] + p2[2]) * .5;
        allLines.push([p1[0], p1[1], p2[0], p2[1], z, draw.color]);
      }
    }

    allLines.sort(function(a, b) { return b[4] - a[4]; });
    ctx.lineWidth = 1.2;

    for(i = allLines.length; i--;) {
      l = allLines[i];
      ctx.strokeStyle = l[5];
      ctx.beginPath();
      ctx.moveTo(l[0], l[1]);
      ctx.lineTo(l[2], l[3]);
      ctx.stroke();
    }
  };
})();

const drawGrowing = (function() {
  const easing = t => t < 0.5 ? 2 * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

  let globalScale = 1, globalRot = 0, rotX = -.17;

  const transformed = v => projection(rotateX(rotateY(v, globalRot), rotX), perspective);

  const box = (ctx, sX, sY, sZ) => {
    let p1 = transformed([-sX, -sY, sZ]),
    p2 = transformed([ sX, -sY, sZ]),
    p3 = transformed([ sX,  sY, sZ]),
    p4 = transformed([-sX,  sY, sZ]),
    p5 = transformed([-sX, -sY,-sZ]),
    p6 = transformed([ sX, -sY,-sZ]),
    p7 = transformed([ sX,  sY,-sZ]),
    p8 = transformed([-sX,  sY,-sZ]);
    ctx.moveTo(p1[0], p1[1]);
    ctx.lineTo(p2[0], p2[1]);
    ctx.lineTo(p3[0], p3[1]);
    ctx.lineTo(p4[0], p4[1]);
    ctx.lineTo(p1[0], p1[1]);
    ctx.lineTo(p5[0], p5[1]);
    ctx.lineTo(p6[0], p6[1]);
    ctx.lineTo(p7[0], p7[1]);
    ctx.lineTo(p8[0], p8[1]);
    ctx.lineTo(p5[0], p5[1]);
    ctx.moveTo(p2[0], p2[1]);
    ctx.lineTo(p6[0], p6[1]);
    ctx.moveTo(p3[0], p3[1]);
    ctx.lineTo(p7[0], p7[1]);
    ctx.moveTo(p4[0], p4[1]);
    ctx.lineTo(p8[0], p8[1]);
  }

  let pT, dtMax = 1 / 60, t = 0;
  const animDur = 2.1;

  return (ctx) => {
    const now = Date.now();
    let dt = 0;
    if(pT) dt = Math.min((now - pT) * .001, dtMax);
    pT = now;
    t += dt;
    const p = (t % animDur) / animDur;
    globalScale = 1 - p * .5;
    globalRot = p * Math.PI / 2;
    const sc = cubeSize * .2;
    ctx.scale(sc, sc);
    ctx.strokeStyle = '#57ff57';
    ctx.lineWidth = .75 / sc;
    ctx.beginPath();
    box(ctx, globalScale, globalScale, globalScale);
    const scx = easing(clip(p / .27, 0, 1)) * 1.5 + .5,
    scy = easing(clip((p - .27) / .27, 0, 1)) * 1.5 + .5,
    scz = easing(clip((p - .54) / .27, 0, 1)) * 1.5 + .5;
    box(ctx, globalScale * scx, globalScale * scy, globalScale * scz);
    ctx.stroke();
  };
})();


const baseCorners = [
[-1, -1,  1], [ 1, -1,  1], [ 1, 1,  1], [-1, 1,  1],
[ 1, -1, -1], [-1, -1, -1], [-1, 1, -1], [ 1, 1, -1],
];

const faces = [
{
  name: 'front',
  corners: [0,1,2,3],
  draw: () => ({})
}, {
  name: 'back',
  corners: [4,5,6,7],
  draw: drawGrowing
}, {
  name: 'left',
  corners: [5,0,3,6],
  draw: () => ({})
}, {
  name: 'right',
  corners: [1,4,7,2],
  draw: () => ({})
}, {
  name: 'bottom',
  corners: [3,2,7,6],
  draw: () => ({})
}, {
  name: 'top',
  corners: [5,4,1,0],
  draw: drawCubes
}];


const faceBg = 'rgba(4,13,24,.65)';
const border = 'rgb(40,130,240)';
const cubeSize = 160, perspective = 15;


let rot = [0,0,0];
const rotVel = [-6e-3,7.6e-3,2.13e-3];
let rotBase = [1,0,0,0,1,0,0,0,1];
let rotMatrix;

function setBase() {
  rotBase = rotMatrix;
  rot = [0,0,0];
}

function loop() {
  const mx = rotate3dMatrix(1,0,0,rot[0]);
  const my = rotate3dMatrix(0,1,0,rot[1]);
  const mz = rotate3dMatrix(0,0,1,rot[2]);
  rotMatrix = chainMul33(mx, my, mz, rotBase);

  const w = c.width; 
  const h = c.height;

  const corners = baseCorners.map(c => {
    let res = projection(rotateMatrix(c, rotMatrix), perspective, cubeSize * .5);
    res[0] += w * .5; res[1] += h * .5;
    return res;
  });

  ctx.clearRect(0, 0, w, h);
  for(let i = 0, l = faces.length; i < l; i++) {
    const face = faces[i];
    let z = 0;
    const faceCorners = face.currentCorners = face.corners.map(i => {
      const c = corners[i];
      z += c[2];
      return c;
    });
    face.z = z * .25;
  }

  faces.sort((a, b) => a.z - b.z);

  for(let i = 0, l = faces.length; i < l; i++) {
    const face = faces[i];
    const faceCorners = face.currentCorners;
    let drawBg;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, c.width, c.height);
    drawPath(ctx, faceCorners);
    ctx.clip();
    ctx.beginPath();
    drawPath(ctx, faceCorners);
    ctx.clip();

    face.draw && 
    ctx.save();
    ctx.translate(w * .5, h * .5);
    drawBg = face.draw(ctx, faces, corners);
    ctx.restore();

    ctx.restore();

    Object.assign(ctx, {
      fillStyle: faceBg,
      strokeStyle: border,
      lineWidth: 0.5,
    });


    ctx.save();
    ctx.beginPath();
    ctx.rect(c.width, 0, -c.width, c.height);
    drawPath(ctx, faceCorners);
    ctx.clip();
    ctx.beginPath();
    drawPath(ctx, faceCorners);
    ctx.fill();
    ctx.restore();

    ctx.beginPath();
    drawPath(ctx, faceCorners);
    if(drawBg) ctx.fill();
    ctx.stroke();
  }
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

function drawPath(ctx, corners) {
  if(!corners.length) return;

  ctx.moveTo(corners[0][0], corners[0][1]);
  corners.map((item, i) => ctx.lineTo(corners[i][0], corners[i][1]));
  ctx.lineTo(corners[0][0], corners[0][1]);
}


(function() {
  let grabbed = false;
  let moved = false;
  let cPos;
  let pPos;
  let lastMoveTime, vel, timer;
  const factor = 3e-3;

  function getPos(e) {
    if(e.touches && e.touches.length)
      e = e.touches[0];
    return [e.clientX,e.clientY];
  }

  function stopMomentum() {
    cancelAnimationFrame(timer); 
    timer = null; 
  }

  function mouseDown(e) {
    if(grabbed) return;

    if(!e.touches)
      e.preventDefault();

    stopMomentum();
    cPos = pPos = grabbed = getPos(e);
    moved = false;
  }

  function mouseMove(e) {
    if(!grabbed) return;

    const pos = getPos(e);
    const dx = grabbed[1] - pos[1], dy = pos[0] - grabbed[0];

    if(!moved) {
      if(dx * dx + dy * dy < 16) return;
      moved = true;
      setBase();
    }

    lastMoveTime = Date.now();
    pPos = cPos; cPos = pos;
    rot = [dx * factor, dy * factor, 0];
  }

  function mouseUp(e) {
    if(!grabbed) return;
    grabbed = false;
    if(!moved) return;
    const f = Math.max(0, 1 - (Date.now() - lastMoveTime) / 200);
    vel = [(pPos[1] - cPos[1]) * factor * f, (cPos[0] - pPos[0]) * factor * f];
    timer = requestAnimationFrame(momentum);
  }

  function momentum() {
    if(Math.abs(vel[0]) < .001 && Math.abs(vel[1]) < .001) return;
    let decay = .97;
    vel[0] *= decay; vel[1] *= decay;
    rot[0] += vel[0]; rot[1] += vel[1];
    if(timer)
      timer = requestAnimationFrame(momentum);
  }

  document.addEventListener('mousedown', mouseDown);
  document.addEventListener('mousemove', mouseMove);
  document.addEventListener('mouseup', mouseUp);
  document.addEventListener('click', e => {
    if(!moved) return;
    e.preventDefault();
    e.stopPropagation(); 
  }, true);
  document.addEventListener('touchstart', mouseDown);
  document.addEventListener('touchmove', mouseMove);
  document.addEventListener('touchend', mouseUp);
})();
