import * as THREE from 'three'

class PanoBase {

    constructor() {
        this.container = null
        this.scene = null
        this.camera = null
        this.renderer = null
        this.frameCount = 0
        this.sphere = null

        this.preSet()
        this.setup()
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
        this.camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 1, 10000)
        this.camera.lookAt(this.scene.position)

        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        
        this.container.appendChild(this.renderer.domElement)

    }

    setup() {
        console.log('未设置setup')
    }

    loopBase(instance) {

        instance = this || instance
        if (instance.__proto__.loop == instance.__proto__.__proto__.loop) {
            console.log('未设置loop')
            return
        }
        instance.frameCount ++
        instance.renderer.render(instance.scene, instance.camera)
        instance.loop()
        requestAnimationFrame(instance.loopBase.bind(instance))

    }

    loop() {

    }

}

export default PanoBase;