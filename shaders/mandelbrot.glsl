#ifdef GL_ES
precision mediump float;
#endif

varying vec2 surfacePosition;
uniform float time;

#define maxiter 20
#define m1 1.0
#define m2 0.2
//#define x1 0.45
//#define y1 0.4
//#define x2 -0.5
//#define y2 -0.25
#define r1 1.0
#define r2 0.5
#define v1 0.5
#define v2 0.9

void main( void )
{
	vec2 z = vec2(0., 0.0);
	float p = 0.0;
	float dist = 0.0;
	float x1 = cos(time*v1)*r1;
	float y1 = sin(time*v1)*r1;
	float x2 = cos(time*v2)*r2;
	float y2 = sin(time*v2)*r2;
	for (int i=0; i<maxiter; ++i)
	{
		z *= 2.0;
		z = vec2(z.x*z.x-z.y*z.y, z.x*z.y*2.0) + surfacePosition;
		p = m1/sqrt((z.x-x1)*(z.x-x1)+(z.y-y1)*(z.y-y1))+m2/sqrt((z.x-x2)*(z.x-x2)+(z.y-y2)*(z.y-y2));
		if (p > dist)
		{
			dist = p;
		}
	}
	dist = dist*0.01;
	gl_FragColor = vec4(dist/0.3, dist*dist/0.03, dist/0.1, 1.0);
}