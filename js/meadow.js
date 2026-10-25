/* "Ink meadow" hero background (adapted from the 5OS billboard).
   An ink tree under a soft sun, in front of a meadow of grasses and small
   flowers, all swaying in the same gentle wind. Drawn with three.js, recoloured
   to the site's mist-and-lavender palette. Holds a single still frame for
   people who prefer reduced motion, pauses when off-screen, and leaves the
   CSS gradient in place where WebGL isn't available. */
(function () {
  'use strict';

  /* ---- palette (0–1 RGB) ---- */
  var INK = [0.42, 0.44, 0.56];        /* grass and flower ink, a soft slate lavender */
  var FAR = [0.80, 0.81, 0.88];        /* distant grass, pale lavender grey */
  var TREE = [0.22, 0.23, 0.31];       /* tree ink */
  var SUN = [0.78, 0.76, 0.89];        /* soft lilac sun */
  var PETUNIA = [0.50, 0.32, 0.72];    /* the little purple flowers */

  var FACTORY = function (THREE, canvas, opts) {
    var W = opts.width || canvas.clientWidth || 800;
    var H = opts.height || canvas.clientHeight || 450;
    var DPR = Math.min(opts.pixelRatio || 1, 2);
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(DPR);
    renderer.setSize(W, H, false);
    var scene = new THREE.Scene();
    var disposables = [];
    var params = opts.params || {};
    var density = Math.round(+(params.density || 2500));
    var windAmt = (params.wind !== undefined && params.wind !== null) ? +params.wind : 1;
    var forkDeg = +(params.fork || 24);
    if (!(density > 0)) density = 2500;
    if (!(windAmt >= 0)) windAmt = 1;
    if (!(forkDeg > 0)) forkDeg = 24;
    var FORK = forkDeg * Math.PI / 180;

    /* ---- view settings, so each page can show its own corner of the meadow ---- */
    var side = params.side === 'left' ? -1 : 1;                 /* which side the tree stands on */
    var treeScale = +(params.treeScale) > 0 ? +params.treeScale : 1;   /* below 1 = further away */
    var sunDX = (params.sunX !== undefined) ? +params.sunX : 1.2;     /* sun position relative to the tree */
    var sunY = (params.sunY !== undefined) ? +params.sunY : 7.3;
    /* or place the sun across the whole sky: -1 = left edge, 0 = middle, 1 = right edge */
    var sunAcross = (params.sunAcross !== undefined) ? +params.sunAcross : null;
    var sunCol = (params.sun && params.sun.length === 3) ? params.sun : SUN;

    /* ---------- deterministic random ---------- */
    var seed = +(params.seed) || 20261025;
    function rnd() {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    }

    /* ---------- layout ---------- */
    var halfW = 8, viewH = 10, treeX = 4;
    var TREE_Y = 0.4;
    var camera = new THREE.OrthographicCamera(-8, 8, 10, 0, -1, 1);

    /* ---------- shared GLSL ---------- */
    var WIND = [
      'float wind(float t, float x) {',
      '  float g = 0.5 + 0.5 * sin(t * 0.31 - x * 0.21);',
      '  g = g * g * g * g;',
      '  return 0.30 * sin(t * 0.83 + x * 0.37) + 0.16 * sin(t * 1.61 + x * 0.93 + 1.3) + 0.55 * g + 0.12;',
      '}',
      'vec2 disp(vec2 p, float bend, float key) {',
      '  float w = wind(uTime, key) * uWind;',
      '  float fl = sin(uTime * 4.3 + p.x * 7.1 + p.y * 5.3 + key * 1.7) * 0.05 * uWind;',
      '  return vec2((w + fl) * bend, -abs(w) * bend * 0.2);',
      '}'
    ];

    var strokeVert = [
      'precision highp float;',
      'attribute vec2 aA;',
      'attribute vec2 aB;',
      'attribute vec2 aW;',
      'attribute vec2 aSE;',
      'attribute vec2 aBend;',
      'attribute float aTone;',
      'attribute vec2 aBase;',
      'uniform float uTime;',
      'uniform float uWind;',
      'uniform float uXScale;',
      'uniform float uX0;',
      'uniform float uPx;',
      'varying float vSide;',
      'varying float vTone;',
      'varying float vCov;'
    ].concat(WIND).concat([
      'void main() {',
      '  vec2 base = vec2(aBase.x * uXScale + uX0, aBase.y);',
      '  float key = base.x;',
      '  vec2 A = base + aA + disp(aA, aBend.x, key);',
      '  vec2 B = base + aB + disp(aB, aBend.y, key);',
      '  vec2 d = B - A;',
      '  float L = max(length(d), 1e-5);',
      '  d /= L;',
      '  vec2 n = vec2(-d.y, d.x);',
      '  float w = mix(aW.x, aW.y, aSE.y);',
      '  float minW = uPx * 1.4;',
      '  float wE = max(w, minW);',
      '  vCov = clamp(w / minW, 0.0, 1.0);',
      '  vec2 P = mix(A, B, aSE.y) + n * aSE.x * wE * 0.5 + d * (aSE.y * 2.0 - 1.0) * wE * 0.35;',
      '  vSide = aSE.x;',
      '  vTone = aTone;',
      '  gl_Position = projectionMatrix * modelViewMatrix * vec4(P, 0.0, 1.0);',
      '}'
    ]).join('\n');

    var strokeFrag = [
      'precision highp float;',
      'uniform vec3 uInk;',
      'uniform vec3 uFar;',
      'varying float vSide;',
      'varying float vTone;',
      'varying float vCov;',
      'void main() {',
      '  float edge = smoothstep(1.0, 0.45, abs(vSide));',
      '  float a = edge * vCov * (0.35 + 0.65 * vTone);',
      '  vec3 c = mix(uFar, uInk, vTone);',
      '  gl_FragColor = vec4(c, a);',
      '}'
    ].join('\n');

    var flowerVert = [
      'precision highp float;',
      'attribute vec2 aBase;',
      'attribute vec2 aTip;',
      'attribute float aBendTip;',
      'attribute float aSize;',
      'attribute float aKind;',
      'attribute float aTone;',
      'uniform float uTime;',
      'uniform float uWind;',
      'uniform float uXScale;',
      'uniform float uX0;',
      'uniform float uPx;',
      'varying float vKind;',
      'varying float vTone;'
    ].concat(WIND).concat([
      'void main() {',
      '  vec2 base = vec2(aBase.x * uXScale + uX0, aBase.y);',
      '  vec2 P = base + aTip + disp(aTip, aBendTip, base.x);',
      '  vKind = aKind;',
      '  vTone = aTone;',
      '  gl_PointSize = max(aSize / uPx, 2.0);',
      '  gl_Position = projectionMatrix * modelViewMatrix * vec4(P, 0.0, 1.0);',
      '}'
    ]).join('\n');

    var flowerFrag = [
      'precision highp float;',
      'uniform vec3 uInk;',
      'uniform vec3 uFar;',
      'uniform vec3 uRed;',
      'varying float vKind;',
      'varying float vTone;',
      'void main() {',
      '  vec2 q = gl_PointCoord * 2.0 - 1.0;',
      '  q.y = -q.y;',
      '  vec3 ink = mix(uFar, uInk, vTone);',
      '  vec3 col = ink;',
      '  float a = 0.0;',
      '  if (vKind < 0.5) {',
      '    float r = length(vec2(q.x * 2.6, (q.y - 0.1) * 1.2));',
      '    a = smoothstep(0.95, 0.7, r);',
      '  } else if (vKind < 1.5) {',
      '    for (int i = 0; i < 7; i++) {',
      '      float ang = -1.2 + float(i) * 0.4;',
      '      vec2 c = vec2(sin(ang), cos(ang) - 0.35) * 0.6;',
      '      a = max(a, smoothstep(0.24, 0.12, length(q - c)));',
      '    }',
      '    a *= 0.85;',
      '  } else {',
      '    float ang = atan(q.y, q.x);',
      '    float r = length(q) * (1.0 + 0.09 * cos(ang * 5.0));',
      '    a = smoothstep(0.85, 0.72, r);',
      '    float core = smoothstep(0.26, 0.16, length(q));',
      '    col = mix(uRed * (0.92 + 0.12 * q.y), uInk, core);',
      '    ink = col;',
      '  }',
      '  a *= (0.35 + 0.65 * vTone);',
      '  if (a < 0.01) discard;',
      '  gl_FragColor = vec4(col, a);',
      '}'
    ].join('\n');

    var backVert = [
      'precision highp float;',
      'void main() {',
      '  gl_Position = vec4(position.xy, 0.0, 1.0);',
      '}'
    ].join('\n');

    /* paper, ground and haze tones are the site's mist and soft lavender */
    var backFrag = [
      'precision highp float;',
      'uniform vec2 uRes;',
      'uniform vec2 uView;',
      'uniform vec2 uSun;',
      'uniform vec2 uRoot;',
      'uniform vec3 uRed;',
      'uniform float uTime;',
      'float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }',
      'float noise(vec2 p) {',
      '  vec2 i = floor(p); vec2 f = fract(p);',
      '  f = f * f * (3.0 - 2.0 * f);',
      '  float a = hash(i), b = hash(i + vec2(1.0, 0.0));',
      '  float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));',
      '  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);',
      '}',
      'float fbm(vec2 p) {',
      '  float s = 0.0, a = 0.5;',
      '  for (int i = 0; i < 4; i++) { s += a * noise(p); p = p * 2.03 + 17.1; a *= 0.5; }',
      '  return s;',
      '}',
      'void main() {',
      '  vec2 uv = gl_FragCoord.xy / uRes;',
      '  vec2 wp = vec2((uv.x * 2.0 - 1.0) * uView.x, uv.y * uView.y);',
      '  vec3 paper = vec3(0.957, 0.957, 0.973);',
      '  float blot = fbm(wp * 0.18 + vec2(uTime * 0.006, 0.0));',
      '  paper *= 0.982 + 0.03 * blot;',
      '  float gy = smoothstep(3.6, 0.0, wp.y);',
      '  paper = mix(paper, vec3(0.910, 0.914, 0.945), gy * 0.6);',
      '  float hz = exp(-pow((wp.y - 2.95) / 0.35, 2.0));',
      '  paper = mix(paper, vec3(0.890, 0.894, 0.930), hz * 0.25);',
      '  vec2 sd = wp - uSun;',
      '  float r = length(sd);',
      '  float edge = 1.5 + 0.06 * (fbm(wp * 1.4) - 0.5);',
      '  float sun = smoothstep(edge, edge - 0.035, r);',
      '  float wash = 0.88 + 0.16 * fbm(wp * 0.9 + 3.0) - 0.05 * (sd.y / 1.5);',
      '  paper = mix(paper, uRed * wash, sun * 0.75);',
      '  float halo = exp(-pow(max(r - 1.5, 0.0) / 0.5, 2.0)) * (1.0 - sun);',
      '  paper = mix(paper, uRed, halo * 0.08);',
      '  vec2 rd = wp - uRoot;',
      '  float sh = exp(-(rd.x * rd.x) / (2.2 * 2.2) - (rd.y * rd.y) / (0.16 * 0.16));',
      '  paper *= 1.0 - sh * 0.1;',
      '  float gr = hash(floor(gl_FragCoord.xy));',
      '  paper -= (gr - 0.5) * 0.022;',
      '  vec2 vc = uv - 0.5;',
      '  paper *= 1.0 - dot(vc, vc) * 0.07;',
      '  gl_FragColor = vec4(paper, 1.0);',
      '}'
    ].join('\n');

    /* ---------- stroke geometry builder ---------- */
    var CORN = [[-1, 0], [1, 0], [-1, 1], [-1, 1], [1, 0], [1, 1]];
    function newBuf() { return { A: [], B: [], W: [], SE: [], BD: [], T: [], BS: [] }; }
    function quad(g, ax, ay, bx, by, wa, wb, ba, bb, tone, sx, sy) {
      for (var c = 0; c < 6; c++) {
        g.A.push(ax, ay); g.B.push(bx, by); g.W.push(wa, wb);
        g.SE.push(CORN[c][0], CORN[c][1]); g.BD.push(ba, bb);
        g.T.push(tone); g.BS.push(sx, sy);
      }
    }
    function strokeGeo(g) {
      var n = g.T.length;
      var geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
      geo.setAttribute('aA', new THREE.BufferAttribute(new Float32Array(g.A), 2));
      geo.setAttribute('aB', new THREE.BufferAttribute(new Float32Array(g.B), 2));
      geo.setAttribute('aW', new THREE.BufferAttribute(new Float32Array(g.W), 2));
      geo.setAttribute('aSE', new THREE.BufferAttribute(new Float32Array(g.SE), 2));
      geo.setAttribute('aBend', new THREE.BufferAttribute(new Float32Array(g.BD), 2));
      geo.setAttribute('aTone', new THREE.BufferAttribute(new Float32Array(g.T), 1));
      geo.setAttribute('aBase', new THREE.BufferAttribute(new Float32Array(g.BS), 2));
      disposables.push(geo);
      return geo;
    }
    function strokeMat(ink, far, xScale, x0) {
      var m = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 }, uWind: { value: windAmt },
          uXScale: { value: xScale }, uX0: { value: x0 }, uPx: { value: 0.01 },
          uInk: { value: new THREE.Color(ink[0], ink[1], ink[2]) },
          uFar: { value: new THREE.Color(far[0], far[1], far[2]) }
        },
        vertexShader: strokeVert,
        fragmentShader: strokeFrag,
        transparent: true, depthTest: false, depthWrite: false, side: THREE.DoubleSide
      });
      disposables.push(m);
      return m;
    }

    /* ---------- the meadow ---------- */
    var grass = newBuf();
    var fl = { base: [], tip: [], bend: [], size: [], kind: [], tone: [] };
    var SEG = 4;
    for (var i = 0; i < density; i++) {
      var u = (i + rnd()) / density;
      var f = Math.pow(u, 1.8);
      var by = 2.9 - 2.35 * f;
      var sc = 0.25 + 0.75 * f;
      var xn = rnd() * 2 - 1;
      var stem = rnd() < 0.22;
      var h = (0.9 + 0.5 * rnd()) * 2.0 * sc * (stem ? 1.2 : 1.0);
      var lean = (rnd() - 0.5) * (stem ? 0.4 : 0.9);
      var wb = (0.035 + 0.02 * rnd()) * sc;
      var tone = 0.2 + 0.75 * f;
      var flex = stem ? 0.4 : 0.32;
      var px = 0, py = 0, pw = stem ? wb * 0.3 : wb, pb = 0;
      for (var k = 1; k <= SEG; k++) {
        var s = k / SEG;
        var qx = lean * s * s * h * 0.45;
        var qy = h * s * (1 - 0.08 * lean * lean * s);
        var qw = stem ? wb * 0.3 * (1 - 0.4 * s) : wb * (1 - s);
        var qb = s * s * h * flex;
        quad(grass, px, py, qx, qy, pw, qw, pb, qb, tone, xn, by);
        px = qx; py = qy; pw = qw; pb = qb;
      }
      if (stem) {
        var kr = rnd();
        var kind = (kr < 0.45) ? 0 : (kr < 0.8 ? 1 : 2);
        if (kind === 2 && f < 0.35) kind = 1;
        var size = (kind === 0 ? 0.075 : (kind === 1 ? 0.16 : 0.17)) * sc * (0.85 + 0.3 * rnd());
        fl.base.push(xn, by); fl.tip.push(px, py); fl.bend.push(pb);
        fl.size.push(size); fl.kind.push(kind); fl.tone.push(kind === 2 ? 0.5 + 0.5 * f : tone);
      }
    }
    var grassMat = strokeMat(INK, FAR, 8, 0);
    var grassMesh = new THREE.Mesh(strokeGeo(grass), grassMat);
    grassMesh.frustumCulled = false;
    grassMesh.renderOrder = 1;
    scene.add(grassMesh);

    var fn = fl.kind.length;
    var flGeo = new THREE.BufferGeometry();
    flGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(Math.max(fn, 1) * 3), 3));
    flGeo.setAttribute('aBase', new THREE.BufferAttribute(new Float32Array(fl.base), 2));
    flGeo.setAttribute('aTip', new THREE.BufferAttribute(new Float32Array(fl.tip), 2));
    flGeo.setAttribute('aBendTip', new THREE.BufferAttribute(new Float32Array(fl.bend), 1));
    flGeo.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(fl.size), 1));
    flGeo.setAttribute('aKind', new THREE.BufferAttribute(new Float32Array(fl.kind), 1));
    flGeo.setAttribute('aTone', new THREE.BufferAttribute(new Float32Array(fl.tone), 1));
    flGeo.setDrawRange(0, fn);
    disposables.push(flGeo);
    var flMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 }, uWind: { value: windAmt },
        uXScale: { value: 8 }, uX0: { value: 0 }, uPx: { value: 0.01 },
        uInk: { value: new THREE.Color(INK[0], INK[1], INK[2]) },
        uFar: { value: new THREE.Color(FAR[0], FAR[1], FAR[2]) },
        uRed: { value: new THREE.Color(PETUNIA[0], PETUNIA[1], PETUNIA[2]) }
      },
      vertexShader: flowerVert,
      fragmentShader: flowerFrag,
      transparent: true, depthTest: false, depthWrite: false
    });
    disposables.push(flMat);
    var flPoints = new THREE.Points(flGeo, flMat);
    flPoints.frustumCulled = false;
    flPoints.renderOrder = 2;
    scene.add(flPoints);

    /* ---------- the tree (L-system: fork, shrink, lean) ---------- */
    var tree = newBuf();
    var LEVELS = 9, WR = 0.68;
    function bendT(lv) { return Math.pow(lv / LEVELS, 2.2) * 0.55; }
    function branch(x, y, ang, len, wid, lvl) {
      var a = ang, px2 = x, py2 = y;
      for (var k2 = 0; k2 < 3; k2++) {
        a += (rnd() - 0.5) * 0.12;
        a *= 0.97;
        var l = len / 3;
        var qx2 = px2 + Math.sin(a) * l;
        var qy2 = py2 + Math.cos(a) * l;
        var wA = wid * (1 - (k2 / 3) * (1 - WR));
        var wB = wid * (1 - ((k2 + 1) / 3) * (1 - WR));
        quad(tree, px2, py2, qx2, qy2, wA, wB, bendT(lvl + k2 / 3), bendT(lvl + (k2 + 1) / 3), 1, 0, TREE_Y);
        px2 = qx2; py2 = qy2;
      }
      if (lvl >= LEVELS - 1) return;
      var lean = (rnd() - 0.5) * 0.24;
      var cl = len * (0.7 + 0.12 * rnd());
      var cw = wid * WR;
      branch(px2, py2, a - FORK * (0.7 + 0.6 * rnd()) + lean, cl, cw, lvl + 1);
      branch(px2, py2, a + FORK * (0.7 + 0.6 * rnd()) + lean, cl * (0.9 + 0.1 * rnd()), cw, lvl + 1);
      if (lvl < 3 && rnd() < 0.3) {
        branch(px2, py2, a + (rnd() - 0.5) * 0.3, cl * 0.85, cw * 0.9, lvl + 1);
      }
    }
    var ts = treeScale;
    quad(tree, -0.16 * ts, -0.02, 0, 0.35 * ts, 0.12 * ts, 0.05 * ts, 0, 0, 1, 0, TREE_Y);
    quad(tree, 0.17 * ts, -0.02, 0, 0.3 * ts, 0.1 * ts, 0.04 * ts, 0, 0, 1, 0, TREE_Y);
    branch(0, 0, -0.04, 2.3 * ts, 0.34 * ts, 0);
    /* a tree on the left is drawn mirrored, so it leans the other way */
    if (side < 0) {
      for (var mi = 0; mi < tree.A.length; mi += 2) { tree.A[mi] = -tree.A[mi]; tree.B[mi] = -tree.B[mi]; }
    }
    var treeMat = strokeMat(TREE, TREE, 0, 4);
    var treeMesh = new THREE.Mesh(strokeGeo(tree), treeMat);
    treeMesh.frustumCulled = false;
    treeMesh.renderOrder = 3;
    scene.add(treeMesh);

    /* ---------- paper and sun ---------- */
    var backGeo = new THREE.PlaneGeometry(2, 2);
    disposables.push(backGeo);
    var backMat = new THREE.ShaderMaterial({
      uniforms: {
        uRes: { value: new THREE.Vector2(W * DPR, H * DPR) },
        uView: { value: new THREE.Vector2(8, 10) },
        uSun: { value: new THREE.Vector2(5, 7.3) },
        uRoot: { value: new THREE.Vector2(4, TREE_Y) },
        uRed: { value: new THREE.Color(sunCol[0], sunCol[1], sunCol[2]) },
        uTime: { value: 0 }
      },
      vertexShader: backVert,
      fragmentShader: backFrag,
      depthTest: false, depthWrite: false
    });
    disposables.push(backMat);
    var back = new THREE.Mesh(backGeo, backMat);
    back.frustumCulled = false;
    back.renderOrder = -1;
    scene.add(back);

    var strokeMats = [grassMat, treeMat, flMat];

    function layout() {
      var aspect = W / Math.max(H, 1);
      viewH = Math.max(10, 12 / aspect);
      halfW = viewH * aspect * 0.5;
      treeX = side * Math.max(Math.min(halfW * 0.48, halfW - 3.6), 0);
      camera.left = -halfW; camera.right = halfW;
      camera.top = viewH; camera.bottom = 0;
      camera.updateProjectionMatrix();
      var px = viewH / Math.max(H * DPR, 1);
      for (var m = 0; m < strokeMats.length; m++) strokeMats[m].uniforms.uPx.value = px;
      grassMat.uniforms.uXScale.value = halfW * 1.08;
      flMat.uniforms.uXScale.value = halfW * 1.08;
      treeMat.uniforms.uXScale.value = 0;
      treeMat.uniforms.uX0.value = treeX;
      backMat.uniforms.uRes.value.set(W * DPR, H * DPR);
      backMat.uniforms.uView.value.set(halfW, viewH);
      backMat.uniforms.uSun.value.set(sunAcross === null ? treeX + side * sunDX : sunAcross * halfW, sunY);
      backMat.uniforms.uRoot.value.set(treeX, TREE_Y);
    }
    layout();

    function render(t) {
      for (var m = 0; m < strokeMats.length; m++) strokeMats[m].uniforms.uTime.value = t;
      backMat.uniforms.uTime.value = t;
      renderer.render(scene, camera);
    }
    function resize(w, h) {
      W = w; H = h;
      renderer.setSize(W, H, false);
      layout();
    }
    function dispose() {
      for (var i = 0; i < disposables.length; i++) { try { disposables[i].dispose(); } catch (e) {} }
      try { renderer.dispose(); } catch (e2) {}
      try { renderer.forceContextLoss(); } catch (e3) {}
    }
    return { render: render, resize: resize, dispose: dispose };
  };

  function mount(host) {
    var canvas = host.querySelector('canvas');
    if (!canvas || !window.THREE) return;
    var probe = null;
    try { probe = document.createElement('canvas').getContext('webgl'); } catch (e) { probe = null; }
    if (!probe) return;                                   /* the CSS fallback stays */
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var W = host.clientWidth || 800, H = host.clientHeight || 450;
    var params = {};
    try { params = JSON.parse(host.getAttribute('data-params') || '{}') || {}; } catch (e0) { params = {}; }
    var scene;
    try {
      scene = FACTORY(THREE, canvas, { width: W, height: H, pixelRatio: window.devicePixelRatio || 1, params: params });
    } catch (e2) { return; }
    host.classList.add('is-live');
    var running = false, raf = 0, last = 0, t = 0, visible = true, shown = true;
    function frame(now) {
      raf = 0;
      if (!running) return;
      var dt = last ? Math.min((now - last) / 1000, 0.1) : 0;   /* a background tab must not jump */
      last = now;
      t += dt;
      scene.render(t);
      raf = requestAnimationFrame(frame);
    }
    function start() {
      if (running || !visible || !shown) return;
      running = true; last = 0;
      if (!raf) raf = requestAnimationFrame(frame);
    }
    function stop() { running = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } }
    if (reduced) { scene.render(0); }                     /* one still frame, no loop */
    else { start(); }
    function resize() {
      var w = host.clientWidth || W, h = host.clientHeight || H;
      if (w === W && h === H) return;
      W = w; H = h; scene.resize(W, H);
      if (reduced) scene.render(0);
    }
    if (window.ResizeObserver) { new ResizeObserver(resize).observe(host); }
    else { window.addEventListener('resize', resize); }
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (es) {
        /* after a quick jump several updates can arrive together; the last one is current */
        shown = es[es.length - 1].isIntersecting; shown ? start() : stop();
      }, { threshold: 0.01 }).observe(host);
    }
    document.addEventListener('visibilitychange', function () {
      visible = !document.hidden; visible ? start() : stop();
    });
    window.addEventListener('pagehide', function () { stop(); scene.dispose(); });
  }

  var hosts = document.querySelectorAll('.billboard');
  for (var i = 0; i < hosts.length; i++) mount(hosts[i]);
})();
