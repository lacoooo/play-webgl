import "babel-polyfill"
import '../scss/pano.scss'
import anime from "animejs/lib/anime.es.js"
import PanoBase from "./pano.js"
import * as THREE from "three"

// https://github.com/juliangarnier/anime

(() => {
  class Pano extends PanoBase {
    async preLoad() {
      // await this.loadImage(require('./img/1.jpg'))
    }

    setup() {
        this.camera.position.y = 99;
        const fovm = this.camera._m;
        this.camera._m = 4;
        const duration = 6000
        anime({
          targets: this.camera.target,
          z: 100,
          easing: "easeInOutExpo",
          round: 1,
          round: 100,
          duration: duration,
          complete: () => {}
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
            this.camera.updateProjectionMatrix();
          }
        });
    }

    loop() {
      // this.camera.rotation.y += 0.01
    }
  }

  const options = {
    width: 1000,
    height: 600,
    image: require("../img/1.jpg"),
    isAddTagMode: true
  };

  window.pano = new Pano(options);
  window.THREE = THREE;
  window.anime = anime;
})();
