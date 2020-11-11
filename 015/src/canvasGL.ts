// declare this.global {
//     interface Window {
//         Canvas: Canvasthis.gl
//     }
// }

export interface Iparams {
    init: Iinit
    preload: (callback: (vert: ShaderWrap, frag: ShaderWrap) => void) => void
    setup: (program: WebGLProgram) => void
}

export type Iinit = {
    canvasId?: string
    width?: number
    height?: number
}

export class ShaderWrap {
    data = ''
}

export class ImageWrap {
    data: HTMLImageElement = new Image()
}

export class CanvasGL {

    canvas!: HTMLCanvasElement
    gl!: WebGLRenderingContext
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
            if (canvas !== null) this.canvas = canvas
            else this.canvas = this._createElement("canvas") as HTMLCanvasElement
        }
        else {
            this.canvas = this._createElement("canvas") as HTMLCanvasElement
            document.body.appendChild(this.canvas)
        }
        this.gl = this.canvas.getContext('webgl') as WebGLRenderingContext
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
            wrap.data.src = objectURL
            await new Promise((r) => {
                wrap.data.onload = r
            })
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

    private validShader(shader: WebGLShader) {
        
        if ( !this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS) ) {
            const info = this.gl.getShaderInfoLog( shader );
            throw new Error("Could not compile WebGL program. \n\n" + info)
          }
          return shader;
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

        if (!this.#program) {
            throw new Error('No program')
        }

        if (cb) cb(this.#program)
    }

    private initShader() {
        let vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER)
        let fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER)
        if (!vertexShader || !fragmentShader) {
            throw new Error('No shader file')
        }
        this.gl.shaderSource(vertexShader, this.vertexShaderSource.data)
        this.gl.shaderSource(fragmentShader, this.fragmentShaderSource.data)
        this.gl.compileShader(vertexShader)
        this.gl.compileShader(fragmentShader)

        this.validShader(vertexShader)
        this.validShader(fragmentShader)

        this.#program = this.gl.createProgram()
        if (!this.#program) {
            throw new Error('No program')
        }
        
        this.gl.attachShader(this.#program, vertexShader)
        this.gl.attachShader(this.#program, fragmentShader)
        this.gl.linkProgram(this.#program)
        this.gl.useProgram(this.#program)
    }

    public draw(cb: Iparams['setup']): void {
        if (!this.#program) {
            throw new Error('No program')
        }
        cb(this.#program)
    }

    public createAttribute(name: string, size: number, type: number, normalize: boolean) {
        
        const program = this.#program
        if (!program) {
            throw new Error('No program')
        }
        const buffer = this.gl.createBuffer()
        if (!buffer) {
            throw new Error('can not create buffer')
        }
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer)

        const attribLocation = this.gl.getAttribLocation(program, name)
        this.gl.enableVertexAttribArray(attribLocation)

        this.gl.vertexAttribPointer(attribLocation, size, type, normalize, 0, 0)
    }

    public setRect(x: number, y: number, width: number, height: number) {
        var x1 = x
        var x2 = x + width
        var y1 = y
        var y2 = y + height
        this.bufferData(new Float32Array([
            x1, y1,
            x2, y1,
            x1, y2,

            x1, y2,
            x2, y1,
            x2, y2,
        ]))
    }

    public bufferData(dataArray: Uint8Array | Float32Array) {
        if (!dataArray) {
            throw new Error('No dataArray')
        }
        if (!dataArray.length) {
            throw new Error('Empty data array')
        }
        
        this.gl.bufferData(this.gl.ARRAY_BUFFER, dataArray, this.gl.STATIC_DRAW);
    }

    public createTexture() {
        
        const texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

        // Set the parameters so we can render any size image.
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

        return texture;
    }

    // public u_image() {
        
    //     const program = this.#program
    //     if (!program) {
    //         throw new Error('No program')
    //     }
    //     const uniformLocation = this.gl.getUniformLocation(program, "u_image")
    //     this.gl.uniform1i(uniformLocation, 0);
    // }

    public texImage2D(img: HTMLImageElement) {
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, img);
    }

    static degToRad(d: number) {
        return d * Math.PI / 180;
    }
}