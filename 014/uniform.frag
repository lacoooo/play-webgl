precision mediump float;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D u_texture_0;

vec3 pow(vec3 color,float num){
  return vec3(pow(color.r,num),pow(color.g,num),pow(color.b,num));
}

float rand(vec2 n){
  return fract(sin(dot(n,vec2(12.9898,4.1414)))*400008.5453);
}

float noise(vec2 p){
  vec2 ip=floor(p);
  vec2 u=fract(p);
  u=u*u*(3.-2.*u);
  
  float res=mix(
    mix(rand(ip),rand(ip+vec2(1.,0.)),u.x),
    mix(rand(ip+vec2(0.,1.)),rand(ip+vec2(1.,1.)),u.x),u.y);
    return res*res;
  }
  
  void main(){
    vec2 pos=gl_FragCoord.xy/u_resolution;
    pos.x*=u_resolution.x/u_resolution.y;
    vec2 mos=u_mouse/u_resolution;
    vec3 color=vec3(.7333,.6039,.6039);
    vec3 texb=texture2D(u_texture_0,pos,0.).rgb;
    gl_FragColor=vec4(texb,1.);
  }