"use client"

import { useEffect, useRef } from "react"
import { useLanguage } from "@/components/i18n/provider"
import * as THREE from "three"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js"
import { mergeGeometries, mergeVertices } from "three/addons/utils/BufferGeometryUtils.js"

const MODEL_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260929_212926_92423081-b0e4-4f5a-b650-14af6c05c058.glb"
const vertexShader = `
  varying vec3 vNormal; varying vec3 vEye;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vec4 eye = viewMatrix * world;
    vNormal = normalize(normalMatrix * normal);
    vEye = normalize(eye.xyz);
    gl_Position = projectionMatrix * eye;
  }`
const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform float uBackside;
  uniform float uPower;
  varying vec3 vNormal; varying vec3 vEye;
  vec3 band(float ior, float slide, float k, vec2 uv, vec3 eye, vec3 n) {
    vec3 ray = refract(eye, n, 1.0 / ior);
    return texture2D(uTexture, uv + ray.xy * (uPower + slide * k) * 0.5).rgb;
  }
  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    vec3 n = normalize(vNormal);
    if (uBackside > 0.5) n = -n;
    vec3 eye = normalize(vEye);
    vec3 color = vec3(0.0);
    for (int i = 0; i < 8; i++) {
      float slide = float(i) / 8.0 * 0.045;
      vec3 R = band(1.15, slide, 1.0, uv, eye, n);
      vec3 Y = band(1.16, slide, 1.0, uv, eye, n);
      vec3 G = band(1.18, slide, 2.0, uv, eye, n);
      vec3 C = band(1.22, slide, 2.5, uv, eye, n);
      vec3 B = band(1.22, slide, 3.0, uv, eye, n);
      vec3 P = band(1.22, slide, 1.0, uv, eye, n);
      float r = R.r * 0.5, y = (Y.r * 2.0 + Y.g * 2.0 - Y.b) / 6.0;
      float g = G.g * 0.5, c = (C.g * 2.0 + C.b * 2.0 - C.r) / 6.0;
      float b = B.b * 0.5, p = (P.b * 2.0 + P.r * 2.0 - P.g) / 6.0;
      color += vec3(r + (2.0*p + 2.0*y - c)/3.0, g + (2.0*y + 2.0*c - p)/3.0, b + (2.0*c + 2.0*p - y)/3.0);
    }
    color /= 8.0;
    float luma = dot(color, vec3(0.2125,0.7154,0.0721));
    color = mix(vec3(luma), color, 1.08);
    vec3 light = normalize(vec3(1.0,-1.0,-1.0));
    vec3 halfVector = normalize(light - eye);
    float spec = pow(max(dot(n,halfVector),0.0),90.0);
    vec3 halfVector2 = normalize(normalize(vec3(-1.0,-1.0,1.0))-eye);
    spec += 0.6 * pow(max(dot(n,halfVector2),0.0),54.0);
    spec += max(0.0,dot(n,light)) * 0.02;
    color += spec * (uBackside > 0.5 ? 0.35 : 1.0);
    float fresnel = pow(clamp(1.0+dot(eye,n),0.0,1.0),5.0);
    color = mix(color,vec3(1.0),fresnel * (uBackside > 0.5 ? 0.25 : 0.55));
    gl_FragColor = vec4(color + vec3(0.004,0.005,0.007),1.0);
    #include <colorspace_fragment>
  }`

export function GlassCube() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const { locale } = useLanguage()

  useEffect(() => {
    const element = canvas.current!
    const host = element.parentElement!
    let renderer: THREE.WebGLRenderer
    try { renderer = new THREE.WebGLRenderer({ canvas: element, antialias: true, alpha: false, powerPreference: "low-power" }) }
    catch { return }
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.autoClear = false
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100)
    camera.position.z = 10
    const scene = new THREE.Scene()
    const pivot = new THREE.Group()
    const spinner = new THREE.Group()
    pivot.add(spinner)
    scene.add(pivot)
    const targetType = renderer.extensions.has("EXT_color_buffer_float") ? THREE.HalfFloatType : THREE.UnsignedByteType
    const rtBack = new THREE.WebGLRenderTarget(1,1,{ type: targetType })
    const rtFront = new THREE.WebGLRenderTarget(1,1,{ type: targetType })
    const makeMaterial = (back: boolean) => new THREE.ShaderMaterial({
      vertexShader, fragmentShader, side: back ? THREE.BackSide : THREE.FrontSide,
      uniforms: { uTexture: { value: back ? rtBack.texture : rtFront.texture }, uResolution: { value: new THREE.Vector2(1,1) }, uBackside: { value: back ? 1 : 0 }, uPower: { value: back ? .22 : .3 } },
    })
    const back = makeMaterial(true), front = makeMaterial(false)
    const cube = new THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>(new RoundedBoxGeometry(1,1,1,6,.12),front)
    spinner.add(cube)
    spinner.rotation.set(-.42,.62,.18)
    const headline = document.createElement("canvas")
    const texture = new THREE.CanvasTexture(headline)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.generateMipmaps = false
    const bgScene = new THREE.Scene()
    const quadGeometry = new THREE.PlaneGeometry(2,2)
    const quadMaterial = new THREE.ShaderMaterial({
      uniforms: { uTex: { value: texture } }, depthTest: false, depthWrite: false,
      vertexShader: "varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.0,1.0);}",
      fragmentShader: "uniform sampler2D uTex; varying vec2 vUv; void main(){gl_FragColor=texture2D(uTex,vUv);\n#include <colorspace_fragment>\n}",
    })
    const quad = new THREE.Mesh(quadGeometry,quadMaterial)
    quad.frustumCulled = false
    bgScene.add(quad)
    const preference = matchMedia("(prefers-reduced-motion: reduce)")
    let disposed = false, visible = true, frame = 0, previous = 0, lastPaint = 0
    let dragging = false, pointer = -1, px = 0, py = 0, release = 0, dirty = true
    const velocity = new THREE.Vector2()
    const axisX = new THREE.Vector3(1,0,0), axisY = new THREE.Vector3(0,1,0), rotation = new THREE.Quaternion()
    const rotate = (x: number,y: number) => {
      spinner.quaternion.premultiply(rotation.setFromAxisAngle(axisY,x))
      spinner.quaternion.premultiply(rotation.setFromAxisAngle(axisX,y))
    }
    function layout() {
      const { width, height } = host.getBoundingClientRect()
      if (!width || !height) return
      const mobile = width < 768
      const dpr = Math.min(devicePixelRatio, mobile ? 1 : 1.25,Math.sqrt(2_000_000/(width*height)))
      renderer.setPixelRatio(dpr)
      renderer.setSize(width,height,false)
      camera.aspect = width/height
      camera.updateProjectionMatrix()
      const size = renderer.getDrawingBufferSize(new THREE.Vector2())
      rtBack.setSize(size.x,size.y)
      rtFront.setSize(size.x,size.y)
      back.uniforms.uResolution.value.copy(size)
      front.uniforms.uResolution.value.copy(size)
      headline.width = Math.round(width*dpr)
      headline.height = Math.round(height*dpr)
      const ctx = headline.getContext("2d")!
      ctx.scale(dpr,dpr)
      ctx.fillStyle = "#12160f"
      ctx.fillRect(0,0,width,height)
      const glow = ctx.createRadialGradient(width*.53,height*.43,0,width*.53,height*.43,width*.55)
      glow.addColorStop(0,"rgba(130,165,35,0.18)")
      glow.addColorStop(1,"rgba(18,22,15,0)")
      ctx.fillStyle = glow
      ctx.fillRect(0,0,width,height)
      const words = ["MEG", "DEV"]
      let fontSize = Math.min(height*.28,width*.24)
      ctx.font = `650 ${fontSize}px system-ui, sans-serif`
      const widest = Math.max(...words.map(word => ctx.measureText(word).width))
      fontSize *= Math.min(1,width*(mobile ? .91 : .88)/widest)
      ctx.font = `650 ${fontSize}px system-ui, sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      words.forEach((word,index) => {
        ctx.fillStyle = index ? "#d7ff43" : "#f7f3ea"
        ctx.fillText(word,width*.5,height*.5+(index-.5)*fontSize*1.05)
      })
      texture.needsUpdate = true
      const visH = 2*Math.tan(THREE.MathUtils.degToRad(15))*10
      pivot.position.set(.015*visH*camera.aspect,0,0)
      const edge = Math.min(height*.58,width*.5)
      pivot.scale.setScalar(edge/height*visH)
      dirty = true
      start()
    }
    function draw() {
      cube.material = back
      renderer.setRenderTarget(rtBack); renderer.clear(); renderer.render(bgScene,camera)
      renderer.setRenderTarget(rtFront); renderer.clear(); renderer.render(bgScene,camera); renderer.clearDepth(); renderer.render(scene,camera)
      cube.material = front
      renderer.setRenderTarget(null); renderer.clear(); renderer.render(bgScene,camera); renderer.clearDepth(); renderer.render(scene,camera)
      host.dataset.glassReady = "true"
      dirty = false
    }
    function tick(now: number) {
      frame = 0
      if (disposed || !visible || document.hidden) return
      const dt = Math.min((now-(previous || now-16))/1000,.05)
      previous = now
      if (!preference.matches && !dragging) {
        const idle = Math.min(1,Math.max(0,(now-release-600)/1000))
        rotate(velocity.x*dt*60 + idle*.0035*dt*60,velocity.y*dt*60 + idle*.0012*dt*60)
        velocity.multiplyScalar(Math.pow(.94,dt*60))
        dirty = true
      }
      if (dirty && now-lastPaint >= (dragging ? 16 : 32)) { draw(); lastPaint = now }
      if (!preference.matches || dirty) frame = requestAnimationFrame(tick)
    }
    function start() { if (!frame && !disposed && visible && !document.hidden) frame = requestAnimationFrame(tick) }
    const onDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return
      dragging = true; pointer = event.pointerId; px = event.clientX; py = event.clientY
      velocity.set(0,0); element.setPointerCapture(pointer); element.dataset.dragging = "true"
      start()
    }
    const onMove = (event: PointerEvent) => {
      if (!dragging || event.pointerId !== pointer) return
      velocity.set((event.clientX-px)*.008,(event.clientY-py)*.008)
      rotate(velocity.x,velocity.y); px = event.clientX; py = event.clientY; dirty = true; start()
    }
    const onUp = () => { dragging = false; release = performance.now(); element.dataset.dragging = "false"; dirty = true; start() }
    const onKey = (event: KeyboardEvent) => {
      if (!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(event.key)) return
      event.preventDefault()
      rotate(event.key === "ArrowLeft" ? -.18 : event.key === "ArrowRight" ? .18 : 0,event.key === "ArrowUp" ? -.18 : event.key === "ArrowDown" ? .18 : 0)
      dirty = true; start()
    }
    const onVisibility = () => { previous = 0; start() }
    const onPreference = () => { dirty = true; start() }
    const resize = new ResizeObserver(layout)
    resize.observe(host)
    const intersection = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; previous = 0; start() })
    intersection.observe(host)
    element.addEventListener("pointerdown",onDown)
    element.addEventListener("pointermove",onMove)
    element.addEventListener("pointerup",onUp)
    element.addEventListener("pointercancel",onUp)
    element.addEventListener("lostpointercapture",onUp)
    element.addEventListener("keydown",onKey)
    document.addEventListener("visibilitychange",onVisibility)
    preference.addEventListener("change",onPreference)
    layout()
    // The reference model loads directly. The rounded procedural cube remains
    // visible during loading and is also the offline/CORS failure fallback.
    new GLTFLoader().load(MODEL_URL,gltf => {
      const geometries: THREE.BufferGeometry[] = []
      gltf.scene.updateMatrixWorld(true)
      gltf.scene.traverse(object => {
        if (!(object instanceof THREE.Mesh)) return
        let geometry = object.geometry.clone()
        geometry.deleteAttribute("uv"); geometry.deleteAttribute("color"); geometry.deleteAttribute("tangent")
        const merged = mergeVertices(geometry,1e-4)
        geometry.dispose(); geometry = merged
        geometry.computeVertexNormals(); geometry.applyMatrix4(object.matrixWorld)
        geometries.push(geometry)
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        materials.forEach(material => material.dispose())
        object.geometry.dispose()
      })
      const geometry = geometries.length ? mergeGeometries(geometries) : null
      geometries.forEach(item => item.dispose())
      if (!geometry) return
      if (disposed) { geometry.dispose(); return }
      geometry.computeBoundingBox()
      const bounds = geometry.boundingBox!
      const size = bounds.getSize(new THREE.Vector3()), center = bounds.getCenter(new THREE.Vector3())
      geometry.translate(-center.x,-center.y,-center.z)
      geometry.scale(1/Math.max(size.x,size.y,size.z),1/Math.max(size.x,size.y,size.z),1/Math.max(size.x,size.y,size.z))
      cube.geometry.dispose(); cube.geometry = geometry; dirty = true; start()
    },undefined,() => { /* Keep the ready, local rounded-cube fallback. */ })
    const fontReady = () => { if (!disposed) layout() }
    void document.fonts.ready.then(fontReady)
    return () => {
      disposed = true; cancelAnimationFrame(frame)
      resize.disconnect(); intersection.disconnect()
      element.removeEventListener("pointerdown",onDown); element.removeEventListener("pointermove",onMove)
      element.removeEventListener("pointerup",onUp); element.removeEventListener("pointercancel",onUp)
      element.removeEventListener("lostpointercapture",onUp); element.removeEventListener("keydown",onKey)
      document.removeEventListener("visibilitychange",onVisibility); preference.removeEventListener("change",onPreference)
      cube.geometry.dispose(); back.dispose(); front.dispose(); quadGeometry.dispose(); quadMaterial.dispose()
      rtBack.dispose(); rtFront.dispose(); texture.dispose(); renderer.dispose()
      delete host.dataset.glassReady
    }
  }, [locale])

  return <canvas ref={canvas} className="glass-cube-canvas" tabIndex={0} aria-label={locale === "de" ? "Glaswürfel. Zum Drehen ziehen oder die Pfeiltasten verwenden." : locale === "en" ? "Glass cube. Drag or use the arrow keys to rotate." : "Cam küp. Döndürmek için sürükleyin veya ok tuşlarını kullanın."} />
}
