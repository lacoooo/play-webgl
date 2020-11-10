import { ImageWrap, CanvasGL } from './canvasGL'

import * as mt from 'gl-matrix';
console.log('mat4', mt.mat4)

const color = [Math.random(), Math.random(), Math.random(), 1];

const c = new CanvasGL({
    init: {
        canvasId: 'webgl'
    },
    preload: (saveShader) => {
        saveShader(c.loadShader('./vert.glsl'), c.loadShader('./frag.glsl'))
    },
    setup: (program) => {
        if (!program) return
        c.createAttribute('a_position', 3)
        c.bufferData([
            // left column
              0,   0,  0,
             30,   0,  0,
              0, 150,  0,
              0, 150,  0,
             30,   0,  0,
             30, 150,  0,
  
            // top rung
             30,   0,  0,
            100,   0,  0,
             30,  30,  0,
             30,  30,  0,
            100,   0,  0,
            100,  30,  0,
  
            // middle rung
             30,  60,  0,
             67,  60,  0,
             30,  90,  0,
             30,  90,  0,
             67,  60,  0,
             67,  90,  0])
        const colorLocation = c.gl.getUniformLocation(program, "u_color");
        c.gl.uniform4fv(colorLocation, color);
        c.gl.drawArrays(c.gl.TRIANGLES, 0, 18);
    },
})

console.log(c)
