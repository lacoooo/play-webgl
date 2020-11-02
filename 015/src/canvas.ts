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
    data: HTMLImageElement = new Image()
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

    redraw(cb: (gl: WebGLRenderingContext, program: WebGLProgram | null) => void) {
        cb(this.#gl, this.#program)
    }
}

let img: ImageWrap



const kernels = {
    normal: [
        0, 0, 0,
        0, 1, 0,
        0, 0, 0
    ],
    gaussianBlur: [
        0.045, 0.122, 0.045,
        0.122, 0.332, 0.122,
        0.045, 0.122, 0.045
    ],
    gaussianBlur2: [
        1, 2, 1,
        2, 4, 2,
        1, 2, 1
    ],
    gaussianBlur3: [
        0, 1, 0,
        1, 1, 1,
        0, 1, 0
    ],
    unsharpen: [
        -1, -1, -1,
        -1, 9, -1,
        -1, -1, -1
    ],
    sharpness: [
        0, -1, 0,
        -1, 5, -1,
        0, -1, 0
    ],
    sharpen: [
        -1, -1, -1,
        -1, 16, -1,
        -1, -1, -1
    ],
    edgeDetect: [
        -0.125, -0.125, -0.125,
        -0.125, 1, -0.125,
        -0.125, -0.125, -0.125
    ],
    edgeDetect2: [
        -1, -1, -1,
        -1, 8, -1,
        -1, -1, -1
    ],
    edgeDetect3: [
        -5, 0, 0,
        0, 0, 0,
        0, 0, 5
    ],
    edgeDetect4: [
        -1, -1, -1,
        0, 0, 0,
        1, 1, 1
    ],
    edgeDetect5: [
        -1, -1, -1,
        2, 2, 2,
        -1, -1, -1
    ],
    edgeDetect6: [
        -5, -5, -5,
        -5, 39, -5,
        -5, -5, -5
    ],
    sobelHorizontal: [
        1, 2, 1,
        0, 0, 0,
        -1, -2, -1
    ],
    sobelVertical: [
        1, 0, -1,
        2, 0, -2,
        1, 0, -1
    ],
    previtHorizontal: [
        1, 1, 1,
        0, 0, 0,
        -1, -1, -1
    ],
    previtVertical: [
        1, 0, -1,
        1, 0, -1,
        1, 0, -1
    ],
    boxBlur: [
        0.111, 0.111, 0.111,
        0.111, 0.111, 0.111,
        0.111, 0.111, 0.111
    ],
    triangleBlur: [
        0.0625, 0.125, 0.0625,
        0.125, 0.25, 0.125,
        0.0625, 0.125, 0.0625
    ],
    emboss: [
        -2, -1, 0,
        -1, 1, 1,
        0, 1, 2
    ]
};

const effects = [
    { name: "gaussianBlur3", on: true },
    { name: "gaussianBlur3", on: true },
    { name: "gaussianBlur3", on: true },
    { name: "sharpness", },
    { name: "sharpness", },
    { name: "sharpness", },
    { name: "sharpen", },
    { name: "sharpen", },
    { name: "sharpen", },
    { name: "unsharpen", },
    { name: "unsharpen", },
    { name: "unsharpen", },
    { name: "emboss", on: true },
    { name: "edgeDetect", },
    { name: "edgeDetect", },
    { name: "edgeDetect3", },
    { name: "edgeDetect3", },
];

const ui = document.querySelector("#ui") as Element;
const table = document.createElement("table");
const tbody = document.createElement("tbody");

const drawEffects = () => {
    console.log(1111)
}

for (var ii = 0; ii < effects.length; ++ii) {
    var effect = effects[ii];
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    var chk = document.createElement("input");
    chk.value = effect.name;
    chk.type = "checkbox";
    if (effect.on) {
        chk.checked = true;
    }
    chk.onchange = drawEffects;
    td.appendChild(chk);
    td.appendChild(document.createTextNode('≡ ' + effect.name));
    tr.appendChild(td);
    tbody.appendChild(tr);
}
table.appendChild(tbody);
ui.appendChild(table);


const c = new Canvas({
    init: {
        canvasId: 'webgl'
    },
    preload: (saveShader) => {
        saveShader(c.loadShader('./vert.glsl'), c.loadShader('./frag.glsl'))
        img = c.loadImage('./1.jpg')
    },
    setup: (gl, program) => {
        if (!program) return

        const u_resolution = () => {
            const UL = gl.getUniformLocation(program, "u_resolution")
            gl.uniform2f(UL, gl.canvas.width, gl.canvas.height)
        }

        const u_image = () => {
            const UL = gl.getUniformLocation(program, "u_image")
            gl.uniform1i(UL, 0);
        }

        const createAttribute = (name: string, size = 2) => {
            const buffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

            const AL = gl.getAttribLocation(program, name)
            gl.enableVertexAttribArray(AL)

            const type = gl.FLOAT
            const normalize = false
            const stride = 0
            const offset_1 = 0
            gl.vertexAttribPointer(AL, size, type, normalize, stride, offset_1)
        }

        const createTexture = () => {
            const texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);

            // Set the parameters so we can render any size image.
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

            return texture;
        }

        const setPosition = (x: number, y: number, width: number, height: number) => {
            var x1 = x
            var x2 = x + width
            var y1 = y
            var y2 = y + height
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                x1, y1,
                x2, y1,
                x1, y2,

                x1, y2,
                x2, y1,
                x2, y2,
            ]), gl.STATIC_DRAW)
        }

        const setTexCoord = () => {
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                0.0, 0.0,
                1.0, 0.0,
                0.0, 1.0,
                0.0, 1.0,
                1.0, 0.0,
                1.0, 1.0,
            ]), gl.STATIC_DRAW);
        }

        const setColor = () => {
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

        u_resolution()
        u_image()
        createAttribute('a_position', 2)
        setPosition(0, 0, img.data.width, img.data.height)
        createAttribute('a_texCoord', 2)
        setTexCoord()
        createTexture()
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img.data);

        const textures = []
        const frameBuffers = []
        for (let i = 0; i < 2; i++) {
            const texture = createTexture()
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, img.data.width, img.data.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            textures.push(texture)

            const fbo = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
            frameBuffers.push(fbo);

            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        }

        // createAttribute('a_color', 4)
        // setColor()
        gl.drawArrays(gl.TRIANGLES, 0, 6)

    },
})

c.redraw((gl, program) => {
    console.log('redraw', gl, program)
});

console.log(c)