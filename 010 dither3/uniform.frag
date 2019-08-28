precision lowp float;

varying vec2 vTexCoord;

uniform float mouseX;
uniform float mouseY;

uniform float size;

uniform sampler2D picture;

mat3 dither = mat3(8.0, 3.0, 4.0,
                   6.0, 1.0, 2.0,
                   7.0, 5.0, 9.0); 

mat3 dither2 = mat3(1.0, 7.0, 4.0,
                    5.0, 8.0, 3.0,
                    6.0, 2.0, 9.0); 

float cell(float c, float m) {
  return mod(floor(c * size), m);
}

float rand(vec2 n) { 
	return fract(sin( dot(n, vec2(12.9898, 4.1414)) ) * 43758.5453);
}

vec4 color(vec4 c, float m, float t) {
  c = c * 10.0;
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
    c.g = 0.0;
  } else {
    c.g = 1.0;
  }
  return vec4(c.r, c.g, c.b, 1.0);
}

void main() {

  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;
  vec4 texo = texture2D(picture, uv);

  float r = ceil(texo.r * mouseX) / mouseX;
  float g = ceil(texo.g * mouseX) / mouseX;
  float b = ceil(texo.b * mouseX) / mouseX;
  vec4 tex = vec4(r, g, b, 1.0);
  float x = cell(uv.x, 3.0);
  float y = cell(uv.y, 3.0);
  if (x == 0.0) {
    if (y == 0.0) {
      tex = color(tex, dither2[0][0], 1.0);
    } else if (y == 1.0) {
      tex = color(tex, dither2[0][1], 2.0);
    } else if (y == 2.0) {
      tex = color(tex, dither2[0][2], 3.0);
    }
  } else if (x == 1.0) {
    if (y == 0.0) {
      tex = color(tex, dither2[1][0], 4.0);
    } else if (y == 1.0) {
      tex = color(tex, dither2[1][1], 5.0);
    } else if (y == 2.0) {
      tex = color(tex, dither2[1][2], 6.0);
    }
  } else if (x == 2.0) {
    if (y == 0.0) {
      tex = color(tex, dither2[2][0], 7.0);
    } else if (y == 1.0) {
      tex = color(tex, dither2[2][1], 8.0);
    } else if (y == 2.0) {
      tex = color(tex, dither2[2][2], 9.0);
    }
  }

  gl_FragColor = tex;
}