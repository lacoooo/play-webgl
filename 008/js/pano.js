import * as THREE from 'three'
import dataControl from './dataControl.js'

let raycaster = new THREE.Raycaster()

class PanoBase {
  constructor(options = {}) {
    this.container = document.querySelector('#pano')
    this.op = document.querySelector('#op')
    this.scene = null
    this.camera = null
    this.renderer = null
    this.frameCount = 0
    this.sphere = null
    this.isUserInteracting = false
    this.options = {
      width: window.innerWidth,
      height: window.innerHeight,
      fov: 80,
      _fov: 80
    }
    this.DTC = dataControl
    this.canControl = false
    this.isControllingTag = false
    if (!this.container) {
      throw 'no container'
    }
    this._initOptions(options)
    this._preSet()
    this._preLoadBase()
  }

  _initOptions(options) {
    Object.assign(this.options, this.options, options)
  }

  /**
   * 初始化canvas
   */
  _preSet() {
    this.container.style = `width: ${this.options.width}px;height: ${this.options.height}px`

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color('#000000')
    this.camera = new THREE.PerspectiveCamera(
      this.options._fov,
      this.options.width / this.options.height,
      1,
      10000
    )
    this.camera._m = this.camera.getFocalLength()
    this.camera.target = new THREE.Vector3(1, 0, 0)
    this.camera.lookAt(this.camera.target)

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.options.width, this.options.height)

    this.container.appendChild(this.renderer.domElement)

    // this.DTC = dataControl
  }

  async _preLoadBase() {
    await this.preLoad()
    let img = await this.loadImage(this.options.image)
    this.op.innerHTML = ''
    this._initSphere(img)
    this._bindScale()
    this._bindRotate()
    this._bindTagEvents()
    this._setupBase()
    this._loopBase()
  }

  preLoad() {
    console.log('未设置preLoad')
  }

  loadImage(imgUrl) {
    // to do
    return new Promise(r => {
      let img = new THREE.TextureLoader().load(this.options.image, () => {
        r(img)
      })
    })
  }

  _initSphere(img) {
    const material = new THREE.MeshBasicMaterial({ map: img })
    material.side = THREE.DoubleSide
    const geometry = new THREE.SphereGeometry(100, 30, 60)
    this.sphere = new THREE.Mesh(geometry, material)
    this.scene.add(this.sphere)
    this.camera.position.set(0, 0, 0)
  }

  _bindScale() {
    this.container.addEventListener('mousewheel', (ev = window.event) => {
      ev.preventDefault()

      if (!this.canControl) return
      const newFov = Math.floor(this.options.fov + ev.wheelDelta * 0.05)
      if (newFov < 70 || newFov > 160) return
      const m = this.camera._m + (newFov - this.options._fov) * 0.3
      this.camera.setFocalLength(m)
      this.options.fov = newFov
    })
  }

  _bindRotate() {
    let newRX = 0,
      newRY = 0,
      startX = 0,
      startY = 0,
      indexX = 0,
      indexY = 0,
      currentX = 0,
      currentY = 0

    this.container.addEventListener('mousedown', (ev = window.event) => {
      ev.preventDefault()

      if (!this.canControl) return
      this.isUserInteracting = true
      startX = ev.clientX
      startY = ev.clientY
      this.camera.target.prevX = this.camera.target.x
      this.camera.target.prevY = this.camera.target.y
      this.camera.target.prevZ = this.camera.target.z
    })

    this.container.addEventListener('mousemove', (ev = window.event) => {
      ev.preventDefault()

      if (!this.canControl) return
      if (this.isUserInteracting) {
        if (this.isControllingTag) return
        ;(currentX = ev.clientX), (currentY = ev.clientY)
        newRX = startX - currentX
        newRY = currentY - startY

        const speed = 0.003

        if (indexY + newRY > 520) newRY = 520 - indexY
        else if (indexY + newRY < -520) newRY = -520 - indexY

        const xScore = (newRX + indexX) * speed
        const yScore = (newRY + indexY) * speed
        const y = Math.sin(yScore) * 100
        const x = Math.cos(xScore) * 100 * Math.abs(Math.cos(yScore))
        const z = Math.sin(xScore) * 100 * Math.abs(Math.cos(yScore))
        this.camera.target.x = x
        this.camera.target.y = y
        this.camera.target.z = z
        this.camera.lookAt(this.camera.target)
      }
    })

    this.container.addEventListener('mouseup', (ev = window.event) => {
      ev.preventDefault()

      if (!this.canControl) return
      this.isUserInteracting = false
      indexX += newRX
      indexY += newRY
      newRX = 0
      newRY = 0
    })

    this.container.addEventListener('mouseout', (ev = window.event) => {
      ev.preventDefault()

      if (!this.canControl) return
      // this.isUserInteracting = false
      this.isControllingTag = false
      console.log('mouseout')
    })
  }

  _bindTagEvents() {
    if (!this.options.isAddTagMode) return
    const mouse = new THREE.Vector2()

    let sameX, sameY

    this.container.addEventListener('mousedown', (ev = window.event) => {
      ev.preventDefault()

      if (!this.canControl) return
      sameX = ev.clientX
      sameY = ev.clientY
    })

    this.container.addEventListener('mousemove', (ev = window.event) => {
      ev.preventDefault()

      if (!this.canControl) return
      mouse.x = (ev.clientX / this.options.width) * 2 - 1
      mouse.y = -(ev.clientY / this.options.height) * 2 + 1
    })

    this.container.addEventListener('mouseup', (ev = window.event) => {
      ev.preventDefault()

      if (!this.canControl) return
      // 如果down和up不是同一个位置，则此次交互不是为了添加tag
      if (sameX != ev.clientX || sameY != ev.clientY) {
        return
      }
      if (this.isControllingTag) {
        this.isControllingTag = false
        return
      }
      raycaster.setFromCamera(mouse, this.camera)
      this.sphere.updateMatrixWorld()
      const intersects = raycaster.intersectObjects(this.scene.children)
      if (intersects.length > 0) {
        const point = intersects[0].point
        const material = new THREE.MeshBasicMaterial({ color: 0xaaafff })
        const geometry = new THREE.SphereGeometry(0.01, 2, 2)
        const pos = new THREE.Mesh(geometry, material)
        pos.position.x = point.x
        pos.position.y = point.y
        pos.position.z = point.z
        this.sphere.add(pos)
        this.DTC.addPoint({ pos3d: pos })
      }
    })
  }

  _setupBase() {
    this.setup()
    this.renderer.render(this.scene, this.camera)
  }

  setup() {
    console.log('未设置setup')
  }

  _loopBase(instance) {
    instance = this || instance
    // this.camera.matrixWorldNeedsUpdate = true
    this.DTC.updatePoints(this)
    instance.renderer.render(instance.scene, instance.camera)
    if (instance.__proto__.loop == instance.__proto__.__proto__.loop) {
      if (instance.frameCount === 0) {
        this.loop()
      }
    } else {
      this.loop()
    }
    instance.frameCount++
    requestAnimationFrame(instance._loopBase.bind(instance))
  }

  loop() {
    console.log('未设置loop')
  }
}

export default PanoBase
