precision mediump float;

uniform vec2 u_resolution;

uniform vec2 u_mouse;

uniform float u_time;

vec3 pow (vec3 color, float num) {
	return vec3(pow(color.r, num), pow(color.g, num), pow(color.b, num));
}

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
  vec2 pos = gl_FragCoord.xy / u_resolution;
  pos.x *= u_resolution.x / u_resolution.y;
  vec2 mos = u_mouse / u_resolution;
  vec3 color = vec3(0.0);
  float dist = distance(pos, mos);
  float dist2 = distance(pos, mos * vec2(0.4, 0.4));
  float dist3 = distance(pos, mos * vec2(0.2, 0.6));
  float distAll = pow(noise(vec2(dist / dist2 * 10.0, dist3 * 10.0 * noise(pos * 5.0))), 2.);
  vec3 colorLight = vec3((distAll * (u_time * 120.)) * .2);
  color = 1.5 - (color + colorLight
  * rand(pos)
  );
  color.r *= pos.y / pos.x;
  color.g*= pos.y / pos.x;
  color.b  *= pos.y / pos.x;
  gl_FragColor = vec4(color, 1.0);
}