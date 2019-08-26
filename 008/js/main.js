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
        const duration = 3000
        anime({
          targets: this.camera.target,
          x: 100,
          easing: "easeInOutCubic",
          round: 1,
          round: 100,
          duration: duration,
          complete: () => {
            this.canControl = true
          }
        });
        anime({
          targets: this.camera.position,
          y: 0,
          round: 1,
          duration: duration,
          round: 100,
          easing: "easeInOutCubic",
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
          easing: "easeInOutCubic",
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
    // width: 1400,
    // height: 1000,
    image: require("../img/1.jpg"),
    isAddTagMode: true
  };

  window.pano = new Pano(options);
  window.THREE = THREE;
  window.anime = anime;
  window.stopEventBubble = (event) => {   
    var e=event || window.event;
    console.log(e)
   if (e && e.stopPropagation){       
        e.stopPropagation();          
       } else{     
         e.cancelBubble=true;      
     }  
 }
})();
