import { CanvasGL } from './canvasGL'
import * as dat from 'dat.gui';
import * as mt from 'gl-matrix';
const gui = new dat.GUI();

const ops = {
    x: -150,
    y: 0,
    z: -360,

    rotateX: 190,
    rotateY: 30,
    rotateZ: 320,

    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,

    fv: 90
}

gui.add(ops, 'x', -500, 500).onChange(draw)
gui.add(ops, 'y', -500, 500).onChange(draw)
gui.add(ops, 'z', -500, 500).onChange(draw)

gui.add(ops, 'rotateX', 0, 360).onChange(draw)
gui.add(ops, 'rotateY', 0, 360).onChange(draw)
gui.add(ops, 'rotateZ', 0, 360).onChange(draw)

gui.add(ops, 'scaleX', -2, 2).onChange(draw)
gui.add(ops, 'scaleY', -2, 2).onChange(draw)
gui.add(ops, 'scaleZ', -2, 2).onChange(draw)

gui.add(ops, 'fv', -100, 200).onChange(draw)

const mat4 = mt.mat4

const m4 = {
    projection: function (width: number, height: number, depth: number) {
        return new Float32Array([
            2 / width, 0, 0, 0,
            0, -2 / height, 0, 0,
            0, 0, 2 / depth, 0,
            -1, 1, 0, 1,
        ]);
    },
    orthographic: function (left: number, right: number, bottom: number, top: number, near: number, far: number) {
        return new Float32Array([
            2 / (right - left), 0, 0, 0,
            0, 2 / (top - bottom), 0, 0,
            0, 0, 2 / (near - far), 0,

            (left + right) / (left - right),
            (bottom + top) / (bottom - top),
            (near + far) / (near - far),
            1,
        ])
    },
    perspective: function (fieldOfViewInRadians: number, width: number, height: number, near: number, far: number) {
        const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
        const rangeInv = 1.0 / (near - far);
     
        const aspect = width / height;

        console.log(new Float32Array([
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * rangeInv, -1,
            0, 0, near * far * rangeInv * 2, 0
          ]))

        return new Float32Array([
          f / aspect, 0, 0, 0,
          0, f, 0, 0,
          0, 0, (near + far) * rangeInv, -1,
          0, 0, near * far * rangeInv * 2, 0
        ]);
    },
    translate: function (m: mt.mat4, tx: number, ty: number, tz: number) {
        return mat4.translate(m, m, [tx, ty, tz]);
    },
    xRotate: function (m: mt.mat4, angleInRadians: number) {
        return mat4.rotateX(m, m, angleInRadians);
    },
    yRotate: function (m: mt.mat4, angleInRadians: number) {
        return mat4.rotateY(m, m, angleInRadians);
    },
    zRotate: function (m: mt.mat4, angleInRadians: number) {
        return mat4.rotateZ(m, m, angleInRadians);
    },
    scale: function (m: mt.mat4, sx: number, sy: number, sz: number) {
        return mat4.scale(m, m, [sx, sy, sz]);
    },
};

function draw() {
    const translation = [ops.x, ops.y, ops.z]
    const rotation = [CanvasGL.degToRad(ops.rotateX), CanvasGL.degToRad(ops.rotateY), CanvasGL.degToRad(ops.rotateZ)];
    const scale = [ops.scaleX, ops.scaleY, ops.scaleZ];

    let matrix = m4.perspective(60, c.canvas.width, c.canvas.height, 1, 2000);
    m4.translate(matrix, translation[0], translation[1], translation[2]);
    m4.xRotate(matrix, rotation[0]);
    m4.yRotate(matrix, rotation[1]);
    m4.zRotate(matrix, rotation[2]);
    m4.scale(matrix, scale[0], scale[1], scale[2]);

    c.gl.enable(c.gl.CULL_FACE);

    c.gl.clear(c.gl.COLOR_BUFFER_BIT | c.gl.DEPTH_BUFFER_BIT);

    c.gl.uniformMatrix4fv(u_matrix, false, matrix);
    c.gl.uniform1f(u_fudgeFactor, ops.fv);

    c.gl.drawArrays(c.gl.TRIANGLES, 0, 16 * 6);
}

let u_matrix: WebGLUniformLocation | null
let u_fudgeFactor: WebGLUniformLocation | null

