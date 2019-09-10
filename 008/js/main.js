import 'babel-polyfill'
import '../scss/pano.scss'
import anime from 'animejs/lib/anime.es.js'
import PanoBase from './pano.js'
import * as THREE from 'three'

// https://github.com/juliangarnier/anime
;(() => {
  class Pano extends PanoBase {
    async preLoad() {
      // await this.loadImage(require('./img/1.jpg'))
    }

    setup() {
      this.camera.position.y = 99
      const fovm = this.camera._m
      this.camera._m = 5
      const duration = 3000
      this.camera.setFocalLength(this.camera._m)
      this.camera.lookAt(this.camera.target)
      this.renderer.render(this.scene, this.camera)
      setTimeout(() => {
        anime({
          targets: this.camera.target,
          x: 100,
          easing: 'easeInOutCubic',
          round: 1,
          round: 100,
          duration: duration,
          complete: () => {
            this.canControl = true

            // 添加预置数据
            let t = [
              {
                id: 'tag-14562465433',
                innerHTML:
                  '<div class="point"></div><img class="close" src="/close.24fb46be.svg"><div class="contentArticle">\n        <img class="thumb" src="/thumb.cc1e80e9.jpg">\n        <div class="detail">\n        马山镇是1992年10月国务院批准成立的国家级旅游度假区，地处无锡西南美丽的马山半岛，总规划面积65平方公里，地域分布在太湖十八湾（12平方公里）、马圩圩区（20平方公里）、马迹山岛（33平方公里），下辖灵山景区管理处、生命科学园区管理处、吴都阖闾城管理处三个管理处和古竹、群丰、嶂青、西村、和平、万丰、栖云、耿湾、阖闾、湖山、峰影、乐山、迎晖13个社区，常住人口3.9万。\n        </div>\n      </div>',
                position: {
                  x: 89.86384558815979,
                  y: 33.05745572740552,
                  z: -26.846661014983894
                }
              },
              {
                id: 'tag-2131246546',
                innerHTML:
                  '<div class="point"></div><img class="close" src="/close.24fb46be.svg"><div class="contentHref">\n        <a href="https://baike.baidu.com/item/%E6%97%A0%E9%94%A1/135983?fr=aladdin" target="_blank">无锡</a>\n      </div>',
                position: {
                  x: 59.86982027061797,
                  y: 26.487980074605247,
                  z: 74.86892316500652
                }
              },
              {
                id: 'tag-2264926255309428',
                innerHTML:
                  '<div class="point"></div><img class="close" src="/close.24fb46be.svg"><div class="contentWords"><img class="avatar" src="/002.218a29dd.jpg"><span class="content">我也想到这里来</span></div>',
                position: {
                  x: -9.712032817286312,
                  y: 24.89528103057096,
                  z: -96.18525376945924
                }
              },
              {
                id: 'tag-06672052380517366',
                innerHTML:
                  '<div class="point"></div><img class="close" src="/close.24fb46be.svg"><div class="contentWords"><img class="avatar" src="/006.87a37e32.jpg"><span class="content">我家就在这里</span></div>',
                position: {
                  x: 12.011146891210647,
                  y: -24.060452177279604,
                  z: 96.0084775867408
                }
              },
              {
                id: 'tag-13955379026355985',
                innerHTML:
                  '<div class="point"></div><img class="close" src="/close.24fb46be.svg"><div class="contentName">金匮公园</div>',
                position: {
                  x: 54.906407267764735,
                  y: -10.233557882051759,
                  z: -82.37852985491962
                }
              },
              {
                id: 'tag-3717281910370899',
                innerHTML:
                  '<div class="point"></div><img class="close" src="/close.24fb46be.svg"><div class="contentName">崇安寺</div>',
                position: {
                  x: -50.70366804287195,
                  y: -13.167488349554162,
                  z: -84.8893272113674
                }
              },
              {
                id: 'tag-6438750130804021',
                innerHTML:
                  '<div class="point"></div><img class="close" src="/close.24fb46be.svg"><div class="contentVideo">\n        <video class="thumb" controls="" src="/1.e4aec935.mp4"></video>\n        <div class="detail">\n        无锡小笼包，当地人又称小笼馒头，以皮薄卤多而誉遍沪、宁、杭一带，是江苏无锡地方传统名点，已有百年历史。\n        </div>\n      </div>',
                position: {
                  x: 95.15284743305334,
                  y: -5.323879085170015,
                  z: 28.085738773792137
                }
              }
            ]
            // t = JSON.parse(t)
            t.forEach(ele => {
              const material = new THREE.MeshBasicMaterial({ color: 0xaaafff })
              const geometry = new THREE.SphereGeometry(0.01, 2, 2)
              const pos = new THREE.Mesh(geometry, material)
              pos.position.x = ele.position.x
              pos.position.y = ele.position.y
              pos.position.z = ele.position.z
              this.sphere.add(pos)
              this.DTC.addPoint({
                pos3d: pos,
                id: ele.id,
                innerHTML: ele.innerHTML
              })
            })
          }
        })
        anime({
          targets: this.camera.position,
          y: 0,
          round: 1,
          duration: duration,
          round: 100,
          easing: 'easeInOutCubic',
          update: () => {
            this.camera.lookAt(this.camera.target)
          }
        })
        anime({
          targets: this.camera,
          _m: fovm,
          round: 1,
          duration: duration,
          round: 100,
          easing: 'easeInOutCubic',
          update: () => {
            // console.log(this.camera._m)
            this.camera.setFocalLength(this.camera._m)
            this.camera.updateProjectionMatrix()
          }
        })
      }, 2000)
    }

    loop() {
      // this.camera.rotation.y += 0.01
    }
  }

  const options = {
    // width: 1400,
    // height: 1000,
    image: require('../img/1.jpg'),
    isAddTagMode: true
  }

  window.pano = new Pano(options)
  window.THREE = THREE
  window.anime = anime
  window.stopEventBubble = event => {
    var e = event || window.event
    console.log(e)
    if (e && e.stopPropagation) {
      e.stopPropagation()
    } else {
      e.cancelBubble = true
    }
  }
})()
