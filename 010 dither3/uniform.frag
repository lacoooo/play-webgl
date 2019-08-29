precision lowp float;

varying vec2 vTexCoord;

uniform float mouseX;
uniform float mouseY;

uniform float dither4[64];

uniform float size;

uniform sampler2D picture;

mat3 dither = mat3(8.0, 3.0, 4.0,
                   6.0, 1.0, 2.0,
                   7.0, 5.0, 9.0); 

mat3 dither2 = mat3(1.0, 7.0, 4.0,
                    5.0, 8.0, 3.0,
                    6.0, 2.0, 9.0); 

mat4 dither3 = mat4(0.0, 8.0, 2.0, 10.0,
                    12.0, 4.0, 14.0, 6.0,
                    3.0, 11.0, 1.0, 9.0,
                    15.0, 7.0, 13.0, 5.0); 


int cell(float c, float m) {
  float t = mod(floor(c * size), m);
  int e = int(t);
  return e;
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



vec4 color(vec4 c, float m, float ms) {
  c = c * 64.0;
  if (c.r < m) {
    c.r = 0.0;
  } else {
    c.r = 1.0;
  }
  if (c.g < m) {
    c.g = 0.0;
  } else {
    c.g = 1.0;
  }
  if (c.b < m) {
    c.b = 0.0;
  } else {
    c.b = 1.0;
  }
  return vec4(c.r, c.g, c.b, 1.0);
}

float getData(int x, int y) {
    for (int i=0; i<8; i++) {
      for (int j=0; j<8; j++) {
        if (x * 8 + y == i * 8 + j) {
          return dither4[i * 8 + j];
        }
      }
    }
}

void main() {

  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;
  vec4 texo = texture2D(picture, uv);

  float r = ceil(texo.r * mouseX) / mouseX;
  float g = ceil(texo.g * mouseX) / mouseX;
  float b = ceil(texo.b * mouseX) / mouseX;
  vec4 tex = vec4(r, g, b, 1.0);
  tex = texo;
  // vec4 tex = vec4(vec3(ceil((texo.r + texo.g + texo.b) * mouseX) / 3.0 / mouseX), 1.0);
  int x = cell(uv.x, 8.0);
  int y = cell(uv.y, 8.0);

  tex = color(tex, getData(x, y), 8.0);

  gl_FragColor = tex;
}