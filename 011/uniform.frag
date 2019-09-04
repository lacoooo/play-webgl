precision mediump float;
varying vec2 vTexCoord;

#define PI 3.14159265358979323846

uniform vec2 resolution;
uniform float time;

float rand(vec2 n) { 
	return fract(sin( dot(n, vec2(12.9898, 4.1414)) ) * 43758.5453);
}

float noise(vec2 p){
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u*u*(3.0-2.0*u);
	
	float res = mix(
		mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
		mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
	return res*res;
}

void main (void) {
    vec2 uv = vTexCoord;
    float c = rand(uv * 1.5);
    vec4 t = vec4(c, c, c, uv.y);
	if (uv.y * rand(uv * 1.5) > 0.3) {
		c = 0.0;
	}
	t = vec4(c, c, c, uv.y);
    gl_FragColor = t;
}