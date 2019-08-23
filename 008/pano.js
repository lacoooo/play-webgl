import * as THREE from 'three'

class PanoBase {

    constructor(options = {}) {
        this.container = null
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

        this._setOptions(options)
        this._preSet()
        this._bindScale()
        this._bindRotate()
        this._setupBase()
        this._loopBase()
    }

    _setOptions(options) {

        Object.assign(this.options, this.options, options)

    }

    /**
     * 初始化canvas
     */
    _preSet() {

        this.container = document.createElement('div')
        document.body.appendChild(this.container)

        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color('#000000')
        this.camera = new THREE.PerspectiveCamera(this.options._fov, this.options.width / this.options.height, 1, 10000)
        this.camera._m = this.camera.getFocalLength()
        this.camera.lookAt(this.scene.position)

        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(this.options.width, this.options.height)
        
        this.container.appendChild(this.renderer.domElement)

    }

    _bindScale() {
        this.container.addEventListener('mousewheel', (ev = window.event) => {
            ev.preventDefault()
            const newFov = Math.floor(this.options.fov + ev.wheelDelta * 0.05)
            if (newFov < 60 || newFov > 120) return
            const m = this.camera._m + (newFov - this.options._fov) * 0.3
            this.camera.setFocalLength(m)
            this.options.fov = newFov
        })
    }

    _bindRotate() {

        this.container.addEventListener('mousedown', (ev = window.event) => {
            ev.preventDefault()
            this.isUserInteracting = true
        })

        this.container.addEventListener('mousemove', (ev = window.event) => {
            ev.preventDefault()
        })

        this.container.addEventListener('mouseup', (ev = window.event) => {
            ev.preventDefault()
            this.isUserInteracting = false
        })

    }

    _setupBase() {
        this.setup()
        console.log(1)
        this.renderer.render(this.scene, this.camera)
    }

    setup() {
        console.log('未设置setup')
    }

    _loopBase(instance) {

        instance = this || instance
        instance.renderer.render(instance.scene, instance.camera)
        if (instance.__proto__.loop == instance.__proto__.__proto__.loop) {
            if (instance.frameCount === 0) {
                this.loop()
            }
        } else {
            this.loop()
        }
        instance.frameCount ++
        requestAnimationFrame(instance._loopBase.bind(instance))

    }

    loop() {
        console.log('未设置loop')
    }

}

export default PanoBase;