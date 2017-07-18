#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float color = 0.0;
	color = sin(position.x * position.y)* sin(time);
	color += -sin(position.y/position.y) * cos ( time);

	gl_FragColor = vec4(color-(position.x),color, color-(position.x-.4),1);

}