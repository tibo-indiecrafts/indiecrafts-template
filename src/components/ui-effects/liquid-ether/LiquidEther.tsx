/* eslint-disable @typescript-eslint/no-explicit-any -- LiquidEther is a port of a third-party WebGL fluid sim. The internal ShaderPass / Simulation / Output classes use heterogeneous uniform bags (each uniform's `value` is shader-specific: numbers, vectors, textures, booleans). Typing each one precisely would add hundreds of lines for no runtime benefit; the public React surface (props + return) is fully typed below. */
"use client";

import * as React from "react";
import * as THREE from "three";

export interface LiquidEtherProps {
  mouseForce?: number;
  cursorSize?: number;
  isViscous?: boolean;
  viscous?: number;
  iterationsViscous?: number;
  iterationsPoisson?: number;
  dt?: number;
  BFECC?: boolean;
  resolution?: number;
  isBounce?: boolean;
  colors?: string[];
  style?: React.CSSProperties;
  className?: string;
  autoDemo?: boolean;
  autoSpeed?: number;
  autoIntensity?: number;
  takeoverDuration?: number;
  autoResumeDelay?: number;
  autoRampDuration?: number;
}

interface SimOptions {
  iterations_poisson: number;
  iterations_viscous: number;
  mouse_force: number;
  resolution: number;
  cursor_size: number;
  viscous: number;
  isBounce: boolean;
  dt: number;
  isViscous: boolean;
  BFECC: boolean;
}

const DEFAULT_COLORS = ["#5227FF", "#FF9FFC", "#B497CF"];

const face_vert = `
attribute vec3 position;
uniform vec2 px;
uniform vec2 boundarySpace;
varying vec2 uv;
precision highp float;
void main(){
  vec3 pos = position;
  vec2 scale = 1.0 - boundarySpace * 2.0;
  pos.xy = pos.xy * scale;
  uv = vec2(0.5) + (pos.xy) * 0.5;
  gl_Position = vec4(pos, 1.0);
}
`;

const line_vert = `
attribute vec3 position;
uniform vec2 px;
precision highp float;
varying vec2 uv;
void main(){
  vec3 pos = position;
  uv = 0.5 + pos.xy * 0.5;
  vec2 n = sign(pos.xy);
  pos.xy = abs(pos.xy) - px * 1.0;
  pos.xy *= n;
  gl_Position = vec4(pos, 1.0);
}
`;

const mouse_vert = `
precision highp float;
attribute vec3 position;
attribute vec2 uv;
uniform vec2 center;
uniform vec2 scale;
uniform vec2 px;
varying vec2 vUv;
void main(){
  vec2 pos = position.xy * scale * 2.0 * px + center;
  vUv = uv;
  gl_Position = vec4(pos, 0.0, 1.0);
}
`;

const advection_frag = `
precision highp float;
uniform sampler2D velocity;
uniform float dt;
uniform bool isBFECC;
uniform vec2 fboSize;
uniform vec2 px;
varying vec2 uv;
void main(){
  vec2 ratio = max(fboSize.x, fboSize.y) / fboSize;
  if(isBFECC == false){
    vec2 vel = texture2D(velocity, uv).xy;
    vec2 uv2 = uv - vel * dt * ratio;
    vec2 newVel = texture2D(velocity, uv2).xy;
    gl_FragColor = vec4(newVel, 0.0, 0.0);
  } else {
    vec2 spot_new = uv;
    vec2 vel_old = texture2D(velocity, uv).xy;
    vec2 spot_old = spot_new - vel_old * dt * ratio;
    vec2 vel_new1 = texture2D(velocity, spot_old).xy;
    vec2 spot_new2 = spot_old + vel_new1 * dt * ratio;
    vec2 error = spot_new2 - spot_new;
    vec2 spot_new3 = spot_new - error / 2.0;
    vec2 vel_2 = texture2D(velocity, spot_new3).xy;
    vec2 spot_old2 = spot_new3 - vel_2 * dt * ratio;
    vec2 newVel2 = texture2D(velocity, spot_old2).xy;
    gl_FragColor = vec4(newVel2, 0.0, 0.0);
  }
}
`;

const color_frag = `
precision highp float;
uniform sampler2D velocity;
uniform sampler2D palette;
uniform vec4 bgColor;
varying vec2 uv;
void main(){
  vec2 vel = texture2D(velocity, uv).xy;
  float lenv = clamp(length(vel), 0.0, 1.0);
  vec3 c = texture2D(palette, vec2(lenv, 0.5)).rgb;
  vec3 outRGB = mix(bgColor.rgb, c, lenv);
  float outA = mix(bgColor.a, 1.0, lenv);
  gl_FragColor = vec4(outRGB, outA);
}
`;

