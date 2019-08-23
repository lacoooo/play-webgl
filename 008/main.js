import "babel-polyfill"
import PanoBase from './pano'
import * as THREE from 'three'
import { Material, Geometry } from 'three';

// https://github.com/juliangarnier/anime

(() => {

    class Pano extends PanoBase {

        async preLoad() {
            await this.loadImage(require('./img/1.jpg'))
        }

        setup() {

            const material = new THREE.MeshBasicMaterial(
                { map: new THREE.TextureLoader().load(this.image) }
            )
            material.side = THREE.DoubleSide
            const geometry = new THREE.SphereGeometry(100, 50, 50)
            this.sphere = new THREE.Mesh( geometry, material )
            this.scene.add(this.sphere)
            this.camera.position.set(0, 0, 0)

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
        width: 1200,
        height: 700
    }

    window.pano = new Pano(options)
    window.THREE = THREE

})();
