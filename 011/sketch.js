let theShader
let shaderTexture

let theta = 0

let x
let y
let outsideRadius = 200
let insideRadius = 100

let data = []

window.preload = () => {
  // load the shader
  theShader = loadShader('uniform.vert', 'uniform.frag')
}

window.setup = () => {
  // shaders require WEBGL mode to work
  createCanvas(1200, 800, WEBGL)
  noStroke()
  // stroke(1)

  // initialize the createGraphics layers
  shaderTexture = createGraphics(1200, 800, WEBGL)

  // turn off the createGraphics layers stroke
  shaderTexture.noStroke()

  x = -50
  y = 0
  for (var i = 0; i < 100; i++) {
    data.push({
      x: random(-100, 100),
      y: random(-100, 100),
      z: random(-100, 100),
      w: random(100, 450),
      h: random(100, 450),
      d: random(100, 450)
    })
  }
}

window.draw = () => {
  // instead of just setting the active shader we are passing it to the createGraphics layer
  shaderTexture.shader(theShader)
  // console.log(millis())
  // here we're using setUniform() to send our uniform values to the shader
  theShader.setUniform('resolution', [width, height])
  theShader.setUniform('time', millis() / 1000.0)
  // passing the shaderTexture layer geometry to render on
  shaderTexture.rect(0, 0, width, height)

  background('rgba(210,210,210,1)')

  // pass the shader as a texture
  // anything drawn after this will have this texture.
  texture(shaderTexture)

  // push();
  rotateZ(theta * mouseX * 0.0001)
  rotateX(theta * mouseX * 0.0001)
  rotateY(theta * mouseX * 0.0001)
  theta += 0.05
  for (var i = 0; i < 100; i++) {
    var t = data[i]
    // rotateZ(i * 0.0001)
    // rotateX(i * 0.0001);
    // rotateY(i * 0.0001);
    translate(t.x, 0, t.z)
    cylinder(t.w / 3, t.h * 2)
  }
  // pop();
}

window.keyPressed = params => {
  if (window.keyCode == 83) {
    save()
  }
}
