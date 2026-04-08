<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  let { imageSrc = "", class: className = "" } = $props();

  let canvas: HTMLCanvasElement;
  let gl: WebGLRenderingContext;
  let program: WebGLProgram;
  let animId: number;
  let uniforms: Record<string, WebGLUniformLocation | null> = {};
  let t0 = 0;

  let mouse = { x: 0.5, y: 0.5 };
  let target = { x: 0.5, y: 0.5 };
  let hasMouse = $state(false);
  let hasMousFloat = 0; // smooth 0..1
  let leaveTimer = 0;

  // ── Vertex shader ────────────────────────────────────────────────────────
  const VS = `
    attribute vec2 a_pos;
    varying vec2 v_uv;
    void main() {
      v_uv = a_pos * 0.5 + 0.5;
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
  `;

  // ── Fragment shader ──────────────────────────────────────────────────────
  const FS = `
    precision highp float;

    uniform sampler2D u_tex;
    uniform vec2  u_mouse;
    uniform float u_time;
    uniform vec2  u_res;
    uniform float u_has_mouse; // 0..1

    varying vec2 v_uv;

    /* ── Hash & noise ──────────────────────────────────────────────────── */
    float hash(vec2 p) {
      p = fract(p * vec2(234.34, 435.345));
      p += dot(p, p + 34.23);
      return fract(p.x * p.y);
    }

    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i),            hash(i + vec2(1,0)), f.x),
        mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x),
        f.y
      );
    }

    float fbm(vec2 p) {
      float v = 0.0, a = 0.5;
      for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p  = p * 2.17 + vec2(1.3, 2.7);
        a *= 0.5;
      }
      return v;
    }

    /* ── Painting palette ─────────────────────────────────────────────── */
    // Maps a 0..1 luminance to a vivid warm oil-painting colour scale:
    //   shadows  → deep sepia brown
    //   darks    → rich terracotta
    //   mids     → brand terracotta #c96442
    //   lights   → warm coral / salmon
    //   whites   → warm ivory #faf9f5
    vec3 palette(float l) {
      vec3 c0 = vec3(0.08, 0.04, 0.02);   // deep sepia shadow
      vec3 c1 = vec3(0.42, 0.14, 0.06);   // dark terracotta
      vec3 c2 = vec3(0.79, 0.39, 0.26);   // brand #c96442
      vec3 c3 = vec3(0.91, 0.60, 0.42);   // warm coral
      vec3 c4 = vec3(0.98, 0.93, 0.84);   // ivory highlight

      if (l < 0.25) return mix(c0, c1, l * 4.0);
      if (l < 0.50) return mix(c1, c2, (l - 0.25) * 4.0);
      if (l < 0.75) return mix(c2, c3, (l - 0.50) * 4.0);
      return            mix(c3, c4, (l - 0.75) * 4.0);
    }

    void main() {
      vec2  uv     = v_uv;
      float t      = u_time;
      float aspect = u_res.x / u_res.y;

      /* ── Sample & luminance ───────────────────────────────────────────── */
      vec4  raw = texture2D(u_tex, uv);
      float lum = dot(raw.rgb, vec3(0.2126, 0.7152, 0.0722));

      /* ── B&W layer  (warm aged-paper tint, mild contrast) ─────────────── */
      vec3 bw = vec3(lum) * vec3(1.04, 1.00, 0.93); // slight sepia
      bw = (bw - 0.5) * 1.08 + 0.5;                 // micro-contrast

      /* ── Painted layer ─────────────────────────────────────────────────── */
      vec3 painted = palette(lum);
      // Brush-stroke texture via FBM bump
      float brushTex = fbm(uv * 14.0 + vec2(t * 0.04, 0.0)) * 0.05 - 0.025;
      painted = clamp(painted + brushTex, 0.0, 1.0);

      /* ── Reveal position ───────────────────────────────────────────────── */
      // Idle: gentle drift so the canvas always breathes
      float ix = 0.5 + 0.07 * sin(t * 0.29 + 1.0);
      float iy = 0.5 + 0.05 * sin(t * 0.41 + 2.5);
      vec2 revealPt = mix(vec2(ix, iy), u_mouse, u_has_mouse);

      /* ── Distance (aspect-corrected) ───────────────────────────────────── */
      vec2  d    = (uv - revealPt) * vec2(aspect, 1.0);
      float dist = length(d);

      /* ── Organic edge via FBM ──────────────────────────────────────────── */
      float angle  = atan(d.y, d.x);
      float wobble = fbm(vec2(angle * 2.3 + t * 0.06, dist * 5.0)) * 0.022;

      float innerR = mix(0.06, 0.21, u_has_mouse);
      float outerR = innerR + 0.09;

      float mask = 1.0 - smoothstep(innerR - wobble, outerR + wobble * 0.5, dist);
      // Soft inner highlight (glow at the very centre of reveal)
      float innerGlow = smoothstep(innerR * 0.7, 0.0, dist) * 0.06;
      painted += innerGlow;

      /* ── Chromatic aberration at the transition ring ───────────────────── */
      float edgeZone = smoothstep(outerR + 0.02, innerR + 0.01, dist)
                     * smoothstep(innerR - 0.01, outerR + 0.02, dist);
      float caAmt    = edgeZone * 0.006;
      vec2  caDir    = normalize(d + 1e-5) * caAmt;
      float rL = dot(texture2D(u_tex, uv + caDir).rgb,      vec3(0.2126, 0.7152, 0.0722));
      float bL = dot(texture2D(u_tex, uv - caDir).rgb,      vec3(0.2126, 0.7152, 0.0722));
      vec3  bwCA = vec3(rL, lum, bL) * vec3(1.04, 1.00, 0.93);

      /* ── Compose ───────────────────────────────────────────────────────── */
      vec3 col = mix(bwCA, painted, mask);

      /* ── Film grain ────────────────────────────────────────────────────── */
      float grain = (hash(uv * 937.7 + fract(t * 0.4)) - 0.5) * 0.028;
      col += grain;

      /* ── Vignette ──────────────────────────────────────────────────────── */
      vec2  vc  = uv * 2.0 - 1.0;
      float vig = 1.0 - smoothstep(0.55, 1.4, length(vc * vec2(0.7, 0.85)));
      col *= 0.60 + 0.40 * vig;

      gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `;

  // ── WebGL helpers ────────────────────────────────────────────────────────
  function makeShader(type: number, src: string): WebGLShader {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      throw new Error("Shader: " + gl.getShaderInfoLog(s));
    }
    return s;
  }

  function initWebGL(): boolean {
    gl = (canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext;
    if (!gl) return false;

    const vs = makeShader(gl.VERTEX_SHADER, VS);
    const fs = makeShader(gl.FRAGMENT_SHADER, FS);

    program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error("Link: " + gl.getProgramInfoLog(program));
    }
    gl.useProgram(program);

    // Full-screen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const posLoc = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Cache uniform locations
    uniforms = {
      tex:      gl.getUniformLocation(program, "u_tex"),
      mouse:    gl.getUniformLocation(program, "u_mouse"),
      time:     gl.getUniformLocation(program, "u_time"),
      res:      gl.getUniformLocation(program, "u_res"),
      hasMouse: gl.getUniformLocation(program, "u_has_mouse"),
    };
    return true;
  }

  async function loadTexture(src: string): Promise<WebGLTexture> {
    // fetch → blob → ImageBitmap avoids crossOrigin/CORS issues with Vite dev
    const res = await fetch(src);
    const blob = await res.blob();
    const bitmap = await createImageBitmap(blob);

    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    // WebGL 1: NPOT textures require CLAMP_TO_EDGE + LINEAR (no mipmaps)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmap as unknown as ImageData);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    bitmap.close();
    return tex;
  }

  // ── Render loop ──────────────────────────────────────────────────────────
  let lastW = 0,
    lastH = 0;

  function tick() {
    const now = (Date.now() - t0) / 1000;
    const lp = 0.075;

    // Smooth mouse
    mouse.x += (target.x - mouse.x) * lp;
    mouse.y += (target.y - mouse.y) * lp;

    // Smooth has-mouse float
    hasMousFloat += ((hasMouse ? 1 : 0) - hasMousFloat) * 0.04;

    // Resize canvas to device pixel ratio
    const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);
    if (w !== lastW || h !== lastH) {
      canvas.width = lastW = w;
      canvas.height = lastH = h;
      gl.viewport(0, 0, w, h);
    }

    gl.uniform2f(uniforms.mouse!, mouse.x, mouse.y);
    gl.uniform1f(uniforms.time!, now);
    gl.uniform2f(uniforms.res!, canvas.width, canvas.height);
    gl.uniform1i(uniforms.tex!, 0);
    gl.uniform1f(uniforms.hasMouse!, hasMousFloat);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    animId = requestAnimationFrame(tick);
  }

  // ── Event handlers ───────────────────────────────────────────────────────
  function onMove(clientX: number, clientY: number) {
    hasMouse = true;
    clearTimeout(leaveTimer);
    const rect = canvas.getBoundingClientRect();
    target.x = (clientX - rect.left) / rect.width;
    target.y = 1.0 - (clientY - rect.top) / rect.height;
  }

  function onMouseMove(e: MouseEvent) {
    onMove(e.clientX, e.clientY);
  }

  function onMouseLeave() {
    leaveTimer = window.setTimeout(() => {
      hasMouse = false;
    }, 1800);
  }

  function onTouchMove(e: TouchEvent) {
    e.preventDefault();
    const t = e.touches[0];
    onMove(t.clientX, t.clientY);
  }

  // ── Lifecycle ────────────────────────────────────────────────────────────
  onMount(async () => {
    t0 = Date.now();
    try {
      if (!initWebGL()) return;
      const tex = await loadTexture(imageSrc);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      tick();
    } catch (err) {
      console.error("[HeroShader]", err);
    }

    window.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
  });

  onDestroy(() => {
    cancelAnimationFrame(animId);
    clearTimeout(leaveTimer);
    window.removeEventListener("mousemove", onMouseMove);
  });
</script>

<canvas bind:this={canvas} class={className}></canvas>
