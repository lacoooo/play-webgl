// this time we're going to send an image to the shader
// in shaderland, an image is called a "texture"
// https://p5js.org/reference/#/p5.Shader/setUniform

// a shader variable
let uniformsShader;
// let cactiImg;

let dither4 = new Float32Array([0.0,  48.0, 12.0, 60.0, 3.0,  51.0, 15.0, 63.0,
  32.0, 16.0, 44.0, 28.0, 35.0, 19.0, 47.0, 31.0,
  8.0,  56.0, 4.0,  52.0, 11.0, 59.0, 7.0,  55.0,
  40.0, 24.0, 36.0, 20.0, 43.0, 27.0, 39.0, 23.0,
  2.0,  50.0, 14.0, 62.0, 1.0,  49.0, 13.0, 61.0,
  34.0, 18.0, 46.0, 30.0, 33.0, 17.0, 45.0, 29.0,
  10.0, 58.0, 6.0,  54.0, 9.0,  57.0, 5.0,  53.0,
  42.0, 26.0, 38.0, 22.0, 41.0, 25.0, 37.0, 21.0])

function preload(){
  // load the shader
  uniformsShader = loadShader('uniform.vert', 'uniform.frag');
  // cactiImg = loadImage('1.jpg');
}

function setup() {
  size = 500
  size = {
    w: window.innerWidth,
    h: window.innerHeight
  }
  // shaders require WEBGL mode to work
  createCanvas(size.w, size.h, WEBGL);
  noStroke();
  // console.log(cactiImg)
  cam = createCapture(VIDEO);
  cam.size(windowWidth, windowHeight);

  // hide the html element that createCapture adds to the screen
  cam.hide();
}

function draw() {  
  // shader() sets the active shader with our shader
  shader(uniformsShader);

  // uniformsShader.setUniform('time', frameCount * 0.01);

  uniformsShader.setUniform('mouseX', mouseX * 0.01);
  
  uniformsShader.setUniform('mouseY', mouseY);
  uniformsShader.setUniform('size', size.w);
  // setUniform can also send an image to a shader
  // 'picture' is the name of the variable in our shader
  // cactiImg, is a normal p5 image object
  uniformsShader.setUniform('picture', cam);
  // uniformsShader.setUniform('picture', cactiImg);

  uniformsShader.setUniform('dither4', dither4);

  // rect gives us some geometry on the screen
  rect(0,0,width, height);
}

function keyPressed(params) {
  if (keyCode == 83) {
    save();
  }
}

function windowResized(){
  resizeCanvas(size.w, size.h);
}