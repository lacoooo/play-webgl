import * as THREE from 'three'

let startX = 0,
    startY = 0

let raycaster = new THREE.Raycaster()

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
            fov: 80,
            _fov: 80
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
        this.camera.target = new THREE.Vector3(0, 0, 0)
        this.camera.lookAt(this.camera.target)

        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(this.options.width, this.options.height)
        
        this.container.appendChild(this.renderer.domElement)

    }

    async _preLoadBase() {
        await this.preLoad()
        await this.loadImage(this.options.image)
        this._initSphere()
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
        return new Promise((r) => {
            let img = new Image
            img.src = imgUrl
            img.onload = () => {
                this.image = imgUrl
                r(imgUrl)
            }
        })
    }

    _initSphere() {
        const material = new THREE.MeshBasicMaterial(
            { map: new THREE.TextureLoader().load(this.image) }
        )
        material.side = THREE.DoubleSide
        const geometry = new THREE.SphereGeometry(100, 40, 40)
        this.sphere = new THREE.Mesh( geometry, material )
        this.scene.add(this.sphere)
        this.camera.position.set(0, 0, 0)
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
        let pos = new THREE.Vector3()
        pos = pos.setFromMatrixPosition(this.sphere.matrixWorld)
        pos.project(this.camera);
        
        let widthHalf = this.options.width / 2;
        let heightHalf = this.options.height / 2;
        
        pos.x = (pos.x * widthHalf) + widthHalf;
        pos.y = - (pos.y * heightHalf) + heightHalf;
        pos.z = 0;
        
        console.log(pos)
    }

    _bindTagEvents() {
        if (!this.options.isAddTagMode) {
            return
        }
        const mouse = new THREE.Vector2()

        let sameX, sameY

        this.container.addEventListener('mousemove', (ev = window.event) => {
            ev.preventDefault()
            mouse.x = ( ev.clientX / this.options.width ) * 2 - 1
            mouse.y = - ( ev.clientY / this.options.height ) * 2 + 1
        })

        this.container.addEventListener('mousedown', (ev = window.event) => {
            ev.preventDefault()
            sameX = ev.clientX
            sameY = ev.clientY
        })

        this.container.addEventListener('mouseup', (ev = window.event) => {
            ev.preventDefault()
            // 如果down和up不是同一个位置，则此次交互不是为了添加tag
            if (sameX != ev.clientX || sameY != ev.clientY) {
                return
            }
            raycaster.setFromCamera( mouse, this.camera )
            const intersects = raycaster.intersectObjects( this.scene.children )
            if ( intersects.length > 0 ) {
                console.log(intersects[0].point)
                const point = intersects[0].point
                const material = new THREE.MeshBasicMaterial({color: 0xaaafff})
                const geometry = new THREE.SphereGeometry(2, 10, 10)
                const pos = new THREE.Mesh( geometry, material )
                pos.position.x = point.x
                pos.position.y = point.y
                pos.position.z = point.z
                pos.parent = this.sphere
                this.sphere.children.push(pos)
                // this.getScreenPosition()
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