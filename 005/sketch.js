// this time we're going to send an image to the shader
// in shaderland, an image is called a "texture"
// https://p5js.org/reference/#/p5.Shader/setUniform

// a shader variable
let uniformsShader;
let cactiImg;

function preload(){
  // load the shader
  uniformsShader = loadShader('uniform.vert', 'uniform.frag');
  cactiImg = loadImage('a4b1c53deb464e3d45f7bf6a682aafcd.jpg');
}

function setup() {
  size = 800
  // shaders require WEBGL mode to work
  createCanvas(560, 700, WEBGL);
  noStroke();
  console.log(cactiImg)
}

function draw() {  
  // shader() sets the active shader with our shader
  shader(uniformsShader);

  // uniformsShader.setUniform('time', frameCount * 0.01);

  uniformsShader.setUniform('mouseX', mouseX * 0.01);
  // setUniform can also send an image to a shader
  // 'picture' is the name of the variable in our shader
  // cactiImg, is a normal p5 image object
  uniformsShader.setUniform('picture', cactiImg);

  // rect gives us some geometry on the screen
  rect(0,0,width, height);
}

function windowResized(){
  resizeCanvas(560, 700);
}