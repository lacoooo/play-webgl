;

const threeSetting = {

    data: {
        camera: '',
        bgColor: 'rgba(240, 240, 240, 1)'
    },

    init() {
        this.preSet()
        this.setup()
        this.aftSet()
        this.draw()

    },

    setBgColor( bgColor ) {
        if ( bgColor )  this.data.bgColor =  bgColor
    },

    setCamera( o ) {
        const width = window.innerWidth
        const height = window.innerHeight
        this.data.camera = o ? 
        new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 10000 ) : 
        new THREE.PerspectiveCamera(70, width / height, 1, 10000)
    },

    preSet() {
        container = document.createElement('div')
        document.body.appendChild(container)

        scene = new THREE.Scene()
        scene.background = new THREE.Color(this.data.bgColor)
        const distance = 200
        camera = this.data.camera ||
        new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000)
        camera.position.set(0, 0, distance)
        camera.lookAt(scene.position)

    },

    setup() {
        if (!window.setup) throw 'no setup function'
        window.setup()
    },

    aftSet() {
        renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(window.innerWidth, window.innerHeight)

        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap

        container.appendChild(renderer.domElement)
        stats = new Stats()
        container.appendChild(stats.dom)
        controls = new THREE.OrbitControls( camera, renderer.domElement )
    },

    draw(a) {
        if (!window.draw) throw 'no draw function'
        draw(a)
        renderer.render(scene, camera)
        // stats.update()
        requestAnimationFrame(threeSetting.draw);
    }
}

window.onload = function () {
    threeSetting.init()
}