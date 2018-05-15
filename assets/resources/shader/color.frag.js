// white.frag.js
module.exports =
`
#ifdef GL_ES
precision lowp float;
#endif

varying vec4 v_fragmentColor;
varying vec2 v_texCoord;

void main()
{
	float alpha = texture2D(CC_Texture0, v_texCoord).a;
	gl_FragColor = vec4(v_fragmentColor.rgb, alpha);

}
`