const divergence_frag = `
precision highp float;
uniform sampler2D velocity;
uniform float dt;
uniform vec2 px;
varying vec2 uv;
void main(){
  float x0 = texture2D(velocity, uv - vec2(px.x, 0.0)).x;
  float x1 = texture2D(velocity, uv + vec2(px.x, 0.0)).x;
  float y0 = texture2D(velocity, uv - vec2(0.0, px.y)).y;
  float y1 = texture2D(velocity, uv + vec2(0.0, px.y)).y;
  float divergence = (x1 - x0 + y1 - y0) / 2.0;
  gl_FragColor = vec4(divergence / dt);
}
`;

const externalForce_frag = `
precision highp float;
uniform vec2 force;
uniform vec2 center;
uniform vec2 scale;
uniform vec2 px;
varying vec2 vUv;
void main(){
  vec2 circle = (vUv - 0.5) * 2.0;
  float d = 1.0 - min(length(circle), 1.0);
  d *= d;
  gl_FragColor = vec4(force * d, 0.0, 1.0);
}
`;

const poisson_frag = `
precision highp float;
uniform sampler2D pressure;
uniform sampler2D divergence;
uniform vec2 px;
varying vec2 uv;
void main(){
  float p0 = texture2D(pressure, uv + vec2(px.x * 2.0, 0.0)).r;
  float p1 = texture2D(pressure, uv - vec2(px.x * 2.0, 0.0)).r;
  float p2 = texture2D(pressure, uv + vec2(0.0, px.y * 2.0)).r;
  float p3 = texture2D(pressure, uv - vec2(0.0, px.y * 2.0)).r;
  float div = texture2D(divergence, uv).r;
  float newP = (p0 + p1 + p2 + p3) / 4.0 - div;
  gl_FragColor = vec4(newP);
}
`;

const pressure_frag = `
precision highp float;
uniform sampler2D pressure;
uniform sampler2D velocity;
uniform vec2 px;
uniform float dt;
varying vec2 uv;
void main(){
  float step = 1.0;
  float p0 = texture2D(pressure, uv + vec2(px.x * step, 0.0)).r;
  float p1 = texture2D(pressure, uv - vec2(px.x * step, 0.0)).r;
  float p2 = texture2D(pressure, uv + vec2(0.0, px.y * step)).r;
  float p3 = texture2D(pressure, uv - vec2(0.0, px.y * step)).r;
  vec2 v = texture2D(velocity, uv).xy;
  vec2 gradP = vec2(p0 - p1, p2 - p3) * 0.5;
  v = v - gradP * dt;
  gl_FragColor = vec4(v, 0.0, 1.0);
}
`;

const viscous_frag = `
precision highp float;
uniform sampler2D velocity;
uniform sampler2D velocity_new;
uniform float v;
uniform vec2 px;
uniform float dt;
varying vec2 uv;
void main(){
  vec2 old = texture2D(velocity, uv).xy;
  vec2 new0 = texture2D(velocity_new, uv + vec2(px.x * 2.0, 0.0)).xy;
  vec2 new1 = texture2D(velocity_new, uv - vec2(px.x * 2.0, 0.0)).xy;
  vec2 new2 = texture2D(velocity_new, uv + vec2(0.0, px.y * 2.0)).xy;
  vec2 new3 = texture2D(velocity_new, uv - vec2(0.0, px.y * 2.0)).xy;
  vec2 newv = 4.0 * old + v * dt * (new0 + new1 + new2 + new3);
  newv /= 4.0 * (1.0 + v * dt);
  gl_FragColor = vec4(newv, 0.0, 0.0);
}
`;

