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
                { map: new THREE.TextureLoader().load(require('./img/1.jpg'))
            } )
            material.side = THREE.DoubleSide
            const geometry = new THREE.SphereGeometry(100, 100, 100)
            this.sphere = new THREE.Mesh( geometry, material )
            this.scene.add(this.sphere)
            setTimeout(() => {
                this.renderer.render(this.scene, this.camera)
            }, 500);
        }

        // loop() {
        //     // this.sphere.rotation.y -= 0.04
        //     // this.sphere.rotation.x -= 0.04
        //     // this.sphere.rotation.z -= 0.04
        // }

    }

    const options = {
        width: 1200,
        height: 700
    }

    window.pano = new Pano(options)
    window.THREE = THREE
    pano.camera.position.set(0, 0, 0)
    pano.camera.lookAt(new THREE.Vector3(0, 0, -100))

})();
