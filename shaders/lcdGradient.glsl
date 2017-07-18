#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265358979323

vec3 drawing(vec2 uv){
	return vec3(sin(uv.x+sin((uv.y*4.)+time)),sin(uv.y+sin((uv.x*2.)+time)),sin((2.*uv.x)+cos(uv.y+time)));
}

void main(void){
	vec2 uv=gl_FragCoord.xy/resolution.xy;
	vec2 div=vec2(100.,50.);
	vec3 o=vec3(0.);
	for(int i=0;i<3;i++){
		float fi=float(i);
		o[i]=drawing(floor(uv*div)/div)[i]*pow(abs(sin((fract(uv.x*div.x)+(fi/3.))*PI)),0.5);//(fract(uv.x*div.x)>=(fi/3.)&&fract(uv.x*div.x)<((fi+1.)/3.)?1.:0.);
	}
	o*=mix(pow(sin(fract(uv.y*div.y)*PI),0.4),1.,0.9);
	gl_FragColor=vec4(o*2.0,1.);
}