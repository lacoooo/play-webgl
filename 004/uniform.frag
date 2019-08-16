precision mediump float;

varying vec2 vTexCoord;

uniform float time;

uniform sampler2D picture;

float rand(vec2 n) { 
	// if (n.x < 0.5) {
	// 	return 1.0;
	// }
	return sin(fract(sin( dot(n, vec2(11232.9898, 1433.1414)) ) * (452.0)) * vTexCoord.x * 10.0) * vTexCoord.x * 2.0;
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

//   float sineWave = sin(noise(uv + time) * 7.0);
//   uv.x = uv.x * sin(noise(uv + time) * 7.0);
//   uv.y = uv.y * cos(noise(uv + time) * 7.0);
  uv.x = uv.x * 0.95 + uv.x * rand(uv) * 0.05;

  vec4 texa = texture2D(picture, uv * 0.95 + uv * rand(uv) * 0.05);
  vec4 texb = texture2D(picture, uv);

  texa.r = texa.r * (1.0 - uv.x) + texb.r * 0.5 * uv.x * rand(uv);
  texa.g = texa.g * (1.0 - uv.x) + texb.g * 0.5 * uv.x * rand(uv + 100.0);
  texa.b = texa.b * (1.0 - uv.x) + texb.b * 0.5 * uv.x * rand(uv + 12.0);

  gl_FragColor = texa;
}