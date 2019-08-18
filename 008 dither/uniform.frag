precision mediump float;

varying vec2 vTexCoord;

uniform float mouseX;
uniform float mouseY;

uniform float size;

uniform sampler2D picture;

float cell(float c, float m) {
  return mod(floor(c * size), m);
}

float rand(vec2 n) { 
	return fract(sin( dot(n, vec2(12.9898, 4.1414)) ) * 43758.5453);
}

void main() {

  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;
  vec4 texo = texture2D(picture, uv);

  vec4 tex = vec4(vec3(ceil((texo.r + texo.g + texo.b) * mouseX) / 3.0 / mouseX), 1.0);

  if (floor(tex.r * 5.0) == 0.0) {
    tex = vec4(vec3(0.0), 1.0);
  }

  else if (floor(tex.r * 5.0) == 1.0) {
    if (cell(uv.x, 2.0) == 0.0) {
      if (cell(uv.y, 2.0) == 0.0) {
        tex = vec4(vec3(0.0), 1.0);
      } else {
        tex = vec4(vec3(0.0), 1.0);
      }
    } else {
      if (cell(uv.y, 2.0) == 0.0) {
        tex = texo;
      } else {
        tex = vec4(vec3(0.0), 1.0);
      }
    }
  }

  else if (floor(tex.r * 5.0) == 2.0) {
    if (cell(uv.x, 2.0) == 0.0) {
      if (cell(uv.y, 2.0) == 0.0) {
        tex = vec4(vec3(0.0), 1.0);
      } else {
        tex = texo;
      }
    } else {
      if (cell(uv.y, 2.0) == 0.0) {
        tex = vec4(vec3(1.0), 1.0);
      } else {
        tex = vec4(vec3(0.0), 1.0);
      }
    }
  }

  else if (floor(tex.r * 5.0) == 3.0) {
    if (cell(uv.x, 2.0) == 0.0) {
      if (cell(uv.y, 2.0) == 0.0) {
        tex = vec4(vec3(0.0), 1.0);
      } else {
        tex = vec4(vec3(0.0), 1.0);
      }
    } else {
      if (cell(uv.y, 2.0) == 0.0) {
        tex = vec4(vec3(1.0), 1.0);
      } else {
        tex = texo;
      }
    }
  }

  else if (floor(tex.r * 5.0) == 4.0) {
    tex = vec4(vec3(1.0), 1.0);
  }

  if (fract(sin(uv.x * 0.5 + tex.r * 3.0) * 50.0) > tex.r) {
	// tex = vec4(vec3(0.1), 1.0);
  } else {
	tex = vec4(vec3(0.5 + rand(uv) * 0.5), 1.0);
  }

  gl_FragColor = tex;
}