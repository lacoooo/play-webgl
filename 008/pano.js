;
class PanoBase {

    container = null
    scene = null
    camera = null
    renderer = null
    control = null

    constructor() {
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
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000)
        this.camera.lookAt(this.scene.position)

        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        
        this.container.appendChild(this.renderer.domElement)
        this.control = new THREE.OrbitControls( this.camera, this.renderer.domElement )

    }

    setup() {

    }

    loopBase() {
        this.loop()
        requestAnimationFrame(this.loopBase)
    }

    loop() {
        
    }

}