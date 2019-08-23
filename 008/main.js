import "babel-polyfill";
import anime from "animejs/lib/anime.es.js";
import PanoBase from "./pano";
import * as THREE from "three";

// https://github.com/juliangarnier/anime

(() => {
  class Pano extends PanoBase {
    async preLoad() {
      // await this.loadImage(require('./img/1.jpg'))
    }

    setup() {
        this.camera.position.y = 99;
        this.camera.target.z = 0;
        const fovm = this.camera._m;
        this.camera._m = 4;
        const duration = 6000
        anime({
          targets: this.camera.target,
          z: -100,
          easing: "easeInOutExpo",
          round: 1,
          round: 100,
          duration: duration
        });
        anime({
          targets: this.camera.position,
          y: 0,
          round: 1,
          duration: duration,
          round: 100,
          easing: "easeInOutExpo",
          update: () => {
            this.camera.lookAt(this.camera.target);
          }
        });
        anime({
          targets: this.camera,
          _m: fovm,
          round: 1,
          duration: duration,
          round: 100,
          easing: "easeInOutExpo",
          update: () => {
            // console.log(this.camera._m)
            this.camera.setFocalLength(this.camera._m);
          }
        });
      // this.sphere.geometry.vertices.forEach(ele => {
      //     const material = new THREE.MeshBasicMaterial({color: 0xaaafff})
      //     const geometry = new THREE.SphereGeometry(2, 10, 10)
      //     const pos = new THREE.Mesh( geometry, material )
      //     pos.position.x = ele.x
      //     pos.position.y = ele.y
      //     pos.position.z = ele.z
      //     this.sphere.children.push(pos)
      // });
    }

    loop() {
      // this.sphere.rotation.y -= 0.04
      // this.sphere.rotation.x -= 0.04
      // this.sphere.rotation.z -= 0.04
    }
  }

  const options = {
    width: 1400,
    height: 800,
    image: require("./img/1.jpg"),
    isAddTagMode: true
  };

  window.pano = new Pano(options);
  window.THREE = THREE;
  window.anime = anime;
})();
