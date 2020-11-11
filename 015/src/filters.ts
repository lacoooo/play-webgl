import { ImageWrap, CanvasGL } from './canvasGL'

declare global {
    interface HTMLInputElement {
        value: Effect['name']
    }
}

type Effect = {name: string, on?: boolean}

const kernels = {
    "normal": [
        0, 0, 0,
        0, 1, 0,
        0, 0, 0
    ],
    "gaussianBlur": [
        0.045, 0.122, 0.045,
        0.122, 0.332, 0.122,
        0.045, 0.122, 0.045
    ],
    "gaussianBlur2": [
        1, 2, 1,
        2, 4, 2,
        1, 2, 1
    ],
    "gaussianBlur3": [
        0, 1, 0,
        1, 1, 1,
        0, 1, 0
    ],
    "unsharpen": [
        -1, -1, -1,
        -1, 9, -1,
        -1, -1, -1
    ],
    "sharpness": [
        0, -1, 0,
        -1, 5, -1,
        0, -1, 0
    ],
    "sharpen": [
        -1, -1, -1,
        -1, 16, -1,
        -1, -1, -1
    ],
    "edgeDetect": [
        -0.125, -0.125, -0.125,
        -0.125, 1, -0.125,
        -0.125, -0.125, -0.125
    ],
    "edgeDetect2": [
        -1, -1, -1,
        -1, 8, -1,
        -1, -1, -1
    ],
    "edgeDetect3": [
        -5, 0, 0,
        0, 0, 0,
        0, 0, 5
    ],
    "edgeDetect4": [
        -1, -1, -1,
        0, 0, 0,
        1, 1, 1
    ],
    "edgeDetect5": [
        -1, -1, -1,
        2, 2, 2,
        -1, -1, -1
    ],
    "edgeDetect6": [
        -5, -5, -5,
        -5, 39, -5,
        -5, -5, -5
    ],
    "sobelHorizontal": [
        1, 2, 1,
        0, 0, 0,
        -1, -2, -1
    ],
    "sobelVertical": [
        1, 0, -1,
        2, 0, -2,
        1, 0, -1
    ],
    "previtHorizontal": [
        1, 1, 1,
        0, 0, 0,
        -1, -1, -1
    ],
    "previtVertical": [
        1, 0, -1,
        1, 0, -1,
        1, 0, -1
    ],
    "boxBlur": [
        0.111, 0.111, 0.111,
        0.111, 0.111, 0.111,
        0.111, 0.111, 0.111
    ],
    "triangleBlur": [
        0.0625, 0.125, 0.0625,
        0.125, 0.25, 0.125,
        0.0625, 0.125, 0.0625
    ],
    "emboss": [
        -2, -1, 0,
        -1, 1, 1,
        0, 1, 2
    ],
};

const effects: Effect[] = [
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

for (let i = 0; i < effects.length; i++) {
    const effect = effects[i];
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    const chk = document.createElement("input");
    chk.value = effect.name;
    chk.type = "checkbox";
    if (effect.on) {
        chk.checked = true;
    }
    chk.onchange = drawBufferToCanvas;
    td.appendChild(chk);
    td.appendChild(document.createTextNode('≡ ' + effect.name));
    tr.appendChild(td);
    tbody.appendChild(tr);
}

table.appendChild(tbody);
ui.appendChild(table);

let img: ImageWrap
const textures: Array<WebGLTexture | null> = []
const frameBuffers: Array<WebGLFramebuffer | null> = []
let u_flipY: WebGLUniformLocation | null
let u_textureSize: WebGLUniformLocation | null
let u_resolution: WebGLUniformLocation | null
let u_kernel: WebGLUniformLocation | null
let originalImageTexture: WebGLTexture | null
let u_kernelWeight: WebGLUniformLocation | null

const c = new CanvasGL({
    init: {
        canvasId: 'webgl'
    },
    preload: (saveShader) => {
        saveShader(c.loadShader('./vert.glsl'), c.loadShader('./frag.glsl'))
        img = c.loadImage('./1.jpg')
    },
    setup: (program) => {
        const gl = c.gl
        if (!program) return
        // c.u_image()
        c.createAttribute('a_position', 2, c.gl.FLOAT, false)
        c.setRect(0, 0, img.data.width, img.data.height)
        c.createAttribute('a_texCoord', 2, c.gl.FLOAT, false)
        // setTexCoord
        c.bufferData(new Float32Array([
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            1.0, 1.0
        ]))
        originalImageTexture = c.createTexture()
        c.texImage2D(img.data)

        for (let i = 0; i < 2; i++) {
            const texture = c.createTexture()
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, img.data.width, img.data.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            textures.push(texture)

            const fbo = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
            frameBuffers.push(fbo);

            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        }

        u_resolution = gl.getUniformLocation(program, "u_resolution")
        u_textureSize = gl.getUniformLocation(program, "u_textureSize");
        gl.uniform2f(u_textureSize, img.data.width, img.data.height);
        u_flipY = gl.getUniformLocation(program, "u_flipY");
        u_kernelWeight = gl.getUniformLocation(program, "u_kernelWeight");
        u_kernel = gl.getUniformLocation(program, "u_kernel[0]")

        drawBufferToCanvas()
    },
})

console.log(c)

function computeKernelWeight(kernel: any) {
    return kernel.reduce(function (prev: any, curr: any) {
        return prev + curr;
    })
  }

function drawBufferToCanvas() {
    const gl = c.gl

    gl.bindTexture(gl.TEXTURE_2D, originalImageTexture);

    gl.uniform1f(u_flipY, 1);
    let count = 0;
    for (let ii = 0; ii < tbody.rows.length; ++ii) {
      const child = tbody.rows[ii].firstChild
      if (!child) return
      const checkbox = child.firstChild as HTMLInputElement;
      if (!checkbox) return
      if (checkbox.checked) {
        const index = count % 2
        gl.uniform2f(u_resolution, img.data.width, img.data.height);
        gl.viewport(0, 0, img.data.width, img.data.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffers[index]);

        const kernel = kernels[checkbox.value]

        gl.uniform1fv(u_kernel, kernel);
        gl.uniform1f(u_kernelWeight, computeKernelWeight(kernel));
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.bindTexture(gl.TEXTURE_2D, textures[index]);
        count ++;
      }
    }
    gl.uniform1f(u_flipY, -1);

    gl.uniform2f(u_resolution, gl.canvas.width, gl.canvas.height);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.uniform1fv(u_kernel, kernels['normal']);
    gl.uniform1f(u_kernelWeight, 1);
    gl.drawArrays(gl.TRIANGLES, 0, 6)
}