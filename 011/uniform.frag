precision mediump float;
varying vec2 vTexCoord;

#define PI 3.14159265358979323846

uniform vec2 resolution;
uniform float time;

void main (void) {
    vec2 uv = vTexCoord;
    gl_FragColor = vec4(uv.x - uv.y, uv.x + uv.y, uv.x / uv.y, uv.x * uv.y);
}