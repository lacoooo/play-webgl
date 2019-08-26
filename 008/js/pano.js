import * as THREE from 'three'
import dataControl from './dataControl.js'

let raycaster = new THREE.Raycaster()

const HALF_PI = Math.PI * 0.5

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
        this.camera = new THREE.PerspectiveCamera(this.options._fov, this.options.width / this.options.height, 1, 10000)
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
        const geometry = new THREE.SphereGeometry(100, 30, 30)
        this.sphere = new THREE.Mesh( geometry, material )
        this.scene.add(this.sphere)
        this.camera.position.set(0, 0, 0)
    }

    _bindScale() {
        this.container.addEventListener('mousewheel', (ev = window.event) => {
            ev.preventDefault()
            if (!this.canControl) return
            const newFov = Math.floor(this.options.fov + ev.wheelDelta * 0.05)
            if (newFov < 60 || newFov > 90) return
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
                currentX = ev.clientX,
                currentY = ev.clientY
                newRX = startX - currentX
                newRY = currentY - startY

                if (indexY + newRY > 520) newRY = 520 - indexY
                else if (indexY + newRY < -520) newRY = -520 - indexY

                const xScore = (newRX + indexX) * 0.003
                const yScore = (newRY + indexY) * 0.003
                const y = Math.sin(yScore) * 100
                const x = Math.cos(xScore) * 100
                * (1 - Math.abs(Math.sin(yScore)))
                const z = Math.sin(xScore) * 100
                * (1 - Math.abs(Math.sin(yScore)))
                this.camera.target.x = x
                if (true) {
                    this.camera.target.y = y
                }
                this.camera.target.z = z
                console.log(Math.floor(this.camera.target.x), Math.floor(this.camera.target.z))
                this.camera.lookAt(this.camera.target)
                this.DTC.updatePoints(this)
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
            this.isUserInteracting = false
        })

    }

    _bindTagEvents() {
        if (!this.options.isAddTagMode) return
        const mouse = new THREE.Vector2()

        let sameX, sameY

        this.container.addEventListener('mousemove', (ev = window.event) => {
            ev.preventDefault()
            if (!this.canControl) return
            mouse.x = ( ev.clientX / this.options.width ) * 2 - 1
            mouse.y = - ( ev.clientY / this.options.height ) * 2 + 1
        })

        this.container.addEventListener('mousedown', (ev = window.event) => {
            ev.preventDefault()
            if (!this.canControl) return
            sameX = ev.clientX
            sameY = ev.clientY
        })

        this.container.addEventListener('mouseup', (ev = window.event) => {
            ev.preventDefault()
            if (!this.canControl) return
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
                const geometry = new THREE.SphereGeometry(0.1, 2, 2)
                const pos = new THREE.Mesh( geometry, material )
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
        instance.frameCount ++
        requestAnimationFrame(instance._loopBase.bind(instance))

    }

    loop() {
        console.log('未设置loop')
    }

}

export default PanoBase;