const c = new CanvasGL({
    init: {
        canvasId: 'webgl'
    },
    preload: (saveShader) => {
        saveShader(c.loadShader('./vert.glsl'), c.loadShader('./frag.glsl'))
    },
    setup: (program) => {
        if (!program) return
        c.gl.enable(c.gl.DEPTH_TEST);
        c.createAttribute('a_position', 3, c.gl.FLOAT, false)
        c.bufferData(new Float32Array([
            // left column front
            0, 0, 0,
            0, 150, 0,
            30, 0, 0,
            0, 150, 0,
            30, 150, 0,
            30, 0, 0,

            // top rung front
            30, 0, 0,
            30, 30, 0,
            100, 0, 0,
            30, 30, 0,
            100, 30, 0,
            100, 0, 0,

            // middle rung front
            30, 60, 0,
            30, 90, 0,
            67, 60, 0,
            30, 90, 0,
            67, 90, 0,
            67, 60, 0,

            // left column back
            0, 0, 30,
            30, 0, 30,
            0, 150, 30,
            0, 150, 30,
            30, 0, 30,
            30, 150, 30,

            // top rung back
            30, 0, 30,
            100, 0, 30,
            30, 30, 30,
            30, 30, 30,
            100, 0, 30,
            100, 30, 30,

            // middle rung back
            30, 60, 30,
            67, 60, 30,
            30, 90, 30,
            30, 90, 30,
            67, 60, 30,
            67, 90, 30,

            // top
            0, 0, 0,
            100, 0, 0,
            100, 0, 30,
            0, 0, 0,
            100, 0, 30,
            0, 0, 30,

            // top rung right
            100, 0, 0,
            100, 30, 0,
            100, 30, 30,
            100, 0, 0,
            100, 30, 30,
            100, 0, 30,

            // under top rung
            30, 30, 0,
            30, 30, 30,
            100, 30, 30,
            30, 30, 0,
            100, 30, 30,
            100, 30, 0,

            // between top rung and middle
            30, 30, 0,
            30, 60, 30,
            30, 30, 30,
            30, 30, 0,
            30, 60, 0,
            30, 60, 30,

            // top of middle rung
            30, 60, 0,
            67, 60, 30,
            30, 60, 30,
            30, 60, 0,
            67, 60, 0,
            67, 60, 30,

            // right of middle rung
            67, 60, 0,
            67, 90, 30,
            67, 60, 30,
            67, 60, 0,
            67, 90, 0,
            67, 90, 30,

            // bottom of middle rung.
            30, 90, 0,
            30, 90, 30,
            67, 90, 30,
            30, 90, 0,
            67, 90, 30,
            67, 90, 0,

            // right of bottom
            30, 90, 0,
            30, 150, 30,
            30, 90, 30,
            30, 90, 0,
            30, 150, 0,
            30, 150, 30,

            // bottom
            0, 150, 0,
            0, 150, 30,
            30, 150, 30,
            0, 150, 0,
            30, 150, 30,
            30, 150, 0,

            // left side
            0, 0, 0,
            0, 0, 30,
            0, 150, 30,
            0, 0, 0,
            0, 150, 30,
            0, 150, 0]))

        c.createAttribute('a_color', 3, c.gl.UNSIGNED_BYTE, true)

        c.bufferData(new Uint8Array([
            // left column front
            200, 70, 120,
            200, 70, 120,

            // top rung front
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,

            // middle rung front
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,
            200, 70, 120,

            // left column back
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,

            // top rung back
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,

            // middle rung back
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,
            80, 70, 200,

            // top
            70, 200, 210,
            70, 200, 210,
            70, 200, 210,
            70, 200, 210,
            70, 200, 210,
            70, 200, 210,

            // top rung right
            200, 200, 70,
            200, 200, 70,
            200, 200, 70,
            200, 200, 70,
            200, 200, 70,
            200, 200, 70,

            // under top rung
            210, 100, 70,
            210, 100, 70,
            210, 100, 70,
            210, 100, 70,
            210, 100, 70,
            210, 100, 70,

            // between top rung and middle
            210, 160, 70,
            210, 160, 70,
            210, 160, 70,
            210, 160, 70,
            210, 160, 70,
            210, 160, 70,

            // top of middle rung
            70, 180, 210,
            70, 180, 210,
            70, 180, 210,
            70, 180, 210,
            70, 180, 210,
            70, 180, 210,

            // right of middle rung
            100, 70, 210,
            100, 70, 210,
            100, 70, 210,
            100, 70, 210,
            100, 70, 210,
            100, 70, 210,

            // bottom of middle rung.
            76, 210, 100,
            76, 210, 100,
            76, 210, 100,
            76, 210, 100,
            76, 210, 100,
            76, 210, 100,

            // right of bottom
            140, 210, 80,
            140, 210, 80,
            140, 210, 80,
            140, 210, 80,
            140, 210, 80,
            140, 210, 80,

            // bottom
            90, 130, 110,
            90, 130, 110,
            90, 130, 110,
            90, 130, 110,
            90, 130, 110,
            90, 130, 110,

            // left side
            160, 160, 220,
            160, 160, 220,
            160, 160, 220,
            160, 160, 220,
            160, 160, 220,
            160, 160, 220]))

            u_matrix = c.gl.getUniformLocation(program, "u_matrix");
            u_fudgeFactor = c.gl.getUniformLocation(program, "u_fudgeFactor");

        draw()

    },
})

console.log(c)
