
class DataControl {

  constructor() {
    this.types = []
    this.points = []
  }

  addPoint(point) {
    this.points.push(point)
  }

  appendDom(type, klass, parent, content = '') {
    let dom = document.createElement(type)
    dom.className = klass
    dom.innerHTML = content
    parent.appendChild(dom)
    return dom
  }

  updatePoints(pano) {
    if (!this.points.length) {
      return
    }
    this.points.forEach(ele => {
      ele.posScreen = this.getScreenPosition(ele.pos3d, pano)
      if (!ele.dom) {
        this.addNewTag(ele, pano)
      }
      if (ele.posScreen) {
        ele.posScreen = {
          x: Math.round(ele.posScreen.x),
          y: Math.round(ele.posScreen.y)
        }
        ele.dom.style.top = `${ele.posScreen.y}px`
        ele.dom.style.left = `${ele.posScreen.x}px`
        ele.dom.style.display = 'block'
      } else {
        ele.dom.style.display = 'none'
      }
      if (ele.status === 'bye') {
        document.querySelector(`#${ele.dom.id}`).remove()
      }
    })
    this.points = this.points.filter(ele => ele.status !== 'bye')
  }

  addNewTag(ele, pano) {
    ele.dom = document.createElement('div')
    ele.dom.className = 'pointWrap'
    ele.dom.id = `tag-${this.points.length}`
    ele.dom.addEventListener('mousedown', (ev = window.event) => {
      ev.preventDefault()
      pano.isControllingTag = true
    })

    let point = this.appendDom('div', 'point', ele.dom)
    let line = this.appendDom('div', 'line', ele.dom)
    let typeSelect = this.appendDom('div', 'typeSelect', ele.dom)

    let selectItemType = this.appendDom('div', 'selectItem', typeSelect, '留言')
    selectItemType.addEventListener('click', (ev = window.event) => {
      ev.preventDefault()
      let contentWords = typeSelect
      contentWords.className = 'contentWords'
      let words = [
        '小美：好壮观呀！',
        '小杰：我家就在这里',
        '小磊：太美了',
        '小梦：我也想到这里来',
        '小万：厉害了厉害了'
      ]
      contentWords.innerHTML = words[Math.floor(Math.random()* words.length)]
    })

    let selectItemName = this.appendDom('div', 'selectItem', typeSelect, '名称')
    selectItemName.addEventListener('click', (ev = window.event) => {
      ev.preventDefault()
      let contentName = typeSelect
      contentName.className = 'contentName'
      let names = [
        '马山', '海岸城', '金匮公园', '人民医院', '崇安寺', '鼋头渚', '江南大学', '雪浪山'
      ]
      contentName.innerHTML = names[Math.floor(Math.random()* names.length)]
    })
    
    let selectItemCancel = this.appendDom('div', 'selectItem', typeSelect, '取消')
    selectItemCancel.addEventListener('click', (ev = window.event) => {
      ev.preventDefault()
      ele.status = 'bye'
    })

    pano.op.appendChild(ele.dom)
  }

  getScreenPosition(vec, pano) {
    // console.log(THREE)
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