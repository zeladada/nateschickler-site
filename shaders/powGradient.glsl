void main() {
  gl_FragColor = vec4(gl_FragCoord.x / gl_FragCoord.y / gl_FragCoord.y * 200.,  // R
                      (gl_FragCoord.x + 1000.) / gl_FragCoord.y / 10.,  // G
                      gl_FragCoord.x / gl_FragCoord.y / 1.2,  // B
                      1.0); // A
}