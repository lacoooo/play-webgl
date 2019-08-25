
class DataControl {

  constructor() {
    this.points = []
  }

  addPoint(point) {
    this.points.push(point)
  }

  updatePoints(pano) {
    if (!this.points.length) {
      return
    }
    this.points.forEach(ele => {
      ele.matrixWorldNeedsUpdate = true
      ele.posScreen = this.getScreenPosition(ele.pos3d, pano)
      if (!ele.dom) {
        ele.dom = document.createElement('div')
        ele.dom.classList.add('pointWrap')
        pano.op.appendChild(ele.dom)
      }
      if (ele.posScreen) {
        ele.posScreen = {
          x: Math.round(ele.posScreen.x),
          y: Math.round(ele.posScreen.y)
        }
        console.log(ele.posScreen)
        ele.dom.style.top = `${ele.posScreen.y}px`
        ele.dom.style.left = `${ele.posScreen.x}px`
        ele.dom.style.display = 'block'
      } else {
        // ele.dom.style.display = 'none'
      }
    })
  }

  getScreenPosition(vec, pano) {
    let vecTotal = 
    Math.abs(vec.position.x) + 
    Math.abs(vec.position.y) + 
    Math.abs(vec.position.z)

    let tar = pano.camera.target

    let vecDistanceTotal = 
    Math.abs(vec.position.x - tar.x) +
    Math.abs(vec.position.y - tar.y) + 
    Math.abs(vec.position.z - tar.z)
    // console.log(vecTotal, vecDistanceTotal)
    if (vecTotal < vecDistanceTotal) {
        return false
    }
    let pos = new THREE.Vector3()
    pos = pos.setFromMatrixPosition(vec.matrixWorld)
    pos.project(pano.camera);
    
    let widthHalf = pano.options.width / 2;
    let heightHalf = pano.options.height / 2;
    
    pos.x = (pos.x * widthHalf) + widthHalf;
    pos.y = - (pos.y * heightHalf) + heightHalf;
    pos.z = 0;
    
    if (pos.x > 0 && pos.x < pano.options.width && pos.y > 0 && pos.y < pano.options.height) {
        return pos
    }
    return false
}

}

export default new DataControl()