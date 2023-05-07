import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const Placeholder: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer;
    let cube: THREE.Mesh, cubeRotation = 0.01;

    const init = () => {
      // Create scene
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);

      // Create camera
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 5;

      // Create cube
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshNormalMaterial();
      cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      // Create renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      containerRef.current?.appendChild(renderer.domElement);
    };

    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += cubeRotation;
      cube.rotation.y += cubeRotation;
      renderer.render(scene, camera);
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    init();
    animate();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (<>
      <div ref={containerRef} style={{ height: "100vh" }} />;

  </>)
};

export default Placeholder;
