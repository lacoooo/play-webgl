declare global {
    interface Window {
        Canvas: typeof Canvas
    }
}

export interface Iparams {
    init: Iinit
    preload: (callback: (vert: ShaderWrap, frag: ShaderWrap) => void) => void
    setup: (gl: WebGLRenderingContext, program: WebGLProgram | null) => void
}

export type Iinit = {
    canvasId?: string
    width?: number
    height?: number
}

class ShaderWrap {
    data = ''
}

class ImageWrap {
    data = ''
}

class Canvas {

    #canvas!: HTMLCanvasElement
    #gl!: WebGLRenderingContext
    #program!: WebGLProgram | null
    #preloadLeftCount = 0
    vertexShaderSource = { data: '' }
    fragmentShaderSource = { data: '' }
    setupParams!: Iparams['setup']

    constructor(params: Iparams) {
        this.canvasElementInit(params.init)

        const {
            preload,
            setup,
        } = params

        setTimeout(() => {
            if (preload) {
                this.preload(preload)
            }
            if (setup) {
                this.setup(setup)
            }
        }, 0)
    }

    canvasElementInit(init?: Iinit) {
        const { canvasId } = init || {}
        if (canvasId) {
            const canvas = document.getElementById(canvasId) as HTMLCanvasElement
            if (canvas !== null) this.#canvas = canvas
            else this.#canvas = this._createElement("canvas") as HTMLCanvasElement
        }
        else {
            this.#canvas = this._createElement("canvas") as HTMLCanvasElement
            document.body.appendChild(this.#canvas)
        }
        this.#gl = this.#canvas.getContext('webgl') as WebGLRenderingContext
    }

    protected _createElement(elem = "div"): HTMLElement {
        const d = document.createElement(elem)
        return d
    }

    public loadShader(url: string): ShaderWrap {
        const wrap = new ShaderWrap()
        this.loadFile(url, wrap)
        return wrap
    }

    public loadImage(url: string): ImageWrap {
        const wrap = new ImageWrap()
        this.loadFile(url, wrap)
        return wrap
    }

    private async loadFile(url: string, wrap: ShaderWrap | ImageWrap): Promise<void> {

        this.#preloadLeftCount ++

        const res = await fetch(url, { mode: 'cors' })
            .catch(err => {
                throw new Error('There has been a problem with your fetch operation: ' + err.message)
            })

        if (!res.ok) {
            throw new Error('Network response was not ok.')
        }

        if (wrap instanceof ShaderWrap) {
            const text = await res.text()
                .catch(err => {
                    throw new Error('There has been a problem with your response blob(): ' + err.message)
                })
            // const objectURL: string = URL.createObjectURL(blob)
            wrap.data = text
        }
        else if (wrap instanceof ImageWrap) {
            const blob = await res.blob()
            .catch(err => {
                throw new Error('There has been a problem with your response blob(): ' + err.message)
            })
            const objectURL: string = URL.createObjectURL(blob)
            wrap.data = objectURL
        }

        this.#preloadLeftCount --
        if (this.#preloadLeftCount === 0) {
            setTimeout(() => {
                this.initShader()
                this.setup(this.setupParams)
            }, 0)
        }
    }

    public preload(cb: (callback: (vert: ShaderWrap, frag: ShaderWrap) => void) => void) {
        if (cb) cb((vertexShaderSource, fragmentShaderSource) => {
            this.vertexShaderSource = vertexShaderSource
            this.fragmentShaderSource = fragmentShaderSource
        })
    }

    /**
 * Setup only call once
 * @param cb Function to be called at initialization time
 */
    public setup(cb: Iparams['setup']) {
        if (!this.setupParams) {
            this.setupParams = cb
        }

        if (this.#preloadLeftCount > 0) return

        if (cb) cb(this.#gl, this.#program)
    }

    private initShader() {
        let vertexShader = this.#gl.createShader(this.#gl.VERTEX_SHADER)
        let fragmentShader = this.#gl.createShader(this.#gl.FRAGMENT_SHADER)
        if (!vertexShader || !fragmentShader) {
            return
        }
        this.#gl.shaderSource(vertexShader, this.vertexShaderSource.data)
        this.#gl.shaderSource(fragmentShader, this.fragmentShaderSource.data)
        this.#gl.compileShader(vertexShader)
        this.#gl.compileShader(fragmentShader)

        this.#program = this.#gl.createProgram()
        if (!this.#program) return
        this.#gl.attachShader(this.#program, vertexShader)
        this.#gl.attachShader(this.#program, fragmentShader)
        this.#gl.linkProgram(this.#program)
        this.#gl.useProgram(this.#program)
    }
}
function randomInt(range: number) {
    return Math.floor(Math.random() * range)
}

let img

const c = new Canvas({
    init: {
        canvasId: 'webgl'
    },
    preload: (cb) => {
        cb(c.loadShader('./vert.glsl'), c.loadShader('./frag.glsl'))
        img = c.loadImage('./1.jpg')
    },
    setup: (gl, program) => {
        if (!program) return
        const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution")
        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)

        const positionSet = () => {
            const positionBuffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

            const positionAL = gl.getAttribLocation(program, "a_position")
            gl.enableVertexAttribArray(positionAL)

            const size = 2
            const type = gl.FLOAT
            const normalize = false
            const stride = 0
            const offset_1 = 0
            gl.vertexAttribPointer(positionAL, size, type, normalize, stride, offset_1)
        }

        function setPosition(x: number, y: number, width: number, height: number) {
            var x1 = x
            var x2 = x + width
            var y1 = y
            var y2 = y + height
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                x1, y1,
                x2, y1,
                x1, y2,]), gl.STATIC_DRAW)
        }

        function setColor() {
            // Pick 2 random colors.
            var r1 = Math.random()
            var b1 = Math.random()
            var g1 = Math.random()
            var r2 = Math.random()
            var b2 = Math.random()
            var g2 = Math.random()

            gl.bufferData(
                gl.ARRAY_BUFFER,
                new Float32Array(
                    [Math.random(), Math.random(), Math.random(), 1,
                    Math.random(), Math.random(), Math.random(), 1,
                    Math.random(), Math.random(), Math.random(), 1,]),
                gl.STATIC_DRAW)
        }

        const colorSet = () => {
            const colorBuffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)

            const colorAL = gl.getAttribLocation(program, "a_color")
            gl.enableVertexAttribArray(colorAL)

            const size = 4
            const type = gl.FLOAT
            const normalize = false
            const stride = 0
            const offset_1 = 0
            gl.vertexAttribPointer(colorAL, size, type, normalize, stride, offset_1)
        }

        positionSet()
        setPosition(randomInt(300), randomInt(300), randomInt(300), randomInt(300))
        colorSet()
        setColor()
        gl.drawArrays(gl.TRIANGLES, 0, 6)

    },
})

console.log(c)