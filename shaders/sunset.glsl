//renderer directives for performace and/or visuals
//renderScale: 0.25
//framerate: 60

#ifdef GL_ES
precision lowp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float coeiff = 0.2;
const vec3 totalSkyLight = vec3(0.3, 0.5, 1.0);

vec3 getSky(vec2 uv){

//	vec2 sunPos = vec2(0.5, cos(time * 0.15
//				  ));

    vec2 sunPos = vec2(mouse.x, cos(time * 0.2)*0.5 + mouse.y/2.);

	float scatterMult = distance(uv, clamp(sunPos, -1.0, 1.0));
	float sun = 1.0 - smoothstep(0.01, 0.011, scatterMult);

	float dist = uv.y;
	dist = (coeiff * mix(scatterMult, 1.0, dist)) / dist;

	vec3 color = dist * totalSkyLight;
	color = mix(pow(color, 1.0 - color),
	color / (2.0 * color + 0.5 - color),
	clamp(sunPos.y * 2.0, 0.0, 1.0))
	+ sun;

	color *=  1.0 + pow(1.0 - scatterMult, 10.0) * 10.0;

	float underscatter = distance(sunPos.y * 0.5 + 0.5, 1.0);

	color = mix(color, vec3(0.0), clamp(underscatter, 0.0, 1.0));

	return color;
}

void main( void ) {

	vec3 color = getSky(gl_FragCoord.xy / resolution.x);

	color = color / (2.0 * color + 0.5 - color);

	gl_FragColor = vec4(color, 1.0);
}