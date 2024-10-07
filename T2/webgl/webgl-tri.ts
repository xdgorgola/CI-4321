main();

function main() {
  // Obtaining canvas from html and creating webgl2 context
  const canvas = document.querySelector("#glcanvas") as HTMLCanvasElement | null;
  if (canvas === null) throw new Error("No canvas element.")
  
  const gl = canvas.getContext("webgl2");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  if (gl === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it.",
    );
    return;
  }

  // Shaders
  var vertexShaderSource = `#version 300 es
  in vec4 a_position;
  in vec4 a_color;
  out vec4 v_color;

  void main() {
    gl_Position = a_position;
    v_color = a_color;
  }
  `;

  var fragmentShaderSource = `#version 300 es
  precision highp float;
  
  in vec4 v_color;
  out vec4 outColor;
  
  void main() {
    // Just set the output to a constant reddish-purple
    outColor = v_color;
  }
  `;

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  const program = createProgram(gl, vertexShader, fragmentShader);
  if (program === undefined) {
    alert("Problem linking shaders.")
    return;
  }

  // Vertex shader attributes init
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const verColorAttributeLocation = gl.getAttribLocation(program, "a_color");
  const positionBuffer = gl.createBuffer();
  const colorBuffer = gl.createBuffer();

  // Data binding for position attrib
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positions = [
    -0.5, -0.5,
    0, 0.87,
    0.5, -0.5
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  // Data binding for color attrib
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  const colors = [
    0, 1, 0, 1,
    1, 0, 0, 1,
    0, 0, 1, 1
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(verColorAttributeLocation);
  gl.vertexAttribPointer(verColorAttributeLocation, 4, gl.FLOAT, false, 0, 0);

  // Setting canvas
  resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.05, 0.05, 0.09, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Final touches
  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

// According to the author of WebGL Fundamentals, this is boilerplate
function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

// According to the author of WebGL Fundamentals, this is boilerplate
function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return undefined;
}

// According to the author of WebGL Fundamentals, this is boilerplate
function resizeCanvasToDisplaySize(canvas) {
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;

  const needResize = canvas.width !== displayWidth ||
    canvas.height !== displayHeight;

  if (needResize) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }

  return needResize;
}