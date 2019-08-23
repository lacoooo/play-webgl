import * as THREE from 'three'

let startX = 0,
    startY = 0

const HALF_PI = Math.PI * 0.5

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
            fov: 70,
            _fov: 70
        }

        this._setOptions(options)
        this._preSet()
        this._preLoadBase()
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
        this.camera.target = new THREE.Vector3(0, 0, -100)
        this.camera.lookAt(this.camera.target)

        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(this.options.width, this.options.height)
        
        this.container.appendChild(this.renderer.domElement)

    }

    async _preLoadBase() {
        await this.preLoad()
        this._bindScale()
        this._bindRotate()
        this._setupBase()
        this._loopBase()
    }
    
    preLoad() {
        console.log('未设置preLoad')
    }

    loadImage(imgUrl) {
        return new Promise((r) => {
            let img = new Image
            img.src = imgUrl
            img.onload = () => {
                this.image = imgUrl
                r()
            }
        })
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
            startX = ev.clientX
            startY = ev.clientY
            this.sphere.rotation.prevX = this.sphere.rotation.x
            this.sphere.rotation.prevY = this.sphere.rotation.y
        })

        this.container.addEventListener('mousemove', (ev = window.event) => {
            ev.preventDefault()
            if (this.isUserInteracting) {
                const currentX = ev.clientX,
                      currentY = ev.clientY
                const newRX = this.sphere.rotation.prevX + (startY - currentY) * 0.002
                const newRY = this.sphere.rotation.prevY + (startX - currentX) * 0.002
                if (Math.abs(newRX) < HALF_PI) {
                    this.sphere.rotation.x = newRX
                }
                this.sphere.rotation.y = newRY
            }
        })

        this.container.addEventListener('mouseup', (ev = window.event) => {
            ev.preventDefault()
            this.isUserInteracting = false
        })

        this.container.addEventListener('mouseout', (ev = window.event) => {
            ev.preventDefault()
            this.isUserInteracting = false
        })

    }

    getScreenPosition() {
        var projector = new THREE.Projector();
        var world_vector = new THREE.Vector3(0,0,1);  
        
        var vector = projector.projectVector(world_vector, camera);  
        
        var halfWidth = this.options.width / 2;  
        var halfHeight = this.options.height / 2;  
        
        var result = {  
        
            x: Math.round(vector.x * halfWidth + halfWidth),  
            y: Math.round(-vector.y * halfHeight + halfHeight)  
        
        };
        console.log(result)
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