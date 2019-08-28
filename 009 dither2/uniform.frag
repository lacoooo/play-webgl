precision mediump float;

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

vec4 color(float r, float m, float t) {
  if (r * 10.0 < m) {
    // if (t == 4.0) {
    //   return vec4(0.0, 0.0, 0.0, 1.0);
    // } else if (t == 5.0) {
    //   return vec4(0.0, 0.0, rand(vTexCoord), 1.0);
    // } else if (t == 6.0) {
    //   return vec4(0.0, rand(vTexCoord), 0.0, 1.0);
    // }
    return vec4(0.0, 0.0, 0.0, 1.0);
  } else {
    // if (t == 1.0) {
    //   return vec4(rand(vTexCoord), 1.0, 1.0, 1.0);
    // } else if (t == 2.0) {
    //   return vec4(rand(vTexCoord), rand(vTexCoord), 1.0, 1.0);
    // } else if (t == 3.0) {
    //   return vec4(rand(vTexCoord), 1.0, rand(vTexCoord), 1.0);
    // }
    return vec4(1.0, 1.0, 1.0, 1.0);
  }
}

void main() {

  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;
  vec4 texo = texture2D(picture, uv);

  vec4 tex = vec4(vec3(ceil((texo.r + texo.g + texo.b) * mouseX) / 3.0 / mouseX), 1.0);
  // vec4 tex = texo;
  float x = cell(uv.x, 3.0);
  float y = cell(uv.y, 3.0);
  if (x == 0.0) {
    if (y == 0.0) {
      tex = color(tex.r, dither[0][0], 1.0);
    } else if (y == 1.0) {
      tex = color(tex.r, dither[0][1], 2.0);
    } else if (y == 2.0) {
      tex = color(tex.r, dither[0][2], 3.0);
    }
  } else if (x == 1.0) {
    if (y == 0.0) {
      tex = color(tex.r, dither[1][0], 4.0);
    } else if (y == 1.0) {
      tex = color(tex.r, dither[1][1], 5.0);
    } else if (y == 2.0) {
      tex = color(tex.r, dither[1][2], 6.0);
    }
  } else if (x == 2.0) {
    if (y == 0.0) {
      tex = color(tex.r, dither[2][0], 7.0);
    } else if (y == 1.0) {
      tex = color(tex.r, dither[2][1], 8.0);
    } else if (y == 2.0) {
      tex = color(tex.r, dither[2][2], 9.0);
    }
  }

  gl_FragColor = tex;
}