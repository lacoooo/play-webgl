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
    vec3 color=vec3(0.);
    float dist=distance(pos,mos);
    float dist2=distance(pos,mos/vec2(.4,.4));
    float dist3=distance(pos,mos/vec2(.2,.6));
    float distAll=mod(pow(noise(vec2(dist / dist3*u_time,dist2 / dist*u_time)),2.)*20.,.8);
    vec3 colorLight=vec3(
      (distAll*abs(sin(u_time/10.+dist)*100.)));
      color=6.-(color+colorLight
      *rand(pos)
      );
      // color.r*=pow(pos.y, pos.x);
      // color.g*=noise(pos * 5.);
      // color.b*=noise(pos * 5.);
      // color=AZUR;
      gl_FragColor=vec4(color,1.);
    } 