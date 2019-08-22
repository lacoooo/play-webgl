import PanoBase from './pano'
import * as THREE from 'three'
import { Material, Geometry } from 'three';

(() => {

    class Pano extends PanoBase {

        ok() {
            console.log('ojbk')
        }

        setup() {
            const material = new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load(require('./img/1.jpg')) } )
            material.side = THREE.DoubleSide
            const geometry = new THREE.SphereGeometry(60, 100, 100)
            this.sphere = new THREE.Mesh( geometry, material )
            this.scene.add(this.sphere)
        }

        loop() {
            this.sphere.rotation.y -= 0.004
            this.sphere.rotation.x -= 0.004
            this.sphere.rotation.z -= 0.004
        }

    }

    window.pano = new Pano()
    window.THREE = THREE
    pano.camera.position.set(0, 59.9, 0)
    pano.camera.lookAt(pano.scene.position)

})();
