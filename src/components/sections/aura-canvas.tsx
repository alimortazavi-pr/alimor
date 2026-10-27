"use client";

import { useEffect, useRef } from "react";

import { useMotionPreference } from "@/components/providers/motion-preference";

const VERTEX = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

// Domain-warped noise: two layers of fbm feed each other, then a palette maps the result to ink,
// violet, ember and a thin line of acid lime. The pointer bends the field around it.
const FRAGMENT = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + 11.7; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uTime * 0.06;

  vec2 m = (uPointer - 0.5) * vec2(uRes.x / uRes.y, 1.0);
  float pull = exp(-3.5 * length(p - m));
  p += (p - m) * pull * 0.35;

  vec2 q = vec2(fbm(p * 1.6 + t), fbm(p * 1.6 - t + 4.2));
  vec2 r = vec2(fbm(p * 1.4 + 2.5 * q + vec2(1.7, 9.2) + t * 1.4), fbm(p * 1.4 + 2.5 * q + vec2(8.3, 2.8) - t));
  float f = fbm(p * 1.2 + 3.0 * r);

  vec3 ink = vec3(0.027, 0.027, 0.035);
  vec3 violet = vec3(0.30, 0.20, 0.85);
  vec3 ember = vec3(0.95, 0.35, 0.18);
  vec3 lime = vec3(0.83, 1.0, 0.25);

  vec3 col = mix(ink, violet, smoothstep(0.35, 0.95, f) * 0.85);
  col = mix(col, ember, smoothstep(0.55, 1.0, length(q) * 0.9) * 0.55);
  col += lime * smoothstep(0.012, 0.0, abs(f - 0.62)) * 0.35;
  col += violet * pull * 0.25;

  // Fade toward the edges and the bottom so the content below reads cleanly
  float vignette = smoothstep(1.25, 0.2, length((uv - vec2(0.5, 0.62)) * vec2(1.1, 1.5)));
  col = mix(ink, col, vignette * smoothstep(0.0, 0.35, uv.y));
  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

// Low-power phones and "reduced motion" get the CSS gradient underneath instead of the shader
function canAfford(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number };
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return false;
  return (navigator.hardwareConcurrency ?? 8) >= 4;
}

export function AuraCanvas() {
  const { enabled } = useMotionPreference();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!enabled || !canvas || !canAfford()) return;
    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "uRes");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uPointer = gl.getUniformLocation(program, "uPointer");

    // The field is soft, so rendering it at half resolution is invisible and saves most of the cost
    const scale = Math.min(window.devicePixelRatio, 1.5) * 0.5;
    const resize = () => {
      canvas.width = Math.max(1, Math.floor(canvas.clientWidth * scale));
      canvas.height = Math.max(1, Math.floor(canvas.clientHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const target = { x: 0.5, y: 0.6 };
    const pointer = { x: 0.5, y: 0.6 };
    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      target.x = (event.clientX - rect.left) / rect.width;
      target.y = 1 - (event.clientY - rect.top) / rect.height;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
    });
    io.observe(canvas);

    let frame = 0;
    const start = performance.now();
    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      if (!visible || document.hidden) return;
      pointer.x += (target.x - pointer.x) * 0.04;
      pointer.y += (target.y - pointer.y) * 0.04;
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uPointer, pointer.x, pointer.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      canvas.dataset.ready = "true";
    };
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      delete canvas.dataset.ready;
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
    };
  }, [enabled]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Still fallback, visible until the shader paints its first frame */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_30%_45%,rgb(123_92_255/0.35),transparent_70%),radial-gradient(45%_40%_at_75%_60%,rgb(255_107_61/0.22),transparent_70%)]" />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 size-full opacity-0 transition-opacity duration-[1.6s] data-[ready=true]:opacity-100"
      />
      <div className="from-background absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t to-transparent" />
    </div>
  );
}
