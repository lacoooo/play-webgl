precision mediump float;

varying vec2 vTexCoord;

uniform float time;

uniform float mouseX;

uniform sampler2D picture;

float rand(vec2 n){
	return fract(sin(dot(n,vec2(12.9898,4.1414)))*43758.5453);
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
		
		vec2 uv=vTexCoord;
		uv.y=1.-uv.y;
		
		float sineWave=sin(noise(uv)*2.);
		
		vec2 distort=vec2(noise(uv*(10.-time)),0.);
		
		vec4 tex=texture2D(picture,uv+rand(uv*.0001*mouseX)*.1);
		
		tex=tex
		// *rand(uv*.0001)
		;
		
		gl_FragColor=tex;
	}