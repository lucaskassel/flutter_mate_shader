#include <flutter/runtime_effect.glsl>

uniform float u_time;
uniform vec2 u_resolution;

out vec4 fragColor;

float circle(float radius, vec2 uv) {
    float value = distance(vec2(uv.x + 0.01 * cos((5. * uv.y + u_time) * 4.), uv.y + 0.01 * sin((5. * uv.x + u_time) * 2.)), vec2(0.5));
    return 1. - step(radius, value);
}

void main() {
    vec2 uv = FlutterFragCoord().xy / u_resolution;

    float alpha = 0.9;
    vec3 white = vec3(1.0);
    vec3 black = vec3(0.0);
    vec3 red = vec3(1.0, 0.0, 0.0);

    vec3 color = white;

    float radius = 0.4;
    color = mix(color, black, 1. - circle(radius - 0.05, uv));

    fragColor = vec4(color, alpha);
}