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
        let v = 1
        if (location.href.endsWith(1)) {
          v = 2
        } else if (location.href.endsWith(2)) {
          v = 3
        } else if (location.href.endsWith(3)) {
          v = 1
        } else {
          v = 1
        }
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
            let t
            if (v == 1) {
              t = [
                {
                  id: 'tag-07956314837428653',
                  innerHTML:
                    '<div class="point"></div><img class="close" src="/close.24fb46be.svg"><div class="contentWords"><img class="avatar" src="/004.af3778dd.jpg"><span class="content">美不胜收！</span></div>',
                  position: {
                    x: -22.775885691599775,
                    y: -90.97020571473806,
                    z: 34.442900135854714
                  }
                },
                {
                  id: 'tag-12830644126899302',
                  innerHTML:
                    '<div class="point"></div><img class="close" src="/close.24fb46be.svg"><div class="contentWords"><img class="avatar" src="/003.b212319e.jpg"><span class="content">太美了</span></div>',
                  position: {
                    x: -24.14717370134251,
                    y: -94.12995085757841,
                    z: 23.20588122656077
                  }
                },
                {
                  id: 'tag-043669819312900104',
                  innerHTML:
                    '<div class="point"></div><img class="close" src="/close.24fb46be.svg"><div class="contentWords"><img class="avatar" src="/002.218a29dd.jpg"><span class="content">我要去现场自拍</span></div>',
                  position: {
                    x: -24.910934865425837,
                    y: -95.8944771886143,
                    z: 13.02094447708028
                  }
                },
                {
                  id: 'tag-3507919611952744',
                  innerHTML:
                    '<div class="point"></div><img class="close" src="/close.24fb46be.svg"><div class="contentWords"><img class="avatar" src="/001.adbac442.jpg"><span class="content">我也想到这里来</span></div>',
                  position: {
                    x: -25.529371284481996,
                    y: -96.61380008039828,
                    z: 2.5132783180028264
                  }
                },
                {
                  id: 'tag-3672786513063344',
                  innerHTML:
                    '<div class="point"></div><img class="close" src="/close.24fb46be.svg"><div class="contentWords"><img class="avatar" src="/004.af3778dd.jpg"><span class="content">阔以阔以</span></div>',
                  position: {
                    x: 67.4276197971515,
                    y: -72.3889007069058,
                    z: -14.358603962634273
                  }
                },
                {
                  id: 'tag-34889009012165166',
                  innerHTML:
                    '<div class="point"></div><img class="close" src="/close.24fb46be.svg"><div class="contentHref">\n        <a href="/?v=1"><img src="/position.530a1c2e.svg">到这里看看</a>\n      </div>',
                  position: {
                    x: 90.29758850542474,
                    y: -38.369043985291476,
                    z: -19.13875009489335
                  }
                },
                {
                  id: 'tag-38968266782044503',
                  innerHTML:
                    '<div class="point"></div><img class="close" src="/close.24fb46be.svg"><div class="contentVideo">\n        <video class="thumb" controls="" src="/1.e4aec935.mp4"></video>\n        <div class="detail">\n        无锡小笼包，当地人又称小笼馒头，以皮薄卤多而誉遍沪、宁、杭一带，是江苏无锡地方传统名点，已有百年历史。\n        </div>\n      </div>',
                  position: {
                    x: -72.52620430995982,
                    y: 64.24967676734164,
                    z: 23.277508171318395
                  }
                },
                {
                  id: 'tag-50639565821410315',
                  innerHTML:
                    '<div class="point"></div><img class="close" src="/close.24fb46be.svg"><div class="contentArticle">\n        <img class="thumb" src="/thumb.cc1e80e9.jpg">\n        <div class="detail">\n        马山镇是1992年10月国务院批准成立的国家级旅游度假区，地处无锡西南美丽的马山半岛，总规划面积65平方公里，地域分布在太湖十八湾（12平方公里）、马圩圩区（20平方公里）、马迹山岛（33平方公里），下辖灵山景区管理处、生命科学园区管理处、吴都阖闾城管理处三个管理处和古竹、群丰、嶂青、西村、和平、万丰、栖云、耿湾、阖闾、湖山、峰影、乐山、迎晖13个社区，常住人口3.9万。\n        </div>\n      </div>',
                  position: {
                    x: 66.01729200798884,
                    y: 72.32115023576118,
                    z: -18.928916687973853
                  }
                },
                {
                  id: 'tag-39209576426525143',
                  innerHTML:
                    '<div class="point"></div><img class="close" src="/close.24fb46be.svg"><div class="contentHref">\n        <a href="/?v=2">\n        <img src="/position.cee5a8aa.svg">\n        到这里看看\n        </a>\n      </div>',
                  position: {
                    x: -83.52562476426957,
                    y: -52.163975515509016,
                    z: 16.6580499474189
                  }
                }
              ]
            } else if (v == 2) {
              t = [
                {
                  id: 'tag-08671033593771382',
                  innerHTML:
                    '<div class="point"></div><img class="close" src="/close.24fb46be.svg"><div class="contentName">鼋头渚</div>',
                  position: {
                    x: 87.95592052147329,
                    y: -47.21696435288414,
                    z: -1.5002862640810526
                  }
                },
                {
                  id: 'tag-11617294774300588',
                  innerHTML:
                    '<div class="point"></div><img class="close" src="/close.24fb46be.svg"><div class="contentVideo">\n        <video class="thumb" controls="" src="/1.e4aec935.mp4"></video>\n        <div class="detail">\n        无锡小笼包，当地人又称小笼馒头，以皮薄卤多而誉遍沪、宁、杭一带，是江苏无锡地方传统名点，已有百年历史。\n        </div>\n      </div>',
                  position: {
                    x: -77.38298684776477,
                    y: -48.19122313215403,
                    z: 40.178393902406405
                  }
                },
                {
                  id: 'tag-19367307041778394',
                  innerHTML:
                    '<div class="point"></div><img class="close" src="/close.24fb46be.svg"><div class="contentName">崇安寺</div>',
                  position: {
                    x: 53.76610284984477,
                    y: 34.195707293526645,
                    z: -76.41576196775297
                  }
                },
                {
                  id: 'tag-3275911832219574',
                  innerHTML:
                    '<div class="point"></div><img class="close" src="/close.24fb46be.svg"><div class="contentWords"><img class="avatar" src="/005.27042a0e.jpg"><span class="content">太美了</span></div>',
                  position: {
                    x: 62.233402843849596,
                    y: 18.458428889255106,
                    z: -75.55963131084869
                  }
                },
                {
                  id: 'tag-19758715651726755',
                  innerHTML:
                    '<div class="point"></div><img class="close" src="/close.24fb46be.svg"><div class="contentName">崇安寺</div>',
                  position: {
                    x: 92.42227274810925,
                    y: 8.353021565790899,
                    z: 36.15636155876848
                  }
                },
                {
                  id: 'tag-664941602095498',
                  innerHTML:
                    '<div class="point"></div><img class="close" src="/close.24fb46be.svg"><div class="contentWords"><img class="avatar" src="/004.af3778dd.jpg"><span class="content">美不胜收！</span></div>',
                  position: {
                    x: 79.08537121866853,
                    y: -57.94374750949364,
                    z: 18.815923088980583
                  }
                },
                {
                  id: 'tag-0698449562567591',
                  innerHTML:
                    '<div class="point"></div><img class="close" src="/close.24fb46be.svg"><div class="contentWords"><img class="avatar" src="/003.b212319e.jpg"><span class="content">昨天路过，天气很好~</span></div>',
                  position: {
                    x: 87.96002441171046,
                    y: -35.759714536847994,
                    z: 29.832703574381398
                  }
                },
                {
                  id: 'tag-7756228715000672',
                  innerHTML:
                    '<div class="point"></div><img class="close" src="/close.24fb46be.svg"><div class="contentWords"><img class="avatar" src="/006.87a37e32.jpg"><span class="content">我要去现场自拍</span></div>',
                  position: {
                    x: 88.84376913592357,
                    y: -34.273302243992426,
                    z: -28.8068415389014
                  }
                },
                {
                  id: 'tag-4525495165002755',
                  innerHTML:
                    '<div class="point"></div><img class="close" src="/close.24fb46be.svg"><div class="contentHref">\n        <a href="/?v=2">\n        <img src="/position.cee5a8aa.svg">\n        到这里看看\n        </a>\n      </div>',
                  position: {
                    x: 97.8177944665936,
                    y: -6.747037372496752,
                    z: -18.32514341761996
                  }
                },
                {
                  id: 'tag-8135903313714545',
                  innerHTML:
                    '<div class="point"></div><img class="close" src="/close.24fb46be.svg"><div class="contentHref">\n        <a href="/?v=3">\n        <img src="/position.cee5a8aa.svg">\n        到这里看看\n        </a>\n      </div>',
                  position: {
                    x: 98.93562573293755,
                    y: -13.862290245132849,
                    z: -0.6441491243997935
                  }
                }
              ]
            } else if (v == 3) {
              t = [
                {
                  id: 'tag-07812017512686047',
                  innerHTML:
                    '<div class="point"></div><img class="close" src="/close.24fb46be.svg"><div class="contentName">鼋头渚</div>',
                  position: {
                    x: 93.35895336857659,
                    y: -22.862106866016706,
                    z: 25.871770285379707
                  }
                },
                {
                  id: 'tag-023273044140981547',
                  innerHTML:
                    '<div class="point"></div><img class="close" src="/close.24fb46be.svg"><div class="contentWords"><img class="avatar" src="/001.adbac442.jpg"><span class="content">太美了</span></div>',
                  position: {
                    x: 83.62641633936794,
                    y: -13.467749909212182,
                    z: -52.1800647406855
                  }
                },
                {
                  id: 'tag-005687145376836056',
                  innerHTML:
                    '<div class="point"></div><img class="close" src="/close.24fb46be.svg"><div class="contentVideo">\n        <video class="thumb" controls="" src="/1.e4aec935.mp4"></video>\n        <div class="detail">\n        无锡小笼包，当地人又称小笼馒头，以皮薄卤多而誉遍沪、宁、杭一带，是江苏无锡地方传统名点，已有百年历史。\n        </div>\n      </div>',
                  position: {
                    x: 87.86670769056224,
                    y: -46.706219045816596,
                    z: 4.9875298663737295
                  }
                },
                {
                  id: 'tag-19243051227466363',
                  innerHTML:
                    '<div class="point"></div><img class="close" src="/close.24fb46be.svg"><div class="contentWords"><img class="avatar" src="/002.218a29dd.jpg"><span class="content">厉害了厉害了</span></div>',
                  position: {
                    x: -42.12436093694357,
                    y: -83.223145930212,
                    z: 35.557797441277515
                  }
                },
                {
                  id: 'tag-11987513540390782',
                  innerHTML:
                    '<div class="point"></div><img class="close" src="/close.24fb46be.svg"><div class="contentName">崇安寺</div>',
                  position: {
                    x: 98.04045211819711,
                    y: -0.529994818254369,
                    z: -18.51179605469565
                  }
                },
                {
                  id: 'tag-2791837124080548',
                  innerHTML:
                    '<div class="point"></div><img class="close" src="/close.24fb46be.svg"><div class="contentHref">\n        <a href="/?v=3"><img src="/position.530a1c2e.svg">到这里看看</a>\n      </div>',
                  position: {
                    x: 98.70605555284554,
                    y: -15.709662815718364,
                    z: 0.4805597205965043
                  }
                },
                {
                  id: 'tag-3149293685694473',
                  innerHTML:
                    '<div class="point"></div><img class="close" src="/close.24fb46be.svg"><div class="contentArticle">\n        <img class="thumb" src="/thumb.cc1e80e9.jpg">\n        <div class="detail">\n        马山镇是1992年10月国务院批准成立的国家级旅游度假区，地处无锡西南美丽的马山半岛，总规划面积65平方公里，地域分布在太湖十八湾（12平方公里）、马圩圩区（20平方公里）、马迹山岛（33平方公里），下辖灵山景区管理处、生命科学园区管理处、吴都阖闾城管理处三个管理处和古竹、群丰、嶂青、西村、和平、万丰、栖云、耿湾、阖闾、湖山、峰影、乐山、迎晖13个社区，常住人口3.9万。\n        </div>\n      </div>',
                  position: {
                    x: -14.123099451305462,
                    y: 23.713807004190766,
                    z: -95.7368236810134
                  }
                },
                {
                  id: 'tag-16425778940781282',
                  innerHTML:
                    '<div class="point"></div><img class="close" src="/close.24fb46be.svg"><div class="contentHref">\n        <a href="/?v=1">\n        <img src="/position.cee5a8aa.svg">\n        到这里看看\n        </a>\n      </div>',
                  position: {
                    x: 97.77694196488659,
                    y: -8.340783293801836,
                    z: -17.520439147257065
                  }
                }
              ]
            } else {
              t = []
            }

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
  const imgs = [
    require(`../img/1.jpg`),
    require(`../img/2.jpg`),
    require(`../img/3.jpg`)
  ]
  let currentImg = imgs[0]
  if (location.href.endsWith('1')) {
    currentImg = imgs[0]
  } else if (location.href.endsWith('2')) {
    currentImg = imgs[1]
  } else {
    currentImg = imgs[2]
  }
  const options = {
    // width: 1400,
    // height: 1000,
    image: currentImg,
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
