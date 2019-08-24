import * as THREE from 'three'
import anime from "animejs/lib/anime.es.js";

let startX = 0,
    startY = 0,
    indexX = 0,
    indexY = 0

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
        this.camera.target = new THREE.Vector3(0, 0, 1)
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
        let newRX2 = 0
        let newRY2 = 0

        this.container.addEventListener('mousedown', (ev = window.event) => {
            ev.preventDefault()
            this.isUserInteracting = true
            startX = ev.clientX
            startY = ev.clientY
            this.camera.target.prevX = this.camera.target.x
            this.camera.target.prevY = this.camera.target.y
            this.camera.target.prevZ = this.camera.target.z
        })

        this.container.addEventListener('mousemove', (ev = window.event) => {
            ev.preventDefault()
            if (this.isUserInteracting) {
                const currentX = ev.clientX,
                      currentY = ev.clientY
                newRX2 = currentX - startX
                newRY2 = currentY - startY
                this.camera.target.x = Math.sin((newRX2 + indexX) * 0.003) * 100
                this.camera.target.z = Math.cos((newRX2 + indexX) * 0.003) * 100
                const y = Math.sin((newRY2 + indexY) * 0.003) * 100
                this.camera.target.y = y
                this.camera.lookAt(this.camera.target)
                this.getScreenPosition()
            }
        })

        this.container.addEventListener('mouseup', (ev = window.event) => {
            ev.preventDefault()
            this.isUserInteracting = false
            indexX += newRX2
            indexY += newRY2
            // console.log(indexY, newRY2)
            newRX2 = 0
            newRY2 = 0
            if (indexY > 600) {
                indexY = 600
            }
            else if (indexY < -600) {
                indexY = -600
            }
            // console.log(indexY)
        })

        this.container.addEventListener('mouseout', (ev = window.event) => {
            ev.preventDefault()
            this.isUserInteracting = false
        })

    }

    getScreenPosition() {
        let vec = this.sphere.children[0]
        if (!vec) return
        this.camera.updateMatrix(); // make sure camera's local matrix is updated
        this.camera.updateMatrixWorld(); // make sure camera's world matrix is updated
        this.camera.matrixWorldInverse.getInverse( this.camera.matrixWorld );
        
        vec.updateMatrix(); // make sure plane's local matrix is updated
        vec.updateMatrixWorld(); // make sure plane's world matrix is updated
        
        // let frustum = new THREE.Frustum();
        // frustum.setFromMatrix( new THREE.Matrix4().multiplyMatrices( this.camera.projectionMatrix, this.camera.matrixWorldInverse ) );
        // if ( frustum.containsPoint( vec ) ) {
        //     console.log(frustum.containsPoint( vec ))
        // }
        let vecTotal = 
        Math.abs(vec.position.x) + 
        Math.abs(vec.position.y) + 
        Math.abs(vec.position.z)
        let tar = this.camera.target
        let vecDistanceTotal = 
        Math.abs(vec.position.x - tar.x) +
        Math.abs(vec.position.y - tar.y) + 
        Math.abs(vec.position.z - tar.z)
        // console.log(vecTotal, vecDistanceTotal)
        if (vecTotal < vecDistanceTotal) {
            return
        }
        let pos = new THREE.Vector3()
        pos = pos.setFromMatrixPosition(vec.matrixWorld)
        pos.project(this.camera);
        
        let widthHalf = this.options.width / 2;
        let heightHalf = this.options.height / 2;
        
        pos.x = (pos.x * widthHalf) + widthHalf;
        pos.y = - (pos.y * heightHalf) + heightHalf;
        pos.z = 0;
        
        if (pos.x > 0 && pos.x < this.options.width && pos.y > 0 && pos.y < this.options.height) {
            console.log(pos)
        }
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
            this.sphere.updateMatrixWorld()
            const intersects = raycaster.intersectObjects( this.scene.children )
            if ( intersects.length > 0 ) {
                const point = intersects[0].point
                const material = new THREE.MeshBasicMaterial({color: 0xaaafff})
                const geometry = new THREE.SphereGeometry(2, 10, 10)
                const pos = new THREE.Mesh( geometry, material )
                pos.position.x = point.x
                pos.position.y = point.y
                pos.position.z = point.z
                this.sphere.add(pos)
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