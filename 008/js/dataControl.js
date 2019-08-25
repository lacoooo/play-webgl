
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
      // ele.matrixWorldNeedsUpdate = true
      ele.posScreen = this.getScreenPosition(ele.pos3d, pano)
      if (!ele.dom) {
        ele.dom = document.createElement('div')
        ele.dom.classList.add('pointWrap')
        ele.dom.addEventListener('click', (ev = window.event) => {
          ev.preventDefault()
          console.log(ele)
        })
        pano.op.appendChild(ele.dom)
      }
      if (ele.posScreen) {
        ele.posScreen = {
          x: Math.round(ele.posScreen.x),
          y: Math.round(ele.posScreen.y)
        }
        ele.dom.style.top = `${ele.posScreen.y}px`
        ele.dom.style.left = `${ele.posScreen.x}px`
        ele.dom.style.display = 'block'
        // console.log(ele.dom)
      } else {
        ele.dom.style.display = 'none'
      }
    })
  }

  getScreenPosition(vec, pano) {
    const distCamera = vec.position.distanceTo(pano.camera.target)
    const distCenter = vec.position.distanceTo(new THREE.Vector3(0, 0, 0))
    if (distCamera * .8 > distCenter) {
        return false
    }
    let pos = new THREE.Vector3()
    pos = pos.setFromMatrixPosition(vec.matrixWorld)
    pos.project(pano.camera)
    
    let widthHalf = pano.options.width / 2
    let heightHalf = pano.options.height / 2
    
    pos.x = (pos.x * widthHalf) + widthHalf
    pos.y = - (pos.y * heightHalf) + heightHalf
    pos.z = 0
    const width = pano.options.width
    const height = pano.options.height
    if (pos.x > -width && pos.x < width && 
        pos.y > -height && pos.y < height) {
        return pos
    }
    return false
}

}

export default new DataControl()