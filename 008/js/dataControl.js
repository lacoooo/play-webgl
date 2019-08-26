
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
    if (!pano.canControl) return
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

    let selectItemName = this.appendDom('div', 'selectItem', typeSelect, '地点名称')
    selectItemName.addEventListener('click', (ev = window.event) => {
      ev.preventDefault()
      let contentName = typeSelect
      contentName.className = 'contentName'
      let names = [
        '马山', '海岸城', '金匮公园', '人民医院', '崇安寺', '鼋头渚', '江南大学', '雪浪山'
      ]
      contentName.innerHTML = names[Math.floor(Math.random()* names.length)]
    })

    let selectItemArticle = this.appendDom('div', 'selectItem', typeSelect, '图文介绍')
    selectItemArticle.addEventListener('click', (ev = window.event) => {
      ev.preventDefault()
      let contentArticle = typeSelect
      contentArticle.className = 'contentArticle'
      let article = `
        <img class='thumb' src='${require('../img/thumb.jpg')}' />
        <div class='detail'>
        马山镇是1992年10月国务院批准成立的国家级旅游度假区，地处无锡西南美丽的马山半岛，总规划面积65平方公里，地域分布在太湖十八湾（12平方公里）、马圩圩区（20平方公里）、马迹山岛（33平方公里），下辖灵山景区管理处、生命科学园区管理处、吴都阖闾城管理处三个管理处和古竹、群丰、嶂青、西村、和平、万丰、栖云、耿湾、阖闾、湖山、峰影、乐山、迎晖13个社区，常住人口3.9万。
        </div>
      `
      contentArticle.innerHTML = article
    })

    let selectItemVideo = this.appendDom('div', 'selectItem', typeSelect, '视频介绍')
    selectItemVideo.addEventListener('click', (ev = window.event) => {
      ev.preventDefault()
      let contentVideo = typeSelect
      contentVideo.className = 'contentVideo'
      let video = `
        <video class='thumb' controls src='${require('../img/1.mp4')}'></video>
        <div class='detail'>
        无锡小笼包，当地人又称小笼馒头，以皮薄卤多而誉遍沪、宁、杭一带，是江苏无锡地方传统名点，已有百年历史。
        </div>
      `
      contentVideo.innerHTML = video
    })

    let selectItemHref = this.appendDom('div', 'selectItem', typeSelect, '跳转链接')
    selectItemHref.addEventListener('click', (ev = window.event) => {
      ev.preventDefault()
      let contentHref = typeSelect
      contentHref.className = 'contentHref'
      let Href = `
        <a href='https://baike.baidu.com/item/%E6%97%A0%E9%94%A1/135983?fr=aladdin' target='_blank'>无锡</a>
      `
      contentHref.innerHTML = Href
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