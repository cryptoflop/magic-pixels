import { onMount } from 'solid-js'

import rgba_noise from './assets/back-noise.png'

const NetherBack = () => {
  let vertScript: HTMLScriptElement
  let fragScript: HTMLScriptElement
  let canvas: HTMLCanvasElement

  onMount(() => {
    const gl = canvas.getContext('webgl2')!

    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!
    const vertShaderSrc = vertScript.innerHTML
    gl.shaderSource(vertexShader, vertShaderSrc)
    gl.compileShader(vertexShader)

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!
    const fragShaderSrc = fragScript.innerHTML
    gl.shaderSource(fragmentShader, fragShaderSrc)
    gl.compileShader(fragmentShader)

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.log(`Error compiling fragment shader:`)
      console.log(gl.getShaderInfoLog(fragmentShader))
    }

    const program = gl.createProgram()!
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)

    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.log('Error linking shader program:')
      console.log(gl.getProgramInfoLog(program))
    }

    let time = 0

    const uniforms: string[] = [
      'iResolution',
      'iTime'
    ]
    const unifrorms_dict: Record<string, WebGLUniformLocation | null> = {}
    uniforms.forEach(function(name) {
      unifrorms_dict[name] = gl.getUniformLocation(program, name)
    })

    const attributes = [
      'aVertexPosition',
      'aTexturePosition'
    ]
    const attributes_dict: Record<string, number> = {}
    attributes.forEach(function(name) {
      attributes_dict[name] = gl.getAttribLocation(program, name)
    })

    const vertices = new Float32Array([
      -1,  1, 0, 0,
      1,  1, 1, 0,
      -1, -1, 0, 1,
      1, -1, 1, 1
    ])

    const vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    const vertexCount = vertices.length / 4

    gl.useProgram(program)

    const animate = () => {
      // Check if the canvas has different size and make it the same.
      if (canvas.clientWidth  !== canvas.width || canvas.clientHeight !== canvas.height) {
        canvas.width = canvas.clientWidth
        canvas.height = canvas.clientHeight
      }

      // Setup viewport and clear it with black non transparent colour.
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.clearColor(0.0, 0.0, 0.0, 1.0)
      gl.clear(gl.COLOR_BUFFER_BIT)

      // Select a buffer for vertices attributes.
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

      gl.uniform2fv(unifrorms_dict['iResolution'], [canvas.width, canvas.height])
      gl.uniform1f(unifrorms_dict['iTime'], time)

      // Enable and setup attributes.
      gl.enableVertexAttribArray(attributes_dict['aVertexPosition'])
      gl.vertexAttribPointer(attributes_dict['aVertexPosition'], 2,
        gl.FLOAT, false, 4 * 4, 0)
      gl.enableVertexAttribArray(attributes_dict['aTexturePosition'])
      gl.vertexAttribPointer(attributes_dict['aTexturePosition'], 2,
        gl.FLOAT, false, 4 * 4, 2 * 4)

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexCount)

      window.requestAnimationFrame(function(currentTime) {
        time = currentTime / 1000
        animate()
      })
    }

    const img = new Image()
    img.onload = function() {
      gl.activeTexture(gl.TEXTURE0)
      const tex = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img)
      gl.generateMipmap(gl.TEXTURE_2D)

      const texLoc = gl.getUniformLocation(program, 'iChannel')
      gl.uniform1i(texLoc, 0)

      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)  // draw over the entire viewport

      animate()
    }
    img.src = rgba_noise
  })

  return <>
    <script type='x-shader/x-vertex' ref={vertScript!}>
      {`
        attribute vec2 aVertexPosition;
        attribute vec2 aTexturePosition;
         
        varying vec2 fragCoord;
         
        void main() {
            fragCoord = aTexturePosition;
            gl_Position = vec4(aVertexPosition, 0.0, 1.0);
        }
      `}
    </script>

    <script type='x-shader/x-fragment' ref={fragScript!}>
      {`
        #ifdef GL_ES
          precision mediump float;
        #endif

        uniform vec2 iResolution;
        uniform float iTime;

        uniform sampler2D iChannel;

        varying vec2 fragCoord;

        #define T(x) texture2D(iChannel, x)

        vec2 grid(in vec2 uv, in float x){ uv *= x; return uv - .5*sin(uv);}
        vec2 edge(in vec2 x){ return abs(fract(x)-.5);}

        void main() {
          vec2 uv = fragCoord;
    
          float amp = 0.;

          float t=iTime*.0025;
          
          vec2 a = grid(uv,10.), b = grid(uv,25.), c = grid(uv,50.);
          vec2 p = floor(a)/10.+t, q = floor(b)/25.+.7*t, s = floor(c)/50.+1.3*t;
          
          vec2 bp = ( edge(a) + edge(b) + edge(c) )/1.5;
          // bp*=bp*bp;
          
          mediump vec4 tex = .9*T(p)+.9*T(q)+.9*T(s); 
          tex -= .1*(bp.x+bp.y);
          tex *= 1.*smoothstep(1.+amp,1.8,tex.r)*tex;

          gl_FragColor = vec4(vec3(0.), 1.) + tex;
        }
      `}
    </script>

    <canvas class='h-screen w-screen fixed' ref={canvas!} />
  </>
}

export default NetherBack