// white.frag.js
module.exports =
`
#ifdef GL_ES
precision lowp float;
#endif

varying vec4 v_fragmentColor;
varying vec2 v_texCoord;
//uniform float sys_time;
varying float ccTime;
const float T = 1.0 / 100.0;
const float active = 0.5; //(-1.0, 1.0)
const float F = 4.0;

void main()
{
	const float PI = acos(-1.0);
    vec4 c = v_fragmentColor * texture2D(CC_Texture0, v_texCoord);
	float t = v_texCoord.y;v_texCoord;// + ccTime * T * F;
    //float siny = sin(t / T * 2.0 * PI + ccTime * timeScale);
    float siny = sin(t / T * 2.0 * PI);
	gl_FragColor = vec4(c.rgb, (siny < active ? 1.0 : 0.0) * c.a);

}
`
