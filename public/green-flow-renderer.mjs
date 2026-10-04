/** A dependency-free, decorative WebGL scene. Returns null when WebGL is unavailable. */
export function createGreenFlow(canvas, { paused = false } = {}) {
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
    preserveDrawingBuffer: false,
  });
  if (!gl) return null;

  const vertexSource = `
    attribute vec2 a_position;
    void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
  `;
  const fragmentSource = `
    precision highp float;
    uniform vec2 u_resolution;
    uniform vec2 u_pointer;
    uniform float u_time;

    mat2 rotate(float a) {
      float s = sin(a), c = cos(a);
      return mat2(c, -s, s, c);
    }

    float strip(vec3 p, float phase, float width) {
      p.xy = rotate(-0.48) * p.xy;
      p.y -= 0.58 * sin(p.x * 0.64 + phase + u_time * 0.16);
      p.z -= 0.38 * cos(p.x * 0.70 + phase - u_time * 0.12);
      p.yz = rotate(p.x * 0.55 + phase + u_time * 0.10) * p.yz;
      vec3 d = abs(p) - vec3(7.5, width, 0.055);
      return (length(max(d, 0.0)) + min(max(d.x, max(d.y, d.z)), 0.0) - 0.045) * 0.62;
    }

    float scene(vec3 p) {
      float a = strip(p - vec3(1.6, 0.15, 0.0), 0.0, 0.60);
      float b = strip(p - vec3(2.1, -1.55, -1.1), 2.5, 0.76);
      float c = strip(p - vec3(-3.4, -2.5, -0.8), 4.2, 0.48);
      return min(a, min(b, c));
    }

    vec3 normal(vec3 p) {
      vec2 e = vec2(0.002, -0.002);
      return normalize(e.xyy * scene(p + e.xyy) + e.yyx * scene(p + e.yyx)
        + e.yxy * scene(p + e.yxy) + e.xxx * scene(p + e.xxx));
    }

    vec3 environment(vec3 direction) {
      float light = pow(max(0.0, dot(direction, normalize(vec3(-0.5, 1.2, 1.3)))), 18.0);
      float rim = pow(max(0.0, dot(direction, normalize(vec3(1.5, 0.3, -0.6)))), 10.0);
      float softbox = pow(max(0.0, dot(direction, normalize(vec3(-0.1, -0.7, 1.2)))), 5.0);
      return vec3(0.025, 0.11, 0.075) + light * vec3(0.56, 0.97, 0.72)
        + rim * vec3(0.14, 0.74, 0.40) + softbox * vec3(0.06, 0.25, 0.16);
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution) / u_resolution.y;
      float glow = exp(-length(uv - vec2(1.25, 0.25)) * 1.1);
      float glow2 = exp(-length(uv - vec2(-1.3, -1.0)) * 1.5);
      vec3 color = vec3(0.006, 0.023, 0.019)
        + glow * vec3(0.012, 0.08, 0.042) + glow2 * vec3(0.006, 0.035, 0.026);

      vec3 origin = vec3(u_pointer * 0.18, 6.5);
      vec3 direction = normalize(vec3(uv * 0.80 - u_pointer * 0.018, -1.8));
      float distance = 0.0;
      bool hit = false;
      for (int i = 0; i < 64; i++) {
        float d = scene(origin + direction * distance);
        if (d < 0.003) { hit = true; break; }
        distance += max(d, 0.006);
        if (distance > 16.0) break;
      }

      if (hit) {
        vec3 p = origin + direction * distance;
        vec3 n = normal(p);
        vec3 reflection = reflect(direction, n);
        float diffuse = max(0.0, dot(n, normalize(vec3(-0.6, 1.2, 1.8))));
        float fresnel = pow(1.0 - max(0.0, dot(n, -direction)), 3.0);
        float sheen = pow(max(0.0, dot(reflection, normalize(vec3(-0.5, 1.2, 1.3)))), 36.0);
        float occlusion = clamp(scene(p + n * 0.20) / 0.12, 0.35, 1.0);
        vec3 jade = mix(vec3(0.008, 0.10, 0.065), vec3(0.018, 0.28, 0.15), diffuse);
        vec3 surface = jade * (0.38 + diffuse * 0.75) * occlusion
          + environment(reflection) * (0.32 + fresnel * 0.48)
          + sheen * vec3(0.46, 0.80, 0.58);
        float fog = 1.0 - exp(-distance * distance * 0.0025);
        color = mix(surface, color, fog);
      }

      vec2 screen = gl_FragCoord.xy / u_resolution;
      float vignette = 1.0 - smoothstep(0.24, 0.85, length(screen - 0.5));
      color *= 0.62 + vignette * 0.38;
      color = pow(color, vec3(0.90));
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  let vertex, fragment, program, buffer;
  const release = () => {
    if (buffer) gl.deleteBuffer(buffer);
    if (program) gl.deleteProgram(program);
    if (vertex) gl.deleteShader(vertex);
    if (fragment) gl.deleteShader(fragment);
  };
  const compile = (type, source) => {
    const shader = gl.createShader(type);
    if (!shader) throw new Error("Unable to allocate shader");
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      throw new Error("Unable to compile background shader");
    }
    return shader;
  };
  try {
    vertex = compile(gl.VERTEX_SHADER, vertexSource);
    fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    program = gl.createProgram();
    if (!program) throw new Error("Unable to allocate program");
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("Unable to link program");
    buffer = gl.createBuffer();
    if (!buffer) throw new Error("Unable to allocate buffer");
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    gl.useProgram(program);
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  } catch {
    release();
    return null;
  }

  const resolution = gl.getUniformLocation(program, "u_resolution");
  const time = gl.getUniformLocation(program, "u_time");
  const pointer = gl.getUniformLocation(program, "u_pointer");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const coarsePointer = window.matchMedia("(pointer: coarse)");
  let frame = 0;
  let disposed = false;
  let contextLost = false;
  let visible = true;
  let elapsed = 12;
  let previous = 0;
  let quality = 1;
  let slowFrames = 0;
  let px = 0, py = 0, targetX = 0, targetY = 0;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 1.35);
    const budget = coarsePointer.matches ? 420000 : 850000;
    const scale = Math.min(ratio, Math.sqrt(budget / Math.max(1, rect.width * rect.height))) * quality;
    const width = Math.max(1, Math.round(rect.width * scale));
    const height = Math.max(1, Math.round(rect.height * scale));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  };
  const draw = () => {
    if (disposed || contextLost) return;
    gl.uniform2f(resolution, canvas.width, canvas.height);
    gl.uniform1f(time, elapsed);
    gl.uniform2f(pointer, px, py);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    canvas.dataset.ready = "true";
  };
  const canAnimate = () => !disposed && !contextLost && !paused && visible && !document.hidden && !reducedMotion.matches;
  const tick = (now) => {
    frame = 0;
    if (!canAnimate()) { previous = 0; return; }
    const delta = previous ? Math.min((now - previous) / 1000, 0.05) : 0;
    if (previous && now - previous > 28) slowFrames++;
    else slowFrames = Math.max(0, slowFrames - 1);
    if (slowFrames > 45 && quality > 0.65) {
      quality = Math.max(0.65, quality - 0.15);
      slowFrames = 0;
      resize();
    }
    previous = now;
    elapsed += delta;
    const blend = 1.0 - Math.exp(-delta * 3.0);
    px += (targetX - px) * blend;
    py += (targetY - py) * blend;
    draw();
    frame = requestAnimationFrame(tick);
  };
  const sync = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    previous = 0;
    if (disposed || contextLost) return;
    resize();
    draw();
    if (canAnimate()) frame = requestAnimationFrame(tick);
  };
  const onPointer = (event) => {
    if (coarsePointer.matches || reducedMotion.matches || paused || event.pointerType === "touch") return;
    const rect = canvas.getBoundingClientRect();
    targetX = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1));
    targetY = Math.max(-1, Math.min(1, 1 - ((event.clientY - rect.top) / Math.max(1, rect.height)) * 2));
  };
  const resetPointer = () => { targetX = 0; targetY = 0; };
  const onContextLost = (event) => {
    event.preventDefault();
    contextLost = true;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    delete canvas.dataset.ready;
  };
  // Keep the CSS fallback visible if a GPU context is lost; remount to retry.
  const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(sync) : null;
  const intersection = typeof IntersectionObserver !== "undefined"
    ? new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }) : null;
  observer?.observe(canvas);
  intersection?.observe(canvas);
  window.addEventListener("resize", sync, { passive: true });
  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("blur", resetPointer);
  document.documentElement.addEventListener("pointerleave", resetPointer);
  document.addEventListener("visibilitychange", sync);
  reducedMotion.addEventListener("change", sync);
  canvas.addEventListener("webglcontextlost", onContextLost);
  sync();

  return {
    setPaused(value) { paused = value; sync(); },
    destroy() {
      if (disposed) return;
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      observer?.disconnect();
      intersection?.disconnect();
      window.removeEventListener("resize", sync);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("blur", resetPointer);
      document.documentElement.removeEventListener("pointerleave", resetPointer);
      document.removeEventListener("visibilitychange", sync);
      reducedMotion.removeEventListener("change", sync);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      delete canvas.dataset.ready;
      release();
    },
  };
}
