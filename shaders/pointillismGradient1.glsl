precision mediump float;

uniform vec2 resolution;
//uniform vec2 mouse;

void main() {
	vec2 p = gl_FragCoord.xy / resolution.xy;
	 
	float sxy =mod(gl_FragCoord.x,2.0)-mod(gl_FragCoord.y,2.0);
	 
	gl_FragColor =vec4(p.x,p.y,0.0,1.0)*sxy;
}// End of File