#include <flutter/runtime_effect.glsl>

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_intensity;

out vec4 fragColor;

float bubble(float radius, vec2 uv) {
    float value = distance(vec2(uv.x + 0.01 * cos((5. * uv.y + u_time) * 4.)*u_intensity, uv.y + 0.01 * sin((5. * uv.x + u_time) * 2.)*u_intensity), vec2(0.5));
    return 1. - step(radius, value);
}

void main() {
    vec2 uv = FlutterFragCoord().xy / u_resolution;

    float alpha = 0.0;
    
    // Check if the current fragment is inside the circle
    float radius = 0.4;
    alpha = bubble(radius, uv);

    vec3 foreground_colour = vec3(0.4, 0.0, 1.0);
    vec3 background_colour = vec3(0.0, 0.0, 0.0);
    vec3 final = mix(background_colour, foreground_colour, alpha);

    fragColor = vec4(final, alpha);  // Set alpha to 1.0 for the final output color
}
