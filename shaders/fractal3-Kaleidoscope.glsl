#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 mouse;
uniform float time;
uniform vec2 resolution;

vec2 getPos() {
        vec2 pos = ( gl_FragCoord.xy / resolution.xy ) - vec2(0.15);
        pos.x *= resolution.x / resolution.y;
        return pos;
}

float iterate(vec2 p){
	float strength = 7. + 1.3 * sin(time*2.);
	float accum = 0.;
	float prev = 0.;
	float tw = 0.;
	for (int i = 0; i < 34; ++i)
	{
		float mag = dot(p, p);
		p = abs(p) / mag - mouse/10. - vec2(0.7,0.46) + vec2(abs(cos(time*.17)*.123)+.0125,abs(sin(time*.063)*.143)+.013);
		accum += exp(-float(i) / 13. - strength * pow(abs(mag - prev), 5.));
		prev = mag;
	}
	return max(.2, 5. * accum *.09 - .14);
}


void main( void ){
	vec2 cstime = vec2(cos(time/13.),sin(time/13.));
        vec2  c2 = getPos()*.95+cstime+mouse*.5;
        float m;

	float  col2 = iterate(c2);//-0.123*vec2(col1,0.));

        gl_FragColor = exp(col2)*.051 * vec4(1.,1.4,1.,1.);
}
/// zodi