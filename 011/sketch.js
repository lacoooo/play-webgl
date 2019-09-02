let theShader;
let shaderTexture;

let theta = 0;

let x;
let y;
let outsideRadius = 200;
let insideRadius = 100;


window.preload = () => {
  // load the shader
  theShader = loadShader('uniform.vert','uniform.frag');
}

window.setup = () => {
  // shaders require WEBGL mode to work
  createCanvas(710, 400, WEBGL);
  noStroke();

  // initialize the createGraphics layers
  shaderTexture = createGraphics(1200, 800, WEBGL);

  // turn off the createGraphics layers stroke
  shaderTexture.noStroke();

   x = -50;
   y = 0;
}

window.draw = () => {

  // instead of just setting the active shader we are passing it to the createGraphics layer
  shaderTexture.shader(theShader);
  // console.log(millis())
  // here we're using setUniform() to send our uniform values to the shader
  theShader.setUniform("resolution", [width, height]);
  theShader.setUniform("time", millis() / 1000.0);
  theShader.setUniform("mouse", [mouseX, map(mouseY, 0, height, height, 0)]);
  // passing the shaderTexture layer geometry to render on
  shaderTexture.rect(0,0,width,height);

  background('rgba(200,200,200,.2)');

  // pass the shader as a texture
  // anything drawn after this will have this texture.
  texture(shaderTexture);

  translate(-150, 0, 0);
  push();
  rotateZ(theta * mouseX * 0.0001);
  rotateX(theta * mouseX * 0.0001);
  rotateY(theta * mouseX * 0.0001);  
  theta += 0.05;
  sphere(125);
  pop();

  /* when you put a texture or shader on an ellipse it is rendered in 3d,
     so a fifth parameter that controls the # vertices in it becomes necessary,
     or else you'll have sharp corners. setting it to 100 is smooth. */
  let ellipseFidelity = int(map(mouseX, 0, width, 8, 100));
  ellipse(260, 0, 200, 200, ellipseFidelity);
}