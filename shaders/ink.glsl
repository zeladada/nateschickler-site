//renderer directives for performace and/or visuals
//renderScale: 0.3
//framerate: 60

#ifdef GL_ES
precision lowp float;
#endif
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

const float Pi = 3.14159;
const int zoom = 71;
const float speed = 0.1;
float fScale = 1.1;

void main(void)
{
    float t = (25. +(sin(time)));
	
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec2 p=(4.0*gl_FragCoord.xy-resolution.xy)/max(resolution.x,resolution.y)
	        + time*0.01 + mouse.x*0.1 - mouse.y*0.1;
	
	float ct =  t * speed * 2.;
	
	for(int i=1;i<zoom;i++) {
		vec2 newp=p;
		newp.x+=0.25/float(i)*cos(float(i)*p.y+t*cos(ct)*0.3/40.0+0.03*float(i))*fScale+10.0;
		newp.y+=0.5/float(i)*cos(float(i)*p.x+sin(t)*ct*0.3/50.0+0.03*float(i+10))*fScale+15.0;
		p=newp;
	}
	
	vec3 col=vec3(1.5*sin(1.0*p.x)+0.5, 0.5*cos(3.0*p.y)+0.3, cos(p.x+p.y));
	gl_FragColor=vec4(col, 1.0);
}