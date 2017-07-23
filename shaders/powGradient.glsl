//renderer directives for performace and/or visuals
//renderScale: 0.25
//framerate: 60


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

/*
 * A one-liner
 */
void main() {

    float thirds = resolution.x/3.0/2.0;
    float r = (gl_FragCoord.x / gl_FragCoord.y / gl_FragCoord.y * 50.) * (sin(time)/5. + 0.75 - mouse.y/2.);
    float g = ((gl_FragCoord.x + 250.) / gl_FragCoord.y / 10.) * (sin(time)/5. + 0.75 + mouse.y/2.);
    float b = (gl_FragCoord.x / gl_FragCoord.y / 1.2) * (sin(time)/5. + 0.75 + mouse.y/2.);

    if(gl_FragCoord.x < thirds) {
        gl_FragColor = vec4(r/1.2, g, b, 1.0);
    } else if (gl_FragCoord.x < thirds*2.) {
        gl_FragColor = vec4(r, g, b/1.2, 1.0)/1.5;
    } else {
        gl_FragColor = vec4(r, g/1.2, b, 1.0)/1.5;
    }
}