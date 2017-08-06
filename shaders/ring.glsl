//renderer directives for performace and/or visuals
//renderScale: 0.5
//framerate: 60

#ifdef GL_ES
precision lowp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main()
{
    vec2 r = resolution,
    o = gl_FragCoord.xy - r/2.;
    o = vec2(length(o) / r.y - .3, atan(o.y,o.x));
    vec4 s = .1*cos(1.6*vec4(0,1,2,3) + time + o.y + sin(o.y) * sin(time)*2.),
    e = s.yzwx,
    f = max(o.x-s,e-o.x);
    gl_FragColor = dot(clamp(f*r.y,0.,1.), 70.*(s-e)) * (s-.1) + f;
}
