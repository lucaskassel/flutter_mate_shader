uniform float u_time;
uniform vec2 u_resolution;
uniform float u_displacementStrength;

out vec4 fragColor;

const int MAX_STEPS = 256;
const float EPSILON = 0.001;

vec3 sphereCenter = vec3(0.0, 0.0, -3.0);
float sphereRadius = 1.5;
float displacementScale = 3.5;

float displacementFunction(vec3 p, float time) {
    return sin(p.x * displacementScale + time) * sin(p.y * displacementScale + time) * sin(p.z * displacementScale + time) * 0.1 * u_displacementStrength;
}

void main()
{
    vec2 uv = (2.0 * gl_FragCoord.xy - u_resolution.xy) / min(u_resolution.y, u_resolution.x);
    vec3 rayOrigin = vec3(0.0, 0.0, 0.0);
    vec3 rayDirection = normalize(vec3(uv, -1.0));

    float time = u_time * 2.0;

    float t = 0.0;
    for (int i = 0; i < MAX_STEPS; ++i) {
        vec3 p = rayOrigin + rayDirection * t;
        float d = length(p - sphereCenter) - (sphereRadius + displacementFunction(p, time));
        if (d < EPSILON) {
            vec3 normal = normalize(p - sphereCenter);
            vec3 viewDir = normalize(rayOrigin - p);
            
            // Calculate Fresnel reflection
            float fresnel = pow(1.0 - dot(viewDir, normal), 1.2);
            vec3 reflectionColor = mix(vec3(0.239, 0.063, 1.0), vec3(1.0), fresnel);
            
            fragColor = vec4(reflectionColor, 1.0);
            return;
        }
        t += d;
        if (t > 100.0) break; // Exit loop if too far
    }

    fragColor = vec4(0.0, 0.0, 0.0, 0.0); // Background color
}