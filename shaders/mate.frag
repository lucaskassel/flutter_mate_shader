#include <flutter/runtime_effect.glsl>

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_intensity;

out vec4 fragColor;

float circle(float radius, vec2 uv) {
    float value = distance(vec2(uv.x + 0.01 * cos((5. * uv.y + u_time) * 4.)*u_intensity, uv.y + 0.01 * sin((5. * uv.x + u_time) * 2.)*u_intensity), vec2(0.5));
    return 1. - step(radius, value);
}

void main() {
   vec2 uv = FlutterFragCoord().xy / u_resolution;

    float alpha = 0.0;
    vec3 black = vec3(0.0);

    vec3 color = black;  // Set the sphere color to black

    float radius = 0.4;

    // Use the circle function to control transparency based on distance from the center
    alpha = circle(radius, uv);

    fragColor = vec4(color, alpha);
}