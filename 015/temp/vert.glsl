attribute vec4 a_position;
attribute vec4 a_color;
varying vec4 v_color;

attribute vec2 a_texcoord;
varying vec2 v_texcoord;

attribute vec3 a_normal;
varying vec3 v_normal;

uniform mat4 u_worldViewProjection;
uniform mat4 u_worldInverseTranspose;

void main() {

  gl_Position = u_worldViewProjection * a_position;

  v_color = a_color;
  v_normal = mat3(u_worldInverseTranspose) * a_normal;
  v_texcoord = a_texcoord;
}