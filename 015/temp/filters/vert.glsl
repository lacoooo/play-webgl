attribute vec2 a_position;
uniform vec2 u_resolution;

attribute vec2 a_texCoord;
varying vec2 v_texCoord;
uniform float u_flipY;

vec2 transView() {
    // 从像素坐标转换到 0.0 到 1.0
    vec2 zeroToOne = a_position / u_resolution;
 
    // 再把 0->1 转换 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;
 
    // 把 0->2 转换到 -1->+1 (裁剪空间)
    vec2 clipSpace = zeroToTwo - 1.0;

    return clipSpace * vec2(1, u_flipY);
}

void main(){
 
    gl_Position = vec4(transView(), 0, 1);
    v_texCoord = a_texCoord;
}