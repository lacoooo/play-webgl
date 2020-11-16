precision mediump float;
varying vec3 v_normal;
varying vec4 v_color;
varying vec2 v_texcoord;

uniform sampler2D u_texture;
uniform vec3 u_reverseLightDirection;

void main(){

   vec3 v_normal = normalize(v_normal);

   float light = dot(v_normal, u_reverseLightDirection);

   vec3 color = light * v_color.rgb / 2.0 + v_color.rgb * 1.5;

   gl_FragColor = vec4(color, 1.0);

   gl_FragColor = texture2D(u_texture, v_texcoord);
   
}