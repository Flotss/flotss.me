import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const MyThreeScene = () => {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      (window.innerWidth / 2 - 32) / (window.innerHeight / 2 + 200),
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ alpha: true });

    // Size of 50% width and 50% height of the screen - padding of 32px right
    renderer.setSize(window.innerWidth / 2 - 32, window.innerHeight / 2 + 200);
    mount.current?.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial();
    const cube = new THREE.Mesh(geometry, material);

    cube.rotation.x = 0;
    cube.rotation.y = 2;
    cube.rotation.z = 2;

    scene.add(cube);

    const controls = new OrbitControls(camera, renderer.domElement);

    controls.minDistance = 2;
    controls.maxDistance = 10;

    camera.position.z = 5;
    

    function animate() {
      requestAnimationFrame(animate);

      cube.rotation.x += 0;
      cube.rotation.y += 0;

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      mount.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mount} />;
}

export default MyThreeScene;