export function LiquidEther({
  mouseForce = 20,
  cursorSize = 100,
  isViscous = false,
  viscous = 30,
  iterationsViscous = 32,
  iterationsPoisson = 32,
  dt = 0.014,
  BFECC = true,
  resolution = 0.5,
  isBounce = false,
  colors = DEFAULT_COLORS,
  style,
  className,
  autoDemo = true,
  autoSpeed = 0.5,
  autoIntensity = 2.2,
  takeoverDuration = 0.25,
  autoResumeDelay = 1000,
  autoRampDuration = 0.6,
}: Readonly<LiquidEtherProps>): React.ReactElement {
  const mountRef = React.useRef<HTMLDivElement | null>(null);
  const webglRef = React.useRef<any>(null);
  const isVisibleRef = React.useRef(true);

  React.useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const rafRef = { current: null as number | null };
    const resizeRafRef = { current: null as number | null };

    function makePaletteTexture(stops: string[]): THREE.DataTexture {
      const arr =
        Array.isArray(stops) && stops.length > 0
          ? stops.length === 1
            ? [stops[0], stops[0]]
            : stops
          : ["#ffffff", "#ffffff"];
      const w = arr.length;
      const data = new Uint8Array(w * 4);
      for (let i = 0; i < w; i++) {
        const c = new THREE.Color(arr[i]);
        data[i * 4 + 0] = Math.round(c.r * 255);
        data[i * 4 + 1] = Math.round(c.g * 255);
        data[i * 4 + 2] = Math.round(c.b * 255);
        data[i * 4 + 3] = 255;
      }
      const tex = new THREE.DataTexture(data, w, 1, THREE.RGBAFormat);
      tex.magFilter = THREE.LinearFilter;
      tex.minFilter = THREE.LinearFilter;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.generateMipmaps = false;
      tex.needsUpdate = true;
      return tex;
    }
    const paletteTex = makePaletteTexture(colors);
    const bgVec4 = new THREE.Vector4(0, 0, 0, 0);

    class CommonClass {
      width = 0;
      height = 0;
      aspect = 1;
      pixelRatio = 1;
      time = 0;
      delta = 0;
      container: HTMLElement | null = null;
      renderer: THREE.WebGLRenderer | null = null;
      clock: THREE.Clock | null = null;
      init(el: HTMLElement) {
        this.container = el;
        this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        this.resize();
        this.renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
        });
        this.renderer.autoClear = false;
        this.renderer.setClearColor(new THREE.Color(0x000000), 0);
        this.renderer.setPixelRatio(this.pixelRatio);
        this.renderer.setSize(this.width, this.height);
        const c = this.renderer.domElement;
        c.style.width = "100%";
        c.style.height = "100%";
        c.style.display = "block";
        this.clock = new THREE.Clock();
        this.clock.start();
      }
      resize() {
        if (!this.container) return;
        const rect = this.container.getBoundingClientRect();
        this.width = Math.max(1, Math.floor(rect.width));
        this.height = Math.max(1, Math.floor(rect.height));
        this.aspect = this.width / this.height;
        if (this.renderer) this.renderer.setSize(this.width, this.height, false);
      }
      update() {
        if (!this.clock) return;
        this.delta = this.clock.getDelta();
        this.time += this.delta;
      }
    }
    const Common = new CommonClass();

    class MouseClass {
      coords = new THREE.Vector2();
      coords_old = new THREE.Vector2();
      diff = new THREE.Vector2();
      timer: number | null = null;
      container: HTMLElement | null = null;
      docTarget: Document | null = null;
      listenerTarget: Window | null = null;
      isHoverInside = false;
      hasUserControl = false;
      isAutoActive = false;
      autoIntensity = 2.0;
      takeoverActive = false;
      takeoverStartTime = 0;
      takeoverDuration = 0.25;
      takeoverFrom = new THREE.Vector2();
      takeoverTo = new THREE.Vector2();
      onInteract: (() => void) | null = null;
      private _mm = this.onMouseMove.bind(this);
      private _ts = this.onTouchStart.bind(this);
      private _tm = this.onTouchMove.bind(this);
      private _te = () => {
        this.isHoverInside = false;
      };
      private _dl = () => {
        this.isHoverInside = false;
      };
      init(el: HTMLElement) {
        this.container = el;
        this.docTarget = el.ownerDocument;
        const view = this.docTarget?.defaultView ?? window;
        if (!view) return;
        this.listenerTarget = view;
        view.addEventListener("mousemove", this._mm);
        view.addEventListener("touchstart", this._ts, { passive: true });
        view.addEventListener("touchmove", this._tm, { passive: true });
        view.addEventListener("touchend", this._te);
        this.docTarget.addEventListener("mouseleave", this._dl);
      }
      dispose() {
        if (this.listenerTarget) {
          this.listenerTarget.removeEventListener("mousemove", this._mm);
          this.listenerTarget.removeEventListener("touchstart", this._ts);
          this.listenerTarget.removeEventListener("touchmove", this._tm);
          this.listenerTarget.removeEventListener("touchend", this._te);
        }
        this.docTarget?.removeEventListener("mouseleave", this._dl);
        this.listenerTarget = null;
        this.docTarget = null;
        this.container = null;
      }
      private inside(x: number, y: number) {
        if (!this.container) return false;
        const r = this.container.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return false;
        return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
      }
      setCoords(x: number, y: number) {
        if (!this.container) return;
        if (this.timer) window.clearTimeout(this.timer);
        const r = this.container.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        const nx = (x - r.left) / r.width;
        const ny = (y - r.top) / r.height;
        this.coords.set(nx * 2 - 1, -(ny * 2 - 1));
      }
      setNormalized(nx: number, ny: number) {
        this.coords.set(nx, ny);
      }
      onMouseMove(e: MouseEvent) {
        this.isHoverInside = this.inside(e.clientX, e.clientY);
        if (!this.isHoverInside) return;
        this.onInteract?.();
        if (this.isAutoActive && !this.hasUserControl && !this.takeoverActive) {
          if (!this.container) return;
          const r = this.container.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width;
          const ny = (e.clientY - r.top) / r.height;
          this.takeoverFrom.copy(this.coords);
          this.takeoverTo.set(nx * 2 - 1, -(ny * 2 - 1));
          this.takeoverStartTime = performance.now();
          this.takeoverActive = true;
          this.hasUserControl = true;
          this.isAutoActive = false;
          return;
        }
        this.setCoords(e.clientX, e.clientY);
        this.hasUserControl = true;
      }
      onTouchStart(e: TouchEvent) {
        if (e.touches.length !== 1) return;
        const t = e.touches[0];
        this.isHoverInside = this.inside(t.clientX, t.clientY);
        if (!this.isHoverInside) return;
        this.onInteract?.();
        this.setCoords(t.clientX, t.clientY);
        this.hasUserControl = true;
      }
      onTouchMove(e: TouchEvent) {
        if (e.touches.length !== 1) return;
        const t = e.touches[0];
        this.isHoverInside = this.inside(t.clientX, t.clientY);
        if (!this.isHoverInside) return;
        this.onInteract?.();
        this.setCoords(t.clientX, t.clientY);
      }
      update() {
        if (this.takeoverActive) {
          const t =
            (performance.now() - this.takeoverStartTime) / (this.takeoverDuration * 1000);
          if (t >= 1) {
            this.takeoverActive = false;
            this.coords.copy(this.takeoverTo);
            this.coords_old.copy(this.coords);
            this.diff.set(0, 0);
          } else {
            const k = t * t * (3 - 2 * t);
            this.coords.copy(this.takeoverFrom).lerp(this.takeoverTo, k);
          }
        }
        this.diff.subVectors(this.coords, this.coords_old);
        this.coords_old.copy(this.coords);
        if (this.coords_old.x === 0 && this.coords_old.y === 0) this.diff.set(0, 0);
        if (this.isAutoActive && !this.takeoverActive)
          this.diff.multiplyScalar(this.autoIntensity);
      }
    }
    const Mouse = new MouseClass();

    class AutoDriver {
      enabled: boolean;
      speed: number;
      resumeDelay: number;
      rampDurationMs: number;
      active = false;
      current = new THREE.Vector2();
      target = new THREE.Vector2();
      lastTime = performance.now();
      activationTime = 0;
      margin = 0.2;
      mouse: MouseClass;
      manager: WebGLManager;
      private _d = new THREE.Vector2();
      constructor(
        mouse: MouseClass,
        manager: WebGLManager,
        opts: {
          enabled: boolean;
          speed: number;
          resumeDelay: number;
          rampDuration: number;
        },
      ) {
        this.mouse = mouse;
        this.manager = manager;
        this.enabled = opts.enabled;
        this.speed = opts.speed;
        this.resumeDelay = opts.resumeDelay || 3000;
        this.rampDurationMs = (opts.rampDuration || 0) * 1000;
        this.pickNewTarget();
      }
      pickNewTarget() {
        this.target.set(
          (Math.random() * 2 - 1) * (1 - this.margin),
          (Math.random() * 2 - 1) * (1 - this.margin),
        );
      }
      forceStop() {
        this.active = false;
        this.mouse.isAutoActive = false;
      }
      update() {
        if (!this.enabled) return;
        const now = performance.now();
        if (now - this.manager.lastUserInteraction < this.resumeDelay) {
          if (this.active) this.forceStop();
          return;
        }
        if (this.mouse.isHoverInside) {
          if (this.active) this.forceStop();
          return;
        }
        if (!this.active) {
          this.active = true;
          this.current.copy(this.mouse.coords);
          this.lastTime = now;
          this.activationTime = now;
        }
        this.mouse.isAutoActive = true;
        let dtSec = (now - this.lastTime) / 1000;
        this.lastTime = now;
        if (dtSec > 0.2) dtSec = 0.016;
        const dir = this._d.subVectors(this.target, this.current);
        const dist = dir.length();
        if (dist < 0.01) {
          this.pickNewTarget();
          return;
        }
        dir.normalize();
        let ramp = 1;
        if (this.rampDurationMs > 0) {
          const t = Math.min(1, (now - this.activationTime) / this.rampDurationMs);
          ramp = t * t * (3 - 2 * t);
        }
        const step = this.speed * dtSec * ramp;
        const move = Math.min(step, dist);
        this.current.addScaledVector(dir, move);
        this.mouse.setNormalized(this.current.x, this.current.y);
      }
    }

    class ShaderPass {
      props: any;
      uniforms?: Record<string, { value: any }>;
      scene: THREE.Scene | null = null;
      camera: THREE.Camera | null = null;
      material: THREE.RawShaderMaterial | null = null;
      geometry: THREE.BufferGeometry | null = null;
      plane: THREE.Mesh | null = null;
      constructor(props: any) {
        this.props = props ?? {};
        this.uniforms = this.props.material?.uniforms;
      }
      init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.Camera();
        if (this.uniforms) {
          this.material = new THREE.RawShaderMaterial(this.props.material);
          this.geometry = new THREE.PlaneGeometry(2, 2);
          this.plane = new THREE.Mesh(this.geometry, this.material);
          this.scene.add(this.plane);
        }
      }
      render() {
        if (!Common.renderer || !this.scene || !this.camera) return;
        Common.renderer.setRenderTarget(this.props.output ?? null);
        Common.renderer.render(this.scene, this.camera);
        Common.renderer.setRenderTarget(null);
      }
    }

    class Advection extends ShaderPass {
      line!: THREE.LineSegments;
      constructor(s: any) {
        super({
          material: {
            vertexShader: face_vert,
            fragmentShader: advection_frag,
            uniforms: {
              boundarySpace: { value: s.cellScale },
              px: { value: s.cellScale },
              fboSize: { value: s.fboSize },
              velocity: { value: s.src.texture },
              dt: { value: s.dt },
              isBFECC: { value: true },
            },
          },
          output: s.dst,
        });
        this.uniforms = this.props.material.uniforms;
        this.init();
      }
      init() {
        super.init();
        const g = new THREE.BufferGeometry();
        const v = new Float32Array([
          -1, -1, 0, -1, 1, 0, -1, 1, 0, 1, 1, 0, 1, 1, 0, 1, -1, 0, 1, -1, 0, -1, -1, 0,
        ]);
        g.setAttribute("position", new THREE.BufferAttribute(v, 3));
        const m = new THREE.RawShaderMaterial({
          vertexShader: line_vert,
          fragmentShader: advection_frag,
          uniforms: this.uniforms!,
        });
        this.line = new THREE.LineSegments(g, m);
        this.scene!.add(this.line);
      }
      step(opts: { dt: number; isBounce: boolean; BFECC: boolean }) {
        if (!this.uniforms) return;
        this.uniforms.dt.value = opts.dt;
        this.line.visible = opts.isBounce;
        this.uniforms.isBFECC.value = opts.BFECC;
        this.render();
      }
    }

    class ExternalForce extends ShaderPass {
      mouse!: THREE.Mesh;
      constructor(s: any) {
        super({ output: s.dst });
        super.init();
        const m = new THREE.RawShaderMaterial({
          vertexShader: mouse_vert,
          fragmentShader: externalForce_frag,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          uniforms: {
            px: { value: s.cellScale },
            force: { value: new THREE.Vector2() },
            center: { value: new THREE.Vector2() },
            scale: { value: new THREE.Vector2(s.cursor_size, s.cursor_size) },
          },
        });
        this.mouse = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), m);
        this.scene!.add(this.mouse);
      }
      step(opts: { cursor_size: number; mouse_force: number; cellScale: THREE.Vector2 }) {
        const fx = (Mouse.diff.x / 2) * opts.mouse_force;
        const fy = (Mouse.diff.y / 2) * opts.mouse_force;
        const csX = opts.cursor_size * opts.cellScale.x;
        const csY = opts.cursor_size * opts.cellScale.y;
        const cx = Math.min(
          Math.max(Mouse.coords.x, -1 + csX + opts.cellScale.x * 2),
          1 - csX - opts.cellScale.x * 2,
        );
        const cy = Math.min(
          Math.max(Mouse.coords.y, -1 + csY + opts.cellScale.y * 2),
          1 - csY - opts.cellScale.y * 2,
        );
        const u = (this.mouse.material as THREE.RawShaderMaterial).uniforms;
        u.force.value.set(fx, fy);
        u.center.value.set(cx, cy);
        u.scale.value.set(opts.cursor_size, opts.cursor_size);
        this.render();
      }
    }

    class Viscous extends ShaderPass {
      constructor(s: any) {
        super({
          material: {
            vertexShader: face_vert,
            fragmentShader: viscous_frag,
            uniforms: {
              boundarySpace: { value: s.boundarySpace },
              velocity: { value: s.src.texture },
              velocity_new: { value: s.dst_.texture },
              v: { value: s.viscous },
              px: { value: s.cellScale },
              dt: { value: s.dt },
            },
          },
          output: s.dst,
          output0: s.dst_,
          output1: s.dst,
        });
        this.init();
      }
      step(opts: { viscous: number; iterations: number; dt: number }) {
        if (!this.uniforms) return undefined;
        this.uniforms.v.value = opts.viscous;
        let out: any;
        for (let i = 0; i < opts.iterations; i++) {
          const inBuf = i % 2 === 0 ? this.props.output0 : this.props.output1;
          out = i % 2 === 0 ? this.props.output1 : this.props.output0;
          this.uniforms.velocity_new.value = inBuf.texture;
          this.props.output = out;
          this.uniforms.dt.value = opts.dt;
          this.render();
        }
        return out;
      }
    }

    class Divergence extends ShaderPass {
      constructor(s: any) {
        super({
          material: {
            vertexShader: face_vert,
            fragmentShader: divergence_frag,
            uniforms: {
              boundarySpace: { value: s.boundarySpace },
              velocity: { value: s.src.texture },
              px: { value: s.cellScale },
              dt: { value: s.dt },
            },
          },
          output: s.dst,
        });
        this.init();
      }
      step(vel: any) {
        if (this.uniforms && vel) this.uniforms.velocity.value = vel.texture;
        this.render();
      }
    }

    class Poisson extends ShaderPass {
      constructor(s: any) {
        super({
          material: {
            vertexShader: face_vert,
            fragmentShader: poisson_frag,
            uniforms: {
              boundarySpace: { value: s.boundarySpace },
              pressure: { value: s.dst_.texture },
              divergence: { value: s.src.texture },
              px: { value: s.cellScale },
            },
          },
          output: s.dst,
          output0: s.dst_,
          output1: s.dst,
        });
        this.init();
      }
      step(iterations: number) {
        let out: any;
        for (let i = 0; i < iterations; i++) {
          const inBuf = i % 2 === 0 ? this.props.output0 : this.props.output1;
          out = i % 2 === 0 ? this.props.output1 : this.props.output0;
          if (this.uniforms) this.uniforms.pressure.value = inBuf.texture;
          this.props.output = out;
          this.render();
        }
        return out;
      }
    }

    class Pressure extends ShaderPass {
      constructor(s: any) {
        super({
          material: {
            vertexShader: face_vert,
            fragmentShader: pressure_frag,
            uniforms: {
              boundarySpace: { value: s.boundarySpace },
              pressure: { value: s.src_p.texture },
              velocity: { value: s.src_v.texture },
              px: { value: s.cellScale },
              dt: { value: s.dt },
            },
          },
          output: s.dst,
        });
        this.init();
      }
      step(vel: any, pressure: any) {
        if (this.uniforms && vel && pressure) {
          this.uniforms.velocity.value = vel.texture;
          this.uniforms.pressure.value = pressure.texture;
        }
        this.render();
      }
    }

    class Simulation {
      options: SimOptions;
      fbos: Record<string, THREE.WebGLRenderTarget | null> = {
        vel_0: null,
        vel_1: null,
        vel_viscous0: null,
        vel_viscous1: null,
        div: null,
        pressure_0: null,
        pressure_1: null,
      };
      fboSize = new THREE.Vector2();
      cellScale = new THREE.Vector2();
      boundarySpace = new THREE.Vector2();
      advection!: Advection;
      externalForce!: ExternalForce;
      viscous!: Viscous;
      divergence!: Divergence;
      poisson!: Poisson;
      pressure!: Pressure;
      constructor(opts: Partial<SimOptions>) {
        this.options = {
          iterations_poisson: 32,
          iterations_viscous: 32,
          mouse_force: 20,
          resolution: 0.5,
          cursor_size: 100,
          viscous: 30,
          isBounce: false,
          dt: 0.014,
          isViscous: false,
          BFECC: true,
          ...opts,
        };
        this.calcSize();
        this.createAllFBO();
        this.createShaderPass();
      }
      private floatType() {
        return /(iPad|iPhone|iPod)/i.test(navigator.userAgent)
          ? THREE.HalfFloatType
          : THREE.FloatType;
      }
      private createAllFBO() {
        const o = {
          type: this.floatType(),
          depthBuffer: false,
          stencilBuffer: false,
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          wrapS: THREE.ClampToEdgeWrapping,
          wrapT: THREE.ClampToEdgeWrapping,
        } as const;
        for (const k in this.fbos) {
          this.fbos[k] = new THREE.WebGLRenderTarget(this.fboSize.x, this.fboSize.y, o);
        }
      }
      private createShaderPass() {
        this.advection = new Advection({
          cellScale: this.cellScale,
          fboSize: this.fboSize,
          dt: this.options.dt,
          src: this.fbos.vel_0,
          dst: this.fbos.vel_1,
        });
        this.externalForce = new ExternalForce({
          cellScale: this.cellScale,
          cursor_size: this.options.cursor_size,
          dst: this.fbos.vel_1,
        });
        this.viscous = new Viscous({
          cellScale: this.cellScale,
          boundarySpace: this.boundarySpace,
          viscous: this.options.viscous,
          src: this.fbos.vel_1,
          dst: this.fbos.vel_viscous1,
          dst_: this.fbos.vel_viscous0,
          dt: this.options.dt,
        });
        this.divergence = new Divergence({
          cellScale: this.cellScale,
          boundarySpace: this.boundarySpace,
          src: this.fbos.vel_viscous0,
          dst: this.fbos.div,
          dt: this.options.dt,
        });
        this.poisson = new Poisson({
          cellScale: this.cellScale,
          boundarySpace: this.boundarySpace,
          src: this.fbos.div,
          dst: this.fbos.pressure_1,
          dst_: this.fbos.pressure_0,
        });
        this.pressure = new Pressure({
          cellScale: this.cellScale,
          boundarySpace: this.boundarySpace,
          src_p: this.fbos.pressure_0,
          src_v: this.fbos.vel_viscous0,
          dst: this.fbos.vel_0,
          dt: this.options.dt,
        });
      }
      calcSize() {
        const w = Math.max(1, Math.round(this.options.resolution * Common.width));
        const h = Math.max(1, Math.round(this.options.resolution * Common.height));
        this.cellScale.set(1 / w, 1 / h);
        this.fboSize.set(w, h);
      }
      resize() {
        this.calcSize();
        for (const k in this.fbos) this.fbos[k]!.setSize(this.fboSize.x, this.fboSize.y);
      }
      update() {
        if (this.options.isBounce) this.boundarySpace.set(0, 0);
        else this.boundarySpace.copy(this.cellScale);
        this.advection.step({
          dt: this.options.dt,
          isBounce: this.options.isBounce,
          BFECC: this.options.BFECC,
        });
        this.externalForce.step({
          cursor_size: this.options.cursor_size,
          mouse_force: this.options.mouse_force,
          cellScale: this.cellScale,
        });
        let vel: any = this.fbos.vel_1;
        if (this.options.isViscous) {
          vel = this.viscous.step({
            viscous: this.options.viscous,
            iterations: this.options.iterations_viscous,
            dt: this.options.dt,
          });
        }
        this.divergence.step(vel);
        const pressure = this.poisson.step(this.options.iterations_poisson);
        this.pressure.step(vel, pressure);
      }
    }

    class Output {
      simulation: Simulation;
      scene = new THREE.Scene();
      camera = new THREE.Camera();
      mesh: THREE.Mesh;
      constructor() {
        this.simulation = new Simulation({});
        this.mesh = new THREE.Mesh(
          new THREE.PlaneGeometry(2, 2),
          new THREE.RawShaderMaterial({
            vertexShader: face_vert,
            fragmentShader: color_frag,
            transparent: true,
            depthWrite: false,
            uniforms: {
              velocity: { value: this.simulation.fbos.vel_0!.texture },
              boundarySpace: { value: new THREE.Vector2() },
              palette: { value: paletteTex },
              bgColor: { value: bgVec4 },
            },
          }),
        );
        this.scene.add(this.mesh);
      }
      resize() {
        this.simulation.resize();
      }
      update() {
        this.simulation.update();
        if (!Common.renderer) return;
        Common.renderer.setRenderTarget(null);
        Common.renderer.render(this.scene, this.camera);
      }
    }

    class WebGLManager {
      output!: Output;
      autoDriver: AutoDriver;
      lastUserInteraction = performance.now();
      running = false;
      private _onResize = () => this.resize();
      private _onVisibility = () => {
        if (document.hidden) this.pause();
        else if (isVisibleRef.current) this.start();
      };
      constructor(props: {
        wrapper: HTMLElement;
        autoDemo: boolean;
        autoSpeed: number;
        autoIntensity: number;
        takeoverDuration: number;
        autoResumeDelay: number;
        autoRampDuration: number;
      }) {
        Common.init(props.wrapper);
        Mouse.init(props.wrapper);
        Mouse.autoIntensity = props.autoIntensity;
        Mouse.takeoverDuration = props.takeoverDuration;
        Mouse.onInteract = () => {
          this.lastUserInteraction = performance.now();
          this.autoDriver?.forceStop();
        };
        this.autoDriver = new AutoDriver(Mouse, this, {
          enabled: props.autoDemo,
          speed: props.autoSpeed,
          resumeDelay: props.autoResumeDelay,
          rampDuration: props.autoRampDuration,
        });
        if (Common.renderer) props.wrapper.prepend(Common.renderer.domElement);
        this.output = new Output();
        window.addEventListener("resize", this._onResize);
        document.addEventListener("visibilitychange", this._onVisibility);
      }
      resize() {
        Common.resize();
        this.output.resize();
      }
      private tick = () => {
        if (!this.running) return;
        this.autoDriver.update();
        Mouse.update();
        Common.update();
        this.output.update();
        rafRef.current = requestAnimationFrame(this.tick);
      };
      start() {
        if (this.running) return;
        this.running = true;
        this.tick();
      }
      pause() {
        this.running = false;
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      }
      dispose() {
        try {
          window.removeEventListener("resize", this._onResize);
          document.removeEventListener("visibilitychange", this._onVisibility);
          Mouse.dispose();
          if (Common.renderer) {
            const c = Common.renderer.domElement;
            if (c.parentNode) c.parentNode.removeChild(c);
            Common.renderer.dispose();
            Common.renderer.forceContextLoss();
          }
        } catch {
          // intentional: best-effort cleanup
        }
      }
    }

    container.style.position = container.style.position || "relative";
    container.style.overflow = container.style.overflow || "hidden";

    const webgl = new WebGLManager({
      wrapper: container,
      autoDemo,
      autoSpeed,
      autoIntensity,
      takeoverDuration,
      autoResumeDelay,
      autoRampDuration,
    });
    webglRef.current = webgl;

    // Initial sim options sync.
    Object.assign(webgl.output.simulation.options, {
      mouse_force: mouseForce,
      cursor_size: cursorSize,
      isViscous,
      viscous,
      iterations_viscous: iterationsViscous,
      iterations_poisson: iterationsPoisson,
      dt,
      BFECC,
      resolution,
      isBounce,
    });
    webgl.start();

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        const visible = e.isIntersecting && e.intersectionRatio > 0;
        isVisibleRef.current = visible;
        if (visible && !document.hidden) webgl.start();
        else webgl.pause();
      },
      { threshold: [0, 0.01, 0.1] },
    );
    io.observe(container);

    const ro = new ResizeObserver(() => {
      if (resizeRafRef.current) cancelAnimationFrame(resizeRafRef.current);
      resizeRafRef.current = requestAnimationFrame(() => webgl.resize());
    });
    ro.observe(container);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (resizeRafRef.current) cancelAnimationFrame(resizeRafRef.current);
      io.disconnect();
      ro.disconnect();
      webgl.dispose();
      webglRef.current = null;
    };
  }, [
    autoDemo,
    autoIntensity,
    autoRampDuration,
    autoResumeDelay,
    autoSpeed,
    BFECC,
    colors,
    cursorSize,
    dt,
    isBounce,
    isViscous,
    iterationsPoisson,
    iterationsViscous,
    mouseForce,
    resolution,
    takeoverDuration,
    viscous,
  ]);

  return (
    <div
      ref={mountRef}
      className={`pointer-events-none relative h-full w-full touch-none overflow-hidden ${className ?? ""}`}
      style={style}
    />
  );
}
