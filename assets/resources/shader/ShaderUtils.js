// ShaderUtils.js
var ShaderUtils = {
    shaderPrograms: {},

    setShader: function (sprite, shaderName) {
        var glProgram = this.shaderPrograms[shaderName];
        if (!glProgram) {
            glProgram = new cc.GLProgram();
            var vert = require(cc.js.formatStr("%s.vert", shaderName));
            var frag = require(cc.js.formatStr("%s.frag", shaderName));
            if (cc.sys.isNative) {
                glProgram.initWithString(vert, frag);
            } else {
                glProgram.initWithVertexShaderByteArray(vert, frag);
                glProgram.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
                glProgram.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
                glProgram.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
            }
            glProgram.link();
            glProgram.updateUniforms();
            this.shaderPrograms[shaderName] = glProgram;
        }
        sprite._sgNode.setShaderProgram(glProgram);
    },
    setShaderUniform: function(shaderName, uniformName, uniformValue){
        var glProgram = this.shaderPrograms[shaderName];
        if (glProgram) {
            glProgram.use();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(glProgram);
                glProgram_state.setUniformFloat(uniformName, uniformValue);
            } else {
                glProgram.setUniformLocationWith1f(glProgram.getUniformLocationForName(uniformName), uniformValue);
            }
        }
    },
    getGLShader: function (sprite) {
        return sprite._sgNode.getShaderProgram()
    },
    setGLShader: function (sprite, shader) {
        sprite._sgNode.setShaderProgram(shader);
    },
};

module.exports = ShaderUtils;
