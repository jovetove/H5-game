var ez;
(function (ez) {
    var singleVS = `
attribute vec2 pos;
attribute float quad;
uniform vec4 tc;	//xoff,yoff,width,height
uniform float t[8];	//mat2d,width,height
uniform vec4 quads[MAX_QUAD * 2];//x,y,angle,size,color
varying vec2 v_tc;
varying vec2 v_pos;
varying vec4 v_color;

void main(){
	int idx = int(quad) * 2;
	vec4 p0 = quads[idx];
	float c = cos(p0.z) * p0.w;
	float s = sin(p0.z) * p0.w;
	v_tc = vec2(pos.x * tc.z + tc.x, pos.y * tc.w + tc.y);
	pos -= vec2(0.5, 0.5);
	float x = pos.x * t[6] * c - pos.y * t[7] * s + p0.x;
	float y = pos.x * t[6] * s + pos.y * t[7] * c + p0.y;
	gl_Position = vec4(x * t[0] + y * t[2] + t[4] - 1.0, x * t[1] + y * t[3] + t[5] + 1.0, 0.0, 1.0);	
	v_pos = pos;
	v_color = quads[idx + 1];
}`;
    var framesVS = `
attribute vec2 pos;
attribute float quad;
uniform float t[8];
uniform vec4 tc;	//uoff,voff,width,height
uniform vec4 quads[MAX_QUAD * 2];
uniform vec2 frames[MAX_QUAD]; //uoff,voff
varying vec2 v_tc;
varying vec2 v_pos;
varying vec4 v_color;
void main(){
	int idx = int(quad) * 2;
	vec4 p0 = quads[idx];
	vec2 frame = frames[int(quad)];
	float c = cos(p0.z) * p0.w;
	float s = sin(p0.z) * p0.w;
	v_tc = vec2(pos.x * tc.z + frame.x + tc.x, pos.y * tc.w + frame.y + tc.y);
	pos -= vec2(0.5, 0.5);
	float x = pos.x * t[6] * c - pos.y * t[7] * s + p0.x;
	float y = pos.x * t[6] * s + pos.y * t[7] * c + p0.y;
	gl_Position = vec4(x * t[0] + y * t[2] + t[4] - 1.0, x * t[1] + y * t[3] + t[5] + 1.0, 0.0, 1.0);
	v_pos = pos;
	v_color = quads[idx + 1];
}`;
    var MaxQuads;
    var MaxFramesQuads;
    function getShader(frames) {
        var gl = ez.getGL();
        if (!MaxQuads) {
            var limit = gl.getParameter(36347);
            MaxQuads = Math.min(128, (limit - 3) >> 1);
            MaxFramesQuads = Math.min(128, ((limit - 2) / 3) | 0);
        }
        if (frames) {
            var name = "particle2d_Seq";
            if (ez.Effect.has(name))
                return ez.Effect.get(name);
            ez.Effect.register(name, new ez.Shader(`#define MAX_QUAD ${MaxFramesQuads}\n` + framesVS, ez.Effect.DefFS2D, ["pos", "quad"], { texture0: gl.uniform1i, quads: gl.uniform4fv, t: gl.uniform1fv }));
            return ez.Effect.get(name);
        }
        else {
            var name = "particle2d";
            if (ez.Effect.has(name))
                return ez.Effect.get(name);
            ez.Effect.register(name, new ez.Shader(`#define MAX_QUAD ${MaxFramesQuads}\n` + singleVS, ez.Effect.DefFS2D, ["pos", "quad"], { texture0: gl.uniform1i, quads: gl.uniform4fv, t: gl.uniform1fv }));
            return ez.Effect.get(name);
        }
    }
    class ParticleSprite extends ez.Sprite {
        constructor(stage, id) {
            super(stage, id);
        }
        _draw(rc, opacity) {
        }
        getType() {
            return ParticleSprite.Type;
        }
    }
    ParticleSprite.Type = "Particle";
    ez.ParticleSprite = ParticleSprite;
})(ez || (ez = {}));

//# sourceMappingURL=particle2D.js.map
