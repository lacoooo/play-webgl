precision mediump float;
varying vec3 v_normal;
varying vec4 v_color;

uniform vec3 u_reverseLightDirection;

void main(){

   vec3 v_normal = normalize(v_normal);

   float light = dot(v_normal, u_reverseLightDirection);

   gl_FragColor = vec4(light * v_color.rgb / 2.0 + v_color.rgb * 1.5, 1.0);
   
}