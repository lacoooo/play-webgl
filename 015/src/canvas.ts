declare global {
    interface Window {
        Canvas: typeof Canvas
    }
}

export interface Iparams {
    init: Iinit
    preload: () => void
    setup: () => void
}

export type Iinit = {
    canvasId?: string
    width?: number
    height?: number
}

class Canvas {

    #canvas!: HTMLCanvasElement
    #ctx!: WebGLRenderingContext
    #preloadLeftCount = 0
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
        this.#ctx = this.#canvas.getContext('webgl') as WebGLRenderingContext
    }

    protected _createElement(elem = "div"): HTMLElement {
        const d = document.createElement(elem)
        return d
    }

    public loadShader(url: string): {data: string} {
        const wrap = {data: ''}
        this.loadFile(url, wrap)
        return wrap
    }

    private async loadFile(url: string, wrap: any): Promise<void> {

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

    public preload(cb: () => void) {
        if (cb) cb()
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

}

window.Canvas = Canvas

let vertexShaderSource: any

const canvas = new Canvas({
    init: {
        canvasId: 'webgl'
    },
    preload: () => {
        vertexShaderSource = canvas.loadShader('./vert.glsl')
    },
    setup: () => {
        console.log(vertexShaderSource)
      },
})

return

//片元着色器源码
var fragShaderSource = '' +
    'void main(){' +
    //定义片元颜色
    '   gl_FragColor = vec4(1.0,0.0,0.0,1.0);' +
    '}';

//初始化着色器
var program = initShader(gl, vertexShaderSource, fragShaderSource);
//开始绘制，显示器显示结果
gl.drawArrays(gl.POINTS, 0, 1);

//声明初始化着色器函数
function initShader(gl, vertexShaderSource, fragmentShaderSource) {
    //创建顶点着色器对象
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    //创建片元着色器对象
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    //引入顶点、片元着色器源代码
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    //编译顶点、片元着色器
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    //创建程序对象program
    var program = gl.createProgram();
    //附着顶点着色器和片元着色器到program
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    //链接program
    gl.linkProgram(program);
    //使用program
    gl.useProgram(program);
    //返回程序program对象
    return program;
}