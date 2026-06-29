import { useEffect, useRef } from 'react'

const OPTS = {
  SIM_RESOLUTION: 128,
  DYE_RESOLUTION: 1024,
  CAPTURE_RESOLUTION: 512,
  DENSITY_DISSIPATION: 3.5,
  VELOCITY_DISSIPATION: 2.0,
  PRESSURE: 0.1,
  PRESSURE_ITERATIONS: 20,
  CURL: 3,
  SPLAT_RADIUS: 0.18,
  SPLAT_FORCE: 6000,
  SHADING: true,
  COLOR_UPDATE_SPEED: 0,
  BACK_COLOR: { r: 0, g: 0, b: 0 },
  TRANSPARENT: true,
}

function pointerPrototype() {
  this.id = -1
  this.texcoordX = 0
  this.texcoordY = 0
  this.prevTexcoordX = 0
  this.prevTexcoordY = 0
  this.deltaX = 0
  this.deltaY = 0
  this.down = false
  this.moved = false
  this.color = { r: 0.78, g: 0.68, b: 0.62 }
}

export default function SplashCursor({ opacity = 0.55 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const touch = !window.matchMedia('(pointer: fine)').matches
    if (reduce || touch) return

    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    if (!gl) return

    let pointers = [new pointerPrototype()]
    let splatStack = []
    let lastTime = Date.now()

    function getWebGLContext(canvas) {
      const params = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false }
      let gl = canvas.getContext('webgl2', params)
      const isWebGL2 = !!gl
      if (!isWebGL2) gl = canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params)
      let halfFloat, supportLinearFiltering
      if (isWebGL2) {
        gl.getExtension('EXT_color_buffer_float')
        supportLinearFiltering = gl.getExtension('OES_texture_float_linear')
      } else {
        halfFloat = gl.getExtension('OES_texture_half_float')
        supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear')
      }
      gl.clearColor(0, 0, 0, 1)
      const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : halfFloat && halfFloat.HALF_FLOAT_OES
      let formatRGBA, formatRG, formatR
      if (isWebGL2) {
        formatRGBA = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType)
        formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType)
        formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType)
      } else {
        formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType)
        formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType)
        formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType)
      }
      return { gl, ext: { formatRGBA, formatRG, formatR, halfFloatTexType, supportLinearFiltering } }
    }

    function getSupportedFormat(gl, internalFormat, format, type) {
      if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
        switch (internalFormat) {
          case gl.R16F: return getSupportedFormat(gl, gl.RG16F, gl.RG, type)
          case gl.RG16F: return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type)
          default: return null
        }
      }
      return { internalFormat, format }
    }

    function supportRenderTextureFormat(gl, internalFormat, format, type) {
      const texture = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null)
      const fbo = gl.createFramebuffer()
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
      const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER)
      return status === gl.FRAMEBUFFER_COMPLETE
    }

    const { gl: glCtx, ext } = getWebGLContext(canvas)
    const g = glCtx

    function compileShader(type, source, keywords) {
      source = addKeywords(source, keywords)
      const shader = g.createShader(type)
      g.shaderSource(shader, source)
      g.compileShader(shader)
      return shader
    }

    function addKeywords(source, keywords) {
      if (!keywords) return source
      let keywordsStr = ''
      keywords.forEach(k => { keywordsStr += `#define ${k}\n` })
      return keywordsStr + source
    }

    function createProgram(vertexShader, fragmentShader) {
      const program = g.createProgram()
      g.attachShader(program, vertexShader)
      g.attachShader(program, fragmentShader)
      g.linkProgram(program)
      return program
    }

    function getUniforms(program) {
      const uniforms = []
      const n = g.getProgramParameter(program, g.ACTIVE_UNIFORMS)
      for (let i = 0; i < n; i++) {
        const info = g.getActiveUniform(program, i)
        const loc = g.getUniformLocation(program, info.name)
        uniforms[info.name] = loc
      }
      return uniforms
    }

    class Material {
      constructor(vertexShader, fragmentShaderSource) {
        this.vertexShader = vertexShader
        this.fragmentShaderSource = fragmentShaderSource
        this.programs = []
        this.activeProgram = null
        this.uniforms = []
      }
      setKeywords(keywords) {
        let hash = 0
        for (let i = 0; i < keywords.length; i++) for (let j = 0; j < keywords[i].length; j++) hash = (hash << 5) - hash + keywords[i].charCodeAt(j), hash |= 0
        let program = this.programs[hash]
        if (!program) {
          const frag = compileShader(g.FRAGMENT_SHADER, this.fragmentShaderSource, keywords)
          program = createProgram(this.vertexShader, frag)
          this.programs[hash] = program
        }
        if (program === this.activeProgram) return
        this.uniforms = getUniforms(program)
        this.activeProgram = program
      }
      bind() { g.useProgram(this.activeProgram) }
    }

    class Program {
      constructor(vertexShader, fragmentShader) {
        this.uniforms = {}
        this.program = createProgram(vertexShader, fragmentShader)
        this.uniforms = getUniforms(this.program)
      }
      bind() { g.useProgram(this.program) }
    }

    const baseVertexShader = compileShader(g.VERTEX_SHADER, `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }`)

    const copyShader = compileShader(g.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      void main () { gl_FragColor = texture2D(uTexture, vUv); }`)

    const clearShader = compileShader(g.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;
      void main () { gl_FragColor = value * texture2D(uTexture, vUv); }`)

    const displayShaderSource = `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform sampler2D uBloom;
      uniform sampler2D uDithering;
      uniform vec2 ditherScale;
      uniform vec2 texelSize;
      vec3 linearToGamma (vec3 color) { return max(pow(color, vec3(1.0 / 2.2)), vec3(0.0)); }
      void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;
        #ifdef SHADING
          vec3 lc = texture2D(uTexture, vL).rgb;
          vec3 rc = texture2D(uTexture, vR).rgb;
          vec3 tc = texture2D(uTexture, vT).rgb;
          vec3 bc = texture2D(uTexture, vB).rgb;
          float dx = length(rc) - length(lc);
          float dy = length(tc) - length(bc);
          vec3 n = normalize(vec3(dx, dy, length(texelSize)));
          vec3 l = vec3(0.0, 0.0, 1.0);
          float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
          c *= diffuse;
        #endif
        float a = max(c.r, max(c.g, c.b));
        gl_FragColor = vec4(c, a);
      }`

    const splatShader = compileShader(g.FRAGMENT_SHADER, `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }`)

    const advectionShader = compileShader(g.FRAGMENT_SHADER, `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform vec2 dyeTexelSize;
      uniform float dt;
      uniform float dissipation;
      vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
        vec2 st = uv / tsize - 0.5;
        vec2 iuv = floor(st);
        vec2 fuv = fract(st);
        vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
        vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
        vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
        vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
        return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
      }
      void main () {
        #ifdef MANUAL_FILTERING
          vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
          vec4 result = bilerp(uSource, coord, dyeTexelSize);
        #else
          vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
          vec4 result = texture2D(uSource, coord);
        #endif
        float decay = 1.0 + dissipation * dt;
        gl_FragColor = result / decay;
      }`,
      ext.supportLinearFiltering ? null : ['MANUAL_FILTERING'])

    const divergenceShader = compileShader(g.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;
        vec2 C = texture2D(uVelocity, vUv).xy;
        if (vL.x < 0.0) { L = -C.x; }
        if (vR.x > 1.0) { R = -C.x; }
        if (vT.y > 1.0) { T = -C.y; }
        if (vB.y < 0.0) { B = -C.y; }
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }`)

    const curlShader = compileShader(g.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }`)

    const vorticityShader = compileShader(g.FRAGMENT_SHADER, `
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;
      void main () {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
      }`)

    const pressureShader = compileShader(g.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float C = texture2D(uPressure, vUv).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }`)

    const gradientSubtractShader = compileShader(g.FRAGMENT_SHADER, `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }`)

    const copyProgram = new Program(baseVertexShader, copyShader)
    const clearProgram = new Program(baseVertexShader, clearShader)
    const splatProgram = new Program(baseVertexShader, splatShader)
    const advectionProgram = new Program(baseVertexShader, advectionShader)
    const divergenceProgram = new Program(baseVertexShader, divergenceShader)
    const curlProgram = new Program(baseVertexShader, curlShader)
    const vorticityProgram = new Program(baseVertexShader, vorticityShader)
    const pressureProgram = new Program(baseVertexShader, pressureShader)
    const gradientSubtractProgram = new Program(baseVertexShader, gradientSubtractShader)
    const displayMaterial = new Material(baseVertexShader, displayShaderSource)

    const buf = g.createBuffer()
    g.bindBuffer(g.ARRAY_BUFFER, buf)
    g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), g.STATIC_DRAW)
    const indexBuf = g.createBuffer()
    g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, indexBuf)
    g.bufferData(g.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), g.STATIC_DRAW)
    g.vertexAttribPointer(0, 2, g.FLOAT, false, 0, 0)
    g.enableVertexAttribArray(0)

    function createFBO(w, h, internalFormat, format, type, param) {
      g.activeTexture(g.TEXTURE0)
      const tex = g.createTexture()
      g.bindTexture(g.TEXTURE_2D, tex)
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, param)
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, param)
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE)
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE)
      g.texImage2D(g.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null)
      const fbo = g.createFramebuffer()
      g.bindFramebuffer(g.FRAMEBUFFER, fbo)
      g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, tex, 0)
      g.viewport(0, 0, w, h)
      g.clear(g.COLOR_BUFFER_BIT)
      const texelSizeX = 1.0 / w
      const texelSizeY = 1.0 / h
      return { texture: tex, fbo, width: w, height: h, texelSizeX, texelSizeY, attach(id) { g.activeTexture(g.TEXTURE0 + id); g.bindTexture(g.TEXTURE_2D, tex); return id } }
    }

    function createDoubleFBO(w, h, internalFormat, format, type, param) {
      let fbo1 = createFBO(w, h, internalFormat, format, type, param)
      let fbo2 = createFBO(w, h, internalFormat, format, type, param)
      return {
        width: w, height: h, texelSizeX: fbo1.texelSizeX, texelSizeY: fbo1.texelSizeY,
        get read() { return fbo1 }, set read(v) { fbo1 = v },
        get write() { return fbo2 }, set write(v) { fbo2 = v },
        swap() { const t = fbo1; fbo1 = fbo2; fbo2 = t }
      }
    }

    function getResolution(res) {
      let w = g.drawingBufferWidth
      let h = g.drawingBufferHeight
      if (w > h) { h = Math.round(h * res / w); w = res }
      else { w = Math.round(w * res / h); h = res }
      return { width: w, height: h }
    }

    const filtering = ext.supportLinearFiltering ? g.LINEAR : g.NEAREST
    let simRes = getResolution(OPTS.SIM_RESOLUTION)
    let dyeRes = getResolution(OPTS.DYE_RESOLUTION)
    const texType = ext.halfFloatTexType
    const rgba = ext.formatRGBA
    const rg = ext.formatRG
    const r = ext.formatR

    let dye = createDoubleFBO(dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering)
    let velocity = createDoubleFBO(simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering)
    let divergence = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, g.NEAREST)
    let curl = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, g.NEAREST)
    let pressure = createDoubleFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, g.NEAREST)

    function blit(target, clear = false) {
      if (target == null) { g.viewport(0, 0, g.drawingBufferWidth, g.drawingBufferHeight); g.bindFramebuffer(g.FRAMEBUFFER, null) }
      else { g.viewport(0, 0, target.width, target.height); g.bindFramebuffer(g.FRAMEBUFFER, target.fbo) }
      if (clear) { g.clearColor(0, 0, 0, 1); g.clear(g.COLOR_BUFFER_BIT) }
      g.drawElements(g.TRIANGLES, 6, g.UNSIGNED_SHORT, 0)
    }

    function splat(x, y, dx, dy, color) {
      splatProgram.bind()
      g.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0))
      g.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height)
      g.uniform2f(splatProgram.uniforms.point, x, y)
      g.uniform3f(splatProgram.uniforms.color, dx, dy, 0)
      g.uniform1f(splatProgram.uniforms.radius, correctRadius(OPTS.SPLAT_RADIUS / 100))
      blit(velocity.write)
      velocity.swap()
      g.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0))
      g.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b)
      blit(dye.write)
      dye.swap()
    }

    function correctRadius(radius) {
      const ar = canvas.width / canvas.height
      if (ar > 1) radius *= ar
      return radius
    }

    function step(dt) {
      g.disable(g.BLEND)
      curlProgram.bind()
      g.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY)
      g.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0))
      blit(curl)
      vorticityProgram.bind()
      g.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY)
      g.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0))
      g.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1))
      g.uniform1f(vorticityProgram.uniforms.curl, OPTS.CURL)
      g.uniform1f(vorticityProgram.uniforms.dt, dt)
      blit(velocity.write)
      velocity.swap()
      divergenceProgram.bind()
      g.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY)
      g.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0))
      blit(divergence)
      clearProgram.bind()
      g.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0))
      g.uniform1f(clearProgram.uniforms.value, OPTS.PRESSURE)
      blit(pressure.write)
      pressure.swap()
      pressureProgram.bind()
      g.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY)
      g.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0))
      for (let i = 0; i < OPTS.PRESSURE_ITERATIONS; i++) {
        g.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1))
        blit(pressure.write)
        pressure.swap()
      }
      gradientSubtractProgram.bind()
      g.uniform2f(gradientSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY)
      g.uniform1i(gradientSubtractProgram.uniforms.uPressure, pressure.read.attach(0))
      g.uniform1i(gradientSubtractProgram.uniforms.uVelocity, velocity.read.attach(1))
      blit(velocity.write)
      velocity.swap()
      advectionProgram.bind()
      g.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY)
      if (!ext.supportLinearFiltering) g.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY)
      const velId = velocity.read.attach(0)
      g.uniform1i(advectionProgram.uniforms.uVelocity, velId)
      g.uniform1i(advectionProgram.uniforms.uSource, velId)
      g.uniform1f(advectionProgram.uniforms.dt, dt)
      g.uniform1f(advectionProgram.uniforms.dissipation, OPTS.VELOCITY_DISSIPATION)
      blit(velocity.write)
      velocity.swap()
      if (!ext.supportLinearFiltering) g.uniform2f(advectionProgram.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY)
      g.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0))
      g.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1))
      g.uniform1f(advectionProgram.uniforms.dissipation, OPTS.DENSITY_DISSIPATION)
      blit(dye.write)
      dye.swap()
    }

    function render(target) {
      g.blendFunc(g.ONE, g.ONE_MINUS_SRC_ALPHA)
      g.enable(g.BLEND)
      drawDisplay(target)
    }

    function drawDisplay(target) {
      const w = target == null ? g.drawingBufferWidth : target.width
      const h = target == null ? g.drawingBufferHeight : target.height
      displayMaterial.setKeywords(OPTS.SHADING ? ['SHADING'] : [])
      displayMaterial.bind()
      g.uniform2f(displayMaterial.uniforms.texelSize, 1.0 / w, 1.0 / h)
      g.uniform1i(displayMaterial.uniforms.uTexture, dye.read.attach(0))
      blit(target)
    }

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener('resize', resize)

    let raf
    function update() {
      const now = Date.now()
      const dt = Math.min((now - lastTime) / 1000, 0.016)
      lastTime = now
      g.viewport(0, 0, g.drawingBufferWidth, g.drawingBufferHeight)
      for (let i = 0; i < pointers.length; i++) {
        const p = pointers[i]
        if (p.moved) {
          p.moved = false
          splat(p.texcoordX, p.texcoordY, p.deltaX, p.deltaY, p.color)
        }
      }
      step(dt)
      render(null)
      raf = requestAnimationFrame(update)
    }
    raf = requestAnimationFrame(update)

    function scaleByPixelRatio(n) { return Math.floor(n * (window.devicePixelRatio || 1)) }

    function updatePointerMoveData(pointer, posX, posY) {
      pointer.prevTexcoordX = pointer.texcoordX
      pointer.prevTexcoordY = pointer.texcoordY
      pointer.texcoordX = posX / canvas.width
      pointer.texcoordY = 1.0 - posY / canvas.height
      pointer.deltaX = correctDelta(pointer.texcoordX - pointer.prevTexcoordX)
      pointer.deltaY = correctDelta(pointer.texcoordY - pointer.prevTexcoordY)
      pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0
    }

    function correctDelta(delta) {
      const ar = canvas.width / canvas.height
      if (ar < 1) delta *= ar
      return delta * OPTS.SPLAT_FORCE
    }

    function onMouseMove(e) {
      const p = pointers[0]
      updatePointerMoveData(p, scaleByPixelRatio(e.clientX), scaleByPixelRatio(e.clientY))
    }

    window.addEventListener('mousemove', onMouseMove)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity,
      }}
    />
  )
}
