import * as THREE from 'three'

class PanoBase {

    constructor(options = {}) {
        this.container = null
        this.scene = null
        this.camera = null
        this.renderer = null
        this.frameCount = 0
        this.sphere = null
        this.options = {
            width: options.width || window.innerWidth,
            height: options.height || window.innerHeight
        } 

        this.preSet()
        this.bindScale()
        this.setupBase()
        this.loopBase()
    }

    /**
     * 初始化canvas
     */
    preSet() {

        this.container = document.createElement('div')
        document.body.appendChild(this.container)

        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color('#000000')
        this.camera = new THREE.PerspectiveCamera(90, this.options.width / this.options.height, 1, 10000)
        this.camera.lookAt(this.scene.position)

        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(this.options.width, this.options.height)
        
        this.container.appendChild(this.renderer.domElement)

    }

    bindScale() {
        this.container.addEventListener('mousewheel', (ev = window.event) => {
            console.log(ev.wheelDelta)
        })
    }
    setupBase() {
        this.setup()
        console.log(1)
        this.renderer.render(this.scene, this.camera)
    }

    setup() {
        console.log('未设置setup')
    }

    loopBase(instance) {

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
        requestAnimationFrame(instance.loopBase.bind(instance))

    }

    loop() {
        console.log('未设置loop')
    }

}

export default PanoBase;