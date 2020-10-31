declare global {
    interface Window {
        Canvas: typeof Canvas
    }
}

export interface Iparams {
    init: Iinit
    preload: (callback: (vert: ShaderWrap, frag: ShaderWrap) => void) => void
    setup: () => void
}

export type Iinit = {
    canvasId?: string
    width?: number
    height?: number
}

class ShaderWrap {
    data = ''
}

class Canvas {

    #canvas!: HTMLCanvasElement
    #gl!: WebGLRenderingContext
    #preloadLeftCount = 0
    vertexShaderSource = { data: '' }
    fragmentShaderSource = { data: '' }
    setupParams!: () => void

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
            this.initShader()
            this.#gl.drawArrays(this.#gl.POINTS, 0, 1);
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

    private async loadFile(url: string, wrap: ShaderWrap): Promise<void> {

        this.#preloadLeftCount ++

        const res = await fetch(url, { mode: 'cors' })
            .catch(err => {
                throw new Error('There has been a problem with your fetch operation: ' + err.message)
            })

        if (!res.ok) {
            throw new Error('Network response was not ok.')
        }

        const blob = await res.blob()
            .catch(err => {
                throw new Error('There has been a problem with your response blob(): ' + err.message)
            })

        const objectURL: string = URL.createObjectURL(blob)
        wrap.data = objectURL
        this.#preloadLeftCount --
        if (this.#preloadLeftCount === 0) {
            setTimeout(() => {
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
    public setup(cb: () => void) {
        if (!this.setupParams) {
            this.setupParams = cb
        }

        if (this.#preloadLeftCount > 0) return

        if (cb) cb()
    }

    private initShader() {
        //创建顶点着色器对象
        let vertexShader = this.#gl.createShader(this.#gl.VERTEX_SHADER);
        //创建片元着色器对象
        let fragmentShader = this.#gl.createShader(this.#gl.FRAGMENT_SHADER);
        //引入顶点、片元着色器源代码
        if (!vertexShader || !fragmentShader) {
            return
        }
        this.#gl.shaderSource(vertexShader, this.vertexShaderSource.data);
        this.#gl.shaderSource(fragmentShader, this.fragmentShaderSource.data);
        //编译顶点、片元着色器
        this.#gl.compileShader(vertexShader);
        this.#gl.compileShader(fragmentShader);

        //创建程序对象program
        const program = this.#gl.createProgram();
        if (!program) return
        //附着顶点着色器和片元着色器到program
        this.#gl.attachShader(program, vertexShader);
        this.#gl.attachShader(program, fragmentShader);
        //链接program
        this.#gl.linkProgram(program);
        //使用program
        this.#gl.useProgram(program);
    }
}

window.Canvas = Canvas

let vertexShaderSource: any
let fragShaderSource: any

const cc = new Canvas({
    init: {
        canvasId: 'webgl'
    },
    preload: (cb) => {
        vertexShaderSource = cc.loadShader('./vert.glsl')
        fragShaderSource = cc.loadShader('./frag.glsl')
        cb(vertexShaderSource, fragShaderSource)
    },
    setup: () => {
        console.log(vertexShaderSource)
    },
})

console.log(cc)