import { CanvasGL } from './canvasGL'
import * as dat from 'dat.gui';
import * as mt from 'gl-matrix';
const gui = new dat.GUI();
const mat4 = mt.mat4

const ops = {
    x: 0,
    y: 0,
    z: 0,

    rotateX: 0,
    rotateY: 46,
    rotateZ: 180,

    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,

    fv: 90,
    cameraAngle: 0,
    cameraX: 200,
    cameraY: 200,
    cameraZ: 200
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
gui.add(ops, 'cameraAngle', -360, 360).onChange(draw)
gui.add(ops, 'cameraX', -360, 360).onChange(draw)
gui.add(ops, 'cameraY', -360, 360).onChange(draw)
gui.add(ops, 'cameraZ', -360, 360).onChange(draw)

function draw() {

    let cameraMatrix_0 = mat4.fromYRotation(mat4.create(), CanvasGL.degToRad(ops.cameraAngle));
    mat4.translate(cameraMatrix_0, cameraMatrix_0, [0, 0, ops.cameraZ]);
    const cameraPos = new Float32Array([cameraMatrix_0[12], cameraMatrix_0[13], cameraMatrix_0[14]]);
    // const cameraPos = new Float32Array([ops.cameraX, ops.cameraY, ops.cameraZ])
    const targetPos = new Float32Array([0, 0, 0]);
    const up = new Float32Array([0, 1, 0]);
    const cameraMatrix = mat4.lookAt(mat4.create(), cameraPos, targetPos, up);

    const translation = [ops.x, ops.y, ops.z]
    const rotation = [CanvasGL.degToRad(ops.rotateX), CanvasGL.degToRad(ops.rotateY), CanvasGL.degToRad(ops.rotateZ)];
    const scale = [ops.scaleX, ops.scaleY, ops.scaleZ];

    const m = mat4.perspective(mat4.create(), CanvasGL.degToRad(ops.fv), c.canvas.width / c.canvas.height, 1, 2000);
    
    mat4.multiply(m, m, cameraMatrix)
    mat4.translate(m, m, [translation[0], translation[1], translation[2]]);
    mat4.rotateX(m, m, rotation[0]);
    mat4.rotateY(m, m, rotation[1]);
    mat4.rotateZ(m, m, rotation[2]);
    mat4.scale(m, m, [scale[0], scale[1], scale[2]]);

    c.gl.enable(c.gl.CULL_FACE);
    c.gl.clear(c.gl.COLOR_BUFFER_BIT | c.gl.DEPTH_BUFFER_BIT);
    c.gl.uniformMatrix4fv(u_worldViewProjection, false, m);
    const worldMatrix = mat4.fromYRotation(mat4.create(), CanvasGL.degToRad(ops.cameraAngle));
    const worldInverseTransposeMatrix = mat4.transpose(mat4.create(), worldMatrix);
    c.gl.uniformMatrix4fv(u_worldInverseTranspose, false, worldInverseTransposeMatrix);
    c.gl.uniform3fv(u_reverseLightDirection, [0.5, 0.7, 1]);
    c.gl.drawArrays(c.gl.TRIANGLES, 0, 16 * 6);
}

let u_worldViewProjection: WebGLUniformLocation | null
let u_reverseLightDirection: WebGLUniformLocation | null
let u_worldInverseTranspose: WebGLUniformLocation | null

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
            200, 70, 120,
            200, 70, 120,
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

        c.createAttribute('a_normal', 3, c.gl.FLOAT, false)

        c.bufferData(new Float32Array([
                // 正面左竖
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
 
          // 正面上横
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
 
          // 正面中横
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
 
          // 背面左竖
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
 
          // 背面上横
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
 
          // 背面中横
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
          0, 0, -1,
 
          // 顶部
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
 
          // 上横右面
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
 
          // 上横下面
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
 
          // 上横和中横之间
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
 
          // 中横上面
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
          0, 1, 0,
 
          // 中横右面
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
 
          // 中横底面
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
 
          // 底部右侧
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
          1, 0, 0,
 
          // 底面
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
          0, -1, 0,
 
          // 左面
          -1, 0, 0,
          -1, 0, 0,
          -1, 0, 0,
          -1, 0, 0,
          -1, 0, 0,
          -1, 0, 0]))

          u_worldViewProjection = c.gl.getUniformLocation(program, "u_worldViewProjection");
          u_reverseLightDirection = c.gl.getUniformLocation(program, "u_reverseLightDirection");
          u_worldInverseTranspose = c.gl.getUniformLocation(program, "u_worldInverseTranspose");
        draw()

    },
})

console.log(c)
