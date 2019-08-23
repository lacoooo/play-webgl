import PanoBase from './pano'
import * as THREE from 'three'
import { Material, Geometry } from 'three';

(() => {

    class Pano extends PanoBase {

        ok() {
            console.log('ojbk')
        }

        setup() {
            const material = new THREE.MeshBasicMaterial(
                { map: new THREE.TextureLoader().load(require('./img/1.jpg')) }
            )
            material.side = THREE.DoubleSide
            const geometry = new THREE.SphereGeometry(100, 20, 20)
            this.sphere = new THREE.Mesh( geometry, material )
            this.scene.add(this.sphere)
            this.camera.position.set(0, 0, 0)
            this.camera.lookAt(new THREE.Vector3(0, 0, -100))
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
