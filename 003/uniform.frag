precision mediump float;

varying vec2 vTexCoord;

uniform float time;

uniform sampler2D cactiTex;

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

void main() {

  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;

  float sineWave = sin(noise(uv) * 7.0);

  vec2 distort = vec2(noise(uv * 2.0 + time / 2.0), noise(uv * 2.0 + time / 2.0 + 100.0)) / 2.0;

  vec4 tex = texture2D(cactiTex, uv + distort);

  gl_FragColor = tex;
}